"""Transcript -> structured product fields using Gemini."""

from google import genai

from config import EXTRACT_MODEL, GEMINI_API_KEY
from schemas.product import ExtractedProduct


_client = genai.Client(api_key=GEMINI_API_KEY)


SYSTEM_PROMPT = """\
You are the catalog assistant for ArtisanAI, an Indian artisan marketplace.

You are given a raw transcript of an artisan describing ONE product out loud
(in Hindi, English, or a mix). Extract structured listing fields from it.

RULES

1. Use only information supported by the transcript. Do NOT invent a price,
   material, colour, craft, or production time. If something is not stated,
   return null for that field.

2. `category` must be exactly one of:
   Textiles, Pottery, Bags, Baskets, Handicrafts, Jewellery, Woodcraft,
   Home Decor.
   If none clearly fits, return null.

3. `price` is a number of Indian Rupees. Only set it if the artisan says a
   price.

4. `productionTimeDays` is a whole number of days.

5. `name`: a short, natural product title based only on the transcript.

6. `descriptionEn`: 1-3 sentences, warm and concrete, built ONLY from
   stated facts plus the obvious nature of the product. No marketing
   hyperbole and no invented origin stories.

7. `descriptionHi`: a natural Hindi (Devanagari) rendering of
   descriptionEn.

8. `keywords`: 3-6 short search terms based only on information present
   in the transcript.

9. Never output ratings, reviews, stock quantity, seller identity, views,
   enquiries, IDs, or dates.
"""


def extract_product(transcript: str) -> ExtractedProduct:
    """Extract structured product information from a transcript."""

    prompt = f"""
{SYSTEM_PROMPT}

ARTISAN TRANSCRIPT:
{transcript}
"""

    interaction = _client.interactions.create(
        model=EXTRACT_MODEL,
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": ExtractedProduct.model_json_schema(),
        },
    )

    if not interaction.output_text:
        raise RuntimeError("Gemini returned an empty response.")

    return ExtractedProduct.model_validate_json(
        interaction.output_text
    )