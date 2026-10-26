import React from 'react';
import { MascotMood, useApp } from '../context/AppContext';

/**
 * Illustrated SVG Mascots & Official TailsHug Category Icons
 * Exactly matching the 12 service icons from TailsHug branding:
 * 1. Health
 * 2. Grooming & Hygiene
 * 3. Boarding & Daycare
 * 4. Training & Behaviour
 * 5. Pet Adoption & Breeding
 * 6. Pet Transport
 * 7. Recreation & Exercise
 * 8. Pet supplies
 * 9. Technology & Apps
 * 10. Memorial Services
 * 11. Arts & Photos
 * 12. Pet Ambulance (with 24/7 emergency badge)
 */

export const IllustratedDogMascot: React.FC<{
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg';
}> = ({ mood = 'idle', size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  const containerAnimation =
    mood === 'celebrate'
      ? 'animate-happy-bounce'
      : mood === 'curious'
      ? '-rotate-6 transition-transform duration-200'
      : 'animate-gentle-float';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${dimensions} ${containerAnimation}`}
      aria-label="Huggy the friendly TailsHug Golden Pup mascot"
    >
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <ellipse cx="70" cy="128" rx="36" ry="7" fill="#F69E40" fillOpacity="0.18" />
        <g className="animate-tail-wag" style={{ transformOrigin: '96px 96px' }}>
          <path
            d="M94 96 C116 88, 126 68, 114 56 C106 48, 98 66, 92 86 Z"
            fill="#E88B28"
          />
        </g>
        <rect x="44" y="74" width="52" height="46" rx="24" fill="#F69E40" />
        <ellipse cx="70" cy="99" rx="17" ry="18" fill="#FFF7ED" />
        <ellipse cx="55" cy="118" rx="10" ry="7" fill="#FFF7ED" stroke="#E88B28" strokeWidth="2" />
        <ellipse cx="85" cy="118" rx="10" ry="7" fill="#FFF7ED" stroke="#E88B28" strokeWidth="2" />
        <path d="M48 78 Q70 86 92 78" stroke="#1F4D3A" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="84" r="5" fill="#FBBF24" stroke="#1F4D3A" strokeWidth="1.5" />
        <g
          style={{
            transformOrigin: '70px 54px',
            transform: mood === 'curious' ? 'rotate(-8deg)' : 'rotate(0deg)',
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <path d="M38 36 C22 40, 20 66, 34 70 C42 72, 46 54, 44 40 Z" fill="#D97719" />
          <path d="M102 36 C118 40, 120 66, 106 70 C98 72, 94 54, 96 40 Z" fill="#D97719" />
          <rect x="36" y="24" width="68" height="54" rx="27" fill="#F8AC58" />
          <ellipse cx="70" cy="58" rx="18" ry="13" fill="#FFF7ED" />
          <g className="animate-eye-blink">
            <circle cx="54" cy="46" r="5" fill="#18181B" />
            <circle cx="52.5" cy="44.5" r="1.8" fill="#FFFFFF" />
            <circle cx="86" cy="46" r="5" fill="#18181B" />
            <circle cx="84.5" cy="44.5" r="1.8" fill="#FFFFFF" />
          </g>
          <path d="M47 37 Q54 34 59 37" stroke="#9A4E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M81 37 Q86 34 93 37" stroke="#9A4E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="70" cy="53" rx="6.5" ry="4.5" fill="#18181B" />
          <path d="M62 60 Q70 66 78 60" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {(mood === 'celebrate' || mood === 'idle') && (
            <path d="M66 63 Q70 72 74 63 Z" fill="#F43F5E" />
          )}
        </g>
      </svg>
    </div>
  );
};

export const IllustratedCatMascot: React.FC<{
  size?: 'sm' | 'md' | 'lg';
}> = ({ size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none animate-gentle-float ${dimensions}`}
      aria-label="Bekky & Chiku the curious Persian cats"
    >
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <ellipse cx="70" cy="128" rx="34" ry="6" fill="#18181B" fillOpacity="0.08" />
        <path
          d="M92 104 C118 98, 124 72, 110 62 C100 56, 96 78, 88 94 Z"
          fill="#FFFFFF"
          stroke="#E4E4E7"
          strokeWidth="2"
          className="animate-tail-wag"
          style={{ transformOrigin: '92px 104px' }}
        />
        <rect x="44" y="72" width="52" height="48" rx="24" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="2" />
        <polygon points="40,42 36,18 58,30" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="2" />
        <polygon points="42,38 40,23 54,31" fill="#FBCFE8" />
        <polygon points="100,42 104,18 82,30" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="2" />
        <polygon points="98,38 100,23 86,31" fill="#FBCFE8" />
        <rect x="36" y="26" width="68" height="52" rx="26" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="2" />
        <g className="animate-eye-blink">
          <circle cx="55" cy="50" r="6" fill="#0284C7" />
          <circle cx="55" cy="50" r="2.5" fill="#18181B" />
          <circle cx="53.5" cy="48.5" r="1.5" fill="#FFFFFF" />
          <circle cx="85" cy="50" r="6" fill="#D97706" />
          <circle cx="85" cy="50" r="2.5" fill="#18181B" />
          <circle cx="83.5" cy="48.5" r="1.5" fill="#FFFFFF" />
        </g>
        <polygon points="67,56 73,56 70,60" fill="#F472B6" />
        <path d="M64 62 Q70 66 76 62" stroke="#52525B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="26" y1="54" x2="44" y2="56" stroke="#A1A1AA" strokeWidth="1.5" />
        <line x1="26" y1="60" x2="44" y2="60" stroke="#A1A1AA" strokeWidth="1.5" />
        <line x1="96" y1="56" x2="114" y2="54" stroke="#A1A1AA" strokeWidth="1.5" />
        <line x1="96" y1="60" x2="114" y2="60" stroke="#A1A1AA" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

/**
 * EXACT 12 TailsHug Service Icons matching user's reference image
 * Styled with warm coral-to-amber gradient (#FF5A70 to #F69E40)
 */
export const CategoryGraphic: React.FC<{
  slug: string;
  className?: string;
  showBg?: boolean;
  customIconUrl?: string;
}> = ({ slug, className = 'w-16 h-16', showBg = false, customIconUrl }) => {
  let customIcon = customIconUrl;
  const norm = slug.toLowerCase();

  try {
    const app = useApp();
    if (!customIcon && app?.customIcons?.[norm]) {
      customIcon = app.customIcons[norm];
    }
  } catch {
    // Graceful fallback outside AppProvider
  }

  if (customIcon) {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none overflow-hidden ${
          showBg
            ? 'p-2 rounded-2xl bg-[#FFF5F5] border border-rose-100 shadow-xs'
            : ''
        } ${className}`}
      >
        <img
          src={customIcon}
          alt={slug}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        showBg
          ? 'p-2 rounded-2xl bg-[#FFF5F5] border border-rose-100 shadow-xs'
          : ''
      } ${className}`}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`thGrad_${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D68" />
            <stop offset="100%" stopColor="#F69E40" />
          </linearGradient>
        </defs>

        {/* 1. Health — Stethoscope Heart with Paw */}
        {norm.includes('health') && !norm.includes('ambulance') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Earpieces */}
            <circle cx="24" cy="14" r="2.5" />
            <circle cx="40" cy="14" r="2.5" />
            <path
              d="M24 16.5 C24 23 28 27 32 27 C36 27 40 23 40 16.5"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Heart outline tube */}
            <path
              d="M32 27 C32 30 20 32 17 40 C14 47 22 55 32 60 C42 55 50 47 47 40 C44 32 32 30 32 27"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Chestpiece node */}
            <circle cx="46" cy="44" r="4.5" />
            <circle cx="46" cy="44" r="2" fill="#FFF" />
            {/* Paw inside Heart */}
            <ellipse cx="32" cy="46" rx="4.5" ry="3.5" />
            <circle cx="27" cy="41" r="1.6" />
            <circle cx="30.5" cy="39" r="1.6" />
            <circle cx="34" cy="39.2" r="1.6" />
            <circle cx="37" cy="41.5" r="1.6" />
          </g>
        )}

        {/* 2. Grooming & Hygiene — Scissors, Comb, Paw & Sparkles */}
        {norm.includes('grooming') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Scissors (left) */}
            <g transform="rotate(-30 24 24)">
              <circle cx="16" cy="16" r="3.5" fill="none" stroke={`url(#thGrad_${slug})`} strokeWidth="2.2" />
              <circle cx="22" cy="14" r="3.5" fill="none" stroke={`url(#thGrad_${slug})`} strokeWidth="2.2" />
              <path d="M19 19 L32 32 M22 17 L30 30" stroke={`url(#thGrad_${slug})`} strokeWidth="2.2" strokeLinecap="round" />
            </g>
            {/* Comb (right) */}
            <g transform="rotate(35 44 22)">
              <rect x="36" y="14" width="20" height="4.5" rx="2" />
              <line x1="38" y1="18.5" x2="38" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
              <line x1="41" y1="18.5" x2="41" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
              <line x1="44" y1="18.5" x2="44" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
              <line x1="47" y1="18.5" x2="47" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
              <line x1="50" y1="18.5" x2="50" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
              <line x1="53" y1="18.5" x2="53" y2="26" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
            </g>
            {/* Center Paw */}
            <ellipse cx="32" cy="44" rx="7.5" ry="6" />
            <circle cx="23" cy="35" r="2.4" />
            <circle cx="29" cy="31" r="2.5" />
            <circle cx="35.5" cy="31" r="2.5" />
            <circle cx="41.5" cy="35" r="2.4" />
            {/* Sparkles */}
            <path d="M18 42 L20 40 L18 38 L16 40 Z" />
            <path d="M46 44 L48 42 L46 40 L44 42 Z" />
          </g>
        )}

        {/* 3. Boarding & Daycare — Dog House with Paw in Door */}
        {norm.includes('boarding') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Roof */}
            <polygon points="32,10 10,28 14,31 32,16 50,31 54,28" />
            {/* House body */}
            <path d="M16 28 L16 52 C16 54 18 55 20 55 L44 55 C46 55 48 54 48 52 L48 28 Z" />
            {/* White / cut doorway */}
            <path d="M26 55 L26 40 C26 36.5 28.5 34 32 34 C35.5 34 38 36.5 38 40 L38 55 Z" fill="#FFF5F5" />
            {/* Paw inside Door */}
            <ellipse cx="32" cy="46" rx="3.2" ry="2.6" />
            <circle cx="28.5" cy="42" r="1.1" />
            <circle cx="31" cy="40.5" r="1.1" />
            <circle cx="33" cy="40.5" r="1.1" />
            <circle cx="35.5" cy="42" r="1.1" />
          </g>
        )}

        {/* 4. Training & Behaviour — Person holding hoop with jumping dog */}
        {norm.includes('training') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Person Head */}
            <circle cx="22" cy="18" r="4" />
            {/* Person Torso & Arms */}
            <path d="M18 25 C18 23 20 23 23 23 L25 23 C27 23 28 24 28 26 L29 36 L25 36 L24 45 L21 45 L22 36 L18 36 Z" />
            {/* Leg forward */}
            <path d="M25 36 L29 48 L26 49 L23 39 Z" />
            {/* Hoop raised in hand */}
            <circle cx="38" cy="20" r="7.5" fill="none" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" />
            <path d="M26 25 L32 23" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" strokeLinecap="round" />
            {/* Jumping Dog */}
            <g transform="translate(38 24) rotate(-22)">
              {/* Dog head & ears */}
              <circle cx="10" cy="10" r="3.2" />
              <path d="M8 8 C7 6 9 5 10 7 Z" />
              {/* Dog body */}
              <ellipse cx="4" cy="12" rx="6" ry="3.5" />
              {/* Front paws leaping */}
              <line x1="8" y1="13" x2="12" y2="15" stroke={`url(#thGrad_${slug})`} strokeWidth="2" strokeLinecap="round" />
              {/* Back paws extending */}
              <line x1="1" y1="13" x2="-3" y2="16" stroke={`url(#thGrad_${slug})`} strokeWidth="2" strokeLinecap="round" />
              {/* Tail pointing up */}
              <path d="M-1 10 C-3 6 -4 8 -2 10" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 5. Pet Adoption — Caring Hand with Paw in Palm */}
        {(norm.includes('adoption') || norm.includes('breeding')) && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Open Hand Shape */}
            <path d="M17 33 C17 31 19 31 20 33 L20 42 C20 42 22 41 23 41 L23 28 C23 26 25 26 26 28 L26 40 C27 40 28 40 29 40 L29 25 C29 23 31 23 32 25 L32 40 C33 40 34 40 35 40 L35 28 C35 26 37 26 38 28 L38 41 C39 41 40 41 41 42 L41 33 C41 31 43 31 44 33 L44 47 C44 54 38 57 31 57 C24 57 17 52 17 44 Z" />
            {/* Negative cutout Paw in palm */}
            <ellipse cx="31" cy="46" rx="4.5" ry="3.5" fill="#FFF5F5" />
            <circle cx="26" cy="41" r="1.4" fill="#FFF5F5" />
            <circle cx="29.5" cy="38.5" r="1.4" fill="#FFF5F5" />
            <circle cx="33" cy="38.5" r="1.4" fill="#FFF5F5" />
            <circle cx="36" cy="41" r="1.4" fill="#FFF5F5" />
          </g>
        )}

        {/* 6. Pet Transport — Delivery / Transport Van with Paw */}
        {norm.includes('transport') && !norm.includes('ambulance') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Van body */}
            <path d="M12 28 C12 26 14 24 16 24 L38 24 L38 30 L45 30 C47 30 49 32 50 34 L54 41 C54.5 42 55 43 55 44 L55 48 C55 49 54 50 53 50 L49 50 C49 46 45 46 45 50 L27 50 C27 46 23 46 23 50 L14 50 C13 50 12 49 12 48 Z" />
            {/* Front windshield */}
            <path d="M40 28 L46 28 L50 35 L40 35 Z" fill="#FFF5F5" />
            {/* Paw on van side */}
            <ellipse cx="27" cy="34" rx="3.6" ry="2.8" fill="#FFF5F5" />
            <circle cx="23" cy="30" r="1.1" fill="#FFF5F5" />
            <circle cx="26" cy="28" r="1.1" fill="#FFF5F5" />
            <circle cx="28.5" cy="28" r="1.1" fill="#FFF5F5" />
            <circle cx="31" cy="30" r="1.1" fill="#FFF5F5" />
            {/* Wheels */}
            <circle cx="23" cy="50" r="4.5" fill="#FFF5F5" stroke={`url(#thGrad_${slug})`} strokeWidth="3" />
            <circle cx="45" cy="50" r="4.5" fill="#FFF5F5" stroke={`url(#thGrad_${slug})`} strokeWidth="3" />
          </g>
        )}

        {/* 7. Recreation & Exercise — Person throwing ball & running dog */}
        {norm.includes('recreation') || norm.includes('exercise') || norm.includes('walking') ? (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Person Head */}
            <circle cx="45" cy="18" r="3.8" />
            {/* Person throwing motion */}
            <path d="M42 24 C44 23 47 23 48 25 L47 34 L43 34 L45 45 L42 45 L40 34 L38 34 Z" />
            <path d="M47 34 L50 47 L47 48 L44 37 Z" />
            {/* Arms throwing ball to left */}
            <path d="M41 26 L34 22" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M46 26 L52 28" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" strokeLinecap="round" />
            {/* Play Ball */}
            <circle cx="22" cy="24" r="2.5" />
            {/* Dog chasing ball */}
            <g transform="translate(14 36)">
              <circle cx="10" cy="5" r="2.8" />
              <path d="M8 3 C7 2 9 1 10 3 Z" />
              <ellipse cx="14" cy="8" rx="6.5" ry="3.2" />
              <line x1="8" y1="10" x2="5" y2="14" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" strokeLinecap="round" />
              <line x1="17" y1="10" x2="21" y2="13" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M19 7 C22 5 22 7 20 8" stroke={`url(#thGrad_${slug})`} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>
        ) : null}

        {/* 8. Pet supplies — Feed / Kibble Pouch with Paw */}
        {norm.includes('supplies') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Pouch body */}
            <path d="M22 18 L42 18 L47 48 C47 52 44 55 40 55 L24 55 C20 55 17 52 17 48 Z" />
            {/* Top seal crimp fold */}
            <path d="M20 18 L44 18 L43 14 L21 14 Z" fill="#FFF5F5" opacity="0.9" />
            <path d="M21 14 L43 14 L42 11 L22 11 Z" />
            {/* Paw on package front */}
            <ellipse cx="32" cy="38" rx="4.6" ry="3.6" fill="#FFF5F5" />
            <circle cx="27.5" cy="32.5" r="1.3" fill="#FFF5F5" />
            <circle cx="30.5" cy="30" r="1.3" fill="#FFF5F5" />
            <circle cx="33.5" cy="30" r="1.3" fill="#FFF5F5" />
            <circle cx="36.5" cy="32.5" r="1.3" fill="#FFF5F5" />
          </g>
        )}

        {/* 9. Technology & Apps — Smartphone with Paw on Screen */}
        {norm.includes('tech') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Phone outline */}
            <rect x="20" y="10" width="24" height="44" rx="6" />
            {/* Inner screen cutout */}
            <rect x="23" y="14" width="18" height="34" rx="3" fill="#FFF5F5" />
            {/* Home / Speaker notch */}
            <line x1="28" y1="12" x2="36" y2="12" stroke="#FFF5F5" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="32" cy="51" r="1.4" fill="#FFF5F5" />
            {/* Paw app icon on screen */}
            <ellipse cx="32" cy="32" rx="4.5" ry="3.5" />
            <circle cx="27" cy="27" r="1.3" />
            <circle cx="30.5" cy="25" r="1.3" />
            <circle cx="33.5" cy="25" r="1.3" />
            <circle cx="37" cy="27" r="1.3" />
          </g>
        )}

        {/* 10. Memorial Services — Dog with Angel Wings & Halo */}
        {norm.includes('memorial') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Halo */}
            <ellipse cx="26" cy="17" rx="7" ry="2.2" fill="none" stroke={`url(#thGrad_${slug})`} strokeWidth="1.8" />
            {/* Dog silhouette sitting */}
            <circle cx="26" cy="24" r="5" />
            <path d="M22 23 C20 22 21 28 23 28 Z" />
            <path d="M26 28 C26 33 24 37 24 45 L21 45 C20 45 20 48 24 48 L32 48 C34 48 34 46 32 46 L30 45 C29 39 31 36 32 32 Z" />
            <ellipse cx="28" cy="46" rx="6" ry="3" />
            {/* Tail */}
            <path d="M22 47 C17 48 16 43 18 40" stroke={`url(#thGrad_${slug})`} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Angel Wings */}
            <path
              d="M30 28 C34 22 42 16 46 19 C48 20 46 24 43 26 C47 26 49 29 46 31 C43 33 39 34 32 34"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M32 29 C36 24 43 19 46 22 M34 31 C39 28 44 26 46 29"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 11. Arts & Photos — Rosette Ribbon Medal with Paw */}
        {norm.includes('art') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Fluted rosette medal base */}
            <g transform="translate(32 28)">
              {Array.from({ length: 12 }).map((_, i) => (
                <circle
                  key={i}
                  cx={13 * Math.cos((i * Math.PI) / 6)}
                  cy={13 * Math.sin((i * Math.PI) / 6)}
                  r="3.2"
                />
              ))}
            </g>
            <circle cx="32" cy="28" r="12" />
            {/* White inner disc */}
            <circle cx="32" cy="28" r="9" fill="#FFF5F5" />
            {/* Paw inside rosette */}
            <ellipse cx="32" cy="30" rx="3.5" ry="2.7" />
            <circle cx="28" cy="26" r="1.1" />
            <circle cx="31" cy="24" r="1.1" />
            <circle cx="33" cy="24" r="1.1" />
            <circle cx="36" cy="26" r="1.1" />
            {/* Ribbon Tails hanging below */}
            <polygon points="26,37 20,54 26,50 30,54 28,37" />
            <polygon points="38,37 34,54 38,50 44,54 40,37" />
          </g>
        )}

        {/* 12. Pet Ambulance — 24/7 Emergency Ambulance with Cross & Siren */}
        {norm.includes('ambulance') && (
          <g fill={`url(#thGrad_${slug})`}>
            {/* Outer Rounded Container Border */}
            <rect
              x="8"
              y="8"
              width="48"
              height="48"
              rx="12"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="1.8"
            />
            {/* 24/7 Clock Badge in top-right */}
            <circle
              cx="45"
              cy="18"
              r="6.5"
              fill="none"
              stroke={`url(#thGrad_${slug})`}
              strokeWidth="1.4"
            />
            <text
              x="45"
              y="19.5"
              fontSize="4"
              fontWeight="bold"
              textAnchor="middle"
              fill={`url(#thGrad_${slug})`}
              fontFamily="sans-serif"
            >
              24/7
            </text>

            {/* Siren Beacon on Ambulance roof */}
            <path d="M26 23 L28 20 L30 23 Z" />
            <line x1="25" y1="19" x2="26" y2="21" stroke={`url(#thGrad_${slug})`} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="28" y1="18" x2="28" y2="20" stroke={`url(#thGrad_${slug})`} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="31" y1="19" x2="30" y2="21" stroke={`url(#thGrad_${slug})`} strokeWidth="1.2" strokeLinecap="round" />

            {/* Ambulance Body */}
            <path d="M14 26 C14 24.5 15.5 23 17 23 L37 23 L37 30 L43 30 C44.5 30 46 31.5 47 33 L49 37 C49.5 38 50 39 50 40 L50 44 C50 45 49 46 48 46 L45 46 C45 42.5 41.5 42.5 41.5 46 L25.5 46 C25.5 42.5 22 42.5 22 46 L15 46 C14 46 14 45 14 44 Z" />

            {/* Front windshield */}
            <path d="M38.5 28 L43.5 28 L47 34 L38.5 34 Z" fill="#FFF5F5" />

            {/* Emergency Red Cross on side */}
            <g transform="translate(32 34) scale(0.7)">
              <rect x="-1" y="-4" width="2" height="8" rx="0.5" fill="#FFF5F5" />
              <rect x="-4" y="-1" width="8" height="2" rx="0.5" fill="#FFF5F5" />
            </g>

            {/* Paw on Ambulance body */}
            <ellipse cx="23" cy="34" rx="2.8" ry="2.2" fill="#FFF5F5" />
            <circle cx="20" cy="30.5" r="0.9" fill="#FFF5F5" />
            <circle cx="22" cy="29" r="0.9" fill="#FFF5F5" />
            <circle cx="24" cy="29" r="0.9" fill="#FFF5F5" />
            <circle cx="26" cy="30.5" r="0.9" fill="#FFF5F5" />

            {/* Wheels */}
            <circle cx="23.5" cy="46" r="3.5" fill="#FFF5F5" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" />
            <circle cx="43" cy="46" r="3.5" fill="#FFF5F5" stroke={`url(#thGrad_${slug})`} strokeWidth="2.4" />
          </g>
        )}

        {/* Fallback Paw Icon for any unexpected slug */}
        {!norm.includes('health') &&
          !norm.includes('grooming') &&
          !norm.includes('boarding') &&
          !norm.includes('training') &&
          !norm.includes('adoption') &&
          !norm.includes('breeding') &&
          !norm.includes('transport') &&
          !norm.includes('recreation') &&
          !norm.includes('exercise') &&
          !norm.includes('walking') &&
          !norm.includes('supplies') &&
          !norm.includes('tech') &&
          !norm.includes('memorial') &&
          !norm.includes('art') &&
          !norm.includes('photo') &&
          !norm.includes('ambulance') && (
            <g fill={`url(#thGrad_${slug})`}>
              <ellipse cx="32" cy="40" rx="9" ry="7.5" />
              <circle cx="21" cy="27" r="3.2" />
              <circle cx="28.5" cy="22" r="3.4" />
              <circle cx="35.5" cy="22" r="3.4" />
              <circle cx="43" cy="27" r="3.2" />
            </g>
          )}
      </svg>
    </div>
  );
};
