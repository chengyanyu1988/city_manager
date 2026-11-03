import React, { useState } from 'react';
import { EventTypeRankingItem } from '../types';
import { Compass, Target, Grid } from 'lucide-react';

interface EventTypeRankingCardProps {
  items: EventTypeRankingItem[];
  onSelectItem?: (name: string) => void;
}

export const EventTypeRankingCard: React.FC<EventTypeRankingCardProps> = ({
  items,
  onSelectItem,
}) => {
  const [chartMode, setChartMode] = useState<'radar' | 'polar' | 'cards'>('radar');
  const [hoveredItem, setHoveredItem] = useState<EventTypeRankingItem | null>(null);

  const maxCount = 85;
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  // Radar Chart calculations for a 5-point pentagon
  const centerX = 140;
  const centerY = 88;
  const radius = 68;
  const angleStep = (2 * Math.PI) / items.length;
  const startAngle = -Math.PI / 2;

  const getCoordinates = (r: number, index: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const levels = [0.35, 0.7, 1.0];
  const levelPolygons = levels.map((lvl) => {
    return items
      .map((_, i) => {
        const { x, y } = getCoordinates(radius * lvl, i);
        return `${x},${y}`;
      })
      .join(' ');
  });

  const dataPoints = items.map((item, i) => {
    const normalizedVal = Math.max(item.count / maxCount, 0.2);
    const { x, y } = getCoordinates(radius * normalizedVal, i);
    return { x, y, item };
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-[1.25] flex flex-col justify-between min-h-[250px]">
      {/* Header with Chart Type Switcher */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            事件类型频发研判
          </h3>
        </div>

        {/* Chart View Switcher Toggles */}
        <div className="flex items-center gap-1 bg-[#091124] p-0.5 rounded border border-cyan-500/30 text-[10px]">
          <button
            onClick={() => setChartMode('radar')}
            title="五维态势雷达蛛网图"
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
              chartMode === 'radar'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>雷达</span>
          </button>

          <button
            onClick={() => setChartMode('polar')}
            title="极坐标同心环刻度"
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
              chartMode === 'polar'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>同心环</span>
          </button>

          <button
            onClick={() => setChartMode('cards')}
            title="指标矩阵蜂巢"
            className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
              chartMode === 'cards'
                ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>矩阵</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Radar Pentagon Spider Chart */}
      {chartMode === 'radar' && (
        <div className="relative flex-1 flex flex-col items-center justify-center">
          <svg viewBox="0 0 280 178" className="w-full h-full max-h-[210px] overflow-visible">
            <defs>
              <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
              </linearGradient>
              <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric Pentagon Web Grid */}
            {levelPolygons.map((poly, idx) => (
              <polygon
                key={idx}
                points={poly}
                fill="none"
                stroke="rgba(56, 189, 248, 0.2)"
                strokeWidth="1"
                strokeDasharray={idx === 2 ? 'none' : '3,3'}
              />
            ))}

            {/* 5 Spoke Axis Lines */}
            {items.map((_, i) => {
              const { x, y } = getCoordinates(radius, i);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="rgba(56, 189, 248, 0.22)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Data Polygon Area */}
            <polygon
              points={dataPolygon}
              fill="url(#radarFillGrad)"
              stroke="#38bdf8"
              strokeWidth="2"
              filter="url(#radarGlow)"
              className="transition-all duration-500 ease-out"
            />

            {/* Vertex Nodes & Interactive Markers */}
            {dataPoints.map((pt, i) => {
              const isHovered = hoveredItem?.name === pt.item.name;
              const isTop = pt.item.rank === 1;

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onClick={() => onSelectItem?.(pt.item.name)}
                  onMouseEnter={() => setHoveredItem(pt.item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : isTop ? 4.5 : 3.5}
                    fill={isTop ? '#f59e0b' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1}
                    className="transition-all duration-200"
                  />
                  {isTop && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="8"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      opacity="0.7"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Peripheral Labels */}
            {/* 1. Top: 机动车乱停放 */}
            <g
              transform="translate(140, 10)"
              className="cursor-pointer text-center"
              onClick={() => onSelectItem?.(items[0].name)}
              onMouseEnter={() => setHoveredItem(items[0])}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <rect x="-46" y="-8" width="92" height="17" rx="3" fill="#091124" stroke="#f59e0b" strokeWidth="1" />
              <text x="0" y="5" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">
                机动车违停 {items[0].count}件
              </text>
            </g>

            {/* 2. Top-Right: 违规户外广告 */}
            <g
              transform="translate(230, 68)"
              className="cursor-pointer text-center"
              onClick={() => onSelectItem?.(items[1].name)}
              onMouseEnter={() => setHoveredItem(items[1])}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <rect x="-42" y="-8" width="84" height="17" rx="3" fill="#091124" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="5" textAnchor="middle" fill="#e2e8f0" fontSize="10">
                户外广告 {items[1].count}件
              </text>
            </g>

            {/* 3. Bottom-Right: 渣土车检测 */}
            <g
              transform="translate(205, 162)"
              className="cursor-pointer text-center"
              onClick={() => onSelectItem?.(items[4].name)}
              onMouseEnter={() => setHoveredItem(items[4])}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <rect x="-38" y="-8" width="76" height="17" rx="3" fill="#091124" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="5" textAnchor="middle" fill="#94a3b8" fontSize="10">
                渣土车 {items[4].count}件
              </text>
            </g>

            {/* 4. Bottom-Left: 物料堆放 */}
            <g
              transform="translate(75, 162)"
              className="cursor-pointer text-center"
              onClick={() => onSelectItem?.(items[3].name)}
              onMouseEnter={() => setHoveredItem(items[3])}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <rect x="-38" y="-8" width="76" height="17" rx="3" fill="#091124" stroke="#64748b" strokeWidth="1" />
              <text x="0" y="5" textAnchor="middle" fill="#94a3b8" fontSize="10">
                物料堆放 {items[3].count}件
              </text>
            </g>

            {/* 5. Top-Left: 出店经营 */}
            <g
              transform="translate(50, 68)"
              className="cursor-pointer text-center"
              onClick={() => onSelectItem?.(items[2].name)}
              onMouseEnter={() => setHoveredItem(items[2])}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <rect x="-42" y="-8" width="84" height="17" rx="3" fill="#091124" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="5" textAnchor="middle" fill="#e2e8f0" fontSize="10">
                出店经营 {items[2].count}件
              </text>
            </g>
          </svg>

          {/* Bottom active inspection hint */}
          <div className="w-full mt-2 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>
              {hoveredItem ? (
                <span className="text-cyan-300 font-semibold">
                  {hoveredItem.name}: {hoveredItem.count}件 ({Math.round((hoveredItem.count / totalCount) * 100)}%)
                </span>
              ) : (
                <span>五维全息态势 · 机动车违停高踞榜首</span>
              )}
            </span>
            <span className="text-amber-400 font-bold">占全量 33.2%</span>
          </div>
        </div>
      )}

      {/* Mode 2: Polar Target Concentric Progress */}
      {chartMode === 'polar' && (
        <div className="flex-1 flex flex-col justify-around py-1 space-y-2">
          {items.map((item) => {
            const pct = Math.round((item.count / maxCount) * 100);
            return (
              <div
                key={item.rank}
                onClick={() => onSelectItem?.(item.name)}
                className="group cursor-pointer flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-800/60 transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${
                      item.rank === 1
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    0{item.rank}
                  </span>
                  <span className="text-xs text-slate-200 group-hover:text-cyan-300 transition">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="w-20 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${
                        item.rank === 1
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 3: Matrix Grid Badges */}
      {chartMode === 'cards' && (
        <div className="flex-1 grid grid-cols-2 gap-2 py-1 items-stretch">
          {items.map((item) => {
            const isTop = item.rank === 1;
            return (
              <div
                key={item.rank}
                onClick={() => onSelectItem?.(item.name)}
                className={`p-2 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                  isTop
                    ? 'col-span-2 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">#{item.rank}</span>
                  <span className="text-slate-400 text-[10px]">占比 {Math.round((item.count / totalCount) * 100)}%</span>
                </div>
                <div className="my-1 font-semibold text-slate-200 text-xs truncate">{item.name}</div>
                <div className="font-mono text-right">
                  <span className={`text-base font-bold ${isTop ? 'text-amber-300' : 'text-white'}`}>
                    {item.count}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">件</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
