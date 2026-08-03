import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card-surface rounded-2xl",
        glow && "shadow-glow-soft",
        className
      )}
      {...props}
    />
  );
}
