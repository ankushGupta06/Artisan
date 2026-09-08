"""Speech -> text using local faster-whisper.

This service runs Whisper locally instead of calling the OpenAI Audio API.
The rest of the application only depends on transcribe_audio(), so the
frontend and extraction workflow remain unchanged.
"""

from faster_whisper import WhisperModel

from config import (
    TRANSCRIBE_MODEL,
    WHISPER_COMPUTE_TYPE,
    WHISPER_DEVICE,
)


# Load the model once when the service starts.
# Loading it for every request would be extremely slow.
_model = WhisperModel(
    TRANSCRIBE_MODEL,
    device=WHISPER_DEVICE,
    compute_type=WHISPER_COMPUTE_TYPE,
)


def transcribe_audio(audio_path: str) -> str:
    """Return the plain-text transcript of the given audio file.

    The artisan may speak Hindi, English, or a mix. Whisper automatically
    detects the spoken language and returns the transcript in that language.

    The model is loaded once at service startup and reused for every request.
    """

    segments, _info = _model.transcribe(
        audio_path,
        beam_size=5,
    )

    transcript = " ".join(
        segment.text.strip()
        for segment in segments
        if segment.text.strip()
    )

    return transcript.strip()
