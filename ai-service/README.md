# ArtisanAI Voice Microservice

A small **real** AI service for the otherwise-mocked ArtisanAI prototype.

```
artisan speaks -> browser records -> FastAPI -> speech-to-text -> structured fields -> JSON -> React form
```

The React app owns products, orders, buyers and the marketplace. This service
only turns a voice note (or typed text) into draft catalog fields.

## Endpoints

| Method | Path                         | Body                              | Returns |
| ------ | ---------------------------- | --------------------------------- | ------- |
| GET    | `/health`                    | –                                 | `{ status, openaiKeyConfigured }` |
| POST   | `/api/voice/extract-product` | `multipart/form-data`, `audio=<file>` | `{ success, transcript, product }` |
| POST   | `/api/text/extract-product`  | `application/json`, `{ "transcript": "..." }` | `{ success, transcript, product }` |

`product` shape (every field nullable except `keywords`):

```json
{
  "name": "Handwoven Cotton Bag",
  "category": "Bags",
  "price": 299,
  "material": "Pure Cotton",
  "craft": "Handloom Weaving",
  "color": "Beige",
  "productionTimeDays": 2,
  "descriptionEn": "A handwoven cotton bag ...",
  "descriptionHi": "हाथ से बुना हुआ सूती बैग ...",
  "keywords": ["cotton", "handwoven", "tote"]
}
```

Anything the artisan did not say comes back as `null` — the service never
invents a price, material, colour, etc.

## Setup (Windows PowerShell)

```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env      # then edit .env and paste your OpenAI key
```

macOS / Linux:

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # then edit .env
```

## Run

```bash
uvicorn app:app --reload --port 8000
```

Check it: <http://localhost:8000/health> → `{"status":"ok","openaiKeyConfigured":true}`

## Test without the frontend

```bash
curl -X POST http://localhost:8000/api/text/extract-product \
  -H "Content-Type: application/json" \
  -d '{"transcript":"This is a handwoven cotton bag made from pure cotton, beige, takes two days, I sell it for 299 rupees."}'
```

or with an audio file:

```bash
curl -X POST http://localhost:8000/api/voice/extract-product -F "audio=@voice-note.webm"
```

## Config (`.env`)

| Key                | Default                                              | Notes |
| ------------------ | --------------------------------------------------- | ----- |
| `OPENAI_API_KEY`   | –                                                   | required |
| `TRANSCRIBE_MODEL` | `gpt-4o-mini-transcribe`                            | speech-to-text |
| `EXTRACT_MODEL`    | `gpt-4o-mini`                                       | must support Structured Outputs |
| `ALLOWED_ORIGINS`  | `http://localhost:5173,http://127.0.0.1:5173`       | Vite dev origins |
| `MAX_AUDIO_BYTES`  | `15728640` (15 MB)                                  | upload cap |

> The OpenAI SDK surface for Structured Outputs still moves. Versions are pinned
> in `requirements.txt`; if you bump `openai`, re-check `services/extraction.py`.

## Frontend wiring

The React app calls this from `src/services/aiService.ts`. Point it at a
non-default URL with `VITE_AI_SERVICE_URL` in the project-root `.env`
(see `.env.example` there). If this service is down, the Add Product → Catalog
screen automatically falls back to the mock transcription so the demo never
breaks.
