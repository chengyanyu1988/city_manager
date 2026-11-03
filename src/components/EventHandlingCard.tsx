import React from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, ArrowRight, Clock, CheckCheck } from 'lucide-react';

interface EventHandlingCardProps {
  warningCount: number;
  violationCount: number;
  handledCount: number;
  onFilterStatus?: (status: string) => void;
}

export const EventHandlingCard: React.FC<EventHandlingCardProps> = ({
  warningCount,
  violationCount,
  handledCount,
  onFilterStatus,
}) => {
  return (
    <div className="cmd-panel p-3.5 w-full shadow-2xl transition-all duration-300 flex-1 flex flex-col justify-between min-h-[180px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45 shadow-xs shadow-cyan-400" />
          <h3 className="text-xs font-bold text-white tracking-widest uppercase">
            处置闭环实效研判
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          时效达标 92.4%
        </span>
      </div>

      {/* 3 Modern Triage Tiles */}
      <div className="grid grid-cols-3 gap-2 flex-1 items-stretch">
        {/* Tile 1: 预警事件 */}
        <div 
          onClick={() => onFilterStatus?.('预警')}
          className="group cursor-pointer rounded-lg p-2.5 bg-gradient-to-b from-amber-950/40 via-slate-900/60 to-slate-950/80 border border-amber-500/30 hover:border-amber-400 flex flex-col justify-between items-center transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="w-7 h-7 rounded-md bg-amber-950/90 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-1">预警事件</span>
          <span className="text-xl xl:text-2xl font-black font-mono text-amber-300 tabular-nums">
            {warningCount}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">待派单</span>
        </div>

        {/* Tile 2: 违规事件 */}
        <div 
          onClick={() => onFilterStatus?.('违规')}
          className="group cursor-pointer rounded-lg p-2.5 bg-gradient-to-b from-rose-950/40 via-slate-900/60 to-slate-950/80 border border-rose-500/30 hover:border-rose-400 flex flex-col justify-between items-center transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="w-7 h-7 rounded-md bg-rose-950/90 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-sm">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-1">核查违规</span>
          <span className="text-xl xl:text-2xl font-black font-mono text-rose-300 tabular-nums">
            {violationCount}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">处置中</span>
        </div>

        {/* Tile 3: 已处置 */}
        <div 
          onClick={() => onFilterStatus?.('已处置')}
          className="group cursor-pointer rounded-lg p-2.5 bg-gradient-to-b from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 flex flex-col justify-between items-center transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="w-7 h-7 rounded-md bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-300 mt-1">已结案</span>
          <span className="text-xl xl:text-2xl font-black font-mono text-emerald-300 tabular-nums">
            {handledCount}
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">已归档</span>
        </div>
      </div>

      {/* Mini Dispatch Footnote */}
      <div 
        onClick={() => onFilterStatus?.('all')}
        className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 cursor-pointer hover:text-cyan-300 transition"
      >
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>平均处置时长: <b className="text-cyan-300">18.4min</b></span>
        </span>
        <span className="flex items-center gap-0.5 text-cyan-400 font-medium font-mono">
          <span>进入调度工单流</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
