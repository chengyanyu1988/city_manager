import React, { useState, useRef } from 'react';
import { CameraDevice, PatrolVehicle, MapDisplayMode, AppTheme } from '../types';
import { 
  Zap, 
  Plus, 
  Minus, 
  RotateCcw, 
  Layers, 
  Video, 
  Truck, 
  Radio, 
  Compass, 
  Crosshair,
  Flame,
  Building
} from 'lucide-react';

interface MapGISProps {
  cameras: CameraDevice[];
  vehicles: PatrolVehicle[];
  activeAlertCount: number;
  onSelectCamera: (camera: CameraDevice) => void;
  onSelectVehicle: (vehicle: PatrolVehicle) => void;
  onToggleAlertDrawer: () => void;
  mapMode?: MapDisplayMode;
  theme?: AppTheme;
}

export const MapGIS: React.FC<MapGISProps> = ({
  cameras,
  vehicles,
  activeAlertCount,
  onSelectCamera,
  onSelectVehicle,
  onToggleAlertDrawer,
  mapMode = 'tactical',
  theme = 'tactical-dark',
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Layer controls
  const [showCameras, setShowCameras] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.75), 2.4));
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 2.4));
  const zoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.75));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Color schemes based on dark command style
  const isLightTheme = theme === 'clean-light';
  const bgColor = isLightTheme ? '#f1f5f9' : '#050811';
  const gridStroke = isLightTheme ? 'rgba(0,0,0,0.06)' : 'rgba(56, 189, 248, 0.08)';

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Mission Grid Lines */}
      <div className="absolute inset-0 bg-tactical-grid opacity-70 pointer-events-none" />

      {/* Scalable GIS Digital Twin Canvas */}
      <div 
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
        className="w-full h-full min-w-[1440px] min-h-[900px] relative pointer-events-auto"
      >
        <svg 
          viewBox="0 0 1600 1000" 
          className="w-full h-full absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {/* Luminous Neon Filter for expressways */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Dark Water Gradient */}
            <linearGradient id="nightWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLightTheme ? '#bae6fd' : '#081c36'} />
              <stop offset="100%" stopColor={isLightTheme ? '#7dd3fc' : '#051324'} />
            </linearGradient>

            {/* Dark Green Eco Reserve */}
            <linearGradient id="nightPark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLightTheme ? '#dcfce7' : '#06261c'} />
              <stop offset="100%" stopColor={isLightTheme ? '#bbf7d0' : '#031711'} />
            </linearGradient>

            {/* Radar Sweep Gradient */}
            <radialGradient id="radarSweepGrad">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
              <stop offset="60%" stopColor="rgba(6, 182, 212, 0.1)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>
          </defs>

          {/* 1. Tactical Grid Lines */}
          <g stroke={gridStroke} strokeWidth="1">
            {Array.from({ length: 17 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} />
            ))}
          </g>

          {/* 2. Water Bodies (Midnight Blue with subtle neon edges) */}
          <path 
            d="M -50 960 C 200 920, 400 940, 600 970 C 800 1000, 1100 980, 1650 950 L 1650 1050 L -50 1050 Z" 
            fill="url(#nightWater)" 
            stroke={isLightTheme ? '#38bdf8' : '#0284c7'} 
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* People's Park Bailong Lake */}
          <path 
            d="M 720 540 C 760 520, 810 535, 830 560 C 840 590, 810 610, 760 620 C 720 615, 690 570, 720 540 Z" 
            fill="url(#nightWater)"
            stroke={isLightTheme ? '#38bdf8' : '#0284c7'}
            strokeWidth="1"
          />
          {/* Mingge Lake */}
          <path 
            d="M 1250 880 C 1300 870, 1380 890, 1420 920 C 1390 940, 1310 945, 1260 920 Z" 
            fill="url(#nightWater)"
            stroke={isLightTheme ? '#38bdf8' : '#0284c7'}
            strokeWidth="1"
          />

          {/* 3. Parks & Eco Zones */}
          <path 
            d="M 640 510 C 680 470, 780 460, 860 480 C 910 520, 920 620, 850 670 C 760 700, 660 660, 630 580 Z" 
            fill="url(#nightPark)" 
            stroke={isLightTheme ? '#22c55e' : '#10b981'} 
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <path 
            d="M 1280 120 C 1350 90, 1480 110, 1550 160 C 1580 230, 1520 310, 1440 330 C 1360 320, 1290 240, 1280 120 Z" 
            fill="url(#nightPark)" 
            stroke={isLightTheme ? '#22c55e' : '#10b981'} 
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* 4. Secondary Urban Grid Roads */}
          <g stroke={isLightTheme ? '#cbd5e1' : '#1e293b'} strokeWidth="2.5" strokeLinecap="round">
            <line x1="200" y1="120" x2="800" y2="120" />
            <line x1="150" y1="280" x2="900" y2="280" />
            <line x1="100" y1="440" x2="1100" y2="440" />
            <line x1="50" y1="620" x2="1300" y2="620" />
            <line x1="100" y1="780" x2="1400" y2="780" />

            <line x1="380" y1="80" x2="380" y2="900" />
            <line x1="560" y1="50" x2="560" y2="920" />
            <line x1="740" y1="60" x2="740" y2="950" />
            <line x1="920" y1="100" x2="920" y2="960" />
            <line x1="1100" y1="150" x2="1100" y2="950" />
            <line x1="1280" y1="200" x2="1280" y2="950" />
          </g>

          {/* 5. Major Urban Arterial Roads (Luminous Cyan Neon) */}
          <g stroke={isLightTheme ? '#0284c7' : '#0284c7'} strokeWidth="7" strokeOpacity={isLightTheme ? '0.8' : '0.6'} strokeLinecap="round">
            <line x1="480" y1="60" x2="540" y2="920" />
            <line x1="780" y1="80" x2="680" y2="850" />
            <path d="M 680 200 L 980 440 L 1280 620 L 1450 780" fill="none" />
            <path d="M 820 540 L 1120 720 L 1380 820" fill="none" />
            <line x1="150" y1="910" x2="1550" y2="910" strokeWidth="9" />
          </g>
          {/* Arterial Center Laser Lines */}
          <g stroke={isLightTheme ? '#ffffff' : '#38bdf8'} strokeWidth="1.5" strokeDasharray="8,6">
            <line x1="480" y1="60" x2="540" y2="920" />
            <line x1="780" y1="80" x2="680" y2="850" />
            <path d="M 680 200 L 980 440 L 1280 620 L 1450 780" fill="none" />
            <line x1="150" y1="910" x2="1550" y2="910" />
          </g>

          {/* 6. Expressways (清厢快速路 & 邕武路 - Luminous High-Tech Amber Flame) */}
          <g filter={isLightTheme ? 'none' : 'url(#neonGlow)'}>
            {/* Outer halo */}
            <path 
              d="M 50 220 L 460 380 L 880 570 L 1220 780 L 1580 920" 
              fill="none" 
              stroke={isLightTheme ? '#ea580c' : '#f59e0b'} 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              strokeOpacity="0.8"
            />
            {/* Core laser beam */}
            <path 
              d="M 50 220 L 460 380 L 880 570 L 1220 780 L 1580 920" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeDasharray="14,10" 
              strokeLinecap="round" 
            />
          </g>

          {/* Yongwu Expressway */}
          <g>
            <path 
              d="M 780 40 L 960 280 L 1020 520 L 1080 840" 
              fill="none" 
              stroke={isLightTheme ? '#ea580c' : '#f59e0b'} 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeOpacity="0.75"
            />
          </g>

          {/* 7. Metro Line 1 (Luminous Emerald Pulse) */}
          <g>
            <path 
              d="M 220 895 L 480 895 L 760 900 L 1080 900 L 1480 900" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="4" 
              strokeDasharray="10,4"
              strokeLinecap="round" 
            />
            {[360, 500, 780, 1120, 1380].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="898" r="5" fill="#091124" stroke="#10b981" strokeWidth="2" />
                <circle cx={cx} cy="898" r="2" fill="#34d399" />
              </g>
            ))}
          </g>

          {/* 8. Digital Twin 3D Isometric Buildings (if enabled) */}
          {showBuildings && (
            <g fill={isLightTheme ? 'rgba(203, 213, 225, 0.4)' : 'rgba(15, 23, 42, 0.7)'} stroke={isLightTheme ? '#94a3b8' : '#0284c7'} strokeWidth="1" strokeOpacity="0.4">
              {/* Chaoyang Commercial Cluster */}
              <rect x="420" y="820" width="35" height="40" />
              <rect x="465" y="810" width="45" height="55" />
              <rect x="520" y="830" width="30" height="35" />

              {/* People's Park District */}
              <rect x="740" y="470" width="40" height="30" />
              <rect x="800" y="440" width="50" height="40" />

              {/* Jinhu CBD Towers */}
              <rect x="1100" y="780" width="45" height="60" />
              <rect x="1155" y="760" width="55" height="85" />
              <rect x="1220" y="790" width="40" height="55" />
            </g>
          )}

          {/* 9. Rotating Tactical Radar Sweep */}
          {showRadar && (
            <g transform="translate(800, 500)">
              <circle r="360" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="4,8" />
              <circle r="220" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" />
              {/* Rotating radar sector */}
              <g className="animate-radar-sweep origin-center">
                <path d="M 0 0 L 360 0 A 360 360 0 0 1 254 254 Z" fill="url(#radarSweepGrad)" />
                <line x1="0" y1="0" x2="360" y2="0" stroke="rgba(6, 182, 212, 0.8)" strokeWidth="1.5" />
              </g>
            </g>
          )}

          {/* 10. Landmark Hologram Labels */}
          <g className="text-slate-300 font-sans text-[12px] font-semibold select-none pointer-events-none">
            {/* Expressways */}
            <text x="130" y="195" fill={isLightTheme ? '#c2410c' : '#fbbf24'} transform="rotate(18, 130, 195)" fontSize="13" fontWeight="bold">清厢快速路</text>
            <text x="910" y="585" fill={isLightTheme ? '#c2410c' : '#fbbf24'} transform="rotate(26, 910, 585)" fontSize="13" fontWeight="bold">清厢快速路</text>
            <text x="850" y="160" fill={isLightTheme ? '#c2410c' : '#fbbf24'} transform="rotate(50, 850, 160)" fontSize="12" fontWeight="bold">邕武路</text>

            {/* Roads */}
            <text x="515" y="360" fill={isLightTheme ? '#475569' : '#38bdf8'} transform="rotate(85, 515, 360)" fontSize="11">北湖南路</text>
            <text x="1040" y="380" fill={isLightTheme ? '#475569' : '#38bdf8'} transform="rotate(38, 1040, 380)" fontSize="11">长堽路</text>
            <text x="1090" y="605" fill={isLightTheme ? '#475569' : '#38bdf8'} transform="rotate(30, 1090, 605)" fontSize="11">东葛路</text>

            {/* Landmarks with HUD Brackets */}
            <g transform="translate(390, 190)">
              <rect x="-4" y="-12" width="76" height="18" rx="2" fill={isLightTheme ? '#ffffff' : '#0b1329'} stroke="#38bdf8" strokeWidth="1" />
              <text x="4" y="2" fill={isLightTheme ? '#0f172a' : '#e2e8f0'} fontSize="11">恒大新城</text>
            </g>

            <g transform="translate(500, 220)">
              <rect x="-4" y="-12" width="96" height="18" rx="2" fill={isLightTheme ? '#ffffff' : '#0b1329'} stroke="#38bdf8" strokeWidth="1" />
              <text x="4" y="2" fill={isLightTheme ? '#0f172a' : '#e2e8f0'} fontSize="11">云星广东商城</text>
            </g>

            <g transform="translate(680, 435)">
              <rect x="-4" y="-12" width="130" height="18" rx="2" fill={isLightTheme ? '#ffffff' : '#0b1329'} stroke="#38bdf8" strokeWidth="1" />
              <text x="4" y="2" fill={isLightTheme ? '#0f172a' : '#e2e8f0'} fontSize="11">万里国际南宁汽配城</text>
            </g>

            <g transform="translate(660, 630)">
              <rect x="-4" y="-12" width="115" height="18" rx="2" fill={isLightTheme ? '#ffffff' : '#06261c'} stroke="#10b981" strokeWidth="1" />
              <text x="4" y="2" fill={isLightTheme ? '#065f46' : '#34d399'} fontSize="11">南宁市人民公园</text>
            </g>

            <g transform="translate(1310, 190)">
              <rect x="-4" y="-12" width="120" height="18" rx="2" fill={isLightTheme ? '#ffffff' : '#06261c'} stroke="#10b981" strokeWidth="1" />
              <text x="4" y="2" fill={isLightTheme ? '#065f46' : '#34d399'} fontSize="11">广西药用植物园</text>
            </g>

            <g transform="translate(740, 910)">
              <text x="0" y="0" fill={isLightTheme ? '#0f172a' : '#38bdf8'} fontSize="12" fontWeight="bold">民族广场</text>
            </g>

            <g transform="translate(1160, 890)">
              <text x="0" y="0" fill={isLightTheme ? '#0f172a' : '#38bdf8'} fontSize="12" fontWeight="bold">金湖广场</text>
            </g>
          </g>
        </svg>

        {/* 11. AI Video Surveillance Points (Modern High-Tech Node with FOV Cone) */}
        {showCameras && cameras.map((cam) => {
          const isAlert = cam.status === 'alert';
          return (
            <div
              key={cam.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCamera(cam);
              }}
              style={{
                left: `${cam.x}%`,
                top: `${cam.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 pointer-events-auto"
            >
              {/* Pulsing Tactical Ring for Alert */}
              {isAlert && (
                <span className="absolute -inset-3.5 rounded-full bg-rose-500/40 animate-pulse-ring pointer-events-none" />
              )}

              {/* FOV Laser Cone projection */}
              <div 
                style={{
                  transform: `rotate(${cam.directionDeg}deg)`,
                  transformOrigin: 'top center',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-12 pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity ${
                  isAlert 
                    ? 'bg-gradient-to-b from-rose-500/60 to-transparent' 
                    : 'bg-gradient-to-b from-cyan-400/50 to-transparent'
                }`}
              />

              {/* Modern Titanium Node Icon */}
              <div 
                className={`relative px-2 py-1 rounded bg-[#0b1324] border shadow-lg flex items-center justify-center transition-all duration-200 group-hover:scale-125 ${
                  isAlert 
                    ? 'border-rose-500 text-rose-400 shadow-rose-500/30' 
                    : 'border-cyan-500/80 text-cyan-300 shadow-cyan-500/20'
                }`}
              >
                <Video className="w-3.5 h-3.5 drop-shadow-xs" />
                <span className={`w-1.5 h-1.5 rounded-full ml-1 ${isAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              </div>

              {/* Hover Tooltip */}
              <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap bg-slate-950/95 text-slate-100 text-[11px] px-2.5 py-1 rounded border border-cyan-500/50 shadow-2xl z-30 font-mono flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-rose-500' : 'bg-cyan-400'}`} />
                <span className="font-sans font-medium text-white">{cam.name}</span>
                <span className="text-cyan-400 font-bold">[{cam.type}]</span>
                {isAlert && <span className="text-rose-400 font-bold">● 异常捕获</span>}
              </div>
            </div>
          );
        })}

        {/* 12. Mobile AI Patrol Vehicles */}
        {showVehicles && vehicles.map((veh) => (
          <div
            key={veh.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectVehicle(veh);
            }}
            style={{
              left: `${veh.x}%`,
              top: `${veh.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 pointer-events-auto"
          >
            <span className="absolute -inset-3 rounded-full bg-blue-500/30 animate-pulse-ring pointer-events-none" />

            <div className="relative px-2 py-1 rounded bg-[#0f172a] border border-blue-400 text-blue-400 shadow-lg shadow-blue-500/30 flex items-center gap-1 group-hover:scale-125 transition">
              <Truck className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-[10px] font-mono font-bold text-white">{veh.plate.substring(3)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Tactical Bottom Map Control Panel (Centered next to the bottom command dock) */}
      <div className="absolute bottom-16 right-4 lg:right-[330px] z-20 pointer-events-auto flex flex-col items-end gap-2 transition-all">
        {/* Layer Controls HUD */}
        <div className="bg-[#0b1324]/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80 shadow-2xl flex items-center gap-1.5 text-xs text-slate-300">
          <button
            onClick={() => setShowCameras(!showCameras)}
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 text-[11px] ${
              showCameras ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>探头</span>
          </button>

          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 text-[11px] ${
              showVehicles ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-500'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>巡查车</span>
          </button>

          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 text-[11px] ${
              showRadar ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>雷达</span>
          </button>
        </div>

        {/* Zoom & Reset Buttons */}
        <div className="bg-[#0b1324]/90 backdrop-blur-md rounded-lg border border-slate-700/80 shadow-2xl overflow-hidden divide-y divide-slate-800 flex flex-col">
          <button onClick={zoomIn} title="放大" className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={zoomOut} title="缩小" className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={resetView} title="重置视角" className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition">
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Left GPS Telemetry Box */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-[#091124]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-xl">
        <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
        <span>南宁核心网格: 22.8170°N, 108.3665°E</span>
        <span className="text-slate-600">|</span>
        <span>俯仰角: 35° · 比例尺 1:5000</span>
      </div>
    </div>
  );
};
