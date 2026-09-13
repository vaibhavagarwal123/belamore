import clsx from "clsx";

export function InfinityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className ?? "h-8 w-auto"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="120" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#946A24" />
          <stop offset="45%" stopColor="#D9B25B" />
          <stop offset="55%" stopColor="#F3E1B0" />
          <stop offset="100%" stopColor="#946A24" />
        </linearGradient>
      </defs>
      <path
        d="M30 15C18 15 8 23 8 33C8 43 18 51 30 51C42 51 47 39 60 30C73 21 78 9 90 9C102 9 112 17 112 27C112 37 102 45 90 45C78 45 73 33 60 24C47 15 42 15 30 15Z"
        stroke="url(#goldGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
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
