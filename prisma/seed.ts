import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const db = new PrismaClient();

function slug(s: string) {
  return slugify(s, { lower: true, strict: true });
}

const CARE = {
  marble:
    "Wipe gently with a soft, slightly damp cloth. Avoid acidic liquids such as lemon, vinegar or wine, and harsh detergents, which can etch the natural stone. Use a coaster under hot or wet items. Each piece carries the natural veining of real marble, so slight variation between pieces is part of its beauty, not a flaw.",
  soapstone:
    "Dust with a soft, dry cloth. Soapstone is naturally heat-resistant, making it ideal near candles and diyas, but avoid soaking it in water for long periods. A light coat of mineral oil every few months keeps the surface lustrous.",
  onyx:
    "Onyx is translucent and slightly more delicate than marble — handle with care and avoid dropping. Clean with a dry or barely damp soft cloth, and keep away from direct, prolonged sunlight to preserve its natural colour bands.",
  inlayBrass:
    "Wipe the marble body with a soft, dry cloth. Avoid abrasive cleaners on the brass or inlay work, which is hand-set and finished by artisans. Polish brass elements occasionally with a brass-safe polish to retain their shine.",
  woodMarble:
    "Wipe the marble surface with a damp cloth. Clean the wood portion with a barely-damp cloth and dry immediately; condition occasionally with a food-safe mineral or wood oil to keep it from drying out. Hand wash only — do not soak or dishwash.",
};

const img = (n: number) => `/products/img-${String(n).padStart(3, "0")}.jpg`;

type SeedProduct = {
  name: string;
  price: number; // rupees
  compareAt?: number;
  short: string;
  description: string;
  care: string;
  material: string;
  images: number[];
  featured?: boolean;
  variants?: { label: string; price: number }[];
};

type SeedCategory = {
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  products: SeedProduct[];
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Plates, Platters & Urlis",
    tagline: "Centrepieces carved to hold light, flowers and flame",
    description:
      "From lotus-shaped deep urlis to hand-finished decorative plates, this room gathers Belamore's most photographed serving and display pieces — each one carved from a single block of marble or onyx.",
    heroImage: img(1),
    products: [
      {
        name: "White Marble Lotus Shape Deep Urli (10\")",
        price: 3990,
        short: "A hand-carved lotus urli in pure white marble, 10 inches across.",
        description:
          "Carved to resemble an unfurling lotus, this deep urli is a statement centrepiece for entryways and festive tablescapes — fill it with floating petals, water and diyas, or display it as sculpture on its own. Hand-finished by artisans in a single piece of white marble.",
        care: CARE.marble,
        material: "White Marble",
        images: [1],
        featured: true,
      },
      {
        name: "Plain White Marble Deep Urli (6\")",
        price: 2100,
        short: "A compact, minimalist deep urli in pure white marble.",
        description:
          "A smaller, softly rounded urli for side tables and pujas — understated and versatile, letting flowers, floating candles or fruit take centre stage.",
        care: CARE.marble,
        material: "White Marble",
        images: [2],
      },
      {
        name: "White Marble Platter / Decorative Plate",
        price: 1800,
        short: "A clean, wide decorative plate for serving or display.",
        description:
          "A generously sized marble platter that moves effortlessly from festive serving to everyday styling — dry fruits, mithai, or simply left out as a quiet decorative object on a console.",
        care: CARE.marble,
        material: "White Marble",
        images: [3],
      },
      {
        name: "Onyx Leaf Plate (6\")",
        price: 2400,
        short: "A leaf-shaped plate in glowing imported onyx.",
        description:
          "Cut in the silhouette of a leaf from richly banded onyx, this plate catches light beautifully when placed near a window or lamp. A striking small-gifting piece that feels far more precious than its size suggests.",
        care: CARE.onyx,
        material: "Imported Onyx",
        images: [4],
      },
      {
        name: "Handcrafted Round Decorative Inlay Plate",
        price: 2290,
        short: "Inlay-work round plates, available in five sizes.",
        description:
          "Delicate stone inlay work rings the rim of this handcrafted plate, in the Mughal-era pietra dura tradition still practised by artisan families near the Taj Mahal. Choose a size to suit your space, from an intimate 6-inch plate to a grand 10-inch display piece.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [5],
        variants: [
          { label: "6 inch", price: 2290 },
          { label: "7 inch", price: 2590 },
          { label: "8 inch", price: 2890 },
          { label: "9 inch", price: 3290 },
          { label: "10 inch", price: 3690 },
        ],
      },
      {
        name: "Marble Urli with Inlay Work (9\")",
        price: 2990,
        short: "A 9-inch urli finished with fine stone inlay.",
        description:
          "This 9-inch urli pairs a wide, elegant bowl with intricate floral inlay work along its rim — a piece equally suited to festive floating-flower displays and year-round decor.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [6],
      },
      {
        name: "Marble Urli in Plain White Marble (9\")",
        price: 1990,
        short: "A clean-lined 9-inch urli in plain white marble.",
        description:
          "For those who prefer quiet elegance, this 9-inch urli is left unadorned — letting the natural marble grain and the water or flowers it holds do the talking.",
        care: CARE.marble,
        material: "White Marble",
        images: [7],
      },
    ],
  },
  {
    name: "Diyas & Festive Lighting",
    tagline: "Light that feels handed down through generations",
    description:
      "Diyas, t-light holders and incense stands carved by artisan families whose lineage traces back to the craftsmen of the Taj Mahal — pieces meant to be lit year after year, at every festival and quiet evening in between.",
    heroImage: img(8),
    products: [
      {
        name: "Almond Shape Marble and Brass Diya",
        price: 690,
        short: "A petite almond-shaped diya in marble and brass.",
        description:
          "A dainty, almond-shaped diya pairing pale marble with a polished brass well — perfect lined up in rows along a window ledge or entrance for Diwali and every festival after.",
        care: CARE.inlayBrass,
        material: "Marble & Brass",
        images: [8],
      },
      {
        name: "Flower Shape Marble and Brass Diya",
        price: 690,
        short: "A flower-shaped diya in marble with a brass well.",
        description:
          "Shaped like an open flower, this diya brings a softer, more ornamental silhouette to your festive lighting — beautiful individually or gathered in threes and fives.",
        care: CARE.inlayBrass,
        material: "Marble & Brass",
        images: [9],
      },
      {
        name: "Lotus Shaped Marble and Brass Diya (5\")",
        price: 1200,
        short: "A larger 5-inch lotus diya in marble and brass.",
        description:
          "A more substantial lotus-form diya, its petals radiating out from a gleaming brass centre — a beautiful anchor piece for a puja table or festive console.",
        care: CARE.inlayBrass,
        material: "Marble & Brass",
        images: [10],
        featured: true,
      },
      {
        name: "Onyx Diya / T-Light Holder",
        price: 800,
        short: "A glowing onyx diya that lights up from within.",
        description:
          "Cut from richly veined imported onyx, this diya glows softly from within when lit — a subtle, luminous alternative to plain marble.",
        care: CARE.onyx,
        material: "Imported Onyx",
        images: [11],
      },
      {
        name: "Yin-Yang Marble T-Light Holder Set",
        price: 1190,
        short: "A pair of interlocking round marble t-light holders.",
        description:
          "Two smooth, pebble-like t-light holders in white marble with mirrored gold-toned wells — set them together or apart, always in quiet balance with each other.",
        care: CARE.inlayBrass,
        material: "White Marble & Brass",
        images: [12],
        featured: true,
      },
      {
        name: "T-Light Holders in Various Shapes",
        price: 890,
        short: "Sculptural marble t-light holders, sold individually.",
        description:
          "Simple, sculptural t-light holders in a range of gentle forms — collect a few different shapes for an eclectic, elegant tablescape.",
        care: CARE.marble,
        material: "White Marble",
        images: [13],
      },
      {
        name: "Candle / T-Light Holder with Intricate Inlay",
        price: 1690,
        short: "An inlay-worked holder, with or without jaali lattice.",
        description:
          "Fine stone inlay traces the surface of this candle holder, available with or without an openwork jaali lid that scatters warm light across the room when lit.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [14],
      },
      {
        name: "T-Light Holder with Intricate Latticework (Jaali)",
        price: 1990,
        short: "A t-light holder wrapped in fine jaali latticework.",
        description:
          "Hand-carved jaali (perforated lattice) wraps this holder entirely, casting intricate shadow patterns across the walls when a candle flickers inside — a showpiece even unlit.",
        care: CARE.marble,
        material: "White Marble",
        images: [15],
      },
      {
        name: "Soapstone Diffuser with Brass Top",
        price: 1200,
        short: "An oil diffuser in cool soapstone with a brass crown.",
        description:
          "A tea-light oil diffuser carved from soapstone with a fitted brass top — gently warm your favourite essential oils to scent a room, festival or otherwise.",
        care: CARE.soapstone,
        material: "Soapstone & Brass",
        images: [16],
      },
      {
        name: "Tall Incense and Dhoop Holder",
        price: 1800,
        short: "A tall, elegant stand for incense and dhoop.",
        description:
          "A tall marble stand designed to catch ash neatly while your incense or dhoop burns — a graceful everyday ritual object rather than an afterthought.",
        care: CARE.marble,
        material: "White Marble",
        images: [17],
      },
      {
        name: "Chakra Incense Holder",
        price: 1200,
        short: "A circular incense holder in white or black marble.",
        description:
          "A circular, meditative incense holder inspired by the chakra motif — available in serene white marble or a deeper, more dramatic black marble finish.",
        care: CARE.marble,
        material: "Marble",
        images: [18],
        variants: [
          { label: "White Marble", price: 1200 },
          { label: "Black Marble", price: 1600 },
        ],
      },
      {
        name: "Shivling in Pure White Marble",
        price: 490,
        short: "A hand-carved Shivling in pure white marble.",
        description:
          "A devotional Shivling hand-carved from a single piece of pure white marble, available in two sizes for home mandirs of any scale.",
        care: CARE.marble,
        material: "White Marble",
        images: [19],
        variants: [
          { label: "Small", price: 490 },
          { label: "Big", price: 690 },
        ],
      },
    ],
  },
  {
    name: "Coasters & Trays",
    tagline: "Small daily luxuries, set on real stone",
    description:
      "Coaster sets in soapstone, marble, onyx and brass — the easiest way to bring Belamore's craftsmanship into everyday moments, one cup of chai or evening drink at a time.",
    heroImage: img(20),
    products: [
      {
        name: "Elephant Design Soapstone Coaster",
        price: 1500,
        short: "Hand-carved soapstone coasters in an elephant motif.",
        description:
          "A set of soapstone coasters hand-carved with a gentle elephant motif — a symbol of good fortune, set beneath your everyday cup.",
        care: CARE.soapstone,
        material: "Soapstone",
        images: [20],
      },
      {
        name: "Peacock Design Soapstone Coasters",
        price: 1300,
        short: "Soapstone coasters carved with a peacock motif.",
        description:
          "Delicately carved with India's national bird, these soapstone coasters bring a touch of ornament to your coffee table or dining setting.",
        care: CARE.soapstone,
        material: "Soapstone",
        images: [21],
      },
      {
        name: "Inlay Work Marble Coasters with Holder (Set of 6)",
        price: 2290,
        short: "Six inlay-worked coasters in a matching marble holder.",
        description:
          "A complete set of six coasters, each finished with fine stone inlay, presented in a matching marble holder — an easy, ready-to-gift set for any home.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [22],
        featured: true,
      },
      {
        name: "Round Marble and Wood Coasters (Set of 4)",
        price: 1190,
        short: "Round coasters pairing marble with warm mango wood.",
        description:
          "Four round coasters that pair cool white marble with warm mango wood — a modern, understated pick for contemporary tables.",
        care: CARE.woodMarble,
        material: "Marble & Mango Wood",
        images: [23],
      },
      {
        name: "Square Marble and Wood Coasters (Set of 4)",
        price: 1190,
        short: "Square coasters pairing marble with warm mango wood.",
        description:
          "The square sibling to our round marble-and-wood coasters — clean geometry, natural materials, four to a set.",
        care: CARE.woodMarble,
        material: "Marble & Mango Wood",
        images: [24],
      },
      {
        name: "White Marble and Brass Coasters (Set of 2)",
        price: 1190,
        short: "A pair of coasters trimmed in gleaming brass.",
        description:
          "Two marble coasters ringed in polished brass — a small, luxurious detail for a housewarming gift or your own dining table.",
        care: CARE.inlayBrass,
        material: "White Marble & Brass",
        images: [25],
      },
      {
        name: "Marble Coasters with Brass Dragonfly (Set of 2)",
        price: 1200,
        short: "Coasters accented with a delicate brass dragonfly inlay.",
        description:
          "A pair of coasters finished with a delicate brass dragonfly motif — playful, elegant, and a lovely small gift on its own.",
        care: CARE.inlayBrass,
        material: "White Marble & Brass",
        images: [26],
      },
    ],
  },
  {
    name: "Figurines & Keepsakes",
    tagline: "Small pieces, meant to be kept forever",
    description:
      "Curated small-format pieces — inlay figurines, imported onyx paperweights and a heart-shaped table clock — built for gifting moments where the size of the box says nothing about the weight of the gesture.",
    heroImage: img(27),
    products: [
      {
        name: "Elegant Figurine with Exquisite Inlay Work",
        price: 1290,
        short: "A small hand-inlaid elephant figurine, in two sizes.",
        description:
          "A beautifully proportioned elephant figurine finished with the same pietra dura inlay technique used on the Taj Mahal itself — an heirloom-quality keepsake in miniature.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [27],
        variants: [
          { label: "2.5 inch", price: 1290 },
          { label: "3 inch", price: 1490 },
        ],
        featured: true,
      },
      {
        name: "Imported Onyx Apple Paperweight (2\")",
        price: 690,
        short: "A polished onyx paperweight, shaped like an apple.",
        description:
          "A small, weighty apple carved from glowing imported onyx — equally at home on a work desk or a bookshelf.",
        care: CARE.onyx,
        material: "Imported Onyx",
        images: [28],
      },
      {
        name: "Imported Onyx Dice Paperweight (2\")",
        price: 690,
        short: "A polished onyx paperweight, shaped like a dice.",
        description:
          "A graphic, geometric dice paperweight in banded onyx — a quietly playful desk object with real heft.",
        care: CARE.onyx,
        material: "Imported Onyx",
        images: [29],
      },
      {
        name: "Imported Decorative Onyx Table Clock (Heart Shape)",
        price: 3490,
        short: "A heart-shaped table clock carved in onyx.",
        description:
          "A working table clock carved into a soft heart silhouette from imported onyx — a sentimental, functional keepsake for anniversaries and milestone gifts.",
        care: CARE.onyx,
        material: "Imported Onyx",
        images: [30],
      },
    ],
  },
  {
    name: "Jewellery & Storage Boxes",
    tagline: "Where the smallest, most precious things live",
    description:
      "Hand-carved boxes for jewellery, trinkets and treasures — each lid finished with fine stone inlay or delicate jaali work, built to be handed down.",
    heroImage: img(31),
    products: [
      {
        name: "Rectangular Jewellery Box with Inlay Work and Lid (6\"x4\")",
        price: 3490,
        short: "A rectangular inlay jewellery box with a fitted lid.",
        description:
          "A generously sized jewellery box in white marble, its lid and sides finished with fine floral inlay work — available in single-colour or multi-coloured stone detailing.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [31],
        featured: true,
      },
      {
        name: "Storage Box with Inlay Work and Jaali Sides (6\"x4\")",
        price: 3990,
        short: "A lidded storage box with inlay top and jaali sides.",
        description:
          "Inlay work crowns the lid while openwork jaali wraps the sides of this storage box — a striking piece that looks as good closed as open.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [32],
      },
      {
        name: "Hexagon Storage Box with Inlay Work (5\")",
        price: 3490,
        short: "A hexagonal keepsake box with fine inlay detailing.",
        description:
          "A hexagonal silhouette sets this storage box apart — hand-carved from a single piece of marble and finished with intricate inlay across its lid.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [33],
      },
      {
        name: "Elephant Jewellery Box with Inlay Work",
        price: 1990,
        short: "A single-piece marble box carved with elephants on every side.",
        description:
          "Carved from one solid piece of marble with elephants processing around every side, then finished with fine inlay work — available in three sizes to suit any dressing table.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [34],
        variants: [
          { label: "3 inch diameter", price: 1990 },
          { label: "5 inch diameter", price: 2990 },
          { label: "6 inch diameter", price: 4490 },
        ],
        featured: true,
      },
      {
        name: "Dome Shaped Storage Box with Inlay Work",
        price: 2600,
        short: "A domed keepsake box with delicate inlay work.",
        description:
          "A softly domed lid gives this storage box a distinctive silhouette, finished all over with delicate hand-set stone inlay.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [35],
      },
      {
        name: "Luxury Marble Tissue Box with Inlay Work and Jaali Lid",
        price: 2990,
        short: "A marble tissue box finished with inlay and a jaali lid.",
        description:
          "An everyday object elevated — this tissue box wears the same inlay and jaali craftsmanship as our finest keepsake boxes, so nothing on your table feels ordinary.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [36],
      },
    ],
  },
  {
    name: "Home Decor & Tabletop",
    tagline: "Everyday rituals, made from stone",
    description:
      "Dessert bowls, condiment sets and a marble-and-wood board — pieces designed for the table you set most often.",
    heroImage: img(39),
    products: [
      {
        name: "Pure White Marble Dessert Bowls",
        price: 990,
        short: "Hand-finished dessert bowls in pure white marble.",
        description:
          "Smooth, weighty little bowls in pure white marble — beautiful for dessert, dry fruits, or a scoop of ice cream that suddenly feels a little more special.",
        care: CARE.marble,
        material: "White Marble",
        images: [37],
        variants: [
          { label: "Set of 2", price: 990 },
          { label: "Set of 4", price: 1790 },
          { label: "Set of 6", price: 2490 },
        ],
      },
      {
        name: "Condiments Containers with Matching Tray",
        price: 2590,
        short: "White marble condiment containers on a matching tray.",
        description:
          "A set of small marble containers on a matching tray — perfect for pickles, chutneys and condiments at the table, or salt and spices by the stove.",
        care: CARE.marble,
        material: "White Marble",
        images: [38],
      },
      {
        name: "White Marble and Wood Platter / Chopping Board",
        price: 1190,
        short: "A platter and board hybrid in marble and mango wood.",
        description:
          "Half marble, half mango wood — cool stone for cheeses and cold cuts on one side, warm wood for slicing and serving on the other.",
        care: CARE.woodMarble,
        material: "Marble & Mango Wood",
        images: [39],
        featured: true,
      },
    ],
  },
  {
    name: "Office Accessories",
    tagline: "A desk worth sitting down to",
    description:
      "Pen holders and card holders carved from marble and finished with fine inlay work — for the desk of someone who notices detail.",
    heroImage: img(40),
    products: [
      {
        name: "Pen Holder in Inlay / Jaali Work",
        price: 1190,
        short: "A marble pen holder, in jaali-only or inlay-and-jaali finish.",
        description:
          "A weighty, handsome pen holder for a desk — choose the openwork jaali finish alone, or the fuller inlay-and-jaali combination for a more ornate look.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [40],
        variants: [
          { label: "Jaali only", price: 1190 },
          { label: "Inlay + Jaali", price: 1690 },
        ],
      },
      {
        name: "Engraved White Marble Pen Holder",
        price: 1490,
        short: "A clean-lined pen holder, ready for personal engraving.",
        description:
          "A simple, sculptural pen holder in white marble — leave it plain, or have it engraved with a name or initials for a personal touch on any desk.",
        care: CARE.marble,
        material: "White Marble",
        images: [41],
      },
      {
        name: "Business Card Holder with Inlay Work (4\"x3\")",
        price: 1990,
        short: "A marble business card holder with fine inlay detailing.",
        description:
          "A refined card holder for a desk or reception counter, its face finished with fine stone inlay — the kind of detail clients notice.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [42],
      },
    ],
  },
  {
    name: "Leadership & Corporate Gifts",
    tagline: "For the gestures that need to say more",
    description:
      "Signature showpieces for clients, leadership and guest speakers — a marble Taj Mahal, wine sets and curated gift hampers built for the moments that matter most in business.",
    heroImage: img(43),
    products: [
      {
        name: "Marble Replica of the Taj Mahal (7\")",
        price: 3990,
        short: "A detailed 7-inch marble replica of the Taj Mahal.",
        description:
          "Carved by artisan families who trace their craft directly back to the builders of the Taj Mahal, this 7-inch replica is Belamore's most requested leadership and legacy gift — a piece with a story built into the stone itself.",
        care: CARE.marble,
        material: "White Marble",
        images: [43],
        featured: true,
      },
      {
        name: "Wine Glasses in White Marble with Matching Tray (Set of 2)",
        price: 2590,
        short: "Two marble wine glasses on a matching tray.",
        description:
          "A pair of wine glasses hand-carved from white marble, presented on a matching tray — an unusual, memorable gift for hosts and clients alike.",
        care: CARE.marble,
        material: "White Marble",
        images: [44],
      },
      {
        name: "Wine Glasses with Inlay Work and Matching Tray (Set of 2)",
        price: 3990,
        short: "Inlay-finished marble wine glasses with a matching tray.",
        description:
          "The elevated version of our marble wine glass set, finished with intricate inlay work across the tray and glasses — a true showpiece gift.",
        care: CARE.inlayBrass,
        material: "White Marble with Stone Inlay",
        images: [45],
      },
      {
        name: "Curated Corporate Gift Hamper",
        price: 4990,
        short: "A fully customisable hamper of two or more Belamore pieces.",
        description:
          "Belamore's signature hamper service — mix and match two or more products from across our collections into a single beautifully packaged hamper, customised with names, logos or messages for employees, clients and leadership. Price shown is a starting point; final pricing depends on the pieces and quantity you choose. Bulk pricing available: 5% off for 10–49 units, 10% off for 50–199 units, 15% off for 200+ units.",
        care: CARE.marble,
        material: "Mixed Marble Pieces",
        images: [46, 47],
        featured: true,
      },
    ],
  },
];

async function main() {
  console.log("Seeding Belamore catalogue...");

  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.productVariant.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.discountCode.deleteMany();
  await db.testimonial.deleteMany();
  await db.blogPost.deleteMany();
  await db.siteContent.deleteMany();

  let categorySort = 0;
  for (const cat of CATEGORIES) {
    const category = await db.category.create({
      data: {
        name: cat.name,
        slug: slug(cat.name),
        tagline: cat.tagline,
        description: cat.description,
        heroImage: cat.heroImage,
        sortOrder: categorySort++,
      },
    });

    let skuCounter = 1;
    for (const p of cat.products) {
      const baseSku = `${category.slug.slice(0, 3).toUpperCase()}-${String(skuCounter++).padStart(3, "0")}`;
      const product = await db.product.create({
        data: {
          name: p.name,
          slug: slug(p.name),
          shortDescription: p.short,
          description: p.description,
          careInstructions: p.care,
          material: p.material,
          priceInPaise: p.price * 100,
          compareAtPaise: p.compareAt ? p.compareAt * 100 : null,
          sku: baseSku,
          stock: 20 + Math.floor(Math.random() * 30),
          isFeatured: !!p.featured,
          categoryId: category.id,
          images: {
            create: p.images.map((n, i) => ({
              url: img(n),
              alt: p.name,
              sortOrder: i,
            })),
          },
          variants: p.variants
            ? {
                create: p.variants.map((v, i) => ({
                  label: v.label,
                  priceInPaise: v.price * 100,
                  stock: 15 + Math.floor(Math.random() * 20),
                  sku: `${baseSku}-V${i + 1}`,
                })),
              }
            : undefined,
        },
      });
      void product;
    }
  }

  await db.discountCode.create({
    data: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderPaise: 100000,
      usageLimit: null,
      isActive: true,
    },
  });

  await db.testimonial.createMany({
    data: [
      {
        authorName: "Ananya Rao",
        authorRole: "Bought for a wedding hamper",
        quote:
          "The inlay jewellery box arrived wrapped so beautifully I almost didn't want to open it. My sister still keeps it on her dressing table a year later.",
        rating: 5,
        sortOrder: 0,
      },
      {
        authorName: "Karan Mehta",
        authorRole: "Head of HR, corporate client",
        quote:
          "We ordered 120 marble diyas for our Diwali employee gifting. The finish, the packaging, the on-time delivery — everything felt far more premium than the price suggested.",
        rating: 5,
        sortOrder: 1,
      },
      {
        authorName: "Priya & Nikhil",
        authorRole: "Return customers",
        quote:
          "We've gifted Belamore pieces at three weddings now. The Taj Mahal replica for our guest speaker was the talk of the evening.",
        rating: 5,
        sortOrder: 2,
      },
    ],
  });

  await db.blogPost.createMany({
    data: [
      {
        title: "The Artisans Behind Every Belamore Piece",
        slug: "artisans-behind-belamore",
        excerpt:
          "Meet the families whose craft traces back generations to the marble workshops of the Taj Mahal — and how that lineage shapes every piece we make.",
        content:
          "Every Belamore piece begins long before it reaches our workshop — in families who have carved marble for generations, tracing their craft directly back to the artisans who built the Taj Mahal. The pietra dura inlay technique you see on our jewellery boxes and coasters is the same technique used on that monument nearly four centuries ago: semi-precious stones cut by hand and set, piece by tiny piece, into marble.\n\nWhen you hold a Belamore piece, you're holding hours of patient, practised work — and helping keep an extraordinary craft alive for the next generation of artisans.",
        coverImage: img(43),
      },
      {
        title: "How to Care for Your Marble Gifts",
        slug: "how-to-care-for-marble-gifts",
        excerpt:
          "Marble is forever, but it does ask for a little care. Here's how to keep your Belamore pieces looking as beautiful as the day they arrived.",
        content:
          "Marble is a natural stone, which means it has a few simple preferences: it dislikes acidic liquids (lemon, vinegar, wine), harsh chemical cleaners, and being left wet for long periods. Beyond that, it's remarkably forgiving.\n\nFor everyday care, a soft, slightly damp cloth is all you need. Use coasters under hot mugs and glasses, avoid soaking pieces in the sink, and if a piece sees regular dining use, a food-safe stone sealer once a year keeps it looking new. Soapstone and onyx pieces have their own small quirks too — full care notes are listed on every product page.",
        coverImage: img(19),
      },
      {
        title: "Corporate Gifting That Doesn't Feel Generic",
        slug: "corporate-gifting-that-doesnt-feel-generic",
        excerpt:
          "A guide to choosing marble gifts for employees, clients and leadership — including our bulk pricing for larger orders.",
        content:
          "Corporate gifting often defaults to the forgettable: branded pens, generic hampers, gifts that say very little about the thought behind them. Marble changes that equation. It's substantial, it photographs beautifully for internal comms and LinkedIn posts, and — because every piece is hand-finished — it never feels mass-produced, even when you're ordering two hundred of them.\n\nWe offer tiered bulk pricing (5% off 10–49 units, 10% off 50–199 units, 15% off 200+ units) and can customise packaging with your company's name or message. Get in touch with our team to build a hamper for your next milestone.",
        coverImage: img(46),
      },
    ],
  });

  await db.siteContent.createMany({
    data: [
      {
        key: "home.hero.heading",
        value: "Step Into a World Carved in Marble",
      },
      {
        key: "home.hero.subheading",
        value:
          "Belamore crafts sustainable, hand-finished marble gifts — designed in India, rooted in a lineage that traces back to the artisans of the Taj Mahal.",
      },
      {
        key: "about.story",
        value:
          "Belamore — derived from the Italian words 'Bel' (Beautiful) and 'Amore' (Love) — embodies the essence of infinite, beautiful love. We believe in doing good while doing business: every piece we craft is designed to minimise environmental impact while delivering timeless value, made by artisan families whose lineage traces back to the creators of the iconic Taj Mahal.",
      },
      {
        key: "contact.phone",
        value: "+91 88600 04976",
      },
      {
        key: "contact.email",
        value: "info@belamore.in",
      },
      {
        key: "contact.instagram",
        value: "https://instagram.com/BelamoreGifts",
      },
      {
        key: "contact.address",
        value: "Belamore Gifts, India — Pan-India Delivery",
      },
    ],
  });

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
