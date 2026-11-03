import React, { useState } from 'react';
import { CameraDevice, PatrolVehicle, GovernanceAlert } from '../types';
import { Search, X, MapPin, Video, Truck, AlertTriangle } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameras: CameraDevice[];
  vehicles: PatrolVehicle[];
  alerts: GovernanceAlert[];
  onSelectCamera: (cam: CameraDevice) => void;
  onSelectVehicle: (veh: PatrolVehicle) => void;
  onSelectAlert: (alert: GovernanceAlert) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  cameras,
  vehicles,
  alerts,
  onSelectCamera,
  onSelectVehicle,
  onSelectAlert,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedCameras = cameras.filter(
    (c) => c.name.includes(query) || c.code.includes(query) || c.street.includes(query) || c.road.includes(query)
  );

  const matchedVehicles = vehicles.filter(
    (v) => v.name.includes(query) || v.plate.includes(query) || v.driver.includes(query)
  );

  const matchedAlerts = alerts.filter(
    (a) => a.location.includes(query) || a.type.includes(query) || a.description.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-100 flex flex-col max-h-[75vh]">
        {/* Input Bar */}
        <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索地名、路段（如 北湖南路、清厢快速路、人民公园、恒大新城）或设备号..."
            autoFocus
            className="w-full bg-transparent border-none outline-hidden text-sm text-white placeholder-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="px-4 py-2 bg-slate-850 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs text-slate-400 shrink-0">
          <span>推荐:</span>
          {['清厢快速路', '北湖南路', '民族广场', '恒大新城', '出店经营', '机动车乱停放'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Cameras */}
          {matchedCameras.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>AI智能监控抓拍杆 ({matchedCameras.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedCameras.slice(0, 4).map((cam) => (
                  <div
                    key={cam.id}
                    onClick={() => {
                      onSelectCamera(cam);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{cam.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cam.code} · {cam.street}</div>
                    </div>
                    <span className="text-[11px] text-blue-400 font-medium">查看实时画面 →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles */}
          {matchedVehicles.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase">
                <Truck className="w-3.5 h-3.5 text-indigo-400" />
                <span>车载移动巡检车辆 ({matchedVehicles.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      onSelectVehicle(veh);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{veh.name}</div>
                      <div className="text-[11px] text-slate-400">{veh.plate} · 执勤: {veh.driver}</div>
                    </div>
                    <span className="text-[11px] text-blue-400 font-medium">定位车辆 →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {matchedAlerts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>违法违规预警工单 ({matchedAlerts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedAlerts.slice(0, 4).map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      onSelectAlert(alt);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{alt.type} - {alt.location}</div>
                      <div className="text-[11px] text-slate-400">{alt.time} · {alt.status}</div>
                    </div>
                    <span className="text-[11px] text-blue-400 font-medium">查看详情 →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedCameras.length === 0 && matchedVehicles.length === 0 && matchedAlerts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              未找到与 “{query}” 匹配的点位或记录，请尝试其他关键词
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
