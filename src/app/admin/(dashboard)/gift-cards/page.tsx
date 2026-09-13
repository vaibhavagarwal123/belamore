import { db } from "@/lib/db";
import { formatPaise } from "@/lib/money";
import { GiftCardForm } from "@/components/admin/gift-card-form";
import { toggleGiftCardAction } from "@/lib/admin-giftcard-actions";

export default async function AdminGiftCardsPage() {
  const cards = await db.giftCard.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Gift Cards</h1>
      <div className="mb-6">
        <GiftCardForm />
      </div>
      <div className="space-y-3">
        {cards.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border border-ink-600/10 bg-white p-5">
            <div>
              <p className="font-display text-lg text-ink-700">{c.code}</p>
              <p className="text-sm text-ink-500">
                Balance {formatPaise(c.balancePaise)} of {formatPaise(c.initialValuePaise)}
                {c.recipientEmail && ` · for ${c.recipientEmail}`}
              </p>
              <p className="text-xs text-ink-400">{c.isActive ? "Active" : "Disabled"}</p>
            </div>
            <form action={toggleGiftCardAction}>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-sm text-blush-300 hover:underline">
                {c.isActive ? "Disable" : "Enable"}
              </button>
            </form>
          </div>
        ))}
        {cards.length === 0 && <p className="text-ink-400">No gift cards issued yet.</p>}
      </div>
    </div>
  );
}
