import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Maximize2, 
  Link as LinkIcon, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Clock, 
  ShieldAlert,
  ZoomIn
} from 'lucide-react';
import { AlertItem } from './RealtimeAlertsPage';

interface AlertDetailPageProps {
  alert?: AlertItem;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const AlertDetailPage: React.FC<AlertDetailPageProps> = ({
  alert,
  onBack,
  onPrev,
  onNext
}) => {
  // Tabs: 事件抓拍 | 实时监控 | 历史视频
  const [activeTab, setActiveTab] = useState<'snapshot' | 'live' | 'history'>('snapshot');

  // Selected thumbnail index from the left frame strip (0 to 4)
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(3); // default 10:31:09

  // Workflow status
  const [currentStatus, setCurrentStatus] = useState<string>(alert?.status || '预警中');
  const [verificationResult, setVerificationResult] = useState<string>('—');
  const [timelineSteps, setTimelineSteps] = useState<Array<{ time: string; text: string; subText?: string; isDone: boolean; isRed?: boolean }>>([
    {
      time: alert?.time || '2026-10-19 10:31:09',
      text: '已识别到 机动车乱停放 事件',
      isDone: true,
      isRed: true
    },
    {
      time: '',
      text: '当前事件待处理',
      isDone: false
    }
  ]);

  // Video play state for live/history
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoSpeed, setVideoSpeed] = useState<string>('1.0x');
  const [scrubPercent, setScrubPercent] = useState<number>(45);

  // Fallback default details matching the user's screenshot
  const eventId = alert?.id ? alert.id.replace('ALT-NN-', '20261019') : '2026101900002';
  const eventType = alert?.type || '机动车乱停放';
  const cameraName = alert?.cameraName || 'C201摄像头';
  const cameraCode = alert?.cameraCode || 'C204摄像头';
  const plateNumber = alert?.plate || '粤B·2N66V';
  const locationText = alert?.location || '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府13栋';
  const startTime = alert?.time || '2026-10-19 10:31:09';
  const lng = '108.376026';
  const lat = '22.770844';

  // 5 Consecutive Surveillance Frames on the left
  const frameThumbnails = [
    { id: 0, time: '2026-10-19 10:31:12', label: '10:31:12' },
    { id: 1, time: '2026-10-19 10:31:11', label: '10:31:11' },
    { id: 2, time: '2026-10-19 10:31:10', label: '10:31:10' },
    { id: 3, time: '2026-10-19 10:31:09', label: '10:31:09' },
    { id: 4, time: '2026-10-19 10:31:08', label: '10:31:08' },
  ];

  // Handle Action: 违规
  const handleConfirmViolation = () => {
    setCurrentStatus('已核实违规');
    setVerificationResult('违规属实');
    setTimelineSteps([
      {
        time: startTime,
        text: `已识别到 ${eventType} 事件`,
        isDone: true,
        isRed: true
      },
      {
        time: '2026-10-19 10:32:04',
        text: '人工研判核实为违规停车，已指派蟠龙网格04专席民警跟进处置',
        isDone: true
      },
      {
        time: '',
        text: '等待现场处置取证及车主移车反馈',
        isDone: false
      }
    ]);
  };

  // Handle Action: 误报
  const handleMarkFalseAlarm = () => {
    setCurrentStatus('已忽略 (误报)');
    setVerificationResult('确认为误报');
    setTimelineSteps([
      {
        time: startTime,
        text: `已识别到 ${eventType} 事件`,
        isDone: true,
        isRed: true
      },
      {
        time: '2026-10-19 10:32:15',
        text: '经值班核验确认属于临时礼让临时卸客，已标记为误报并归档',
        isDone: true
      }
    ]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-y-auto font-sans">
      {/* 1. Top Header Breadcrumb: ← 返回 | 实时预警 */}
      <div className="bg-[#090e1c] border-b border-cyan-500/20 px-6 py-2.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 font-medium text-sm transition group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>返回</span>
          </button>
          <span className="text-slate-600">|</span>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            实时预警
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>事件编号: {eventId}</span>
        </div>
      </div>

      {/* 2. Main Detail Workspace */}
      <div className="flex-1 p-4 md:p-6 max-w-[1780px] mx-auto w-full relative flex items-start justify-center">
        {/* Left Arrow Navigation Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            title="上一条预警"
            className="hidden xl:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-xs transition shadow-md active:scale-95 border border-cyan-500/30"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </button>
        )}

        {/* Right Arrow Navigation Button */}
        {onNext && (
          <button
            onClick={onNext}
            title="下一条预警"
            className="hidden xl:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-xs transition shadow-md active:scale-95 border border-cyan-500/30"
          >
            <ChevronRight className="w-5 h-5 text-cyan-400" />
          </button>
        )}

        {/* Main Content Grid: Left/Center Section & Right Sidebar Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ================= LEFT & CENTER COLUMN (9 Cols) ================= */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Top Big Card: Tabs + Left Thumbnails + Main Viewport + 3 Detail Crops */}
            <div className="bg-[#0d1629] rounded-xl border border-cyan-500/20 shadow-2xl p-4 flex flex-col">
              
              {/* Tab Navigation Header: 事件抓拍 | 实时监控 | 历史视频 */}
              <div className="flex items-center border-b border-slate-800 mb-3.5">
                <button
                  onClick={() => setActiveTab('snapshot')}
                  className={`px-6 py-2 text-sm font-bold transition-all relative ${
                    activeTab === 'snapshot'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>事件抓拍</span>
                  {activeTab === 'snapshot' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-6 py-2 text-sm font-bold transition-all relative ${
                    activeTab === 'live'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>实时监控</span>
                  </span>
                  {activeTab === 'live' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-2 text-sm font-bold transition-all relative ${
                    activeTab === 'history'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>历史视频</span>
                  {activeTab === 'history' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 rounded-t" />
                  )}
                </button>
              </div>

              {/* Viewport Content Area */}
              <div className="flex flex-col md:flex-row gap-3.5 items-stretch">
                
                {/* 1. Left Vertical Frame Thumbnails Strip (5 items) */}
                <div className="w-full md:w-[130px] shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                  {frameThumbnails.map((frame, index) => {
                    const isSelected = selectedFrameIndex === index;
                    return (
                      <div
                        key={frame.id}
                        onClick={() => setSelectedFrameIndex(index)}
                        className={`cursor-pointer rounded border transition-all overflow-hidden bg-slate-950 flex-1 md:flex-none ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 hover:border-cyan-500 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {/* Mini snapshot graphic */}
                        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                          <svg className="w-full h-full" viewBox="0 0 160 100">
                            <rect width="160" height="100" fill="#1e293b" />
                            <rect x="0" y="0" width="160" height="30" fill="#0f172a" />
                            <polygon points="40,95 140,95 125,25 65,25" fill="#334155" />
                            {/* parked cars */}
                            <rect x="75" y="45" width="45" height="25" rx="3" fill="#cbd5e1" />
                            <rect x="95" y="28" width="35" height="18" rx="2" fill="#94a3b8" />
                            <rect x="15" y="48" width="40" height="28" rx="3" fill="#991b1b" />
                            {/* AI red box */}
                            <rect x="70" y="40" width="55" height="35" fill="none" stroke="#f43f5e" strokeWidth="2" />
                            {/* Yellow perspective region */}
                            <polygon points="65,92 135,92 120,32 90,32" fill="rgba(234, 179, 8, 0.1)" stroke="#eab308" strokeWidth="1.2" />
                          </svg>
                          <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/80 text-[8px] text-cyan-300 font-mono scale-90 rounded">
                            帧 #{index + 1}
                          </div>
                        </div>
                        {/* Timestamp below thumbnail */}
                        <div className="py-1 px-1 text-center bg-[#09101f] text-[10px] font-mono text-slate-300 leading-tight border-t border-slate-800">
                          {frame.time}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Center Main Surveillance Image / Video Player */}
                <div className="flex-1 relative aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-cyan-500/30 shadow-inner flex flex-col justify-between">
                  {activeTab === 'snapshot' ? (
                    <>
                      {/* High-Fidelity SVG Reproduction of Screenshot Street Scene */}
                      <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                        {/* Street & Sidewalk Perspective */}
                        <rect width="800" height="500" fill="#4b5563" />
                        
                        {/* Upper Storefront Buildings */}
                        <rect x="0" y="0" width="800" height="150" fill="#1e293b" />
                        
                        {/* Storefront 1: 柏花水会 (White sign with red bold font) */}
                        <rect x="10" y="30" width="220" height="75" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                        <text x="120" y="78" textAnchor="middle" fill="#dc2626" fontSize="34" fontWeight="900" fontFamily="sans-serif">
                          柏花水会
                        </text>

                        {/* Storefront 2: 木屋烧烤 (Black sign with red neon font) */}
                        <rect x="235" y="30" width="240" height="75" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                        <text x="355" y="78" textAnchor="middle" fill="#ef4444" fontSize="32" fontWeight="900" fontFamily="sans-serif">
                          木屋烧烤
                        </text>

                        {/* Storefront 3: Yellow facade store */}
                        <rect x="480" y="30" width="180" height="75" fill="#ca8a04" />
                        <text x="570" y="78" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="bold">
                          便民超市
                        </text>

                        {/* Sidewalk pavement on left */}
                        <polygon points="0,150 290,150 310,500 0,500" fill="#64748b" />
                        {/* Pavement stone lines */}
                        <line x1="0" y1="200" x2="295" y2="200" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="270" x2="300" y2="270" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="360" x2="305" y2="360" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="440" x2="308" y2="440" stroke="#475569" strokeWidth="2" />

                        {/* Pedestrians walking on left sidewalk */}
                        <g transform="translate(180, 160) scale(0.65)">
                          {/* Person 1 in yellow coat */}
                          <circle cx="20" cy="20" r="12" fill="#fde047" />
                          <path d="M 8 32 L 32 32 L 28 85 L 12 85 Z" fill="#eab308" />
                          <line x1="15" y1="85" x2="15" y2="120" stroke="#1e293b" strokeWidth="5" />
                          <line x1="25" y1="85" x2="25" y2="120" stroke="#1e293b" strokeWidth="5" />

                          {/* Person 2 in dark jacket */}
                          <g transform="translate(35, 10)">
                            <circle cx="20" cy="20" r="11" fill="#f87171" />
                            <path d="M 8 31 L 32 31 L 30 75 L 10 75 Z" fill="#1e293b" />
                            <line x1="14" y1="75" x2="14" y2="110" stroke="#334155" strokeWidth="4" />
                            <line x1="24" y1="75" x2="24" y2="110" stroke="#334155" strokeWidth="4" />
                          </g>
                        </g>

                        {/* Street asphalt on right */}
                        <polygon points="290,150 800,150 800,500 310,500" fill="#334155" />

                        {/* Yellow Dashed Lane Divider */}
                        <line x1="390" y1="150" x2="430" y2="500" stroke="#ffffff" strokeWidth="4" strokeDasharray="30,20" />

                        {/* Distant white van parked ahead */}
                        <rect x="495" y="165" width="40" height="25" rx="3" fill="#f1f5f9" />
                        <circle cx="503" cy="190" r="5" fill="#0f172a" />
                        <circle cx="527" cy="190" r="5" fill="#0f172a" />

                        {/* White Car Parked Ahead */}
                        <g transform="translate(470, 215)">
                          <rect x="5" y="15" width="65" height="36" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
                          <rect x="15" y="20" width="45" height="14" rx="2" fill="#0f172a" />
                          <circle cx="15" cy="52" r="7" fill="#0f172a" />
                          <circle cx="60" cy="52" r="7" fill="#0f172a" />
                        </g>

                        {/* YELLOW PERSPECTIVE NO-PARKING ZONE POLYGON */}
                        <polygon
                          points="335,480 610,480 545,190 475,190"
                          fill="rgba(234, 179, 8, 0.08)"
                          stroke="#eab308"
                          strokeWidth="2.5"
                        />

                        {/* Central Violating Silver Audi Sedan (粤B·2N66V) */}
                        <g transform="translate(400, 245)">
                          {/* Perspective vehicle body */}
                          <path
                            d="M 15 135 L 35 48 C 45 28, 120 28, 130 48 L 150 135 Z"
                            fill="#cbd5e1"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                          />
                          {/* Roof & Rear windshield */}
                          <path
                            d="M 40 52 L 48 35 C 55 30, 110 30, 118 35 L 125 52 Z"
                            fill="#0f172a"
                          />
                          {/* Audi 4-Rings Emblem */}
                          <g transform="translate(70, 72) scale(0.7)">
                            <circle cx="6" cy="6" r="6" fill="none" stroke="#475569" strokeWidth="1.5" />
                            <circle cx="13" cy="6" r="6" fill="none" stroke="#475569" strokeWidth="1.5" />
                            <circle cx="20" cy="6" r="6" fill="none" stroke="#475569" strokeWidth="1.5" />
                            <circle cx="27" cy="6" r="6" fill="none" stroke="#475569" strokeWidth="1.5" />
                          </g>

                          {/* Blue License Plate (粤B·2N66V) */}
                          <rect x="58" y="85" width="48" height="19" rx="2.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.2" />
                          <text x="82" y="99" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                            {plateNumber}
                          </text>

                          {/* Red Tail lights */}
                          <rect x="22" y="70" width="22" height="12" rx="3" fill="#ef4444" />
                          <rect x="122" y="70" width="22" height="12" rx="3" fill="#ef4444" />

                          {/* Exhaust pipes & bumper */}
                          <rect x="25" y="125" width="116" height="16" rx="4" fill="#334155" />
                          
                          {/* Rear wheels */}
                          <ellipse cx="22" cy="138" rx="12" ry="16" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                          <ellipse cx="144" cy="138" rx="12" ry="16" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

                          {/* Yellow violation line slicing through car (from AI model) */}
                          <line x1="25" y1="125" x2="105" y2="15" stroke="#facc15" strokeWidth="3" />
                        </g>

                        {/* RED AI BOUNDING BOX AROUND AUDI SEDAN */}
                        <rect
                          x="405"
                          y="245"
                          width="160"
                          height="160"
                          fill="rgba(244, 63, 94, 0.12)"
                          stroke="#f43f5e"
                          strokeWidth="3"
                        />

                        {/* Foreground Red SUV Hood & Mirror */}
                        <g transform="translate(190, 310)">
                          <path
                            d="M 50 190 L 120 40 L 290 85 L 280 190 Z"
                            fill="#7f1d1d"
                            stroke="#991b1b"
                            strokeWidth="3"
                          />
                          {/* Roof & Windshield Reflections */}
                          <polygon points="125,50 270,90 240,15 135,15" fill="#1e293b" opacity="0.85" />
                          {/* Side Mirror */}
                          <ellipse cx="105" cy="55" rx="14" ry="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
                        </g>

                        {/* Right Foreground Tree Trunk & Grate */}
                        <rect x="710" y="120" width="80" height="380" fill="#422006" stroke="#291305" strokeWidth="2" />
                        <ellipse cx="700" cy="460" rx="45" ry="15" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                      </svg>

                      {/* Top-Right Camera Timestamp OSD */}
                      <div className="absolute top-3 right-4 z-10 text-white font-mono text-xs md:text-sm font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                        <span>{startTime} 星期一</span>
                      </div>

                      {/* Bottom-Left Camera Location Badge */}
                      <div className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded border border-cyan-500/30 text-white text-xs font-medium flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{cameraName}</span>
                        <span className="text-cyan-400 font-mono text-[11px] ml-1">
                          {frameThumbnails[selectedFrameIndex]?.time || startTime}
                        </span>
                      </div>

                      {/* Bottom-Right Fullscreen Icon */}
                      <button
                        title="全屏查看"
                        className="absolute bottom-3 right-3 z-10 p-1.5 rounded bg-black/70 hover:bg-black/90 text-white transition border border-cyan-500/30"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : activeTab === 'live' ? (
                    /* Live CCTV Stream Player View */
                    <div className="w-full h-full flex flex-col justify-between p-4 relative bg-[#060911] text-white">
                      <div className="flex items-center justify-between z-10 bg-[#09101f] border border-cyan-500/30 px-3 py-1.5 rounded">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="font-bold text-rose-400">LIVE</span>
                          <span>|</span>
                          <span>{cameraCode} - 实时高清视频流</span>
                        </div>
                        <div className="text-xs font-mono text-cyan-300">
                          1080P @ 25FPS · H.265 · 码率 4.2Mbps
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-2 z-10">
                        <Camera className="w-12 h-12 text-cyan-400 animate-pulse" />
                        <div className="text-sm font-medium text-white">
                          {cameraName} 正在持续回传实时路况
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          当前区域正常巡防监控中，AI 车辆违停算法运行正常
                        </div>
                      </div>

                      <div className="flex items-center justify-between z-10 bg-[#09101f] border border-cyan-500/30 px-3 py-1.5 rounded text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-1 hover:text-cyan-400"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <span className="text-slate-400 font-mono">00:00:00 / 实时直播</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-slate-400" />
                          <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* History Playback View */
                    <div className="w-full h-full flex flex-col justify-between p-4 relative bg-[#060911] text-white">
                      <div className="flex items-center justify-between z-10 bg-[#09101f] border border-cyan-500/30 px-3 py-1.5 rounded">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-cyan-400 font-bold">REC 回放</span>
                          <span>|</span>
                          <span>抓拍前5分钟 ~ 抓拍后5分钟 录像</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">倍速:</span>
                          {['1.0x', '2.0x', '4.0x'].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => setVideoSpeed(spd)}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                                videoSpeed === spd ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {spd}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video Player Scrub timeline */}
                      <div className="z-10 bg-[#09101f] border border-cyan-500/30 p-3 rounded space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <span>10:26:09</span>
                          <span className="text-rose-400 font-bold">⚡ 10:31:09 (违停预警触发)</span>
                          <span>10:36:09</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={scrubPercent}
                          onChange={(e) => setScrubPercent(Number(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-white flex items-center gap-1 font-medium shadow-md"
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>{isPlaying ? '暂停' : '播放'}</span>
                            </button>
                            <span className="font-mono text-cyan-300">进度: {scrubPercent}%</span>
                          </div>
                          <span className="text-slate-400">云存储已加密同步</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Right Side 3 Detail Crop Cards */}
                <div className="w-full md:w-[165px] shrink-0 flex flex-row md:flex-col gap-2.5 justify-between">
                  {/* Crop 1: Offending Vehicle Rear Angle */}
                  <div className="flex-1 rounded border border-cyan-500/20 overflow-hidden bg-slate-950 group cursor-pointer relative shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 160 100">
                        <rect width="160" height="100" fill="#1e293b" />
                        <g transform="translate(15, 10)">
                          <path d="M 15 75 L 30 25 C 40 12, 100 12, 110 25 L 125 75 Z" fill="#cbd5e1" stroke="#94a3b8" />
                          <path d="M 32 28 L 38 18 C 45 14, 95 14, 102 18 L 108 28 Z" fill="#0f172a" />
                          <rect x="48" y="45" width="44" height="16" rx="2" fill="#1d4ed8" />
                          <rect x="18" y="38" width="18" height="8" rx="2" fill="#ef4444" />
                          <rect x="104" y="38" width="18" height="8" rx="2" fill="#ef4444" />
                          <circle cx="20" cy="76" r="8" fill="#0f172a" />
                          <circle cx="120" cy="76" r="8" fill="#0f172a" />
                          <line x1="20" y1="75" x2="85" y2="10" stroke="#facc15" strokeWidth="2" />
                        </g>
                      </svg>
                      <div className="absolute bottom-1 left-1.5 text-[9px] bg-black/80 text-cyan-300 px-1 rounded font-mono border border-cyan-500/30">
                        目标车辆
                      </div>
                    </div>
                  </div>

                  {/* Crop 2: High Resolution License Plate Zoom: 粤B·2N66V */}
                  <div className="flex-1 rounded border border-cyan-500/20 overflow-hidden bg-[#09101f] group cursor-pointer relative shadow-md flex flex-col justify-center items-center p-2">
                    <div className="text-[9px] text-cyan-400 self-start font-mono mb-1">
                      车牌特写 (OCR 99.8%)
                    </div>
                    {/* Blue License Plate Graphic */}
                    <div className="w-full py-2 px-1 rounded bg-[#1e40af] border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-mono font-black text-sm tracking-wider drop-shadow-md">
                        {plateNumber}
                      </span>
                    </div>
                  </div>

                  {/* Crop 3: Wheels on Sidewalk / Line Contact Zoom */}
                  <div className="flex-1 rounded border border-cyan-500/20 overflow-hidden bg-slate-950 group cursor-pointer relative shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 160 100">
                        <rect width="160" height="100" fill="#334155" />
                        {/* Curb & Line */}
                        <line x1="0" y1="65" x2="160" y2="65" stroke="#94a3b8" strokeWidth="3" />
                        <line x1="0" y1="75" x2="160" y2="75" stroke="#facc15" strokeWidth="4" strokeDasharray="12,6" />
                        {/* Wheel & Tire Details */}
                        <g transform="translate(45, 10)">
                          <ellipse cx="40" cy="65" rx="30" ry="25" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                          <ellipse cx="40" cy="65" rx="16" ry="13" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                          {/* Car fender */}
                          <path d="M 0 45 C 10 20, 70 20, 80 45" fill="none" stroke="#cbd5e1" strokeWidth="8" />
                        </g>
                      </svg>
                      <div className="absolute bottom-1 left-1.5 text-[9px] bg-black/80 text-cyan-300 px-1 rounded font-mono border border-cyan-500/30">
                        压线判定
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Section: 预警信息 Card */}
            <div className="bg-[#0d1629] rounded-xl border border-cyan-500/20 shadow-2xl p-4 flex flex-col">
              
              {/* Title with Cyan Vertical Accent */}
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                <h3 className="font-bold text-sm text-white">预警信息</h3>
              </div>

              {/* Grid with Key-Values on Left & Mini GIS Map on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Left 2 Columns of Key-Values (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
                  {/* Row 1 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">事件编号:</span>
                    <span className="text-slate-200 font-mono font-medium">{eventId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">预警摄像头:</span>
                    <span className="text-white font-medium">{cameraCode}</span>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">违规类型:</span>
                    <span className="text-cyan-400 font-medium">{eventType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">目标经度:</span>
                    <span className="text-slate-200 font-mono">{lng}</span>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">开始预警时间:</span>
                    <span className="text-slate-200 font-mono">{startTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">目标纬度:</span>
                    <span className="text-slate-200 font-mono">{lat}</span>
                  </div>

                  {/* Row 4 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">持续时间:</span>
                    <span className="text-slate-200 font-medium">5秒</span>
                  </div>

                  <div className="flex items-start gap-2 sm:col-span-1">
                    <span className="text-slate-400 shrink-0 mt-0.5">位置信息:</span>
                    <span className="text-white font-medium leading-relaxed">
                      {locationText}
                    </span>
                  </div>
                </div>

                {/* Right Mini GIS Map View (5 cols) */}
                <div className="md:col-span-5 rounded-lg border border-cyan-500/30 overflow-hidden relative min-h-[160px] bg-[#09101f]">
                  <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                    {/* Land background */}
                    <rect width="320" height="180" fill="#0b1324" />
                    
                    {/* Roads & Avenues */}
                    <rect x="230" y="0" width="30" height="180" fill="#131f37" stroke="#1e293b" strokeWidth="1" />
                    <line x1="245" y1="0" x2="245" y2="180" stroke="#fde047" strokeWidth="2" strokeDasharray="8,4" />

                    <polygon points="0,50 320,50 320,72 0,72" fill="#131f37" stroke="#1e293b" strokeWidth="1" />
                    <polygon points="0,135 230,135 230,155 0,155" fill="#131f37" stroke="#1e293b" strokeWidth="1" />

                    {/* Green park zones */}
                    <path d="M 270 10 C 300 15, 315 50, 290 80 L 270 80 Z" fill="#064e3b" stroke="#047857" />
                    <path d="M 10 145 C 30 140, 60 150, 70 175 L 10 175 Z" fill="#064e3b" stroke="#047857" />

                    {/* Residential / Commercial Building Blocks */}
                    <rect x="30" y="80" width="40" height="30" rx="2" fill="#1e293b" stroke="#334155" />
                    <rect x="85" y="80" width="40" height="30" rx="2" fill="#1e293b" stroke="#334155" />
                    <rect x="140" y="80" width="45" height="30" rx="2" fill="#1e293b" stroke="#334155" />
                    
                    <rect x="40" y="15" width="45" height="25" rx="2" fill="#1e293b" stroke="#334155" />
                    <rect x="100" y="15" width="45" height="25" rx="2" fill="#1e293b" stroke="#334155" />
                    <rect x="160" y="15" width="50" height="25" rx="2" fill="#1e293b" stroke="#334155" />

                    {/* Water Canal */}
                    <rect x="295" y="0" width="25" height="180" fill="#0369a1" />

                    {/* GIS Street Labels */}
                    <text x="245" y="95" textAnchor="middle" fill="#94a3b8" fontSize="7" transform="rotate(90 245 95)">
                      金龙路
                    </text>
                    <text x="110" y="64" textAnchor="middle" fill="#94a3b8" fontSize="7">
                      云星钱隆首府社区内街
                    </text>
                    <text x="60" y="100" textAnchor="middle" fill="#64748b" fontSize="6">
                      12栋
                    </text>
                    <text x="110" y="100" textAnchor="middle" fill="#64748b" fontSize="6">
                      13栋
                    </text>
                    <text x="165" y="100" textAnchor="middle" fill="#64748b" fontSize="6">
                      14栋
                    </text>

                    {/* Exact Red Location Marker Pin on Coordinates */}
                    <g transform="translate(222, 115)">
                      <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#ef4444" opacity="0.6" />
                      <path
                        d="M 0 -18 C -7 -18 -11 -12 -11 -6 C -11 3 0 10 0 10 C 0 10 11 3 11 -6 C 11 -12 7 -18 0 -18 Z"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle cx="0" cy="-7" r="3.5" fill="#ffffff" />
                    </g>
                  </svg>

                  {/* Overlay Coordinates Tag */}
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 shadow-md border border-cyan-500/30">
                    良庆区 · 蟠龙网格
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR COLUMN (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* 1. 事件状态 Card */}
              <div className="bg-[#0d1629] rounded-xl border border-cyan-500/20 shadow-2xl p-4">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                  <h3 className="font-bold text-sm text-white">事件状态</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  {/* 预警状态 */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">预警状态</div>
                    <div className={`text-xs font-bold ${
                      currentStatus.includes('违规')
                        ? 'text-rose-400'
                        : currentStatus.includes('误报')
                          ? 'text-slate-400'
                          : 'text-rose-400'
                    }`}>
                      {currentStatus}
                    </div>
                  </div>

                  {/* 核实情况 */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">核实情况</div>
                    <div className="text-xs font-medium text-slate-200">
                      {verificationResult}
                    </div>
                  </div>

                  {/* 责任主体 */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">责任主体</div>
                    <div className="text-xs font-medium text-amber-400 flex items-center justify-center gap-1">
                      <span>未关联</span>
                      <LinkIcon className="w-3 h-3 text-cyan-400 hover:text-cyan-300 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 事件流程 Card */}
              <div className="bg-[#0d1629] rounded-xl border border-cyan-500/20 shadow-2xl p-4">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                  <h3 className="font-bold text-sm text-white">事件流程</h3>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-5 py-1">
                  {/* Vertical dashed guideline */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0 border-l border-dashed border-cyan-500/30" />

                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot Icon */}
                      <div className="absolute -left-6 top-1">
                        {step.isDone ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 flex items-center justify-center ring-4 ring-cyan-950" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-slate-900 ring-2 ring-cyan-950" />
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="text-xs space-y-0.5">
                        {step.time && (
                          <div className="font-mono text-cyan-400 text-[11px] font-medium">
                            {step.time}
                          </div>
                        )}
                        <div className="text-slate-300 font-medium leading-relaxed">
                          {step.isRed ? (
                            <span>
                              已识别到 <span className="text-rose-400 font-bold">{eventType}</span> 事件
                            </span>
                          ) : (
                            step.text
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Action Buttons: 违规 (Red) & 误报 (Blue) */}
            <div className="bg-[#0d1629] rounded-xl border border-cyan-500/20 shadow-2xl p-4 flex items-center justify-center gap-4">
              <button
                onClick={handleConfirmViolation}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold tracking-wider shadow-md transition active:scale-95"
              >
                违规
              </button>

              <button
                onClick={handleMarkFalseAlarm}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider shadow-md transition active:scale-95"
              >
                误报
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
