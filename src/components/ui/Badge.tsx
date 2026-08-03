import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "promo" | "success" | "danger" | "warning" | "info" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  promo: "bg-gold text-ink border border-gold/40",
  success: "bg-success/15 text-success border border-success/30",
  danger: "bg-danger/15 text-danger border border-danger/30",
  warning: "bg-warning/15 text-warning border border-warning/30",
  info: "bg-cyan/15 text-cyan border border-cyan/30",
  neutral: "bg-white/5 text-text-muted border border-white/10",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
