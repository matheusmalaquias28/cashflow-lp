import clsx from "clsx";
import type { ComponentProps } from "react";

/* Compound pieces for a pricing card: an outer frame, a glassy header that
   holds the plan, price and CTA, and a body with the feature list. */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "relative flex h-full w-full flex-col rounded-xl border border-white/[0.11] bg-white/[0.02] p-1.5",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,.9)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function Header({
  className,
  children,
  glassEffect = true,
  ...props
}: ComponentProps<"div"> & { glassEffect?: boolean }) {
  return (
    <div
      className={clsx("relative mb-4 overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.04] p-4", className)}
      {...props}
    >
      {glassEffect && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.035) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function Plan({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("mb-6 flex items-center justify-between gap-2", className)} {...props} />;
}

export function PlanName({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={clsx("flex items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-fg-2", className)}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={clsx("shrink-0 rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-fg-2", className)}
      {...props}
    />
  );
}

export function Description({ className, ...props }: ComponentProps<"p">) {
  return <p className={clsx("text-xs text-fg-3", className)} {...props} />;
}

export function Price({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("mb-1 flex items-end gap-1", className)} {...props} />;
}

export function MainPrice({ className, ...props }: ComponentProps<"span">) {
  return <span className={clsx("display text-4xl tabular", className)} {...props} />;
}

export function Period({ className, ...props }: ComponentProps<"span">) {
  return <span className={clsx("pb-1 text-xs text-fg-3", className)} {...props} />;
}

/** Sits above the headline price, so the discount reads top-down. */
export function OriginalPrice({ className, ...props }: ComponentProps<"span">) {
  return <span className={clsx("block font-mono text-sm tabular text-fg-3 line-through", className)} {...props} />;
}

export function Body({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx("flex flex-1 flex-col gap-5 p-3", className)} {...props} />;
}

export function List({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={clsx("space-y-2.5", className)} {...props} />;
}

export function ListItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={clsx("flex items-start gap-2.5 text-sm text-fg-2", className)} {...props} />;
}

export function Separator({
  children = "Vendas adicionais",
  className,
  ...props
}: ComponentProps<"div"> & { children?: string }) {
  return (
    <div className={clsx("flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-fg-3", className)} {...props}>
      <span className="h-px flex-1 bg-white/[0.12]" />
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1 bg-white/[0.12]" />
    </div>
  );
}
