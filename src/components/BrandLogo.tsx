import React from 'react';

interface BrandLogoProps {
  variant?: 'ar' | 'en' | 'icon';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 34, title: 'text-sm', sub: 'text-[10px]' },
  md: { icon: 44, title: 'text-base', sub: 'text-[11px]' },
  lg: { icon: 58, title: 'text-xl', sub: 'text-xs' },
  xl: { icon: 80, title: 'text-2xl md:text-3xl', sub: 'text-xs md:text-sm' },
};

export function BrandEmblem({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار الموسوعة القانونية والقضائية اليمنية"
    >
      <defs>
        <linearGradient id="goldGrad" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6C97E" />
          <stop offset="50%" stopColor="#C6A253" />
          <stop offset="100%" stopColor="#9A7832" />
        </linearGradient>
        <linearGradient id="navyBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#122344" />
          <stop offset="100%" stopColor="#070E1C" />
        </linearGradient>
      </defs>

      {/* Outer octagonal sovereignty seal */}
      <polygon
        points="60,4 99,21 116,60 99,99 60,116 21,99 4,60 21,21"
        fill="url(#navyBg)"
        stroke="url(#goldGrad)"
        strokeWidth="2.2"
      />
      <polygon
        points="60,10 95,25 110,60 95,95 60,110 25,95 10,60 25,25"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />

      {/* Subtle Yemeni tricolor architectural ribbon at top arch */}
      <path d="M40 28 C46 21, 74 21, 80 28" stroke="#B8292F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M43 31.5 C48 25.5, 72 25.5, 77 31.5" stroke="#FAF8F4" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
      <path d="M46 35 C50 30, 70 30, 74 35" stroke="#181B24" strokeWidth="1.8" strokeLinecap="round" />

      {/* Yemeni pointed architectural arch & twin judicial columns */}
      <path
        d="M27 88 V48 C27 32, 45 20, 60 18 C75 20, 93 32, 93 48 V88"
        stroke="url(#goldGrad)"
        strokeWidth="1.8"
        strokeOpacity="0.7"
        fill="none"
      />
      {/* Left Column */}
      <rect x="30" y="50" width="5" height="36" rx="1" fill="url(#goldGrad)" fillOpacity="0.85" />
      <rect x="28" y="48" width="9" height="2.5" rx="0.8" fill="url(#goldGrad)" />
      <rect x="28" y="86" width="9" height="3" rx="0.8" fill="url(#goldGrad)" />
      {/* Right Column */}
      <rect x="85" y="50" width="5" height="36" rx="1" fill="url(#goldGrad)" fillOpacity="0.85" />
      <rect x="83" y="48" width="9" height="2.5" rx="0.8" fill="url(#goldGrad)" />
      <rect x="83" y="86" width="9" height="3" rx="0.8" fill="url(#goldGrad)" />

      {/* Scales of Justice */}
      <line x1="60" y1="36" x2="60" y2="79" stroke="url(#goldGrad)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="36" r="2.6" fill="#E6C97E" />
      <path d="M40 44 Q60 40 80 44" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Left Scale Pan */}
      <line x1="41" y1="44" x2="36" y2="59" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <line x1="41" y1="44" x2="46" y2="59" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <path d="M35 59 Q41 64 47 59 Z" fill="url(#goldGrad)" />
      {/* Right Scale Pan */}
      <line x1="79" y1="44" x2="74" y2="59" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <line x1="79" y1="44" x2="84" y2="59" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <path d="M73 59 Q79 64 85 59 Z" fill="url(#goldGrad)" />

      {/* Open Legal Codex at Base */}
      <path
        d="M39 81 C46 77, 54 78, 60 82 C66 78, 74 77, 81 81 V91 C74 87, 66 88, 60 92 C54 88, 46 87, 39 91 Z"
        fill="#FAF8F4"
        fillOpacity="0.95"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
      />
      <line x1="60" y1="82" x2="60" y2="92" stroke="#9A7832" strokeWidth="1.4" />
    </svg>
  );
}

export function BrandLogo({ variant = 'ar', theme = 'dark', size = 'md', className = '' }: BrandLogoProps) {
  const s = SIZE_MAP[size];
  const titleColor = theme === 'dark' ? 'text-[#FAF8F4]' : 'text-[#0B162C]';
  const subColor = theme === 'dark' ? 'text-[#D6B978]' : 'text-[#8C6D2E]';

  if (variant === 'icon') {
    return <BrandEmblem size={s.icon} className={className} />;
  }

  if (variant === 'en') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
        <BrandEmblem size={s.icon} className="shrink-0" />
        <div className="flex flex-col text-left leading-tight">
          <span className={`font-serif font-bold tracking-wide ${s.title} ${titleColor}`}>
            YEMEN LEGAL &amp; JUDICIAL ENCYCLOPEDIA
          </span>
          <span className={`font-sans uppercase tracking-[0.18em] ${s.sub} ${subColor} mt-0.5`}>
            Digital Authority of Yemeni Legislation
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} dir="rtl">
      <BrandEmblem size={s.icon} className="shrink-0" />
      <div className="flex flex-col text-right leading-snug">
        <span className={`font-bold ${s.title} ${titleColor}`}>
          الموسوعة القانونية والقضائية اليمنية
        </span>
        <span className={`${s.sub} ${subColor} font-medium`}>
          مرجعك الرقمي للتشريعات والعلوم القانونية والقضائية
        </span>
      </div>
    </div>
  );
}
