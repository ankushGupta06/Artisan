"""ArtisanAI voice microservice.

One real AI workflow for an otherwise-mocked prototype:

    audio (or text) -> transcript -> structured product fields -> JSON

Speech-to-text is performed locally using faster-whisper.
OpenAI is used only for structured product-field extraction.

The React app owns everything else (products, orders, buyers, marketplace).
This service knows nothing about them.
"""

import os
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import (
    ALLOWED_ORIGINS,
    EXTRACT_MODEL,
    MAX_AUDIO_BYTES,
    GEMINI_API_KEY,
    TRANSCRIBE_MODEL,
    WHISPER_DEVICE,
    WHISPER_COMPUTE_TYPE,
)
from schemas.product import ExtractedProduct
from services.extraction import extract_product
from services.transcription import transcribe_audio


app = FastAPI(
    title="ArtisanAI Voice Service",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _require_gemini_key() -> None:
    """Ensure the Gemini key is available for product extraction."""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured for product extraction.",
        )


def _payload(transcript: str, product: ExtractedProduct) -> dict:
    """Build the common API response."""
    return {
        "success": True,
        "transcript": transcript,
        "product": product.model_dump(mode="json"),
    }


@app.get("/health")
def health() -> dict:
    """Return service status and AI configuration."""
    return {
        "status": "ok",
        "service": "artisanai-voice",
        "whisper": {
            "model": TRANSCRIBE_MODEL,
            "device": WHISPER_DEVICE,
            "computeType": WHISPER_COMPUTE_TYPE,
        },
        "geminiKeyConfigured": bool(GEMINI_API_KEY),
        "extractionModel": EXTRACT_MODEL,
    }


@app.post("/api/voice/extract-product")
async def extract_product_from_voice(
    audio: UploadFile = File(...),
) -> dict:
    """Audio upload -> local Whisper transcription -> product extraction."""

    content = await audio.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The audio upload was empty.",
        )

    if len(content) > MAX_AUDIO_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Audio file is too large.",
        )

    suffix = os.path.splitext(audio.filename or "")[1] or ".webm"

    tmp_path: str | None = None

    try:
        # Save uploaded audio temporarily so faster-whisper can process it.
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        # --------------------------------------------------------
        # STEP 1: Local speech-to-text
        # --------------------------------------------------------
        # This no longer uses the OpenAI Audio API.
        transcript = transcribe_audio(tmp_path)

        if not transcript:
            raise HTTPException(
                status_code=422,
                detail="No speech could be transcribed from the recording.",
            )

        # --------------------------------------------------------
        # STEP 2: Structured product extraction
        # --------------------------------------------------------
        # OpenAI is still used here.
        _require_gemini_key()

        product = extract_product(transcript)

        return _payload(transcript, product)

    except HTTPException:
        raise

    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"AI processing failed: {exc}",
        ) from exc

    finally:
        # Always remove the temporary audio file.
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


class TextIn(BaseModel):
    transcript: str


@app.post("/api/text/extract-product")
def extract_product_from_text(body: TextIn) -> dict:
    """Typed-description fallback: skip transcription, just extract."""

    _require_gemini_key()

    transcript = body.transcript.strip()

    if not transcript:
        raise HTTPException(
            status_code=400,
            detail="`transcript` must not be empty.",
        )

    try:
        product = extract_product(transcript)

        return _payload(
            transcript,
            product,
        )

    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"AI processing failed: {exc}",
        ) from exc
