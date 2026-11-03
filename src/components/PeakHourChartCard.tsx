import React, { useState } from 'react';
import { HourlyStatItem } from '../types';
import { TrendingUp, Activity, BarChart2, Radio, Clock, AlertTriangle } from 'lucide-react';

interface PeakHourChartCardProps {
  data: HourlyStatItem[];
}

export const PeakHourChartCard: React.FC<PeakHourChartCardProps> = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // View mode: 'spectrum' (Equalizer Spectrum - Default) | 'dial' (24H Circular Clock) | 'stepped' (Step Pulse)
  const [viewMode, setViewMode] = useState<'spectrum' | 'dial' | 'stepped'>('spectrum');

  const maxY = 200;
  const totalSegments = 16; // Number of LED energy blocks per column

  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-[1.2] flex flex-col justify-between min-h-[220px]">
      {/* Header with Style Switcher */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            高发时段潮汐研判
          </h3>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-[#091124] p-0.5 rounded border border-cyan-500/30 text-[10px]">
          <button
            onClick={() => setViewMode('spectrum')}
            title="时段能量频谱柱阵"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-1 ${
              viewMode === 'spectrum'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>频谱</span>
          </button>

          <button
            onClick={() => setViewMode('dial')}
            title="24H环形表盘热力"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-1 ${
              viewMode === 'dial'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>表盘</span>
          </button>

          <button
            onClick={() => setViewMode('stepped')}
            title="阶梯波形"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-1 ${
              viewMode === 'stepped'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>阶梯</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Equalizer Spectrum Pillars (Default Non-Curve Style) */}
      {viewMode === 'spectrum' && (
        <div className="relative flex-1 flex flex-col justify-between py-1">
          {/* Threshold Alert Line across 100 units */}
          <div className="relative w-full flex items-center justify-between text-[9px] font-mono text-rose-400/90 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>警戒水位线: 100件</span>
            </span>
            <span className="text-slate-500">午高峰重点防控</span>
          </div>

          {/* Equalizer Grid Matrix */}
          <div className="relative flex-1 flex items-end justify-between px-1 gap-2 min-h-[110px]">
            {/* Horizontal guideline */}
            <div className="absolute top-[50%] left-0 right-0 border-b border-rose-500/30 border-dashed pointer-events-none" />

            {data.map((item, idx) => {
              const activeCount = Math.round((item.count / maxY) * totalSegments);
              const isPeak = item.count >= 160;
              const isWarning = item.count >= 100;
              const isHovered = hoverIndex === idx;

              return (
                <div
                  key={item.hour}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  {/* Floating Count Hover Tag */}
                  {isHovered && (
                    <div className="absolute -top-7 pointer-events-none bg-slate-950 text-cyan-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/60 shadow-xl whitespace-nowrap z-30">
                      {item.hour}: <b className="text-white">{item.count}</b>件
                    </div>
                  )}

                  {/* Peak Flame Tag at top of 12:00 */}
                  {isPeak && !isHovered && (
                    <div className="text-[9px] font-mono font-bold text-amber-300 mb-0.5 animate-pulse">
                      {item.count}
                    </div>
                  )}

                  {/* Equalizer Column of Stacked LED Blocks */}
                  <div className="w-full max-w-[20px] flex flex-col-reverse gap-[2px] p-[2px] rounded bg-slate-950/80 border border-slate-800 group-hover:border-cyan-500/50 transition">
                    {Array.from({ length: totalSegments }).map((_, segIdx) => {
                      const isActive = segIdx < activeCount;
                      // Block colors: green for base, cyan for mid, amber for warning, rose for peak
                      let blockColor = 'bg-slate-900/60';
                      if (isActive) {
                        if (segIdx >= 12) {
                          blockColor = 'bg-rose-500 shadow-xs shadow-rose-500/70';
                        } else if (segIdx >= 8) {
                          blockColor = 'bg-amber-400 shadow-xs shadow-amber-400/50';
                        } else if (segIdx >= 4) {
                          blockColor = 'bg-cyan-400 shadow-xs shadow-cyan-400/40';
                        } else {
                          blockColor = 'bg-emerald-400';
                        }
                      }

                      return (
                        <div
                          key={segIdx}
                          className={`w-full h-[4.5px] rounded-xs transition-all duration-300 ${blockColor} ${
                            isHovered && isActive ? 'brightness-125' : ''
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* X-axis Label */}
                  <span
                    className={`mt-1.5 text-[9px] font-mono transition tabular-nums ${
                      isPeak
                        ? 'text-amber-400 font-bold'
                        : isHovered
                        ? 'text-cyan-300 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: 24-Hour Circular Dial Heatmap */}
      {viewMode === 'dial' && (
        <div className="relative flex-1 flex items-center justify-between gap-3 py-1">
          {/* Circular Clock Dial */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(15, 23, 42, 0.9)" strokeWidth="10" />
              {data.map((item, idx) => {
                const angle = (idx / data.length) * 360;
                const arcLength = (1 / data.length) * (2 * Math.PI * 42) - 3;
                const dashOffset = -((idx / data.length) * (2 * Math.PI * 42));
                const intensity = item.count / maxY;
                const strokeColor =
                  item.count >= 160
                    ? '#f59e0b'
                    : item.count >= 100
                    ? '#fb923c'
                    : item.count >= 50
                    ? '#06b6d4'
                    : '#10b981';

                return (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={hoverIndex === idx ? 13 : 9}
                    strokeDasharray={`${arcLength} 300`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Dial Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <Clock className="w-4 h-4 text-cyan-400 mb-0.5 animate-spin" style={{ animationDuration: '15s' }} />
              <span className="text-[11px] font-mono font-bold text-white">
                {hoverIndex !== null ? data[hoverIndex].hour : '24H潮汐'}
              </span>
              <span className="text-[9px] font-mono text-cyan-400">
                {hoverIndex !== null ? `${data[hoverIndex].count}件` : '峰值12:00'}
              </span>
            </div>
          </div>

          {/* Dial Right Breakdown */}
          <div className="flex-1 space-y-1 text-xs">
            <div className="text-[10px] text-slate-400 pb-1 border-b border-slate-800">
              时段热度分布:
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>午间重保期 (12-15h)</span>
              </span>
              <span className="font-mono font-bold text-white">323件</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>早晚通勤期 (9/18h)</span>
              </span>
              <span className="font-mono font-bold text-white">256件</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>夜间静默期 (0-6h)</span>
              </span>
              <span className="font-mono font-bold text-white">74件</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Cyber Stepped Pulse Wave */}
      {viewMode === 'stepped' && (
        <div className="relative flex-1 flex flex-col justify-center py-1">
          <svg viewBox="0 0 280 90" className="w-full h-[90px] overflow-visible">
            <defs>
              <linearGradient id="steppedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Stepped stair path */}
            {(() => {
              const stepW = 280 / data.length;
              let pathD = `M 0 90`;
              data.forEach((d, i) => {
                const y = 90 - (d.count / maxY) * 85;
                const xStart = i * stepW;
                const xEnd = (i + 1) * stepW;
                if (i === 0) pathD = `M ${xStart} ${y}`;
                pathD += ` L ${xEnd} ${y}`;
                if (i < data.length - 1) {
                  const nextY = 90 - (data[i + 1].count / maxY) * 85;
                  pathD += ` L ${xEnd} ${nextY}`;
                }
              });
              const fillD = `${pathD} L 280 90 L 0 90 Z`;

              return (
                <>
                  <path d={fillD} fill="url(#steppedGrad)" />
                  <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                </>
              );
            })()}

            {/* Step Nodes */}
            {data.map((d, i) => {
              const stepW = 280 / data.length;
              const x = i * stepW + stepW / 2;
              const y = 90 - (d.count / maxY) * 85;
              const isPeak = d.count >= 160;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={hoverIndex === i ? 5 : isPeak ? 4 : 2.5}
                    fill={isPeak ? '#f59e0b' : '#ffffff'}
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Stepped X-axis */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-cyan-500/20">
            {data.map((d, i) => (
              <span key={i} className="tabular-nums">
                {d.hour}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Peak Tidal Warning Dispatch Strip */}
      <div className="mt-2.5 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-amber-300 truncate">
          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">11:30~14:30 能量峰值（168件），已增派3组铁骑巡防</span>
        </span>
        <span className="text-cyan-400 shrink-0">实时波谱</span>
      </div>
    </div>
  );
};
