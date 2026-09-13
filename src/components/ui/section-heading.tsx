import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <p
          className={clsx(
            "mb-3 text-xs font-body uppercase tracking-[0.35em]",
            light ? "text-gold-100" : "text-gold-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "font-display text-3xl sm:text-4xl md:text-5xl",
          light ? "text-beige-50" : "text-ink-700",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={clsx("mt-4 text-base leading-relaxed", light ? "text-beige-100" : "text-ink-500")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
