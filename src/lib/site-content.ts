import { db } from "@/lib/db";

const DEFAULTS: Record<string, string> = {
  "home.hero.heading": "Step Into a World Carved in Marble",
  "home.hero.subheading":
    "Belamore crafts sustainable, hand-finished marble gifts — designed in India, rooted in a lineage that traces back to the artisans of the Taj Mahal.",
  "about.story":
    "Belamore — derived from the Italian words 'Bel' (Beautiful) and 'Amore' (Love) — embodies the essence of infinite, beautiful love.",
  "contact.phone": "+91 88600 04976",
  "contact.email": "info@belamore.in",
  "contact.instagram": "https://instagram.com/BelamoreGifts",
  "contact.address": "Belamore Gifts, India — Pan-India Delivery",
};

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const rows = await db.siteContent.findMany();
    const map: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    return DEFAULTS;
  }
}

export async function getSiteContentValue(key: string): Promise<string> {
  const all = await getSiteContent();
  return all[key] ?? DEFAULTS[key] ?? "";
}
