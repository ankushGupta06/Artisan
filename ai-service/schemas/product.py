"""The one schema the AI is allowed to produce.

The model only fills the fields an artisan can naturally say out loud. Everything
else on the React `Product` type (id, artisanId, rating, views, createdAt, ...)
is owned by the application, never by the AI.

Every field is Optional so the model can return `null` for anything the artisan
did not mention, instead of inventing it.
"""

from enum import Enum

from pydantic import BaseModel, Field


class ProductCategory(str, Enum):
    """Must stay in sync with `ProductCategory` in src/types/index.ts."""

    textiles = "Textiles"
    pottery = "Pottery"
    bags = "Bags"
    baskets = "Baskets"
    handicrafts = "Handicrafts"
    jewellery = "Jewellery"
    woodcraft = "Woodcraft"
    home_decor = "Home Decor"


class ExtractedProduct(BaseModel):
    name: str | None = Field(
        default=None,
        description="Product name, taken or lightly inferred from the artisan's description.",
    )
    category: ProductCategory | None = Field(
        default=None,
        description="Best-fit category, or null if it cannot be determined confidently.",
    )
    price: float | None = Field(
        default=None,
        description="Selling price in Indian Rupees. Null unless the artisan states a price.",
    )
    material: str | None = Field(
        default=None,
        description="Primary material. Null if not mentioned.",
    )
    craft: str | None = Field(
        default=None,
        description="Crafting or manufacturing technique. Null if not mentioned.",
    )
    color: str | None = Field(
        default=None,
        description="Colour or colour combination. Null if not mentioned.",
    )
    productionTimeDays: int | None = Field(
        default=None,
        description="Whole number of days to make one unit. Null if not mentioned.",
    )
    descriptionEn: str | None = Field(
        default=None,
        description="A concise, appealing English product description built only from stated facts.",
    )
    descriptionHi: str | None = Field(
        default=None,
        description="A natural Hindi (Devanagari) translation of descriptionEn.",
    )
    keywords: list[str] = Field(
        default_factory=list,
        description="3-6 short search keywords derived from the description.",
    )
