import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-body tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-ink-700 text-beige-50 hover:bg-gold-600 px-7 py-3 text-sm shadow-soft hover:shadow-pedestal",
  gold:
    "bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600 bg-[length:200%_auto] text-ink-800 hover:bg-right px-7 py-3 text-sm shadow-soft",
  outline:
    "border border-ink-600/30 text-ink-700 hover:border-gold-500 hover:text-gold-600 px-7 py-3 text-sm",
  ghost: "text-ink-600 hover:text-gold-600 px-4 py-2 text-sm",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  href,
  onClick,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; href?: string }) {
  const cls = clsx(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick as unknown as () => void}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
