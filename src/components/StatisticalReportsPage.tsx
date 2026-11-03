import React, { useState } from 'react';
import {
  Home,
  X,
  Download,
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Filter,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface StatisticalReportsPageProps {
  onBackToHome: () => void;
  theme?: string;
}

export interface DetailRow {
  id: number;
  type: string;
  totalAlerts: number;
  unhandled: number;
  reviewing: number;
  archived: number;
  falseAlarm: number;
}

export const StatisticalReportsPage: React.FC<StatisticalReportsPageProps> = ({
  onBackToHome,
}) => {
  // Dimension state: 'day' | 'month' | 'year'
  const [timeDimension, setTimeDimension] = useState<'day' | 'month' | 'year'>('day');
  
  // Chart Style state: 'area' (平滑面积图) | 'bar' (科技柱状图) | 'combo' (柱折组合图) | 'line' (高精折线图)
  const [chartStyle, setChartStyle] = useState<'area' | 'bar' | 'combo' | 'line'>('area');
  
  const [hoveredPoint, setHoveredPoint] = useState<{ x: string; y: number; index: number } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // 24-hour Trend Points matching screenshot values
  const DAY_POINTS = [
    { label: '00:00', val: 7 },
    { label: '01:00', val: 18 },
    { label: '02:00', val: 16 },
    { label: '03:00', val: 28 },
    { label: '04:00', val: 24 },
    { label: '05:00', val: 32 },
    { label: '06:00', val: 50 },
    { label: '07:00', val: 60 },
    { label: '08:00', val: 70 },
    { label: '09:00', val: 75 },
    { label: '10:00', val: 64 },
    { label: '11:00', val: 39 },
    { label: '12:00', val: 12 },
    { label: '13:00', val: 11 },
    { label: '14:00', val: 10 },
    { label: '15:00', val: 16 },
    { label: '16:00', val: 16 },
    { label: '17:00', val: 26 },
    { label: '18:00', val: 48 },
    { label: '19:00', val: 80 },
    { label: '20:00', val: 90 },
    { label: '21:00', val: 87 },
    { label: '22:00', val: 92 },
    { label: '23:00', val: 61 },
    { label: '24:00', val: 40 },
  ];

  // Monthly points (1-20 Days)
  const MONTH_POINTS = Array.from({ length: 20 }, (_, i) => ({
    label: `${i + 1}日`,
    val: Math.floor(Math.sin(i * 0.5) * 30 + 50 + (i % 5) * 6),
  }));

  // Yearly points (1-10 Months)
  const YEAR_POINTS = [
    { label: '1月', val: 420 },
    { label: '2月', val: 380 },
    { label: '3月', val: 560 },
    { label: '4月', val: 620 },
    { label: '5月', val: 710 },
    { label: '6月', val: 830 },
    { label: '7月', val: 950 },
    { label: '8月', val: 890 },
    { label: '9月', val: 780 },
    { label: '10月', val: 840 },
  ];

  const currentPoints =
    timeDimension === 'day' ? DAY_POINTS : timeDimension === 'month' ? MONTH_POINTS : YEAR_POINTS;

  const maxVal = Math.max(...currentPoints.map((p) => p.val), 100);

  // Table Data Breakdown Matching Screenshot exactly
  const DETAIL_ROWS: DetailRow[] = [
    { id: 1, type: '无照经营游商', totalAlerts: 11, unhandled: 7, reviewing: 23, archived: 20, falseAlarm: 5 },
    { id: 2, type: '出店经营', totalAlerts: 43, unhandled: 6, reviewing: 13, archived: 20, falseAlarm: 3 },
    { id: 3, type: '占道经营', totalAlerts: 55, unhandled: 3, reviewing: 5, archived: 41, falseAlarm: 1 },
    { id: 4, type: '非机动车乱停放', totalAlerts: 12, unhandled: 12, reviewing: 8, archived: 10, falseAlarm: 2 },
    { id: 5, type: '机动车违规停放', totalAlerts: 18, unhandled: 4, reviewing: 9, archived: 15, falseAlarm: 1 },
    { id: 6, type: '渣土车未加盖抛洒', totalAlerts: 8, unhandled: 2, reviewing: 3, archived: 12, falseAlarm: 0 },
    { id: 7, type: '工地未喷淋施工', totalAlerts: 15, unhandled: 1, reviewing: 4, archived: 18, falseAlarm: 2 },
  ];

  // Totals
  const totalAlertsSum = DETAIL_ROWS.reduce((acc, r) => acc + r.totalAlerts, 0);
  const totalUnhandledSum = DETAIL_ROWS.reduce((acc, r) => acc + r.unhandled, 0);
  const totalReviewingSum = DETAIL_ROWS.reduce((acc, r) => acc + r.reviewing, 0);
  const totalArchivedSum = DETAIL_ROWS.reduce((acc, r) => acc + r.archived, 0);
  const totalFalseAlarmSum = DETAIL_ROWS.reduce((acc, r) => acc + r.falseAlarm, 0);

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-y-auto select-text relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP SUB-NAV BREADCRUMB BAR MATCHING USER SCREENSHOT */}
      <div className="bg-[#0b1324] border-b border-cyan-500/20 px-5 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded bg-[#131f37] hover:bg-cyan-950 text-slate-300 hover:text-white text-xs font-medium border border-cyan-500/30 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>首页</span>
          </button>

          <span className="text-slate-600">/</span>

          {/* Active Tab Badge Tag */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
              <span>● 统计报表</span>
              <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">数据时间区间:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            2026-10-19 近期实时统计
          </span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="p-5 flex-1 space-y-5">
        {/* SECTION A: 违规事件概况 (TREND LINE CHART) */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-2xl p-5 space-y-4 shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-wide">违规事件概况</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Chart Style Switcher */}
              <div className="flex items-center bg-[#09101f] p-1 rounded-lg border border-cyan-500/30 text-xs">
                <button
                  onClick={() => setChartStyle('area')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    chartStyle === 'area'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  平滑贝塞尔图
                </button>

                <button
                  onClick={() => setChartStyle('bar')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    chartStyle === 'bar'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  科技柱状图
                </button>

                <button
                  onClick={() => setChartStyle('combo')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    chartStyle === 'combo'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  柱折双轴图
                </button>

                <button
                  onClick={() => setChartStyle('line')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    chartStyle === 'line'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  折线节点图
                </button>
              </div>

              {/* Time Dimension Filters */}
              <div className="flex items-center bg-[#09101f] p-1 rounded-lg border border-cyan-500/30 text-xs">
                <button
                  onClick={() => setTimeDimension('day')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    timeDimension === 'day'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  按天统计
                </button>

                <button
                  onClick={() => setTimeDimension('month')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    timeDimension === 'month'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  按月统计
                </button>

                <button
                  onClick={() => setTimeDimension('year')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    timeDimension === 'year'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  按年统计
                </button>
              </div>
            </div>
          </div>

          {/* SVG Multi-Style Chart Renderer */}
          <div className="relative pt-4 pb-2">
            <svg className="w-full h-64 overflow-visible" viewBox="0 0 1000 240">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>

                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Dotted Lines */}
              {[0, 20, 40, 60, 80, 100].map((level, i) => {
                const y = 200 - (level / 100) * 180;
                return (
                  <g key={i}>
                    <line
                      x1="40"
                      y1={y}
                      x2="980"
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text x="25" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {timeDimension === 'year' ? level * 10 : level}
                    </text>
                  </g>
                );
              })}

              {/* Chart Graphics Calculation */}
              {(() => {
                const pointsCount = currentPoints.length;
                const startX = 50;
                const endX = 970;
                const stepX = (endX - startX) / Math.max(pointsCount - 1, 1);

                const coords = currentPoints.map((p, idx) => {
                  const x = startX + idx * stepX;
                  const normalizedVal = Math.min(p.val / (timeDimension === 'year' ? 1000 : 100), 1);
                  const y = 200 - normalizedVal * 180;
                  return { x, y, label: p.label, val: p.val };
                });

                // Smooth Bezier Curve generator
                let bezierPath = `M ${coords[0].x} ${coords[0].y}`;
                for (let i = 0; i < coords.length - 1; i++) {
                  const p0 = coords[i];
                  const p1 = coords[i + 1];
                  const cx = (p0.x + p1.x) / 2;
                  bezierPath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
                }

                const bezierAreaPath = `${bezierPath} L ${coords[coords.length - 1].x} 200 L ${coords[0].x} 200 Z`;

                const polylineStr = coords.map((c) => `${c.x},${c.y}`).join(' ');

                return (
                  <>
                    {/* CHART STYLE 1: 平滑贝塞尔面积图 (Smooth Bezier Area Chart) */}
                    {chartStyle === 'area' && (
                      <>
                        <path d={bezierAreaPath} fill="url(#areaGradient)" />
                        <path d={bezierPath} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                      </>
                    )}

                    {/* CHART STYLE 2 & 3: 科技柱状图 or 柱折双轴图 (Bar Columns) */}
                    {(chartStyle === 'bar' || chartStyle === 'combo') && (
                      <g>
                        {coords.map((c, idx) => {
                          const barWidth = Math.max(Math.min(stepX * 0.55, 24), 6);
                          const barHeight = Math.max(200 - c.y, 4);
                          return (
                            <g key={idx} className="group cursor-pointer">
                              <rect
                                x={c.x - barWidth / 2}
                                y={c.y}
                                width={barWidth}
                                height={barHeight}
                                rx="3"
                                fill={chartStyle === 'combo' ? 'url(#barGradient)' : 'url(#barGradient)'}
                                className="transition-all duration-200 hover:fill-[url(#barHoverGradient)]"
                                onMouseEnter={() => setHoveredPoint({ x: c.label, y: c.val, index: idx })}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {/* Top Glowing Cap Line */}
                              <line
                                x1={c.x - barWidth / 2}
                                y1={c.y}
                                x2={c.x + barWidth / 2}
                                y2={c.y}
                                stroke="#22d3ee"
                                strokeWidth="2"
                              />
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* CHART STYLE 3: 柱折双轴图 Overlay Line (Combo Curve Overlay) */}
                    {chartStyle === 'combo' && (
                      <path d={bezierPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 3" />
                    )}

                    {/* CHART STYLE 4: 折线节点图 (Line Chart) */}
                    {chartStyle === 'line' && (
                      <>
                        <polygon points={`50,200 ${polylineStr} 970,200`} fill="url(#areaGradient)" opacity="0.3" />
                        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={polylineStr} />
                      </>
                    )}

                    {/* Interactive Node Markers & X-Axis Labels */}
                    {coords.map((c, idx) => (
                      <g key={idx} className="cursor-pointer group">
                        {(chartStyle === 'area' || chartStyle === 'line' || chartStyle === 'combo') && (
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r={chartStyle === 'combo' ? 3.5 : 4.5}
                            fill={chartStyle === 'combo' ? '#f43f5e' : '#0284c7'}
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="transition-all duration-200 group-hover:r-7 group-hover:fill-cyan-300"
                            onMouseEnter={() => setHoveredPoint({ x: c.label, y: c.val, index: idx })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        )}

                        {/* X-axis Label */}
                        <text
                          x={c.x}
                          y="225"
                          fill="#64748b"
                          fontSize="9"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {c.label}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-cyan-950 border border-cyan-400 text-cyan-200 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono font-bold animate-fade-in flex items-center gap-2 z-20">
                <span>时段/节点: {hoveredPoint.x}</span>
                <span className="text-white">|</span>
                <span className="text-amber-300">预警事件起数: {hoveredPoint.y} 起</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: 数据明细 (DATA BREAKDOWN TABLE) */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-2xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-wide">数据明细</h2>
            </div>

            {/* Blue Export Button Matching Screenshot */}
            <button
              onClick={() => showToast('已成功将统计明细报表导出为 Excel 文件！')}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>

          {/* Data Table Matching Screenshot */}
          <div className="overflow-x-auto rounded-xl border border-cyan-500/20">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#09101f] text-slate-300 border-b border-cyan-500/30">
                <tr>
                  <th className="p-3 w-16 text-center">序号</th>
                  <th className="p-3">事件类型</th>
                  <th className="p-3 text-center">预警事件</th>
                  <th className="p-3 text-center">未处置</th>
                  <th className="p-3 text-center">待复核</th>
                  <th className="p-3 text-center">已归档</th>
                  <th className="p-3 text-center">误报事件</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {DETAIL_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-cyan-950/30 transition">
                    <td className="p-3 text-center font-mono text-slate-400">{row.id}</td>
                    <td className="p-3 font-semibold text-white">{row.type}</td>
                    <td className="p-3 text-center font-mono text-cyan-300 font-bold">{row.totalAlerts}</td>
                    <td className="p-3 text-center font-mono text-rose-400 font-bold">{row.unhandled}</td>
                    <td className="p-3 text-center font-mono text-amber-300 font-bold">{row.reviewing}</td>
                    <td className="p-3 text-center font-mono text-emerald-400 font-bold">{row.archived}</td>
                    <td className="p-3 text-center font-mono text-slate-400 font-bold">{row.falseAlarm}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#09101f] font-bold text-white border-t border-cyan-500/30">
                <tr>
                  <td className="p-3 text-center font-mono" colSpan={2}>
                    小计汇总
                  </td>
                  <td className="p-3 text-center font-mono text-cyan-300 text-sm">{totalAlertsSum}</td>
                  <td className="p-3 text-center font-mono text-rose-400 text-sm">{totalUnhandledSum}</td>
                  <td className="p-3 text-center font-mono text-amber-300 text-sm">{totalReviewingSum}</td>
                  <td className="p-3 text-center font-mono text-emerald-400 text-sm">{totalArchivedSum}</td>
                  <td className="p-3 text-center font-mono text-slate-400 text-sm">{totalFalseAlarmSum}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
