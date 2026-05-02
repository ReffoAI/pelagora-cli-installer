---
name: beacon-list-item
description: >
  List an item for sale on the local Pelagora Beacon. Parses a natural language
  description of an item and creates it via the Beacon REST API (POST /refs + POST /offers).
  Triggers on: "list item", "sell", "list for sale", "add listing".
user_invocable: true
---

# /beacon-list-item

List an item for sale on the user's running Beacon. The user describes the item in natural language and the assistant converts it into the correct API calls.

**Usage:**
```
/beacon-list-item <natural language description of the item>
```

## Behavior

1. **Parse the user's description** to extract:
   - **name** — a concise product title
   - **description** — a short seller-written description (expand slightly on what the user said — mention condition, completeness, etc.)
   - **category** — one of the valid taxonomy categories (see below)
   - **subcategory** — a valid subcategory within that category
   - **condition** — infer from the description (e.g., "like new" → `like_new`, "used" → `good`, "sealed" → `new`)
   - **listingStatus** — `for_sale` (default when a price is given), `willing_to_sell`, or `private`
   - **price** and **currency** — if the user mentions a price

2. **Check the beacon is running** by hitting the health endpoint first:
   ```bash
   curl -s http://localhost:3000/health
   ```
   If the beacon is not reachable, tell the user to start it first.

3. **Create the ref** (item):
   ```bash
   curl -X POST http://localhost:3000/refs \
     -H "Content-Type: application/json" \
     -d '{
       "name": "<parsed name>",
       "description": "<parsed description>",
       "category": "<category>",
       "subcategory": "<subcategory>",
       "condition": "<condition>",
       "listingStatus": "for_sale"
     }'
   ```

4. **Create the offer** (price) using the `id` from the ref response:
   ```bash
   curl -X POST http://localhost:3000/offers \
     -H "Content-Type: application/json" \
     -d '{
       "refId": "<id from step 3>",
       "price": <price>,
       "priceCurrency": "USD"
     }'
   ```

5. **Report the result** to the user, showing what was created and how to view it in the beacon UI.

## Valid categories and subcategories

| Category | Subcategories |
|----------|--------------|
| Electronics | Phones & Tablets, Computers & Laptops, Audio & Headphones, Cameras & Photography, TV & Video, Gaming, Components & Parts, Accessories |
| Music | Guitars, Bass, Drums & Percussion, Keyboards & Pianos, Amplifiers, Effects & Pedals, Pro Audio, Accessories |
| Home & Garden | Furniture, Kitchen & Dining, Tools & Hardware, Appliances, Outdoor & Garden, Lighting, Decor, Storage & Organization |
| Clothing & Accessories | Mens, Womens, Kids, Shoes, Bags & Wallets, Activewear, Vintage |
| Jewelry & Watches | Fine Jewelry, Fashion Jewelry, Watches, Loose Stones & Beads |
| Sports | Cycling, Fitness & Gym, Water Sports, Winter Sports, Team Sports, Outdoor & Camping, Running, Racquet Sports |
| Books & Media | Books, Vinyl & Records, CDs & DVDs, Video Games, Magazines, Textbooks, Comics & Graphic Novels, Audiobooks |
| Vehicles | Cars, Motorcycles, Bicycles, Trucks & Vans, Boats, Parts & Accessories, Trailers, Electric Vehicles |
| Real Estate | Apartment, Condo, Townhome, Manufactured, Single Family, Multi-Family |
| Collectibles | Antiques, Art, Coins & Currency, Trading Cards, Memorabilia, Stamps, Vintage Electronics |
| Health & Beauty | Skincare, Makeup, Hair Care, Fragrances, Wellness & Supplements |
| Toys & Hobbies | Action Figures & Dolls, Building Sets, Board Games & Puzzles, RC & Models, Craft Supplies |
| Baby & Kids | Strollers & Car Seats, Clothing, Toys, Furniture & Gear, Feeding & Nursing |
| Pet Supplies | Dogs, Cats, Fish & Aquariums, Small Animals & Birds |
| Other | General, Services, Free Stuff, Wanted |

**Valid listing statuses:** `private`, `for_sale`, `willing_to_sell`, `for_rent`

## Example

User:
```
/beacon-list-item I have a used copy of the board game Balderdash, in like new condition. I'd sell it for $10.
```

Assistant runs:
```bash
# Check beacon health
curl -s http://localhost:3000/health

# Create the ref
curl -X POST http://localhost:3000/refs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balderdash Board Game",
    "description": "Used copy in like-new condition. All pieces included.",
    "category": "Toys & Hobbies",
    "subcategory": "Board Games & Puzzles",
    "condition": "like_new",
    "listingStatus": "for_sale"
  }'

# Create the offer (using the id from the response above)
curl -X POST http://localhost:3000/offers \
  -H "Content-Type: application/json" \
  -d '{
    "refId": "<id>",
    "price": 10,
    "priceCurrency": "USD"
  }'
```

Response to user:
```
✓ Listed "Balderdash Board Game" for $10.00
  Category:  Toys & Hobbies → Board Games & Puzzles
  Condition: Like new
  Status:    For sale

  View it at http://localhost:3000
```
