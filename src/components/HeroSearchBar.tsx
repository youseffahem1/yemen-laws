"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen, FileText } from "lucide-react";

interface Suggestion {
  type: "law" | "article";
  label: string;
  href: string;
}

export function HeroSearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?suggest=1&q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-[#C6A253]/45 bg-[#0B162C]/85 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <Search className="h-5 w-5 shrink-0 text-[#E6C97E]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="ابحث باسم القانون، رقم المادة، كلمة قانونية، أو مبدأ قضائي (مثال: المادة 149، الشريعة الإسلامية، الزواج)..."
            className="w-full bg-transparent text-sm text-[#FAF8F4] placeholder-[#FAF8F4]/55 focus:outline-none sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#C6A253] to-[#E6C97E] px-6 py-3 text-sm font-bold text-[#0B162C] transition hover:brightness-105"
        >
          <span>بحث قانوني</span>
          <ArrowLeft className="h-4 w-4" />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute right-0 left-0 z-30 mt-2 overflow-hidden rounded-xl border border-[#C6A253]/35 bg-[#0B162C] text-right shadow-2xl">
          <div className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold text-[#D6B978]">
            اقتراحات تشريعية فورية
          </div>
          <ul className="divide-y divide-white/10">
            {suggestions.map((s, idx) => (
              <li key={idx}>
                <Link
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs text-[#FAF8F4]/90 transition hover:bg-white/10"
                >
                  {s.type === "law" ? (
                    <BookOpen className="h-4 w-4 shrink-0 text-[#E6C97E]" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 text-[#C6A253]" />
                  )}
                  <span className="truncate">{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
