import React, { useState } from 'react';
import { StreetStatItem } from '../types';
import { Users, BarChart3, Compass, PieChart, TrendingUp } from 'lucide-react';

interface StreetStatsCardProps {
  data: StreetStatItem[];
  onSelectStreet?: (streetName: string) => void;
}

export const StreetStatsCard: React.FC<StreetStatsCardProps> = ({
  data,
  onSelectStreet,
}) => {
  const [hoveredStreet, setHoveredStreet] = useState<string | null>(null);
  // View mode: 'composite' (Dual Bar + Line Chart - Default) | 'radar' (6-Axis Radar) | 'share' (Distribution Donut)
  const [chartMode, setChartMode] = useState<'composite' | 'radar' | 'share'>('composite');

  const maxY = 200;
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  // SLA Resolution compliance rates per street (80% - 100% scale)
  const slaRates: Record<string, number> = {
    '新阳街道': 94.2,
    '北湖街道': 91.5,
    '衡阳街道': 96.0,
    '安吉街道': 93.8,
    '华强街道': 88.5,
    '上尧街道': 95.1,
  };

  // SVG dimensions for the composite line
  const svgW = 220;
  const svgH = 130;

  // Calculate coordinates for the overlaid SLA line
  const linePoints = data.map((item, idx) => {
    const x = (idx + 0.5) * (svgW / data.length);
    // Scale 80% - 100% to Y height
    const rate = slaRates[item.name] || 92;
    const y = svgH - ((rate - 80) / 20) * (svgH - 20) - 10;
    return { x, y, rate, name: item.name };
  });

  const lineD = linePoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Radar chart calculations for 6 streets
  const radarCenterX = 135;
  const radarCenterY = 70;
  const radarR = 52;
  const angleStep = (2 * Math.PI) / 6;

  const getRadarPoint = (r: number, index: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: radarCenterX + r * Math.cos(angle),
      y: radarCenterY + r * Math.sin(angle),
    };
  };

  const radarDataPoints = data.map((item, i) => {
    const valR = (item.count / maxY) * radarR;
    return { ...getRadarPoint(valR, i), item };
  });
  const radarPolygon = radarDataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-[1.25] flex flex-col justify-between min-h-[250px]">
      {/* Header with Multi-Chart Switcher */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            各街道事件负荷统计
          </h3>
        </div>

        {/* Chart View Switcher Toggles */}
        <div className="flex items-center gap-1 bg-[#091124] p-0.5 rounded border border-cyan-500/30 text-[9px]">
          <button
            onClick={() => setChartMode('composite')}
            title="柱线双轴复合图 (负荷量+达标率)"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-0.5 ${
              chartMode === 'composite'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-2.5 h-2.5" />
            <span>柱线图</span>
          </button>

          <button
            onClick={() => setChartMode('radar')}
            title="六街道综合效能雷达"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-0.5 ${
              chartMode === 'radar'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-2.5 h-2.5" />
            <span>网格雷达</span>
          </button>

          <button
            onClick={() => setChartMode('share')}
            title="街道负荷占比环图"
            className={`px-1.5 py-0.5 rounded transition flex items-center gap-0.5 ${
              chartMode === 'share'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-2.5 h-2.5" />
            <span>占比</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Dual-Axis Bar & SLA Trend Composite Chart (柱线双轴复合图) */}
      {chartMode === 'composite' && (
        <div className="relative flex-1 flex flex-col justify-center pt-1">
          {/* Dual Legend Header */}
          <div className="flex items-center justify-between text-[9px] font-mono px-1 pb-1">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-xs bg-cyan-500" />
              <span>事件负荷(件)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400" />
              <span>办结率趋势(%)</span>
            </span>
          </div>

          <div className="flex h-full min-h-[140px] items-stretch">
            {/* Left Y-Axis: Incident Count */}
            <div className="w-6 flex flex-col justify-between text-[8px] font-mono text-slate-500 text-right pr-1 pb-5 h-[130px] tabular-nums">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* Composite Chart Canvas: Vertical Bars + Overlaid SLA Trend Line */}
            <div className="flex-1 relative flex flex-col justify-between">
              {/* Background Horizontal Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5 h-[130px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-b border-cyan-500/10 border-dashed" />
                ))}
              </div>

              {/* Overlaid SVG Trend Line for Resolution Rate */}
              <svg 
                viewBox={`0 0 ${svgW} ${svgH}`} 
                className="absolute inset-0 w-full h-[130px] pointer-events-none z-20 overflow-visible"
              >
                <defs>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Smooth Glowing Trend Path */}
                <path
                  d={lineD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                  className="drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                />

                {/* Nodes with rate */}
                {linePoints.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </svg>

              {/* Bars */}
              <div className="relative h-[130px] flex items-end justify-between px-2 pb-5 z-10">
                {data.map((item) => {
                  const heightPercent = Math.min((item.count / maxY) * 100, 100);
                  const isHovered = hoveredStreet === item.name;
                  const rate = slaRates[item.name] || 92;

                  return (
                    <div
                      key={item.name}
                      onClick={() => onSelectStreet?.(item.name)}
                      onMouseEnter={() => setHoveredStreet(item.name)}
                      onMouseLeave={() => setHoveredStreet(null)}
                      className="group cursor-pointer flex flex-col items-center flex-1 max-w-[32px] relative"
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-9 pointer-events-none bg-slate-950 text-cyan-300 text-[9px] font-mono px-2 py-1 rounded border border-cyan-500/60 shadow-xl whitespace-nowrap z-40">
                          <div>{item.name}: <b className="text-white">{item.count}</b>件</div>
                          <div className="text-emerald-400">办结率: {rate}%</div>
                        </div>
                      )}

                      {/* Number above bar */}
                      <span className="text-[10px] font-mono font-bold text-cyan-300 mb-1 tabular-nums group-hover:text-white transition">
                        {item.count}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-3.5 bg-slate-950 rounded-t-xs h-full flex items-end border border-slate-800">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-xs transition-all duration-500 ease-out ${
                            isHovered 
                              ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-white shadow-md shadow-cyan-400/60 brightness-125' 
                              : 'bg-gradient-to-t from-blue-700 via-cyan-500 to-sky-300'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis */}
              <div className="flex justify-between text-[10px] font-medium text-slate-400 pt-1 border-t border-cyan-500/20">
                {data.map((item) => (
                  <span 
                    key={item.name} 
                    title={item.name}
                    className="truncate text-center flex-1 text-[10px] hover:text-cyan-300 transition"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Y-Axis: Resolution Rate (%) */}
            <div className="w-6 flex flex-col justify-between text-[8px] font-mono text-emerald-400 text-left pl-1 pb-5 h-[130px] tabular-nums">
              <span>100%</span>
              <span>95%</span>
              <span>90%</span>
              <span>85%</span>
              <span>80%</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: 6-Street Performance Radar Chart */}
      {chartMode === 'radar' && (
        <div className="relative flex-1 flex flex-col items-center justify-center py-1">
          <svg viewBox="0 0 270 145" className="w-full h-full max-h-[160px] overflow-visible">
            <defs>
              <linearGradient id="streetRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Hexagon Grids */}
            {[0.4, 0.7, 1.0].map((lvl, idx) => {
              const poly = data.map((_, i) => {
                const pt = getRadarPoint(radarR * lvl, i);
                return `${pt.x},${pt.y}`;
              }).join(' ');

              return (
                <polygon
                  key={idx}
                  points={poly}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="1"
                  strokeDasharray={idx === 2 ? 'none' : '2,2'}
                />
              );
            })}

            {/* Spoke lines */}
            {data.map((_, i) => {
              const pt = getRadarPoint(radarR, i);
              return (
                <line
                  key={i}
                  x1={radarCenterX}
                  y1={radarCenterY}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data Polygon */}
            <polygon
              points={radarPolygon}
              fill="url(#streetRadarGrad)"
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Vertex Markers & Labels */}
            {radarDataPoints.map((p, i) => {
              const angle = -Math.PI / 2 + i * angleStep;
              const labelR = radarR + 18;
              const lx = radarCenterX + labelR * Math.cos(angle);
              const ly = radarCenterY + labelR * Math.sin(angle);

              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {p.item.name.replace('街道', '')} {p.item.count}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="w-full text-center text-[10px] text-slate-400 font-mono mt-1">
            六大片区均衡研判 · 新阳与衡阳形成双峰负荷中心
          </div>
        </div>
      )}

      {/* Mode 3: Distribution Donut Chart */}
      {chartMode === 'share' && (
        <div className="relative flex-1 flex items-center justify-between gap-3 py-1">
          {/* Radial Donut */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(15, 23, 42, 0.9)" strokeWidth="12" />
              {(() => {
                let currentOffset = 0;
                const circumference = 2 * Math.PI * 40;
                const colors = ['#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

                return data.map((item, idx) => {
                  const share = item.count / totalCount;
                  const strokeDash = share * circumference;
                  const dashOffset = -currentOffset;
                  currentOffset += strokeDash;

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[idx % colors.length]}
                      strokeWidth="12"
                      strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeDashoffset={dashOffset}
                      className="cursor-pointer transition-all duration-300 hover:stroke-width-15"
                    />
                  );
                });
              })()}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[8px] text-slate-400 font-mono uppercase">街道总量</span>
              <span className="text-base font-black font-mono text-white tabular-nums">
                {totalCount}
              </span>
            </div>
          </div>

          {/* Share Grid */}
          <div className="flex-1 grid grid-cols-2 gap-1 text-[10px] font-mono">
            {data.map((item, idx) => {
              const colors = ['bg-cyan-400', 'bg-blue-400', 'bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-amber-400'];
              const pct = Math.round((item.count / totalCount) * 100);
              return (
                <div key={idx} className="p-1 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors[idx % colors.length]}`} />
                    <span className="text-slate-300 truncate">{item.name.replace('街道', '')}</span>
                  </div>
                  <span className="text-cyan-300 font-bold">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Inspector Forces Strip */}
      <div className="mt-2.5 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3 text-cyan-400" />
          <span>新阳与衡阳片区负荷居高</span>
        </span>
        <span className="text-emerald-400">在岗网格员: 48人</span>
      </div>
    </div>
  );
};
