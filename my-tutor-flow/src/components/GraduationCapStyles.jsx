import React from 'react';
import { Box } from '@mui/material';

// 1. Continuous Line Art Style
export const CapStyle1 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="shadow1">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2" />
      </filter>
    </defs>
    <g filter="url(#shadow1)">
      <path
        d="M10 35 Q10 30 15 30 L65 30 Q70 30 70 35 Q70 40 65 40 L15 40 Q10 40 10 35 Z"
        stroke="#2C3E50"
        strokeWidth="2"
        fill="none"
      />
      <path d="M15 30 Q40 20 65 30" stroke="#2C3E50" strokeWidth="2" fill="none" />

      {/* Original Spiral Tassel */}
      <circle cx="60" cy="25" r="4" stroke="#E74C3C" strokeWidth="2" fill="none" />
      <path
        d="M60 29 Q62 32 64 35 Q66 38 64 41 Q62 44 60 41 Q58 38 60 35 Q62 32 64 35"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M62 29 Q64 32 66 35 Q68 38 66 41 Q64 44 62 41 Q60 38 62 35 Q64 32 66 35"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M64 29 Q66 32 68 35 Q70 38 68 41 Q66 44 64 41 Q62 38 64 35 Q66 32 68 35"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      {/* Tassel ends with small spirals */}
      <circle cx="60" cy="44" r="1" stroke="#E74C3C" strokeWidth="1" fill="none" />
      <circle cx="62" cy="44" r="1" stroke="#E74C3C" strokeWidth="1" fill="none" />
      <circle cx="64" cy="44" r="1" stroke="#E74C3C" strokeWidth="1" fill="none" />
    </g>
  </svg>
);

// 2. 3D Isometric Perspective
export const CapStyle2 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <linearGradient id="iso3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5D6D7E" />
        <stop offset="100%" stopColor="#2C3E50" />
      </linearGradient>
      <filter id="shadow2">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#shadow2)">
      <ellipse cx="40" cy="38" rx="30" ry="5" fill="#1B2631" opacity="0.8" />
      <path d="M15 25 L65 25 L60 18 L20 18 Z" fill="url(#iso3d)" />
      <path d="M15 25 L65 25 L65 32 L15 32 Z" fill="#34495E" />
      <path d="M65 25 L65 32 L60 25 L60 18 Z" fill="#2C3E50" />

      {/* Original Braided Tassel */}
      <circle cx="58" cy="21" r="4" fill="#E74C3C" />
      <rect x="56" y="25" width="4" height="2" rx="1" fill="#C0392B" />
      {/* Braided pattern */}
      <path
        d="M56 27 Q58 30 60 33 Q62 36 58 39 Q54 42 58 45"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M58 27 Q60 30 62 33 Q64 36 60 39 Q56 42 60 45"
        stroke="#C0392B"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 27 Q62 30 64 33 Q66 36 62 39 Q58 42 62 45"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M62 27 Q64 30 66 33 Q68 36 64 39 Q60 42 64 45"
        stroke="#C0392B"
        strokeWidth="2"
        fill="none"
      />
      {/* Tassel ends with decorative knots */}
      <circle cx="58" cy="45" r="2" fill="#E74C3C" />
      <circle cx="60" cy="45" r="2" fill="#C0392B" />
      <circle cx="62" cy="45" r="2" fill="#E74C3C" />
      <circle cx="64" cy="45" r="2" fill="#C0392B" />
    </g>
  </svg>
);

// 3. Geometric Faceted Design
export const CapStyle3 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="shadow3">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#shadow3)">
      <ellipse cx="40" cy="38" rx="28" ry="4" fill="#2C3E50" />
      <polygon points="12,28 40,22 68,28 64,20 44,16 16,20" fill="#5D6D7E" />
      <polygon points="12,28 40,22 40,30 12,34" fill="#34495E" />
      <polygon points="40,22 68,28 68,34 40,30" fill="#2C3E50" />
      <polygon points="64,20 68,28 68,34 64,26" fill="#1B2631" />

      {/* Enhanced Braided Tassel with Bigger Button */}
      <polygon points="58,18 62,22 66,26" fill="#E74C3C" />
      <circle cx="62" cy="22" r="4" fill="#E74C3C" />
      <rect x="60" y="26" width="4" height="2" rx="1" fill="#C0392B" />

      {/* Braided pattern */}
      <path
        d="M60 28 Q62 32 64 36 Q66 40 62 44 Q58 48 62 52"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M62 28 Q64 32 66 36 Q68 40 64 44 Q60 48 64 52"
        stroke="#C0392B"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M64 28 Q66 32 68 36 Q70 40 66 44 Q62 48 66 52"
        stroke="#E74C3C"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M66 28 Q68 32 70 36 Q72 40 68 44 Q64 48 68 52"
        stroke="#C0392B"
        strokeWidth="2"
        fill="none"
      />

      {/* Extended braided strands */}
      <path d="M62 52 Q64 56 66 60 Q68 64 64 68" stroke="#E74C3C" strokeWidth="2" fill="none" />
      <path d="M64 52 Q66 56 68 60 Q70 64 66 68" stroke="#C0392B" strokeWidth="2" fill="none" />
      <path d="M66 52 Q68 56 70 60 Q72 64 68 68" stroke="#E74C3C" strokeWidth="2" fill="none" />

      {/* Tassel ends with decorative knots */}
      <circle cx="64" cy="68" r="2" fill="#E74C3C" />
      <circle cx="66" cy="68" r="2" fill="#C0392B" />
      <circle cx="68" cy="68" r="2" fill="#E74C3C" />
    </g>
  </svg>
);

// 4. Soft Rounded Organic Style
export const CapStyle4 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="shadow4">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
      </filter>
    </defs>
    <g filter="url(#shadow4)">
      <ellipse cx="40" cy="38" rx="32" ry="6" fill="#2C3E50" />
      <ellipse cx="40" cy="25" rx="28" ry="12" fill="#5D6D7E" />
      <ellipse cx="40" cy="22" rx="28" ry="12" fill="#7F8C8D" />

      {/* Original Flowing Ribbon Tassel */}
      <circle cx="58" cy="22" r="5" fill="#E74C3C" />
      <rect x="56" y="27" width="4" height="2" rx="2" fill="#C0392B" />
      {/* Flowing ribbon strands */}
      <path
        d="M56 29 Q58 32 60 35 Q58 38 60 41 Q62 44 60 47"
        stroke="#E74C3C"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 29 Q60 32 62 35 Q60 38 62 41 Q64 44 62 47"
        stroke="#C0392B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 29 Q62 32 64 35 Q62 38 64 41 Q66 44 64 47"
        stroke="#E74C3C"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 29 Q64 32 66 35 Q64 38 66 41 Q68 44 66 47"
        stroke="#C0392B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ribbon ends */}
      <ellipse cx="60" cy="47" rx="3" ry="1" fill="#E74C3C" />
      <ellipse cx="62" cy="47" rx="3" ry="1" fill="#C0392B" />
      <ellipse cx="64" cy="47" rx="3" ry="1" fill="#E74C3C" />
      <ellipse cx="66" cy="47" rx="3" ry="1" fill="#C0392B" />
    </g>
  </svg>
);

// 5. Flat Design with Bold Outlines
export const CapStyle5 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="shadow5">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2" />
      </filter>
    </defs>
    <g filter="url(#shadow5)">
      <ellipse cx="40" cy="38" rx="30" ry="5" fill="#34495E" stroke="#2C3E50" strokeWidth="3" />
      <rect
        x="12"
        y="20"
        width="56"
        height="12"
        rx="6"
        fill="#5D6D7E"
        stroke="#2C3E50"
        strokeWidth="3"
      />

      {/* Original Chain Link Tassel */}
      <circle cx="58" cy="20" r="4" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />
      <rect
        x="56"
        y="24"
        width="4"
        height="2"
        rx="1"
        fill="#C0392B"
        stroke="#2C3E50"
        strokeWidth="1"
      />
      {/* Chain links */}
      <ellipse cx="58" cy="28" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />
      <ellipse cx="60" cy="28" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />
      <ellipse cx="62" cy="28" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />
      <ellipse cx="64" cy="28" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />

      <ellipse cx="58" cy="33" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />
      <ellipse cx="60" cy="33" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />
      <ellipse cx="62" cy="33" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />
      <ellipse cx="64" cy="33" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />

      <ellipse cx="58" cy="38" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />
      <ellipse cx="60" cy="38" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />
      <ellipse cx="62" cy="38" rx="2" ry="3" fill="none" stroke="#E74C3C" strokeWidth="3" />
      <ellipse cx="64" cy="38" rx="2" ry="3" fill="none" stroke="#C0392B" strokeWidth="3" />

      {/* Chain ends */}
      <circle cx="58" cy="42" r="2" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />
      <circle cx="60" cy="42" r="2" fill="#C0392B" stroke="#E74C3C" strokeWidth="2" />
      <circle cx="62" cy="42" r="2" fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />
      <circle cx="64" cy="42" r="2" fill="#C0392B" stroke="#E74C3C" strokeWidth="2" />
    </g>
  </svg>
);

// 6. Gradient Mesh 3D Style
export const CapStyle6 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <radialGradient id="mesh3d" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#85929E" />
        <stop offset="50%" stopColor="#5D6D7E" />
        <stop offset="100%" stopColor="#2C3E50" />
      </radialGradient>
      <radialGradient id="tassel3d" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#EC7063" />
        <stop offset="100%" stopColor="#C0392B" />
      </radialGradient>
      <filter id="shadow6">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#shadow6)">
      <ellipse cx="40" cy="38" rx="32" ry="6" fill="url(#mesh3d)" />
      <ellipse cx="40" cy="24" rx="30" ry="10" fill="url(#mesh3d)" />
      <circle cx="58" cy="22" r="5" fill="url(#tassel3d)" />
      <path
        d="M58 27 Q63 34 66 42"
        stroke="url(#tassel3d)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 27 Q65 34 68 42"
        stroke="url(#tassel3d)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 27 Q67 34 70 42"
        stroke="url(#tassel3d)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="68" cy="42" rx="3" ry="2" fill="url(#tassel3d)" />
    </g>
  </svg>
);

// 7. Paper Cut-Out Layered Design
export const CapStyle7 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="paper1">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
      </filter>
      <filter id="paper2">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    <ellipse cx="40" cy="40" rx="30" ry="4" fill="#1B2631" filter="url(#paper2)" />
    <rect x="14" y="24" width="52" height="8" rx="4" fill="#34495E" filter="url(#paper1)" />
    <rect x="12" y="20" width="56" height="8" rx="4" fill="#5D6D7E" filter="url(#paper2)" />
    <circle cx="58" cy="20" r="4" fill="#E74C3C" filter="url(#paper1)" />
    <rect x="56" y="24" width="4" height="2" rx="1" fill="#C0392B" filter="url(#paper1)" />
    <rect x="58" y="26" width="2" height="14" fill="#E74C3C" filter="url(#paper1)" />
    <rect x="60" y="26" width="2" height="14" fill="#E74C3C" filter="url(#paper1)" />
    <rect x="62" y="26" width="2" height="14" fill="#E74C3C" filter="url(#paper1)" />
    <ellipse cx="61" cy="40" rx="3" ry="2" fill="#C0392B" filter="url(#paper1)" />
  </svg>
);

// 8. Neon Outline Glow Style
export const CapStyle8 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <ellipse
      cx="40"
      cy="38"
      rx="30"
      ry="5"
      stroke="#00D4FF"
      strokeWidth="2"
      fill="none"
      filter="url(#glow)"
    />
    <rect
      x="12"
      y="20"
      width="56"
      height="10"
      rx="5"
      stroke="#00D4FF"
      strokeWidth="2"
      fill="none"
      filter="url(#glow)"
    />

    {/* Original Lightning Bolt Tassel */}
    <circle
      cx="58"
      cy="20"
      r="4"
      stroke="#FF0080"
      strokeWidth="2"
      fill="none"
      filter="url(#glow)"
    />
    <rect
      x="56"
      y="24"
      width="4"
      height="2"
      rx="1"
      stroke="#FF0080"
      strokeWidth="1"
      fill="none"
      filter="url(#glow)"
    />
    {/* Lightning bolt patterns */}
    <path
      d="M56 26 L60 30 L58 34 L62 38 L58 42"
      stroke="#FF0080"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />
    <path
      d="M58 26 L62 30 L60 34 L64 38 L60 42"
      stroke="#00D4FF"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />
    <path
      d="M60 26 L64 30 L62 34 L66 38 L62 42"
      stroke="#FF0080"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />
    <path
      d="M62 26 L66 30 L64 34 L68 38 L64 42"
      stroke="#00D4FF"
      strokeWidth="3"
      fill="none"
      filter="url(#glow)"
    />
    {/* Electric sparks at ends */}
    <circle
      cx="58"
      cy="42"
      r="1"
      stroke="#FF0080"
      strokeWidth="2"
      fill="#FF0080"
      filter="url(#glow)"
    />
    <circle
      cx="60"
      cy="42"
      r="1"
      stroke="#00D4FF"
      strokeWidth="2"
      fill="#00D4FF"
      filter="url(#glow)"
    />
    <circle
      cx="62"
      cy="42"
      r="1"
      stroke="#FF0080"
      strokeWidth="2"
      fill="#FF0080"
      filter="url(#glow)"
    />
    <circle
      cx="64"
      cy="42"
      r="1"
      stroke="#00D4FF"
      strokeWidth="2"
      fill="#00D4FF"
      filter="url(#glow)"
    />
  </svg>
);

// 9. Watercolor Artistic Style
export const CapStyle9 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="watercolor">
        <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
    <ellipse
      cx="40"
      cy="38"
      rx="30"
      ry="5"
      fill="#5D6D7E"
      opacity="0.7"
      filter="url(#watercolor)"
    />
    <ellipse
      cx="40"
      cy="24"
      rx="28"
      ry="8"
      fill="#7F8C8D"
      opacity="0.8"
      filter="url(#watercolor)"
    />
    <circle cx="58" cy="22" r="4" fill="#E74C3C" opacity="0.8" filter="url(#watercolor)" />
    <path
      d="M58 26 Q62 32 65 38 Q67 40 68 42"
      stroke="#E74C3C"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.7"
      filter="url(#watercolor)"
    />
    <path
      d="M60 26 Q64 32 67 38 Q69 40 70 42"
      stroke="#E74C3C"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.7"
      filter="url(#watercolor)"
    />
    <ellipse cx="69" cy="42" rx="3" ry="2" fill="#C0392B" opacity="0.8" filter="url(#watercolor)" />
  </svg>
);

// 10. Low-Poly Crystalline Design
export const CapStyle10 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="shadow10">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#shadow10)">
      <polygon points="40,38 10,35 15,42 45,42" fill="#2C3E50" />
      <polygon points="40,38 70,35 65,42 35,42" fill="#34495E" />
      <polygon points="20,20 40,24 60,20 50,16 30,16" fill="#5D6D7E" />
      <polygon points="20,20 40,24 40,32 20,28" fill="#7F8C8D" />
      <polygon points="40,24 60,20 60,28 40,32" fill="#34495E" />

      {/* Original Geometric Cascade Tassel */}
      <polygon points="55,18 60,22 65,26" fill="#E74C3C" />
      {/* Cascading geometric shapes */}
      <polygon points="58,26 60,28 62,30 60,32 58,30 56,28" fill="#C0392B" />
      <polygon points="60,28 62,30 64,32 62,34 60,32 58,30" fill="#E74C3C" />
      <polygon points="62,30 64,32 66,34 64,36 62,34 60,32" fill="#C0392B" />
      <polygon points="64,32 66,34 68,36 66,38 64,36 62,34" fill="#E74C3C" />

      <polygon points="59,32 61,34 63,36 61,38 59,36 57,34" fill="#E74C3C" />
      <polygon points="61,34 63,36 65,38 63,40 61,38 59,36" fill="#C0392B" />
      <polygon points="63,36 65,38 67,40 65,42 63,40 61,38" fill="#E74C3C" />

      {/* Final geometric points */}
      <polygon points="60,38 62,40 64,42 62,44 60,42 58,40" fill="#C0392B" />
      <polygon points="62,40 64,42 66,44 64,46 62,44 60,42" fill="#E74C3C" />
    </g>
  </svg>
);

// 11. Vintage Badge Style
export const CapStyle11 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="vintage">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#vintage)">
      <ellipse cx="40" cy="38" rx="32" ry="6" fill="#2C3E50" stroke="#1B2631" strokeWidth="1" />
      <rect
        x="10"
        y="18"
        width="60"
        height="14"
        rx="7"
        fill="#5D6D7E"
        stroke="#34495E"
        strokeWidth="1"
      />
      <rect
        x="12"
        y="20"
        width="56"
        height="10"
        rx="5"
        fill="#7F8C8D"
        stroke="#5D6D7E"
        strokeWidth="1"
      />
      <circle cx="58" cy="18" r="5" fill="#E74C3C" stroke="#C0392B" strokeWidth="1" />
      <circle cx="58" cy="18" r="3" fill="#EC7063" />
      <g stroke="#C0392B" strokeWidth="2" strokeLinecap="round">
        <line x1="58" y1="23" x2="65" y2="38" />
        <line x1="60" y1="23" x2="67" y2="38" />
        <line x1="62" y1="23" x2="69" y2="38" />
        <line x1="64" y1="23" x2="71" y2="38" />
      </g>
      <ellipse cx="68" cy="38" rx="3" ry="2" fill="#E74C3C" stroke="#C0392B" strokeWidth="1" />
      <rect x="14" y="22" width="52" height="2" fill="#85929E" />
      <rect x="16" y="26" width="48" height="2" fill="#85929E" />
    </g>
  </svg>
);

// 12. Duotone High Contrast
export const CapStyle12 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="contrast">
        <feDropShadow dx="2" dy="2" stdDeviation="1" floodOpacity="0.5" />
      </filter>
    </defs>
    <g filter="url(#contrast)">
      <ellipse cx="40" cy="38" rx="30" ry="5" fill="#000000" />
      <rect x="12" y="20" width="56" height="12" rx="6" fill="#FFFFFF" />
      <rect x="14" y="22" width="52" height="8" rx="4" fill="#000000" />
      <circle cx="58" cy="20" r="4" fill="#FF0000" />
      <rect x="56" y="24" width="4" height="2" fill="#FF0000" />
      <rect x="58" y="26" width="2" height="14" fill="#FF0000" />
      <rect x="60" y="26" width="2" height="14" fill="#FF0000" />
      <rect x="62" y="26" width="2" height="14" fill="#FF0000" />
      <rect x="64" y="26" width="2" height="14" fill="#FF0000" />
      <circle cx="61" cy="40" r="3" fill="#FF0000" />
    </g>
  </svg>
);

// 13. Sketch/Hand-Drawn Style
export const CapStyle13 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="sketch">
        <feTurbulence baseFrequency="0.02" numOctaves="1" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
      </filter>
    </defs>
    <path
      d="M12 38 Q15 35 20 36 Q30 34 40 35 Q50 36 60 35 Q65 34 68 37 Q70 40 65 41 Q55 42 40 41 Q25 40 15 41 Q10 40 12 38"
      stroke="#2C3E50"
      strokeWidth="2"
      fill="#5D6D7E"
      filter="url(#sketch)"
    />
    <path
      d="M15 25 Q20 22 30 23 Q40 21 50 23 Q60 22 65 25 Q68 28 65 30 Q55 32 40 30 Q25 32 15 30 Q12 28 15 25"
      stroke="#2C3E50"
      strokeWidth="2"
      fill="#7F8C8D"
      filter="url(#sketch)"
    />
    <circle
      cx="58"
      cy="22"
      r="4"
      stroke="#E74C3C"
      strokeWidth="2"
      fill="#EC7063"
      filter="url(#sketch)"
    />
    <path
      d="M58 26 Q60 30 62 34 Q64 38 66 42"
      stroke="#E74C3C"
      strokeWidth="2"
      fill="none"
      filter="url(#sketch)"
    />
    <path
      d="M60 26 Q62 30 64 34 Q66 38 68 42"
      stroke="#E74C3C"
      strokeWidth="2"
      fill="none"
      filter="url(#sketch)"
    />
    <path
      d="M62 26 Q64 30 66 34 Q68 38 70 42"
      stroke="#E74C3C"
      strokeWidth="2"
      fill="none"
      filter="url(#sketch)"
    />
    <circle
      cx="68"
      cy="42"
      r="2"
      stroke="#E74C3C"
      strokeWidth="2"
      fill="#EC7063"
      filter="url(#sketch)"
    />
  </svg>
);

// 14. Metallic Embossed Look
export const CapStyle14 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D5DBDB" />
        <stop offset="30%" stopColor="#85929E" />
        <stop offset="70%" stopColor="#5D6D7E" />
        <stop offset="100%" stopColor="#34495E" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7DC6F" />
        <stop offset="50%" stopColor="#F1C40F" />
        <stop offset="100%" stopColor="#D68910" />
      </linearGradient>
      <filter id="emboss">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.5" />
        <feSpecularLighting
          result="specOut"
          in="SourceAlpha"
          specularConstant="1.5"
          specularExponent="20"
          lightingColor="white"
        >
          <fePointLight x="-5000" y="-10000" z="20000" />
        </feSpecularLighting>
      </filter>
    </defs>
    <g filter="url(#emboss)">
      <ellipse cx="40" cy="38" rx="30" ry="5" fill="url(#metallic)" />
      <rect x="12" y="20" width="56" height="12" rx="6" fill="url(#metallic)" />
      <circle cx="58" cy="20" r="4" fill="url(#gold)" />
      <g stroke="url(#gold)" strokeWidth="3" strokeLinecap="round">
        <line x1="58" y1="24" x2="66" y2="40" />
        <line x1="60" y1="24" x2="68" y2="40" />
        <line x1="62" y1="24" x2="70" y2="40" />
      </g>
      <ellipse cx="68" cy="40" rx="3" ry="2" fill="url(#gold)" />
    </g>
  </svg>
);

// 15. Particle/Dot Matrix Style
export const CapStyle15 = ({ size = 80 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none">
    <defs>
      <filter id="glow15">
        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow15)">
      {/* Base dots */}
      {Array.from({ length: 15 }, (_, i) => (
        <circle key={i} cx={15 + i * 3.5} cy="38" r="1.5" fill="#5D6D7E" opacity="0.8" />
      ))}
      {/* Top dots */}
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={18 + i * 4} cy="25" r="1.5" fill="#7F8C8D" opacity="0.9" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={22 + i * 4} cy="22" r="1.5" fill="#85929E" opacity="1" />
      ))}

      {/* Original Particle Stream Tassel */}
      <circle cx="58" cy="20" r="3" fill="#E74C3C" />
      {/* Particle streams with varying sizes */}
      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={58 + i * 0.5}
          cy={24 + i * 3}
          r={2 - i * 0.2}
          fill="#E74C3C"
          opacity={1 - i * 0.15}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={60 + i * 0.5}
          cy={24 + i * 3}
          r={2 - i * 0.2}
          fill="#C0392B"
          opacity={1 - i * 0.15}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={62 + i * 0.5}
          cy={24 + i * 3}
          r={2 - i * 0.2}
          fill="#E74C3C"
          opacity={1 - i * 0.15}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={64 + i * 0.5}
          cy={24 + i * 3}
          r={2 - i * 0.2}
          fill="#C0392B"
          opacity={1 - i * 0.15}
        />
      ))}
      {/* Dispersing particles at the end */}
      <circle cx="61" cy="42" r="1.5" fill="#E74C3C" opacity="0.4" />
      <circle cx="63" cy="43" r="1" fill="#C0392B" opacity="0.3" />
      <circle cx="65" cy="44" r="0.8" fill="#E74C3C" opacity="0.2" />
      <circle cx="67" cy="45" r="0.5" fill="#C0392B" opacity="0.1" />
    </g>
  </svg>
);

export default {
  CapStyle1,
  CapStyle2,
  CapStyle3,
  CapStyle4,
  CapStyle5,
  CapStyle6,
  CapStyle7,
  CapStyle8,
  CapStyle9,
  CapStyle10,
  CapStyle11,
  CapStyle12,
  CapStyle13,
  CapStyle14,
  CapStyle15,
};
