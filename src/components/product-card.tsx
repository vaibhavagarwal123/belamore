import Link from "next/link";
import Image from "next/image";
import { formatPaise } from "@/lib/money";

export type ProductCardData = {
  slug: string;
  name: string;
  shortDescription: string | null;
  priceInPaise: number;
  compareAtPaise: number | null;
  image: string;
  material: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-marble-100 shadow-soft transition-shadow duration-500 group-hover:shadow-pedestal">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-800/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {product.compareAtPaise && (
          <span className="absolute left-3 top-3 rounded-full bg-blush-200 px-3 py-1 text-[10px] uppercase tracking-wider text-ink-700">
            Special
          </span>
        )}
      </div>
      <div className="mt-4 px-1">
        {product.material && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-600">{product.material}</p>
        )}
        <h3 className="mt-1 font-display text-lg text-ink-700 group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-ink-700 font-medium">{formatPaise(product.priceInPaise)}</span>
          {product.compareAtPaise && (
            <span className="text-sm text-ink-400 line-through">
              {formatPaise(product.compareAtPaise)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
