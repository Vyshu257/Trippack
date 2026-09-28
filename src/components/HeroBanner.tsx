import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-blue-100 bg-gradient-to-b from-[#bfe4fd] via-[#d7efff] to-[#eef8ff] min-h-[190px] sm:min-h-[220px] flex items-center justify-center p-6 text-center select-none">
      {/* Background SVG Artwork */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1000 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9bd3fc" />
            <stop offset="50%" stopColor="#cdeaff" />
            <stop offset="100%" stopColor="#eef8ff" />
          </linearGradient>
          <linearGradient id="mtnGradFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3d5f7" />
            <stop offset="100%" stopColor="#81bee8" />
          </linearGradient>
          <linearGradient id="mtnGradClose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5ea7dd" />
            <stop offset="100%" stopColor="#3d8dc9" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#77bef1" />
            <stop offset="100%" stopColor="#b0ddfc" />
          </linearGradient>
          <linearGradient id="shoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#55a557" />
            <stop offset="100%" stopColor="#3d823e" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1000" height="360" fill="url(#skyGrad)" />

        {/* Soft Sun on Upper Right */}
        <circle cx="820" cy="90" r="42" fill="#FDE047" fillOpacity="0.85" />
        <circle cx="820" cy="90" r="58" fill="#FEF08A" fillOpacity="0.45" />

        {/* Fluffy Clouds */}
        <g fill="#FFFFFF" fillOpacity="0.82">
          {/* Cloud Left */}
          <ellipse cx="120" cy="70" rx="45" ry="18" />
          <ellipse cx="150" cy="62" rx="35" ry="22" />
          <ellipse cx="95" cy="72" rx="30" ry="15" />
          
          {/* Cloud Center-Left */}
          <ellipse cx="340" cy="85" rx="35" ry="14" />
          <ellipse cx="365" cy="78" rx="28" ry="18" />

          {/* Cloud Center-Right */}
          <ellipse cx="680" cy="65" rx="55" ry="18" />
          <ellipse cx="715" cy="55" rx="40" ry="24" />
          <ellipse cx="650" cy="68" rx="32" ry="14" />
        </g>

        {/* Distant Mountains (Left & Right) */}
        <path
          d="M-50 280 L90 140 L230 280 L380 160 L510 280 L-50 280Z"
          fill="url(#mtnGradFar)"
          fillOpacity="0.55"
        />
        <path
          d="M520 280 L670 130 L800 270 L920 150 L1060 280 L520 280Z"
          fill="url(#mtnGradFar)"
          fillOpacity="0.6"
        />

        {/* Closer Snowy Mountain Peaks */}
        {/* Left Peaks */}
        <polygon points="110,280 200,165 290,280" fill="url(#mtnGradClose)" />
        <polygon points="180,190 200,165 220,190 210,198 200,192 190,198" fill="#FFFFFF" />

        {/* Right Peaks */}
        <polygon points="760,280 870,145 980,280" fill="url(#mtnGradClose)" />
        <polygon points="840,182 870,145 900,182 888,190 870,184 855,190" fill="#FFFFFF" />
        <polygon points="880,280 960,180 1040,280" fill="#4B95CF" />

        {/* Flying Airplane Banking Upwards to the Right */}
        <g transform="translate(730, 110) rotate(-16) scale(0.9)">
          <path
            d="M-40 0 C-20 -4 40 -3 55 0 C60 1 55 4 45 4 L-30 4 C-36 4 -40 2 -40 0 Z"
            fill="#38BDF8"
          />
          {/* Wings */}
          <polygon points="5,-2 -15,-38 -3,-38 22,-2" fill="#0284C7" />
          <polygon points="10,3 -8,32 4,32 24,3" fill="#0284C7" />
          {/* Tail */}
          <polygon points="-32,-1 -44,-20 -36,-20 -24,-1" fill="#0369A1" />
          {/* Contrail trail */}
          <line x1="-120" y1="2" x2="-45" y2="2" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6,4" strokeOpacity="0.75" />
        </g>

        {/* Green Hills & Pine Trees on Banks */}
        {/* Left Shore */}
        <path d="M-20 320 Q120 250 260 300 Q150 330 -20 330 Z" fill="url(#shoreGrad)" />
        {/* Pine Trees Left */}
        <polygon points="35,280 45,250 55,280" fill="#1b4d24" />
        <polygon points="40,270 45,245 50,270" fill="#2d6e38" />
        <polygon points="65,290 77,255 89,290" fill="#1e5428" />
        <polygon points="110,295 125,260 140,295" fill="#256333" />
        <polygon points="145,300 158,272 171,300" fill="#1b4d24" />

        {/* Right Shore */}
        <path d="M740 305 Q860 255 1020 310 L1020 340 L740 340 Z" fill="url(#shoreGrad)" />
        {/* Pine Trees Right */}
        <polygon points="790,295 802,265 814,295" fill="#1e5428" />
        <polygon points="830,290 844,250 858,290" fill="#2d6e38" />
        <polygon points="875,295 888,260 901,295" fill="#1b4d24" />

        {/* Foreground Lake / Water */}
        <path
          d="M-20 300 C200 305 400 305 600 305 C800 305 1020 300 1020 360 L-20 360 Z"
          fill="url(#waterGrad)"
          fillOpacity="0.8"
        />
        {/* Water Ripple Reflections */}
        <line x1="280" y1="322" x2="360" y2="322" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
        <line x1="420" y1="334" x2="520" y2="334" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="610" y1="324" x2="680" y2="324" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
      </svg>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-xl mx-auto py-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1746A2] tracking-tight drop-shadow-2xs">
          Trippack
        </h2>
        <p className="mt-2 text-base sm:text-lg md:text-xl font-bold text-[#1E3A8A] tracking-tight">
          Plan Your Perfect Trip
        </p>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-blue-900/80">
          Smart suggestions. Better journeys.
        </p>
      </div>
    </div>
  );
};
