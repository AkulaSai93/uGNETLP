import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13.5px]",
  md: "px-6 py-[10.5px] text-[15px]",
  lg: "px-6 py-3.5 text-[16px]",
};

/** Primary CTA with the site's rotating dark conic border. */
export function GlowButton({
  children,
  size = "md",
  href,
  className = "",
  fullWidth,
  ...buttonProps
}: {
  children: ReactNode;
  size?: Size;
  href?: string;
  className?: string;
  fullWidth?: boolean;
} & Omit<ComponentProps<"button">, "children" | "className">) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        style={{ backgroundImage: "conic-gradient(transparent 200deg, #0b0d12)" }}
        className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%] group-disabled:hidden"
      />
      <span
        className={`relative z-[2] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-accent font-semibold text-white transition-colors group-hover:bg-accent-hover group-disabled:bg-accent/45 ${sizes[size]} ${fullWidth ? "w-full" : ""}`}
      >
        {children}
        <ArrowRight className="size-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
    </>
  );

  const base = `group relative inline-flex overflow-hidden rounded-[4px] p-[1.5px] ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    );
  }
  return (
    <button className={`${base} disabled:cursor-not-allowed`} {...buttonProps}>
      {inner}
    </button>
  );
}
