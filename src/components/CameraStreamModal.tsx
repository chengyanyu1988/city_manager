import React, { useState } from 'react';
import { CameraDevice } from '../types';
import { 
  X, 
  Camera, 
  Send, 
  Volume2, 
  Maximize, 
  RotateCw, 
  ShieldAlert, 
  CheckCircle,
  Radio,
  Sliders
} from 'lucide-react';

interface CameraStreamModalProps {
  camera: CameraDevice | null;
  onClose: () => void;
  onDispatchAlert?: (camera: CameraDevice) => void;
}

export const CameraStreamModal: React.FC<CameraStreamModalProps> = ({
  camera,
  onClose,
  onDispatchAlert,
}) => {
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(false);
  const [ticketDispatched, setTicketDispatched] = useState(false);

  if (!camera) return null;

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  const handleToggleSpeaker = () => {
    setSpeakerActive(!speakerActive);
  };

  const handleDispatch = () => {
    setTicketDispatched(true);
    onDispatchAlert?.(camera);
    setTimeout(() => setTicketDispatched(false), 3000);
  };

  const isAlert = camera.status === 'alert';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  {camera.name}
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  {camera.code}
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {camera.type}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                所属网格: <span className="text-slate-300 font-medium">{camera.street} · {camera.road}</span> · 在线时长: {camera.onlineDuration}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas Screen */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
          {/* Simulated Urban Camera Scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-slate-800/60 to-slate-950">
            {/* Background street perspective */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 450">
              {/* Sky and distant buildings */}
              <rect x="0" y="0" width="800" height="200" fill="#1e293b" opacity="0.5" />
              <polygon points="100,200 150,110 200,200" fill="#334155" />
              <rect x="220" y="90" width="120" height="110" fill="#1e293b" />
              <rect x="420" y="60" width="160" height="140" fill="#0f172a" />
              <rect x="620" y="100" width="130" height="100" fill="#334155" />
              {/* Ground road */}
              <polygon points="0,450 800,450 500,200 300,200" fill="#334155" />
              <line x1="400" y1="200" x2="400" y2="450" stroke="#facc15" strokeWidth="4" strokeDasharray="15,10" />
              {/* Sidewalk */}
              <polygon points="0,450 250,450 300,200 0,200" fill="#475569" />
              {/* Parked Vehicle Silhouette */}
              <rect x="260" y="270" width="150" height="90" rx="8" fill="#0f172a" />
              <polygon points="280,270 320,225 380,225 400,270" fill="#1e293b" />
              <circle cx="295" cy="360" r="18" fill="#020617" />
              <circle cx="375" cy="360" r="18" fill="#020617" />
            </svg>
          </div>

          {/* CCTV OSD Overlay (Top Left & Top Right) */}
          <div className="absolute top-3 left-4 text-xs font-mono text-emerald-400 drop-shadow-md space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-white font-bold">REC ● 实时直播</span>
              <span className="text-slate-300">[{camera.code}]</span>
            </div>
            <div className="text-[11px] text-emerald-300">
              {new Date().toISOString().replace('T', ' ').substring(0, 19)} NNG_GIS_CAM
            </div>
          </div>

          <div className="absolute top-3 right-4 text-right text-[11px] font-mono text-cyan-300 drop-shadow-md">
            <div>{camera.resolution} · {camera.fps} FPS</div>
            <div className="text-slate-400">码率: 4096 kbps (H.265 / 主码流)</div>
          </div>

          {/* AI Detection Bounding Boxes */}
          {camera.detections.length > 0 ? (
            camera.detections.map((det, idx) => (
              <div
                key={idx}
                style={{
                  top: `${det.box[0]}%`,
                  left: `${det.box[1]}%`,
                  width: `${det.box[2]}%`,
                  height: `${det.box[3]}%`,
                }}
                className="absolute border-2 border-rose-500 bg-rose-500/10 rounded-xs pointer-events-none transition-all duration-300 shadow-lg shadow-rose-500/20"
              >
                {/* AI Detection Tag Label */}
                <div className="absolute -top-6 left-0 bg-rose-600 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{det.label}</span>
                  <span className="font-mono text-amber-200">
                    ({(det.confidence * 100).toFixed(1)}%)
                  </span>
                </div>
                {/* Crosshairs at box corners */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
              </div>
            ))
          ) : (
            <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>AI巡查正常，当前区域未检出违规行为</span>
            </div>
          )}

          {/* Snapshot Flash Feedback */}
          {snapshotTaken && (
            <div className="absolute inset-0 bg-white/80 animate-out fade-out duration-500 flex items-center justify-center">
              <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>高清现场照片已抓拍并自动归档至区块链存证中心</span>
              </div>
            </div>
          )}

          {/* Speaker Active Broadcast Banner */}
          {speakerActive && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-2 animate-pulse">
              <Volume2 className="w-4 h-4" />
              <span>现场IP号角语音喊话中：“该区域禁止乱停放与出店经营，请立即纠正！”</span>
            </div>
          )}

          {/* Ticket Dispatched Notice */}
          {ticketDispatched && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-blue-600/95 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>网格处置工单已自动派发至【{camera.street}】巡防网格长终端</span>
            </div>
          )}
        </div>

        {/* Video Control Bar & Actions */}
        <div className="p-3 bg-slate-800/95 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick PTZ info */}
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>全天候AI智能结构化分析</span>
            </span>
            <span>·</span>
            <span>镜头角度: {camera.directionDeg}°</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTakeSnapshot}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>抓拍存证</span>
            </button>

            <button
              onClick={handleToggleSpeaker}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition active:scale-95 ${
                speakerActive 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{speakerActive ? '停止喊话' : '语音喊话'}</span>
            </button>

            <button
              onClick={handleDispatch}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>一键派单处置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
