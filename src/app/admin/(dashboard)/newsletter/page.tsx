import { db } from "@/lib/db";

export default async function AdminNewsletterPage() {
  const subscribers = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink-700">Newsletter Subscribers ({subscribers.length})</h1>
        <a href="/api/admin/newsletter-export" className="rounded-full border border-ink-600/20 px-5 py-2.5 text-sm text-ink-600 hover:border-gold-500">
          Export CSV
        </a>
      </div>
      <p className="mb-6 text-sm text-ink-500">
        Connect a Mailchimp audience via environment variables (see SETUP.md) to sync subscribers
        automatically, or export this list to import into any email marketing tool.
      </p>
      <div className="rounded-2xl border border-ink-600/10 bg-white">
        <ul className="divide-y divide-ink-600/10">
          {subscribers.map((s) => (
            <li key={s.id} className="flex justify-between p-4 text-sm">
              <span className="text-ink-700">{s.email}</span>
              <span className="text-ink-400">{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
            </li>
          ))}
          {subscribers.length === 0 && <li className="p-8 text-center text-ink-400">No subscribers yet.</li>}
        </ul>
      </div>
    </div>
  );
}
