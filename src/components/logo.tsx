import clsx from "clsx";
import Image from "next/image";

export function InfinityMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/belamore-logo.png"
      alt="Belamore"
      width={420}
      height={240}
      className={clsx("object-contain", className ?? "h-8 w-auto")}
    />
  );
}

export function BelamoreLogo({
  className,
  markClassName,
  textClassName,
  tagline = false,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  tagline?: boolean;
}) {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <InfinityMark className={clsx("h-6 w-auto md:h-7", markClassName)} />
      <div className="leading-none">
        <span
          className={clsx(
            "font-display tracking-[0.18em] text-xl md:text-2xl text-ink-700",
            textClassName,
          )}
        >
          BELAMORE
        </span>
        {tagline && (
          <div className="mt-1 text-[10px] tracking-[0.3em] text-gold-600 uppercase">
            Infinite Beautiful Love
          </div>
        )}
      </div>
    </div>
  );
}
