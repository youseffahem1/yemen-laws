"use client";

import React, { useEffect, useState } from "react";
import { Type, Sparkles, RotateCcw } from "lucide-react";

type FontSizeLevel = "sm" | "md" | "lg" | "xl";
type FontFamilyChoice = "amiri" | "ibm";

const SIZE_PX: Record<FontSizeLevel, string> = {
  sm: "15px",
  md: "18px",
  lg: "21px",
  xl: "25px",
};

export function ReadingControls() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<FontSizeLevel>("md");
  const [family, setFamily] = useState<FontFamilyChoice>("amiri");

  useEffect(() => {
    const savedSize = (localStorage.getItem("yle_font_size") as FontSizeLevel) || "md";
    const savedFam = (localStorage.getItem("yle_font_family") as FontFamilyChoice) || "amiri";
    setSize(savedSize);
    setFamily(savedFam);
    applySettings(savedSize, savedFam);
  }, []);

  function applySettings(s: FontSizeLevel, f: FontFamilyChoice) {
    document.documentElement.style.setProperty("--legal-font-size", SIZE_PX[s]);
    document.documentElement.style.setProperty(
      "--legal-font-family",
      f === "amiri"
        ? "var(--font-amiri), Georgia, serif"
        : "var(--font-ibm-arabic), system-ui, sans-serif"
    );
  }

  function changeSize(s: FontSizeLevel) {
    setSize(s);
    localStorage.setItem("yle_font_size", s);
    applySettings(s, family);
  }

  function changeFamily(f: FontFamilyChoice) {
    setFamily(f);
    localStorage.setItem("yle_font_family", f);
    applySettings(size, f);
  }

  function replayIntro() {
    sessionStorage.removeItem("yle_intro_seen");
    window.location.href = "/";
  }

  return (
    <div className="no-print fixed bottom-5 left-5 z-40">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-[#C6A253]/45 bg-[#0B162C]/95 p-4 text-[#FAF8F4] shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-[#E6C97E]">إعدادات القراءة والخط</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[#FAF8F4]/60 hover:text-white"
            >
              إغلاق
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="mb-1.5 text-[11px] text-[#FAF8F4]/75">حجم خط النصوص القانونية:</div>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: "sm", label: "صغير" },
                    { id: "md", label: "متوسط" },
                    { id: "lg", label: "كبير" },
                    { id: "xl", label: "ضخم" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeSize(item.id)}
                    className={`rounded-lg py-1.5 font-semibold transition ${
                      size === item.id
                        ? "bg-[#C6A253] text-[#0B162C]"
                        : "bg-white/10 text-[#FAF8F4] hover:bg-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-[11px] text-[#FAF8F4]/75">نوع الخط العربي:</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => changeFamily("amiri")}
                  className={`rounded-lg py-1.5 font-semibold transition ${
                    family === "amiri"
                      ? "bg-[#C6A253] text-[#0B162C]"
                      : "bg-white/10 text-[#FAF8F4] hover:bg-white/20"
                  }`}
                >
                  أميري (تشريعي)
                </button>
                <button
                  type="button"
                  onClick={() => changeFamily("ibm")}
                  className={`rounded-lg py-1.5 font-semibold transition ${
                    family === "ibm"
                      ? "bg-[#C6A253] text-[#0B162C]"
                      : "bg-white/10 text-[#FAF8F4] hover:bg-white/20"
                  }`}
                >
                  حديث (IBM)
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={replayIntro}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#C6A253]/40 bg-white/5 py-2 text-[11px] font-semibold text-[#E6C97E] hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة تشغيل الافتتاحية السينمائية
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-[#C6A253]/50 bg-[#0B162C]/95 px-4 py-2.5 text-xs font-bold text-[#E6C97E] shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-[#122344]"
        title="التحكم بحجم الخط وسهولة القراءة"
      >
        <Type className="h-4 w-4" />
        <span className="hidden sm:inline">التحكم بالخط</span>
        <Sparkles className="h-3.5 w-3.5 text-[#C6A253]" />
      </button>
    </div>
  );
}
