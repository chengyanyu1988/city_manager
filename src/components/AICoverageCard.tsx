import React, { useState } from 'react';
import { Camera, Truck, Activity, Wifi, Cpu, Disc3, Layers } from 'lucide-react';

interface AICoverageCardProps {
  camerasCount: number;
  vehiclesCount: number;
  onFilterType?: (type: 'camera' | 'vehicle') => void;
}

export const AICoverageCard: React.FC<AICoverageCardProps> = ({
  camerasCount,
  vehiclesCount,
  onFilterType,
}) => {
  const [viewMode, setViewMode] = useState<'gauge' | 'cockpit'>('gauge');

  // Gauge calculations
  const camRadius = 38;
  const camCircumference = 2 * Math.PI * camRadius;
  const camOnlineRate = 0.987;
  const camStrokeDash = camOnlineRate * camCircumference;

  const vehRadius = 38;
  const vehCircumference = 2 * Math.PI * vehRadius;
  const vehActiveRate = 28 / 32; // 87.5% in patrol
  const vehStrokeDash = vehActiveRate * vehCircumference;

  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-1 flex flex-col justify-between min-h-[185px]">
      {/* Panel Header with Mode Toggle */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            AI物联感知全景
          </h3>
        </div>

        {/* View Toggle & Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#091124] p-0.5 rounded border border-cyan-500/30 text-[9px]">
            <button
              onClick={() => setViewMode('gauge')}
              title="双全息环形仪表"
              className={`px-1.5 py-0.5 rounded transition flex items-center gap-0.5 ${
                viewMode === 'gauge'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Disc3 className="w-2.5 h-2.5" />
              <span>仪表</span>
            </button>
            <button
              onClick={() => setViewMode('cockpit')}
              title="舱位控制排布"
              className={`px-1.5 py-0.5 rounded transition flex items-center gap-0.5 ${
                viewMode === 'cockpit'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-2.5 h-2.5" />
              <span>舱位</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>98.7%</span>
          </div>
        </div>
      </div>

      {/* Mode 1: Holographic Dual Radial Health Gauges (Default) */}
      {viewMode === 'gauge' ? (
        <div className="grid grid-cols-2 gap-3 flex-1 items-stretch py-1">
          {/* Gauge 1: AI固定监控探头 */}
          <div
            onClick={() => onFilterType?.('camera')}
            className="group cursor-pointer rounded-lg p-2.5 bg-gradient-to-b from-[#0a152e]/80 via-slate-900/90 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col items-center justify-between relative overflow-hidden"
          >
            {/* Ambient corner light */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 rounded-full blur-md pointer-events-none" />

            <div className="w-full flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>固定视频点位</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">在线</span>
            </div>

            {/* Circular Holographic Radial Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center my-0.5">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background track circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={camRadius}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.9)"
                  strokeWidth="6"
                />
                {/* Dotted tick ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={camRadius - 7}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                />
                {/* Active Luminous Progress Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={camRadius}
                  fill="none"
                  stroke="url(#camGaugeGrad)"
                  strokeWidth="6.5"
                  strokeDasharray={`${camStrokeDash} ${camCircumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out group-hover:brightness-125"
                />
                <defs>
                  <linearGradient id="camGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Gauge Center Telemetry */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black font-mono text-white tabular-nums tracking-tight">
                  {camerasCount}
                </span>
                <span className="text-[9px] text-slate-400 font-mono -mt-0.5">台在线</span>
              </div>
            </div>

            {/* Sub-status resolution split meter */}
            <div className="w-full pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="text-cyan-300">4K: 142</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">2K: 93</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-bold">98.7%</span>
            </div>
          </div>

          {/* Gauge 2: 车载移动巡检编队 */}
          <div
            onClick={() => onFilterType?.('vehicle')}
            className="group cursor-pointer rounded-lg p-2.5 bg-gradient-to-b from-[#0d1633]/80 via-slate-900/90 to-slate-950 border border-blue-500/30 hover:border-blue-400 shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col items-center justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full blur-md pointer-events-none" />

            <div className="w-full flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>移动巡检车队</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-300 font-bold">5G回传</span>
            </div>

            {/* Circular Holographic Radial Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center my-0.5">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={vehRadius}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.9)"
                  strokeWidth="6"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={vehRadius - 7}
                  fill="none"
                  stroke="rgba(96, 165, 250, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={vehRadius}
                  fill="none"
                  stroke="url(#vehGaugeGrad)"
                  strokeWidth="6.5"
                  strokeDasharray={`${vehStrokeDash} ${vehCircumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out group-hover:brightness-125"
                />
                <defs>
                  <linearGradient id="vehGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="60%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black font-mono text-white tabular-nums tracking-tight">
                  {vehiclesCount}
                </span>
                <span className="text-[9px] text-slate-400 font-mono -mt-0.5">辆在编</span>
              </div>
            </div>

            {/* Sub-status patrol mission */}
            <div className="w-full pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="text-emerald-400 font-bold">在巡: 28</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">备勤: 4</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300">136km</span>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Horizontal Split Telemetry Wings (Cockpit Mode) */
        <div className="grid grid-cols-2 gap-2.5 flex-1 items-stretch py-1">
          {/* Wing 1 */}
          <div
            onClick={() => onFilterType?.('camera')}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium">枪球节点群</span>
              <span className="text-xs font-black font-mono text-cyan-300">{camerasCount}台</span>
            </div>
            <div className="my-1.5 space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>在线运行</span>
                <span className="text-emerald-400 font-bold">98.7%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div style={{ width: '98.7%' }} className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-slate-400 flex justify-between font-mono pt-1 border-t border-slate-800">
              <span>码流: 412 MB/s</span>
              <span className="text-cyan-400">4K超清</span>
            </div>
          </div>

          {/* Wing 2 */}
          <div
            onClick={() => onFilterType?.('vehicle')}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-blue-500/30 hover:border-blue-400 cursor-pointer transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium">巡防车梯队</span>
              <span className="text-xs font-black font-mono text-blue-300">{vehiclesCount}辆</span>
            </div>
            <div className="my-1.5 space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>出勤占位</span>
                <span className="text-cyan-300 font-bold">87.5%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div style={{ width: '87.5%' }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-slate-400 flex justify-between font-mono pt-1 border-t border-slate-800">
              <span>巡查: 136 km</span>
              <span className="text-blue-400">北斗定位</span>
            </div>
          </div>
        </div>
      )}

      {/* Edge Compute Health Footnote */}
      <div className="mt-2 pt-1.5 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>边缘集群算力: <b className="text-cyan-300">42.8%</b></span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>专网时延: <b className="text-emerald-300 font-bold">18ms</b></span>
        </span>
      </div>
    </div>
  );
};
