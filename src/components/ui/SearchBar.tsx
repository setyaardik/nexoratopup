"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({ placeholder = "Cari...", onSearch, className, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-white/10 bg-surface p-1.5 pl-4",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-2 text-sm text-text placeholder:text-text-muted outline-none"
      />
    </div>
  );
}
