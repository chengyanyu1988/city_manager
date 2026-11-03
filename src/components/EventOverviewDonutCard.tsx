import React, { useState } from 'react';
import { OVERVIEW_STATS } from '../data/mockData';
import { PieChart, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EventOverviewDonutCardProps {
  stats?: typeof OVERVIEW_STATS;
  onFilterStatus?: (status: string) => void;
}

export const EventOverviewDonutCard: React.FC<EventOverviewDonutCardProps> = ({
  stats = OVERVIEW_STATS,
  onFilterStatus,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const total = stats.unhandled + stats.reviewing + stats.archived;
  const unhandledPct = Math.round((stats.unhandled / total) * 100);
  const reviewingPct = Math.round((stats.reviewing / total) * 100);
  const archivedPct = Math.round((stats.archived / total) * 100);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  const strokeDash1 = (stats.unhandled / total) * circumference;
  const strokeDash2 = (stats.reviewing / total) * circumference;
  const strokeDash3 = (stats.archived / total) * circumference;

  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-[1.2] flex flex-col justify-between min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            事件概况状态分析
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
          全周期管理
        </span>
      </div>

      {/* Ring Chart & Legend container */}
      <div className="flex-1 flex items-center justify-between gap-4 py-2">
        {/* SVG Multi-Ring Donut graphic */}
        <div className="relative w-28 h-28 xl:w-32 xl:h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
            {/* Background Track Ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="rgba(15, 23, 42, 0.85)"
              strokeWidth="7"
              fill="none"
            />
            {/* Segment 1: 未处置 */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#06b6d4"
              strokeWidth="7"
              strokeDasharray={`${strokeDash1} ${circumference}`}
              strokeDashoffset="0"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out cursor-pointer hover:stroke-width-9"
              onMouseEnter={() => setActiveItem('unhandled')}
              onMouseLeave={() => setActiveItem(null)}
            />
            {/* Segment 2: 待复核 */}
            <circle
              cx="55"
              cy="55"
              r={radius - 9}
              stroke="#3b82f6"
              strokeWidth="6"
              strokeDasharray={`${strokeDash2} ${2 * Math.PI * (radius - 9)}`}
              strokeDashoffset="0"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out cursor-pointer hover:stroke-width-8"
              onMouseEnter={() => setActiveItem('reviewing')}
              onMouseLeave={() => setActiveItem(null)}
            />
            {/* Segment 3: 已存档 */}
            <circle
              cx="55"
              cy="55"
              r={radius - 17}
              stroke="#a855f7"
              strokeWidth="5"
              strokeDasharray={`${strokeDash3} ${2 * Math.PI * (radius - 17)}`}
              strokeDashoffset="0"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out cursor-pointer hover:stroke-width-7"
              onMouseEnter={() => setActiveItem('archived')}
              onMouseLeave={() => setActiveItem(null)}
            />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">总事件数</span>
            <span className="text-xl font-black font-mono text-white tabular-nums -mt-0.5">
              {total}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs">
          {/* 未处置 */}
          <div
            onClick={() => onFilterStatus?.('未处置')}
            onMouseEnter={() => setActiveItem('unhandled')}
            onMouseLeave={() => setActiveItem(null)}
            className={`p-1.5 rounded-lg cursor-pointer transition ${
              activeItem === 'unhandled' ? 'bg-cyan-500/20 font-semibold' : 'hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#06b6d4] shrink-0 shadow-xs shadow-cyan-400" />
                <span className="text-slate-200 font-medium">未处置</span>
              </div>
              <div className="font-mono text-slate-200 tabular-nums">
                <span className="font-bold text-white">{stats.unhandled}</span> 件
                <span className="text-[10px] text-cyan-400 ml-1">({unhandledPct}%)</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
              <div style={{ width: `${unhandledPct}%` }} className="h-full bg-cyan-400 rounded-full" />
            </div>
          </div>

          {/* 待复核 */}
          <div
            onClick={() => onFilterStatus?.('待复核')}
            onMouseEnter={() => setActiveItem('reviewing')}
            onMouseLeave={() => setActiveItem(null)}
            className={`p-1.5 rounded-lg cursor-pointer transition ${
              activeItem === 'reviewing' ? 'bg-blue-500/20 font-semibold' : 'hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#3b82f6] shrink-0 shadow-xs shadow-blue-400" />
                <span className="text-slate-200 font-medium">待复核</span>
              </div>
              <div className="font-mono text-slate-200 tabular-nums">
                <span className="font-bold text-white">{stats.reviewing}</span> 件
                <span className="text-[10px] text-blue-400 ml-1">({reviewingPct}%)</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
              <div style={{ width: `${reviewingPct}%` }} className="h-full bg-blue-500 rounded-full" />
            </div>
          </div>

          {/* 已存档 */}
          <div
            onClick={() => onFilterStatus?.('已存档')}
            onMouseEnter={() => setActiveItem('archived')}
            onMouseLeave={() => setActiveItem(null)}
            className={`p-1.5 rounded-lg cursor-pointer transition ${
              activeItem === 'archived' ? 'bg-purple-500/20 font-semibold' : 'hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#a855f7] shrink-0 shadow-xs shadow-purple-400" />
                <span className="text-slate-200 font-medium">已存档</span>
              </div>
              <div className="font-mono text-slate-200 tabular-nums">
                <span className="font-bold text-white">{stats.archived}</span> 件
                <span className="text-[10px] text-purple-400 ml-1">({archivedPct}%)</span>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
              <div style={{ width: `${archivedPct}%` }} className="h-full bg-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* SLA Compliance Footnote */}
      <div className="mt-2.5 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>区块链防篡改存档接入</span>
        </span>
        <span className="text-cyan-300">处置闭环率 92.4%</span>
      </div>
    </div>
  );
};
