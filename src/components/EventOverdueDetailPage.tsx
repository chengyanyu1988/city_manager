import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  X,
  Camera,
  CornerUpLeft,
  Megaphone,
  Share2,
  Send,
  UserCheck,
  Truck,
  Layers,
  Clock,
  Radio,
  ExternalLink,
  Video,
  Eye,
  Download,
  Compass,
  ZoomIn,
  ZoomOut,
  Sliders,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { OverdueItem } from './EventOverduePage';

interface EventOverdueDetailPageProps {
  item: OverdueItem;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const EventOverdueDetailPage: React.FC<EventOverdueDetailPageProps> = ({
  item,
  onBack,
  onPrev,
  onNext
}) => {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'live' | 'history'>('snapshot');
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(3);
  
  // Modal states
  const [isRemoteNotifyModalOpen, setIsRemoteNotifyModalOpen] = useState<boolean>(false);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState<boolean>(false);
  const [isFalseAlarmModalOpen, setIsFalseAlarmModalOpen] = useState<boolean>(false);

  // Live video states
  const [isLivePlaying, setIsLivePlaying] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('正向车道');

  // History video states
  const [isHistoryPlaying, setIsHistoryPlaying] = useState<boolean>(false);
  const [historyProgress, setHistoryProgress] = useState<number>(45); // %
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [selectedHistoryClip, setSelectedHistoryClip] = useState<number>(0);

  // Dynamic status and process flow
  const [eventStatus, setEventStatus] = useState<string>('预警中 (逾期)');
  const [verifyStatus, setVerifyStatus] = useState<string>('违规');
  const [processSteps, setProcessSteps] = useState([
    { time: '2026-10-19 15:19:35', text: `已识别到 ${item.type} 事件`, tag: '违规' },
    { time: '2026-10-19 15:20:36', text: '王明 已对事件进行 违规 处理', tag: '处理中', note: '此事件属于违规事件，已下发调度指令' }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live stream clock tick simulation
  const [liveTimeString, setLiveTimeString] = useState<string>('2026-10-19 18:59:12');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTimeString(
        `2026-10-19 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 5 Left Carousel Snapshots matching screenshot corresponding to item.imgUrl
  const snapshots = [
    { time: '2026-10-19 15:58:12', url: item.imgUrl },
    { time: '2026-10-19 15:58:11', url: item.imgUrl },
    { time: '2026-10-19 15:58:10', url: item.imgUrl },
    { time: '2026-10-19 15:58:09', url: item.imgUrl },
    { time: '2026-10-19 15:58:08', url: item.imgUrl }
  ];

  // History clips list
  const historyClips = [
    { id: 1, title: '预警触发录像片段', time: '10:31:05 - 10:32:05', duration: '01:00' },
    { id: 2, title: '车辆入场违停片段', time: '10:25:00 - 10:28:00', duration: '03:00' },
    { id: 3, title: '网格员巡查核实录像', time: '10:45:10 - 10:47:10', duration: '02:00' }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white text-xs px-4 py-2 rounded-lg shadow-xl border border-rose-300/40 font-semibold animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header / Breadcrumb Bar (Matching screenshot: ← 返回 | 逾期事件) */}
      <div className="h-11 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d1629] hover:bg-cyan-900/40 border border-cyan-500/30 text-xs text-slate-200 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>返回</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-bold text-slate-200 tracking-wide">逾期事件</span>
          <span className="text-xs text-rose-400 font-mono font-bold pl-2">[{item.id}]</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">处置时限：</span>
          <span className="text-amber-400 font-bold">{item.limitTime || '1.5小时'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">已超时：</span>
          <span className="text-rose-400 font-bold">{item.overdueDuration}</span>
        </div>
      </div>

      {/* Main Container with Left/Right Carousel Nav Arrows */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 relative">
        
        {/* Left Arrow Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-black/60 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-r flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* RIGHT CAROUSEL ARROW */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-black/60 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-l flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: Main Surveillance & Info Panel (approx 75% width) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          
          {/* Top Big Card: Tabs + Left Thumbnails + Main Viewport + Detail Crops */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 flex flex-col">
            
            {/* Tab Navigation Header: 事件抓拍 | 实时监控 | 历史视频 */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <div className="flex items-center gap-1 font-bold text-xs">
                <button
                  onClick={() => setActiveTab('snapshot')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer ${
                    activeTab === 'snapshot'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  事件抓拍
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'live'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>实时监控</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>历史视频</span>
                </button>
              </div>

              {/* Mode indicator description */}
              <div className="text-[11px] font-mono text-cyan-400">
                {activeTab === 'snapshot' && '当前视图：AI视觉多角度告警抓拍记录'}
                {activeTab === 'live' && '当前视图：实时摄像头视频流 & 云台控制'}
                {activeTab === 'history' && '当前视图：全天候历史事件视频回放与时间轴'}
              </div>
            </div>

            {/* TAB 1: 事件抓拍 (Original Screenshot Grid View) */}
            {activeTab === 'snapshot' && (
              <div className="grid grid-cols-12 gap-3">
                {/* 1. Left Thumbnail Strip (2 cols - 5 thumbnails) */}
                <div className="col-span-2 space-y-2 overflow-y-auto max-h-[380px] pr-1">
                  {snapshots.map((snap, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSnapshotIndex(idx)}
                      className={`rounded overflow-hidden border cursor-pointer transition ${
                        selectedSnapshotIndex === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-md'
                          : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="relative h-16 bg-slate-900">
                        <img src={snap.url} alt={snap.time} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-2 inset-y-2 border border-rose-500 bg-rose-500/10" />
                      </div>
                      <div className="bg-[#090e1c] text-[10px] text-center font-mono py-0.5 text-slate-300">
                        {snap.time.split(' ')[1]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Main Viewport Player (7 cols) */}
                <div className="col-span-7 bg-[#090e1c] rounded border border-cyan-500/30 overflow-hidden relative group flex flex-col justify-between h-[380px]">
                  <img
                    src={snapshots[selectedSnapshotIndex].url}
                    alt="Main Camera View"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-1/3 left-1/3 w-36 h-24 border-2 border-rose-500 bg-rose-500/20 rounded-xs" />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <polygon
                      points="120,80 420,90 480,340 180,340"
                      fill="rgba(234, 179, 8, 0.15)"
                      stroke="#eab308"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  </svg>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="font-bold text-cyan-300">{item.cameraName || 'C201摄像头'}</span>
                      <span className="text-slate-300">{snapshots[selectedSnapshotIndex].time}</span>
                    </div>

                    <button
                      onClick={() => showToast('已开启 1080P 高清监看大屏')}
                      className="p-1 rounded hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Right Crop Detail Thumbnails Column (3 cols) */}
                <div className="col-span-3 flex flex-col justify-between space-y-2">
                  <div className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden h-24 relative">
                    <img
                      src={item.imgUrl}
                      alt="Vehicle Zoom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-cyan-300 font-mono">
                      违规目标追踪
                    </div>
                  </div>

                  <div className="bg-[#090e1c] rounded border border-cyan-500/40 overflow-hidden h-24 relative flex items-center justify-center">
                    <div className="bg-blue-900 border-2 border-slate-100 text-white font-bold font-mono px-3 py-1 rounded text-sm shadow-md tracking-wider">
                      {item.plateNumber || '粤B·2N66V'}
                    </div>
                    <div className="absolute bottom-1 right-1 text-[9px] text-emerald-400 font-mono">
                      AI识别率 99.2%
                    </div>
                  </div>

                  <div className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden h-24 relative">
                    <img
                      src={item.imgUrl}
                      alt="Side View"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-slate-300 font-mono">
                      侧向特征
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRemoteNotifyModalOpen(true)}
                    className="w-full py-2 rounded bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-98"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>远程通知</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: 实时监控 (Realtime Live Stream View) */}
            {activeTab === 'live' && (
              <div className="grid grid-cols-12 gap-3">
                {/* Live Stream Viewport (9 cols) */}
                <div className="col-span-9 bg-[#090e1c] rounded border border-cyan-500/40 overflow-hidden relative h-[380px] flex flex-col justify-between">
                  <img
                    src={item.imgUrl}
                    alt="Live Stream"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Status Overlay: LIVE Indicator & Stream Telemetry */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded border border-rose-500/40 text-rose-400 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>● LIVE 实时直播</span>
                    </div>

                    <div className="bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                      码率: <span className="text-cyan-400 font-bold">4.2 Mbps</span> | 帧率: <span className="text-cyan-400 font-bold">30 FPS</span> | 延时: <span className="text-emerald-400 font-bold">22ms</span>
                    </div>
                  </div>

                  {/* Bounding Box Simulation */}
                  <div className="absolute top-1/3 left-1/3 w-40 h-28 border-2 border-rose-500 bg-rose-500/10 rounded-xs flex items-start p-1">
                    <span className="bg-rose-600 text-white font-mono text-[9px] px-1 py-0.2 rounded font-bold">
                      实时追踪: {item.plateNumber}
                    </span>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3 font-mono">
                      <button
                        onClick={() => setIsLivePlaying(!isLivePlaying)}
                        className="p-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                      >
                        {isLivePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <span className="font-bold text-cyan-300">{item.cameraName}</span>
                      <span className="text-slate-300">{liveTimeString}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('已手动截取当前 1080P 现场高清快照并存档')}
                        className="px-2.5 py-1 rounded bg-[#0d1629] border border-cyan-500/40 hover:bg-cyan-900/40 text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>手动抓拍</span>
                      </button>

                      <button
                        onClick={() => setIsRemoteNotifyModalOpen(true)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>实时对讲喊话</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cloud PTZ & Angle Controls Column (3 cols) */}
                <div className="col-span-3 bg-[#090e1c] rounded border border-cyan-500/20 p-3 flex flex-col justify-between h-[380px] text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Compass className="w-4 h-4" />
                        <span>云台方向控制 (PTZ)</span>
                      </span>
                    </div>

                    {/* D-Pad Circle Controls */}
                    <div className="flex flex-col items-center justify-center p-2">
                      <div className="w-28 h-28 rounded-full bg-[#0d1629] border border-cyan-500/30 grid grid-cols-3 grid-rows-3 gap-1 p-2 shadow-inner">
                        <div />
                        <button onClick={() => showToast('云台向上倾斜 +5°')} className="bg-[#131f38] hover:bg-cyan-600 text-slate-200 rounded flex items-center justify-center font-bold">▲</button>
                        <div />
                        <button onClick={() => showToast('云台向左旋转 -10°')} className="bg-[#131f38] hover:bg-cyan-600 text-slate-200 rounded flex items-center justify-center font-bold">◀</button>
                        <button onClick={() => showToast('云台已复位归航位')} className="bg-cyan-600/40 hover:bg-cyan-500 text-cyan-300 rounded flex items-center justify-center font-bold text-[10px]">复位</button>
                        <button onClick={() => showToast('云台向右旋转 +10°')} className="bg-[#131f38] hover:bg-cyan-600 text-slate-200 rounded flex items-center justify-center font-bold">▶</button>
                        <div />
                        <button onClick={() => showToast('云台向下倾斜 -5°')} className="bg-[#131f38] hover:bg-cyan-600 text-slate-200 rounded flex items-center justify-center font-bold">▼</button>
                        <div />
                      </div>
                    </div>

                    {/* Zoom In / Out Controls */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button onClick={() => showToast('变焦放大 2.0X')} className="py-1.5 rounded bg-[#0d1629] border border-slate-700 hover:border-cyan-500 text-slate-200 flex items-center justify-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                        <span>拉近镜头</span>
                      </button>
                      <button onClick={() => showToast('变焦缩小 1.0X')} className="py-1.5 rounded bg-[#0d1629] border border-slate-700 hover:border-cyan-500 text-slate-200 flex items-center justify-center gap-1">
                        <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
                        <span>拉远镜头</span>
                      </button>
                    </div>

                    {/* Preset Angle Buttons */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] text-slate-400 block font-semibold">预置巡航视角：</span>
                      <div className="grid grid-cols-3 gap-1 font-mono text-[11px]">
                        {['全景视角', '正向车道', '盲道特写'].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setActivePreset(p);
                              showToast(`已云台切至预置视角【${p}】`);
                            }}
                            className={`py-1 rounded border text-center transition ${
                              activePreset === p
                                ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                                : 'bg-[#0d1629] text-slate-300 border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono text-center border-t border-slate-800 pt-2">
                    IPC-良庆-C201 · 大华球机云台协议 ONVIF
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 历史视频 (Historical Video Playback View) */}
            {activeTab === 'history' && (
              <div className="grid grid-cols-12 gap-3">
                {/* Historical Video Player with Scrubber Bar (9 cols) */}
                <div className="col-span-9 bg-[#090e1c] rounded border border-cyan-500/40 overflow-hidden relative h-[380px] flex flex-col justify-between">
                  <img
                    src={snapshots[selectedHistoryClip % snapshots.length].url}
                    alt="History Stream"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Bar: Replay Mode */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded border border-blue-500/40 text-blue-300 font-bold font-mono text-xs flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>历史录像回放 Mode · {historyClips[selectedHistoryClip].time}</span>
                  </div>

                  {/* Interactive Video Timeline Scrubber Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 space-y-2 text-xs text-white">
                    {/* Time Scrubber Slider */}
                    <div className="relative pt-2">
                      {/* Violation Timestamp Highlight Markers on Timeline */}
                      <div className="absolute top-0 left-[20%] w-1.5 h-3 bg-rose-500 rounded-full cursor-pointer" title="10:25:00 违停车辆进入" />
                      <div className="absolute top-0 left-[45%] w-2 h-3.5 bg-amber-400 rounded-full cursor-pointer ring-2 ring-rose-500" title="10:31:09 触发AI预警" />
                      <div className="absolute top-0 left-[70%] w-1.5 h-3 bg-emerald-400 rounded-full cursor-pointer" title="10:45:00 网格员核实" />

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={historyProgress}
                        onChange={(e) => setHistoryProgress(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Timeline Controls */}
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsHistoryPlaying(!isHistoryPlaying)}
                          className="p-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                        >
                          {isHistoryPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>

                        <button
                          onClick={() => setHistoryProgress(prev => Math.max(0, prev - 10))}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          -10s
                        </button>

                        <button
                          onClick={() => setHistoryProgress(prev => Math.min(100, prev + 10))}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          +10s
                        </button>

                        <span className="text-cyan-300 font-bold">10:31:09</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">10:45:00</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">倍速:</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => {
                            setPlaybackSpeed(e.target.value);
                            showToast(`已切换回放速度至 ${e.target.value}`);
                          }}
                          className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-[11px]"
                        >
                          <option value="0.5x">0.5x</option>
                          <option value="1.0x">1.0x</option>
                          <option value="2.0x">2.0x</option>
                          <option value="4.0x">4.0x</option>
                        </select>

                        <button
                          onClick={() => showToast(`已下载从 10:30:00 至 10:35:00 的高清证据剪辑视频包`)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>导出证据视频</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Clips Selection List (3 cols) */}
                <div className="col-span-3 bg-[#090e1c] rounded border border-cyan-500/20 p-3 space-y-3 h-[380px] overflow-y-auto text-xs">
                  <div className="font-bold text-cyan-400 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
                    <span>事件关键时刻片段</span>
                    <span className="text-[10px] text-slate-400 font-mono">共 3 组</span>
                  </div>

                  <div className="space-y-2">
                    {historyClips.map((clip, idx) => (
                      <div
                        key={clip.id}
                        onClick={() => {
                          setSelectedHistoryClip(idx);
                          setHistoryProgress((idx + 1) * 30);
                          showToast(`正在播放: ${clip.title}`);
                        }}
                        className={`p-2.5 rounded border transition cursor-pointer ${
                          selectedHistoryClip === idx
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-md'
                            : 'bg-[#0d1629] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 truncate">{clip.title}</span>
                          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-1 py-0.2 rounded border border-cyan-500/30">
                            {clip.duration}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">{clip.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p>💾 硬盘录像机: NVR-WEST-02</p>
                    <p>📁 循环覆盖周期: 30天</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Card: 预警信息 + Mini GIS Map (Matching Screenshot) */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
              <h3 className="text-sm font-bold text-cyan-400">预警信息</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left Info Fields (2 cols) */}
              <div className="md:col-span-2 grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sans">
                <div>
                  <span className="text-slate-400">事件编号：</span>
                  <span className="text-slate-300 font-mono font-medium">{item.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">预警摄像头：</span>
                  <span className="text-slate-200 font-medium">{item.cameraName || 'C204摄像头'}</span>
                </div>
                <div>
                  <span className="text-slate-400">违规类型：</span>
                  <span className="text-rose-400 font-bold">{item.type}</span>
                </div>
                <div>
                  <span className="text-slate-400">目标经度：</span>
                  <span className="text-slate-200 font-mono">108.376026</span>
                </div>
                <div>
                  <span className="text-slate-400">开始预警时间：</span>
                  <span className="text-slate-200 font-mono">2026-10-19 15:19:35</span>
                </div>
                <div>
                  <span className="text-slate-400">目标纬度：</span>
                  <span className="text-slate-200 font-mono">22.770844</span>
                </div>
                <div>
                  <span className="text-slate-400">持续时间：</span>
                  <span className="text-slate-200 font-mono">5秒</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">位置信息：</span>
                  <span className="text-slate-200">{item.location}</span>
                </div>
              </div>

              {/* Right Mini GIS Map Preview */}
              <div className="relative rounded overflow-hidden border border-cyan-500/30 bg-[#090e1c] h-36 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"
                  alt="GIS Map Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[1px]" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>良庆区电子地图</span>
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  GPS: 108.376, 22.770
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Status & Timeline Panel (approx 25% width) */}
        <div className="w-80 shrink-0 space-y-3 flex flex-col">
          
          {/* Card 1: 事件状态 */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
              <h3 className="text-sm font-bold text-cyan-400">事件状态</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <p className="text-slate-400">预警状态</p>
                <p className="text-rose-400 font-bold">{eventStatus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">核实情况</p>
                <p className="text-rose-400 font-bold">{verifyStatus}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">责任主体</p>
                <p className="text-amber-400 font-medium flex items-center justify-center gap-0.5 cursor-pointer hover:underline" onClick={() => showToast('已发起网格责任主体关联流程')}>
                  <span>未关联</span>
                  <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: 事件流程 */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                <h3 className="text-sm font-bold text-cyan-400">事件流程</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{processSteps.length} 步节点</span>
            </div>

            {/* Timeline Item List */}
            <div className="space-y-4 text-xs relative pl-4 pt-1 flex-1 overflow-y-auto max-h-[260px]">
              <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-cyan-500/30" />

              {processSteps.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#0d1629]" />
                  <p className="font-mono text-cyan-400 text-[11px]">{step.time}</p>
                  <div className="bg-[#090e1c] p-2 rounded border border-slate-800 text-slate-300 leading-relaxed space-y-1">
                    <p>{step.text}</p>
                    {step.note && (
                      <p className="text-[11px] text-slate-400 pt-0.5 border-t border-slate-800/80">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Card (违规 / 误报 Buttons matching screenshot) */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsViolationModalOpen(true)}
              className="py-2.5 rounded bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <XCircle className="w-4 h-4" />
              <span>违规</span>
            </button>

            <button
              onClick={() => setIsFalseAlarmModalOpen(true)}
              className="py-2.5 rounded bg-[#1890ff] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>误报</span>
            </button>
          </div>

        </div>

      </div>

      {/* MODAL 1: 确认违规派单模态框 (Triggered by 违规 Button) */}
      {isViolationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-rose-500/50 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#090e1c] border-b border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  确认违规 · 紧急督办派单工单 [{item.id}]
                </h3>
              </div>
              <button onClick={() => setIsViolationModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-200">
              <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded text-rose-200 leading-relaxed font-mono">
                ⚠️ 注意：该事件已超期 <span className="font-bold underline">{item.overdueDuration}</span>，确认违规后将直接向责任网格中队下发加急督办指令！
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">违规分类判定：</label>
                  <input
                    type="text"
                    readOnly
                    value={item.type}
                    className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-cyan-300 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">督办派单责任中队/网格：</label>
                  <select className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500">
                    <option value="1">西乡塘第一网格巡查队 (责任人: 李亮)</option>
                    <option value="2">良庆执法大队第04网格 (责任人: 张中队长)</option>
                    <option value="3">城市管理机动铁骑应急组 (责任人: 王警官)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">现场处置时限要求：</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" className="py-1.5 rounded bg-rose-600 text-white font-bold text-center border border-rose-400">15分钟 (特急)</button>
                    <button type="button" className="py-1.5 rounded bg-[#090e1c] text-slate-300 hover:text-white border border-slate-700">30分钟 (紧急)</button>
                    <button type="button" className="py-1.5 rounded bg-[#090e1c] text-slate-300 hover:text-white border border-slate-700">1小时 (标准)</button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">督办批示意见：</label>
                  <textarea
                    defaultValue={`该事件已严重超期，请网格执法人员立即派员前往【${item.location}】进行现场清理与依法处置，并拍照上传归档！`}
                    className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs h-20 focus:outline-hidden focus:border-cyan-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsViolationModalOpen(false);
                    setEventStatus('处置中 (已督办)');
                    setVerifyStatus('属实违规');
                    setProcessSteps(prev => [
                      ...prev,
                      {
                        time: liveTimeString,
                        text: '值班员 确认该事件属实违规，并已下发特急督办派单指令',
                        tag: '督办派单',
                        note: '责任单位: 西乡塘第一网格巡查队 (限时15分钟到场)'
                      }
                    ]);
                    showToast(`工单 ${item.id} 已确认属实违规，并成功下发特急督办派单！`);
                  }}
                  className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>确认派单督办</span>
                </button>
                <button
                  onClick={() => setIsViolationModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 确认误报归档模态框 (Triggered by 误报 Button) */}
      {isFalseAlarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-blue-500/50 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#090e1c] border-b border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  确认误报 · 审核归档说明 [{item.id}]
                </h3>
              </div>
              <button onClick={() => setIsFalseAlarmModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-200">
              <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded text-blue-200 leading-relaxed font-mono">
                ℹ️ 说明：标记误报后，该逾期工单将停止督办计时，并自动转入误报归档专区。
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">误报认定原因：</label>
                  <select className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500">
                    <option value="1">摄像头算法环境光线/反光误判</option>
                    <option value="2">临停卸货/准停时段内的合规车辆</option>
                    <option value="3">市政维修施工/应急抢修报备车辆</option>
                    <option value="4">活动报备/非违法摊贩摆设</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">误报复核说明：</label>
                  <textarea
                    defaultValue={`经人工二次复核调阅现场视频，该车辆为市政应急作业报备车辆，不构成违法乱停放，予以误报归档结案。`}
                    className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs h-20 focus:outline-hidden focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#090e1c] p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400">误报复核人：</span>
                    <span className="text-cyan-300 font-bold">值班员 (王明)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">复核时间：</span>
                    <span className="text-slate-200">{liveTimeString}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsFalseAlarmModalOpen(false);
                    setEventStatus('已误报归档');
                    setVerifyStatus('误报');
                    setProcessSteps(prev => [
                      ...prev,
                      {
                        time: liveTimeString,
                        text: '值班员 王明 确认该事件属于误报，已通过审核并归档结案',
                        tag: '误报归档',
                        note: '原因: 市政应急作业报备车辆 (算法误识别)'
                      }
                    ]);
                    showToast(`工单 ${item.id} 已成功标记为误报并归档！`);
                  }}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>确认误报归档</span>
                </button>
                <button
                  onClick={() => setIsFalseAlarmModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 远程喊话模态框 */}
      {isRemoteNotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/40 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">音柱远程喊话喊告</h3>
              </div>
              <button onClick={() => setIsRemoteNotifyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-200">
              <div>
                <label className="text-slate-400 block mb-1">喊话音质选定：</label>
                <select className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs">
                  <option>标准男声 - 严肃告诫</option>
                  <option>标准女声 - 柔性劝导</option>
                  <option>实时麦克风喊话</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">语音文本广播内容：</label>
                <textarea
                  defaultValue={`【城管云视告诫】牌号 ${item.plateNumber || '目标'} 的车主您好，您已在违法区域停放，请立即驶离！`}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs h-20 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsRemoteNotifyModalOpen(false);
                    showToast('已向现场摄像头音柱下发远程语音告诫广播指令！');
                  }}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  广播喊话
                </button>
                <button
                  onClick={() => setIsRemoteNotifyModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
