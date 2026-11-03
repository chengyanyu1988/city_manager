import React, { useState } from 'react';
import { GovernanceAlert, CameraDevice } from '../types';
import { 
  X, 
  Zap, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle, 
  Eye, 
  Filter, 
  AlertTriangle
} from 'lucide-react';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: GovernanceAlert[];
  onSelectAlertLocation?: (alert: GovernanceAlert) => void;
  onDispatchAlert?: (alertId: string) => void;
  onOpenFullAlertsPage?: () => void;
  onOpenSurveillancePage?: () => void;
  onOpenPatrolPage?: () => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlertLocation,
  onDispatchAlert,
  onOpenFullAlertsPage,
  onOpenSurveillancePage,
  onOpenPatrolPage,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: '全部预警', count: alerts.length },
    { id: '机动车乱停放', label: '机动车违停', count: 14 },
    { id: '违规户外广告', label: '违规广告', count: 9 },
    { id: '沿街出店经营', label: '出店经营', count: 7 },
    { id: '渣土车检测', label: '渣土车检测', count: 5 },
  ];

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type.includes(filterType) || (filterType === '沿街出店经营' && a.type.includes('出店'));
  });

  const handleDispatch = (id: string) => {
    setDispatchedIds((prev) => new Set([...prev, id]));
    onDispatchAlert?.(id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-700/80 shadow-2xl h-full flex flex-col text-slate-100 z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Zap className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">实时预警研判中心</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white">
                  {alerts.length} 起
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI边缘计算实时抓拍与违规线索汇聚
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSurveillancePage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSurveillancePage();
                }}
                className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs border border-cyan-500/40 transition flex items-center gap-1"
              >
                <span>视频监控</span>
                <span>→</span>
              </button>
            )}
            {onOpenPatrolPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPatrolPage();
                }}
                className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-xs border border-amber-500/40 transition flex items-center gap-1"
              >
                <span>巡查管理</span>
                <span>→</span>
              </button>
            )}
            {onOpenFullAlertsPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullAlertsPage();
                }}
                className="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs border border-blue-500/40 transition flex items-center gap-1"
              >
                <span>预警研判全景</span>
                <span>→</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Segment Tabs */}
        <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-xs shrink-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterType(c.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition font-medium ${
                filterType === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>

        {/* Alert Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.map((alert) => {
            const isDispatched = dispatchedIds.has(alert.id);
            const isEmergency = alert.level === '紧急';

            return (
              <div
                key={alert.id}
                className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5 hover:border-slate-600 transition shadow-xs"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isEmergency 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {alert.level}
                    </span>
                    <h4 className="font-semibold text-xs text-white">
                      {alert.type}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{alert.time.substring(11, 19)}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.description}
                </p>

                {/* Location & Device */}
                <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate text-slate-200">{alert.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>来源: {alert.source} ({alert.deviceId})</span>
                    <span className="text-cyan-300 font-mono">置信度: {(alert.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectAlertLocation?.(alert)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>定位至地图点位</span>
                  </button>

                  {isDispatched ? (
                    <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>已派单至网格员</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispatch(alert.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center gap-1 shadow-xs transition active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                      <span>派发网格单</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>当前时段处置闭环率: <b className="text-emerald-400">92.4%</b></span>
          <button
            onClick={() => {
              alerts.forEach((a) => handleDispatch(a.id));
            }}
            className="text-blue-400 hover:underline font-medium"
          >
            全部一键下发处置
          </button>
        </div>
      </div>
    </div>
  );
};
