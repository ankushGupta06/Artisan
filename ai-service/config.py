"""Runtime configuration for the ArtisanAI voice microservice.

Everything tunable lives here so the rest of the code never reads os.environ
directly. Values come from the process environment / a local `.env` file.
"""

import os

from dotenv import load_dotenv

load_dotenv()


# ============================================================
# OpenAI
# ============================================================

# OpenAI is used for structured product-field extraction.
# It is no longer used for speech-to-text.
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()


# ============================================================
# Local Whisper speech-to-text
# ============================================================

# Local Whisper model.
# Recommended starting point for this project: "base".
#
# Available models include:
# tiny, base, small, medium, large-v3
TRANSCRIBE_MODEL: str = os.getenv(
    "TRANSCRIBE_MODEL",
    "base",
).strip()


# Whisper device.
# "cuda" = NVIDIA GPU
# "cpu"  = CPU
WHISPER_DEVICE: str = os.getenv(
    "WHISPER_DEVICE",
    "cuda",
).strip()


# Whisper computation type.
# CUDA: float16
# CPU: int8
WHISPER_COMPUTE_TYPE: str = os.getenv(
    "WHISPER_COMPUTE_TYPE",
    "float16",
).strip()


# ============================================================
# Structured product extraction
# ============================================================

# OpenAI model used to convert the transcript into structured
# product fields using the Pydantic schema.
EXTRACT_MODEL: str = os.getenv(
    "EXTRACT_MODEL",
    "gpt-4o-mini",
).strip()


# ============================================================
# API configuration
# ============================================================

ALLOWED_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


# Maximum uploaded audio size.
MAX_AUDIO_BYTES: int = int(
    os.getenv(
        "MAX_AUDIO_BYTES",
        str(15 * 1024 * 1024),
    )
)
