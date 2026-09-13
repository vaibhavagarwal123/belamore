"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { formatPaise } from "@/lib/money";

type Point = { date: string; revenuePaise: number; orders: number };
type View = "day" | "week" | "month" | "year";

function bucketKey(dateStr: string, view: View) {
  const d = new Date(dateStr);
  if (view === "day") return dateStr;
  if (view === "week") return format(startOfWeek(d), "yyyy-MM-dd");
  if (view === "month") return format(startOfMonth(d), "yyyy-MM");
  return format(startOfYear(d), "yyyy");
}

function labelFor(key: string, view: View) {
  if (view === "day" || view === "week") return format(new Date(key), "d MMM");
  if (view === "month") return format(new Date(key + "-01"), "MMM yyyy");
  return key;
}

export function SalesChart({ series }: { series: Point[] }) {
  const [view, setView] = useState<View>("day");

  const data = useMemo(() => {
    const map = new Map<string, { revenuePaise: number; orders: number }>();
    for (const point of series) {
      const key = bucketKey(point.date, view);
      const existing = map.get(key) ?? { revenuePaise: 0, orders: 0 };
      existing.revenuePaise += point.revenuePaise;
      existing.orders += point.orders;
      map.set(key, existing);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([key, v]) => ({ label: labelFor(key, view), ...v }));
  }, [series, view]);

  return (
    <div className="rounded-2xl border border-ink-600/10 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-ink-700">Sales Trend</h2>
        <div className="flex gap-1 rounded-full bg-beige-100 p-1 text-xs">
          {(["day", "week", "month", "year"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 capitalize transition-colors ${
                view === v ? "bg-white text-ink-700 shadow-sm" : "text-ink-400"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-400">No sales yet in this period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8862F" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#B8862F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D8" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8A8378" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#8A8378" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${Math.round(v / 100 / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatPaise(value)}
              contentStyle={{ borderRadius: 12, border: "1px solid #EFE6D8" }}
            />
            <Area type="monotone" dataKey="revenuePaise" stroke="#B8862F" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
