import React from 'react';
import { PatrolVehicle } from '../types';
import { 
  X, 
  Truck, 
  BatteryCharging, 
  Navigation, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  Activity,
  Compass
} from 'lucide-react';

interface PatrolVehicleModalProps {
  vehicle: PatrolVehicle | null;
  onClose: () => void;
}

export const PatrolVehicleModal: React.FC<PatrolVehicleModalProps> = ({
  vehicle,
  onClose,
}) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{vehicle.name}</h3>
                <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-700/50">
                  {vehicle.plate}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                所属辖区: {vehicle.street}巡防责任区
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>实时车速</span>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                {vehicle.speed} <span className="text-xs text-slate-400 font-normal">km/h</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>设备电量</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
                {vehicle.battery}%
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>今日巡检点位</span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {vehicle.inspectionsToday} <span className="text-xs text-slate-400 font-normal">处</span>
              </div>
            </div>
          </div>

          {/* Personnel Details */}
          <div className="bg-slate-800/40 rounded-lg p-3.5 border border-slate-700/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>在岗执勤人员</span>
              </span>
              <span className="font-medium text-slate-200">{vehicle.driver}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>联络电话</span>
              </span>
              <span className="font-mono text-slate-300">{vehicle.phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>车载AI算法检出异常</span>
              </span>
              <span className="font-bold text-amber-300 font-mono">{vehicle.anomaliesFound} 起</span>
            </div>
          </div>

          {/* Forward Dashcam Simulation */}
          <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-[16/9] border border-slate-700 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center text-slate-400 text-xs space-y-1">
                <Compass className="w-8 h-8 text-blue-400 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
                <div>车载前置全景高清摄录流接入中</div>
                <div className="text-[10px] text-slate-500 font-mono">1080P 5G专网 低延迟无线回传</div>
              </div>
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-400">
              GPS: 22.8174°N, 108.3662°E · 巡逻航向 045°
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-800/80 border-t border-slate-700 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  );
};
