"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "card-surface relative w-full max-w-md rounded-2xl p-6 animate-[fadeInUp_0.25s_ease]",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-heading text-lg font-bold text-text">{title}</h3>}
          <button onClick={onClose} className="ml-auto text-text-muted hover:text-text">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
