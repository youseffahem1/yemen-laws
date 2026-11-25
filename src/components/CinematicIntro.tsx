"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BrandEmblem } from "./BrandLogo";

export function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("yle_intro_seen");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      sessionStorage.setItem("yle_intro_seen", "1");
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("yle_intro_seen", "1");
          setVisible(false);
        },
      });
      tlRef.current = tl;

      // Ambient gold light rays pulse
      gsap.to(".intro-light-ray", {
        opacity: 0.42,
        scale: 1.08,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Realistic flag wave shimmer
      gsap.to(".flag-shimmer", {
        xPercent: 120,
        duration: 1.6,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Scene 1: Yemeni Qamariya & Courthouse Arches stroke draw-in
      tl.fromTo(
        ".arch-path",
        { strokeDasharray: 1200, strokeDashoffset: 1200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.55, duration: 1.35, stagger: 0.15, ease: "power2.inOut" }
      )
        .to(".intro-scene-1", { opacity: 0.2, scale: 1.06, duration: 0.7, ease: "power1.out" })

        // Scene 2: Waving Yemen Flag (Red, White, Black) with 3D perspective
        .fromTo(
          ".intro-scene-2",
          { opacity: 0, y: 28, rotateY: -14, scale: 0.9 },
          { opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          "-=0.4"
        )
        .to(".intro-scene-2", { opacity: 0, y: -22, scale: 0.95, duration: 0.65, delay: 0.85, ease: "power2.in" })

        // Scene 3: Old Sana'a + Yemen Flag cinematic camera dolly forward
        .fromTo(
          ".intro-scene-3",
          { opacity: 0, scale: 1.0 },
          { opacity: 0.92, scale: 1.14, duration: 1.85, ease: "power1.inOut" },
          "-=0.35"
        )
        .to(".intro-scene-3", { opacity: 0.25, duration: 0.7, ease: "power2.out" })

        // Scene 4: Golden Scales & Brand Emblem with halo burst
        .fromTo(
          ".intro-halo",
          { opacity: 0, scale: 0.4 },
          { opacity: 0.75, scale: 1.25, duration: 1.0, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          ".intro-scene-4",
          { opacity: 0, scale: 0.72, rotateX: 12 },
          { opacity: 1, scale: 1, rotateX: 0, duration: 0.95, ease: "back.out(1.5)" },
          "-=0.75"
        )

        // Scene 5: Platform Title & Subtitle + Yemen Flag Divider
        .fromTo(
          ".intro-title",
          { opacity: 0, y: 24, letterSpacing: "0.08em" },
          { opacity: 1, y: 0, letterSpacing: "0em", duration: 0.85, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(
          ".intro-divider",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.45"
        )
        .fromTo(
          ".intro-subtitle",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.35"
        )

        // Smooth curtain reveal to homepage
        .to(containerRef.current, {
          opacity: 0,
          scale: 1.03,
          duration: 0.85,
          delay: 1.0,
          ease: "power2.inOut",
        });
    }, containerRef);

    return () => ctx.revert();
  }, [visible]);

  const handleSkip = () => {
    sessionStorage.setItem("yle_intro_seen", "1");
    if (tlRef.current) tlRef.current.kill();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050B16] text-[#FAF8F4]"
      style={{ perspective: "1000px" }}
      role="dialog"
      aria-label="افتتاحية الموسوعة القانونية والقضائية اليمنية"
    >
      {/* Ambient radial gold light rays */}
      <div className="intro-light-ray pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,162,83,0.22)_0%,rgba(6,13,27,0.96)_68%)] opacity-25" />

      {/* Scene 1: Yemeni Qamariya & Architectural Arches SVG */}
      <div className="intro-scene-1 pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 800 500" className="h-full w-full max-w-5xl" fill="none">
          <path className="arch-path" d="M120 480 V220 C120 120, 220 60, 260 40 C300 60, 400 120, 400 220 V480" stroke="#C6A253" strokeWidth="1.6" />
          <path className="arch-path" d="M400 480 V220 C400 120, 500 60, 540 40 C580 60, 680 120, 680 220 V480" stroke="#C6A253" strokeWidth="1.6" />
          <path className="arch-path" d="M235 480 V250 C235 155, 340 95, 400 70 C460 95, 565 155, 565 250 V480" stroke="#E6C97E" strokeWidth="2.2" />
          <circle className="arch-path" cx="400" cy="185" r="46" stroke="#E6C97E" strokeWidth="1.4" />
          <line className="arch-path" x1="80" y1="480" x2="720" y2="480" stroke="#C6A253" strokeWidth="1.6" />
        </svg>
      </div>

      {/* Scene 3: Old Sana'a & Yemen Flag */}
      <div className="intro-scene-3 pointer-events-none absolute inset-0 opacity-0">
        <img
          src="/images/hero-old-sanaa-flag.jpg"
          alt="صنعاء القديمة وعلم الجمهورية اليمنية"
          className="h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-[#050B16]/45 to-[#050B16]/75" />
      </div>

      {/* Scene 2: Waving Yemen Flag (Red top, White middle, Black bottom) */}
      <div className="intro-scene-2 pointer-events-none absolute flex flex-col items-center opacity-0">
        <div className="relative h-40 w-68 overflow-hidden rounded-xl border border-[#C6A253]/50 shadow-[0_25px_70px_rgba(0,0,0,0.75)]">
          <div className="h-1/3 w-full bg-[#CE1126]" />
          <div className="h-1/3 w-full bg-[#FFFFFF]" />
          <div className="h-1/3 w-full bg-[#000000]" />
          <div className="flag-shimmer pointer-events-none absolute inset-y-0 -left-full w-2/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
        </div>
        <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-[#E6C97E]">الجمهورية اليمنية</p>
      </div>

      {/* Scene 4 & 5: Golden Halo, Brand Emblem & Typography */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="intro-halo pointer-events-none absolute -top-8 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(230,201,126,0.38)_0%,transparent_70%)] opacity-0 blur-xl" />
        <div className="intro-scene-4 opacity-0 drop-shadow-[0_0_40px_rgba(198,162,83,0.5)]">
          <BrandEmblem size={126} />
        </div>
        <h1 className="intro-title mt-6 text-2xl font-bold text-[#FAF8F4] opacity-0 sm:text-4xl md:text-5xl">
          الموسوعة القانونية والقضائية اليمنية
        </h1>
        <div className="intro-divider mt-4 flex h-1 w-44 overflow-hidden rounded-full opacity-0">
          <div className="w-1/3 bg-[#CE1126]" />
          <div className="w-1/3 bg-[#FAF8F4]" />
          <div className="w-1/3 bg-[#151821]" />
        </div>
        <p className="intro-subtitle mt-3 max-w-2xl text-sm font-medium text-[#E6C97E] opacity-0 sm:text-base md:text-lg">
          مرجعك الرقمي للتشريعات والعلوم القانونية والقضائية
        </p>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="no-print absolute bottom-8 left-8 z-20 rounded-full border border-[#C6A253]/50 bg-[#0B162C]/85 px-5 py-2 text-xs font-semibold text-[#E6C97E] backdrop-blur-md transition hover:border-[#E6C97E] hover:bg-[#122344]"
      >
        تخطي المقدمة ←
      </button>
    </div>
  );
}
