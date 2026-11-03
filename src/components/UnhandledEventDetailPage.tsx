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
  CheckCircle2,
  XCircle,
  X,
  Camera,
  CornerUpLeft,
  Archive,
  Info,
  Megaphone,
  Share2,
  Send,
  UserCheck,
  Truck,
  Layers,
  Clock,
  Radio
} from 'lucide-react';
import { UnhandledEvent } from './EventManagementPage';

interface UnhandledEventDetailPageProps {
  event?: UnhandledEvent;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDispatch: (event: UnhandledEvent) => void;
  onTransferThirdParty: (event: UnhandledEvent, platformName: string, notes: string) => void;
  onMarkFalseAlarm?: (eventId: string, reason: string) => void;
  currentIndex?: number;
  totalCount?: number;
}

export const UnhandledEventDetailPage: React.FC<UnhandledEventDetailPageProps> = ({
  event,
  onBack,
  onPrev,
  onNext,
  onDispatch,
  onTransferThirdParty,
  onMarkFalseAlarm: _onMarkFalseAlarm,
  currentIndex = 1,
  totalCount = 18
}) => {
  // Tabs: 事件抓拍 | 实时监控 | 历史视频
  const [activeTab, setActiveTab] = useState<'snapshot' | 'live' | 'history'>('snapshot');

  // Selected thumbnail index from the left frame strip (0 to 4)
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(3); // default 10:31:09

  // Workflow status
  const [currentStatus, setCurrentStatus] = useState<string>('预警中');
  const [verificationResult, setVerificationResult] = useState<string>('违规');
  const [assignee, setAssignee] = useState<string>('未关联');

  // Modals state
  const [isRemoteNotifyModalOpen, setIsRemoteNotifyModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isThirdPartyModalOpen, setIsThirdPartyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Remote Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState(
    '南宁智慧城管现场警示：粤B·2N66V车主您好，您所停放的机动车已严重占压黄色禁停网格线及人行通道，请在5分钟内立即驶离，逾期交警部门将依法实施清障拖移。'
  );
  const [broadcastVolume, setBroadcastVolume] = useState(85);
  const [broadcastRepeats, setBroadcastRepeats] = useState('3');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Dispatch Form State
  const [dispatchDepartment, setDispatchDepartment] = useState('青秀区城市管理综合行政执法大队');
  const [dispatchTargetType, setDispatchTargetType] = useState<'officer' | 'car' | 'grid'>('officer');
  const [dispatchDeadline, setDispatchDeadline] = useState<'30m' | '1h' | '2h' | 'today'>('1h');
  const [dispatchInstructions, setDispatchInstructions] = useState('请携带执法记录仪立即赶赴现场进行劝离处置，依法取证规范处置并拍照回传系统。');

  // Third Party Form State
  const [selectedPlatform, setSelectedPlatform] = useState('南宁市公安交警集成指挥调度平台');
  const [thirdPartyNotes, setThirdPartyNotes] = useState(
    '根据现场AI抓拍，该粤B·2N66V车辆占用人行通道及黄色禁停区，提请交警部门依法拖移清理并跟进非现场处罚。'
  );

  // Timeline steps matching the screenshot with recent timestamps (2026-10-19)
  const [timelineSteps, setTimelineSteps] = useState<Array<{
    time: string;
    text: string;
    subText?: string;
    isDone: boolean;
    isRedHighlight?: string;
  }>>([
    {
      time: '2026-10-19 15:19:35',
      text: '已识别到 机动车乱停放 事件',
      isRedHighlight: '机动车乱停放',
      isDone: true
    },
    {
      time: '2026-10-19 15:20:36',
      text: '王明 已对事件进行 违规 处理',
      subText: '备注：此事件属于违规事件',
      isRedHighlight: '违规',
      isDone: true
    }
  ]);

  // Video play state for live/history
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Field values with recent dates (2026-10-19) matching screenshot
  const eventId = event?.id ? event.id.replace('SJ-', '').replace(/-/g, '') : '2026101900002';
  const eventType = event?.subType || '机动车乱停放';
  const cameraName = 'C201摄像头';
  const alertCamera = 'C204摄像头';
  const plateNumber = '粤B·2N66V';
  const locationText = event?.address || '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府13栋';
  const startTime = '2026-10-19 15:19:35';
  const osdTime = '2026-10-19 13:01:13 星期一';
  const lng = '108.376026';
  const lat = '22.770844';

  // 5 Consecutive Surveillance Frames on the left strip with recent times
  const frameThumbnails = [
    { id: 0, time: '2026-10-19 10:31:12', label: '10:31:12' },
    { id: 1, time: '2026-10-19 10:31:11', label: '10:31:11' },
    { id: 2, time: '2026-10-19 10:31:10', label: '10:31:10' },
    { id: 3, time: '2026-10-19 10:31:09', label: '10:31:09' },
    { id: 4, time: '2026-10-19 10:31:08', label: '10:31:08' },
  ];

  // Handle Execute Remote Notification Broadcast
  const handleConfirmRemoteBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setIsRemoteNotifyModalOpen(false);
      showToast('远程语音广播已成功向C201摄像头现场音柱下发播放指令！');
      setTimelineSteps(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
          text: `指挥席位已执行【远程广播通知】，现场音柱播放车主违规劝离提示`,
          isDone: true
        }
      ]);
    }, 800);
  };

  // Handle Internal Dispatch (Green Button)
  const handleConfirmDispatch = () => {
    setIsDispatchModalOpen(false);
    setCurrentStatus('处置中');
    setAssignee('良庆网格执勤二组');
    setTimelineSteps(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        text: `已指派【${dispatchDepartment}】到场处置，时限 ${dispatchDeadline}`,
        isDone: true
      }
    ]);
    showToast(`工单已成功指派至执勤力量，状态流转为【处置中】！`);
    if (event) {
      onDispatch(event);
    }
  };

  // Handle Third Party Platform Disposition (Blue Button)
  const handleConfirmThirdParty = () => {
    setIsThirdPartyModalOpen(false);
    setCurrentStatus('已转办第三方');
    setAssignee(selectedPlatform);
    const thirdPartyOrderId = `TP-${Date.now().toString().slice(-6)}`;
    setTimelineSteps(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        text: `已成功推送至【${selectedPlatform}】，受理编号：${thirdPartyOrderId}`,
        isDone: true
      }
    ]);
    showToast(`工单已成功推送至【${selectedPlatform}】进行协同处置！`);
    if (event) {
      onTransferThirdParty(event, selectedPlatform, thirdPartyNotes);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-y-auto font-sans">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1890ff] text-white text-xs px-5 py-2.5 rounded shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Header Breadcrumb: ← 返回 | 待处置 (unified dark style) */}
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
            待处置
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
            title="上一条待处置工单"
            className="hidden xl:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 text-white items-center justify-center backdrop-blur-xs transition shadow-md active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Navigation Button */}
        {onNext && (
          <button
            onClick={onNext}
            title="下一条待处置工单"
            className="hidden xl:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/25 hover:bg-black/50 text-white items-center justify-center backdrop-blur-xs transition shadow-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Main Content Grid: Left/Center Section & Right Sidebar Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* ================= LEFT & CENTER COLUMN (9 Cols) ================= */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Top Big Card: Tabs + Left Thumbnails + Main Viewport + 3 Detail Crops + 远程通知按钮 */}
            <div className="bg-[#0b1324] rounded-md border border-cyan-500/20 shadow-lg p-4 flex flex-col">
              
              {/* Tab Navigation Header: 事件抓拍 | 实时监控 | 历史视频 */}
              <div className="flex items-center border-b border-slate-800 mb-3.5">
                <button
                  onClick={() => setActiveTab('snapshot')}
                  className={`px-6 py-2 text-sm font-bold transition-all relative ${
                    activeTab === 'snapshot'
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
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
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
                      : 'text-slate-400 hover:text-slate-200'
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
                
                {/* 1. Left Vertical Frame Thumbnails Strip (5 items with recent timestamps) */}
                <div className="w-full md:w-[130px] shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                  {frameThumbnails.map((frame, index) => {
                    const isSelected = selectedFrameIndex === index;
                    return (
                      <div
                        key={frame.id}
                        onClick={() => setSelectedFrameIndex(index)}
                        className={`cursor-pointer rounded-xs border transition-all overflow-hidden bg-slate-900 flex-1 md:flex-none ${
                          isSelected
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                            : 'border-slate-700 hover:border-cyan-400/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {/* Mini snapshot graphic */}
                        <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
                          <svg className="w-full h-full" viewBox="0 0 160 100">
                            <rect width="160" height="100" fill="#334155" />
                            <rect x="0" y="0" width="160" height="30" fill="#1e293b" />
                            <polygon points="40,95 140,95 125,25 65,25" fill="#475569" />
                            {/* parked cars */}
                            <rect x="75" y="45" width="45" height="25" rx="3" fill="#cbd5e1" />
                            <rect x="95" y="28" width="35" height="18" rx="2" fill="#94a3b8" />
                            <rect x="15" y="48" width="40" height="28" rx="3" fill="#991b1b" />
                            {/* AI red box */}
                            <rect x="70" y="40" width="55" height="35" fill="none" stroke="#f43f5e" strokeWidth="2" />
                            {/* Yellow perspective region */}
                            <polygon points="65,92 135,92 120,32 90,32" fill="rgba(234, 179, 8, 0.1)" stroke="#eab308" strokeWidth="1.2" />
                          </svg>
                          <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/70 text-[8px] text-white font-mono scale-90">
                            帧 #{index + 1}
                          </div>
                        </div>
                        {/* Timestamp below thumbnail */}
                        <div className="py-1 px-1 text-center bg-[#070e1c] text-[10px] font-mono text-slate-300 leading-tight border-t border-slate-800">
                          {frame.time}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Center Main Surveillance Image / Video Player */}
                <div className="flex-1 relative aspect-[16/10] bg-slate-950 rounded-xs overflow-hidden border border-slate-300 shadow-inner flex flex-col justify-between">
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
                        <line x1="0" y1="200" x2="295" y2="200" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="270" x2="300" y2="270" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="360" x2="305" y2="360" stroke="#475569" strokeWidth="2" />
                        <line x1="0" y1="440" x2="308" y2="440" stroke="#475569" strokeWidth="2" />

                        {/* Pedestrians walking on left sidewalk */}
                        <g transform="translate(180, 160) scale(0.65)">
                          <circle cx="20" cy="20" r="12" fill="#fde047" />
                          <path d="M 8 32 L 32 32 L 28 85 L 12 85 Z" fill="#eab308" />
                          <line x1="15" y1="85" x2="15" y2="120" stroke="#1e293b" strokeWidth="5" />
                          <line x1="25" y1="85" x2="25" y2="120" stroke="#1e293b" strokeWidth="5" />

                          <g transform="translate(35, 10)">
                            <circle cx="20" cy="20" r="11" fill="#f87171" />
                            <path d="M 8 31 L 32 31 L 30 75 L 10 75 Z" fill="#1e293b" />
                            <line x1="14" y1="75" x2="14" y2="110" stroke="#334155" strokeWidth="4" />
                            <line x1="24" y1="75" x2="24" y2="110" stroke="#334155" strokeWidth="4" />
                          </g>
                        </g>

                        {/* Street asphalt on right */}
                        <polygon points="290,150 800,150 800,500 310,500" fill="#334155" />
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

                        {/* YELLOW PERSPECTIVE NO-PARKING ZONE POLYGON (matching screenshot) */}
                        <polygon
                          points="335,480 610,480 545,190 475,190"
                          fill="rgba(234, 179, 8, 0.08)"
                          stroke="#eab308"
                          strokeWidth="2.5"
                        />

                        {/* Central Violating Silver Audi Sedan (粤B·2N66V) */}
                        <g transform="translate(400, 245)">
                          <path
                            d="M 15 135 L 35 48 C 45 28, 120 28, 130 48 L 150 135 Z"
                            fill="#cbd5e1"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                          />
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
                          <ellipse cx="22" cy="138" rx="12" ry="16" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                          <ellipse cx="144" cy="138" rx="12" ry="16" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                          <line x1="25" y1="125" x2="105" y2="15" stroke="#facc15" strokeWidth="3" />
                        </g>

                        {/* RED AI BOUNDING BOX AROUND AUDI SEDAN */}
                        <rect
                          x="405"
                          y="245"
                          width="160"
                          height="160"
                          fill="rgba(244, 63, 94, 0.08)"
                          stroke="#f43f5e"
                          strokeWidth="3"
                        />

                        {/* Foreground Red Vehicle Corner */}
                        <g transform="translate(190, 310)">
                          <path d="M 50 190 L 120 40 L 290 85 L 280 190 Z" fill="#7f1d1d" stroke="#991b1b" strokeWidth="3" />
                          <polygon points="125,50 270,90 240,15 135,15" fill="#1e293b" opacity="0.85" />
                          <ellipse cx="105" cy="55" rx="14" ry="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
                        </g>

                        {/* Right Foreground Tree Trunk */}
                        <rect x="710" y="120" width="80" height="380" fill="#422006" stroke="#291305" strokeWidth="2" />
                        <ellipse cx="700" cy="460" rx="45" ry="15" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                      </svg>

                      {/* Top-Right Camera Timestamp OSD (Recent: 2026-10-19) */}
                      <div className="absolute top-3 right-4 z-10 text-white font-mono text-xs md:text-sm font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                        <span>{osdTime}</span>
                      </div>

                      {/* Bottom-Left Camera Location Badge */}
                      <div className="absolute bottom-3 left-3 z-10 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-white text-xs font-medium flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{cameraName}</span>
                        <span className="text-slate-400 font-mono text-[11px] ml-1">
                          {frameThumbnails[selectedFrameIndex]?.time || '2026-10-19 10:31:09'}
                        </span>
                      </div>

                      {/* Bottom-Right Fullscreen Icon */}
                      <button
                        title="全屏查看"
                        className="absolute bottom-3 right-3 z-10 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : activeTab === 'live' ? (
                    /* Live CCTV Stream View */
                    <div className="w-full h-full flex flex-col justify-between p-4 relative bg-slate-900 text-white">
                      <div className="flex items-center justify-between z-10 bg-black/60 px-3 py-1.5 rounded">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="font-bold text-rose-400">LIVE</span>
                          <span>|</span>
                          <span>{alertCamera} - 实时高清视频流</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300">
                          1080P @ 25FPS · H.265
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-2 z-10">
                        <Camera className="w-12 h-12 text-cyan-400 animate-pulse" />
                        <div className="text-sm font-medium text-slate-200">
                          {cameraName} 正在持续回传实时路况
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          当前区域持续监控中，待指派责任处置力量到场
                        </div>
                      </div>

                      <div className="flex items-center justify-between z-10 bg-black/60 px-3 py-1.5 rounded text-xs">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-1 hover:text-cyan-400 flex items-center gap-1"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span className="font-mono text-slate-400">实时直播</span>
                        </button>
                        <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                      </div>
                    </div>
                  ) : (
                    /* History Playback View */
                    <div className="w-full h-full flex flex-col justify-center items-center text-center p-6 bg-slate-900 text-white">
                      <Play className="w-12 h-12 text-blue-400 mb-2" />
                      <div className="text-sm font-semibold">事发录像切片存证已固化</div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        {startTime} ~ 15:25:00 (可供行政执法证据调取)
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Right 3 Crop Detail Tiles + 远程通知按钮 (matching screenshot exactly!) */}
                <div className="w-full md:w-[150px] shrink-0 flex md:flex-col gap-2.5 justify-between">
                  {/* Crop 1: Car Rear Perspective */}
                  <div className="flex-1 rounded-xs border border-slate-300 overflow-hidden bg-slate-900 relative shadow-inner aspect-[16/10] md:aspect-auto">
                    <svg className="w-full h-full" viewBox="0 0 150 90">
                      <rect width="150" height="90" fill="#334155" />
                      <path d="M 20 85 L 35 25 C 45 10, 105 10, 115 25 L 130 85 Z" fill="#cbd5e1" stroke="#94a3b8" />
                      <line x1="30" y1="80" x2="80" y2="10" stroke="#facc15" strokeWidth="2.5" />
                    </svg>
                    <div className="absolute top-1 left-1 bg-black/70 text-[8px] text-white px-1 rounded font-mono">
                      特征特写 1
                    </div>
                  </div>

                  {/* Crop 2: License Plate Zoom (粤B·2N66V with Audi 4 rings) */}
                  <div className="flex-1 rounded-xs border border-slate-300 overflow-hidden bg-slate-900 relative shadow-inner flex flex-col items-center justify-center p-2 aspect-[16/10] md:aspect-auto">
                    <svg className="w-full h-full" viewBox="0 0 150 90">
                      <rect width="150" height="90" fill="#cbd5e1" />
                      <g transform="translate(48, 18) scale(0.8)">
                        <circle cx="8" cy="8" r="8" fill="none" stroke="#475569" strokeWidth="1.8" />
                        <circle cx="18" cy="8" r="8" fill="none" stroke="#475569" strokeWidth="1.8" />
                        <circle cx="28" cy="8" r="8" fill="none" stroke="#475569" strokeWidth="1.8" />
                        <circle cx="38" cy="8" r="8" fill="none" stroke="#475569" strokeWidth="1.8" />
                      </g>
                      <rect x="22" y="40" width="106" height="36" rx="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                      <text x="75" y="65" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="bold" fontFamily="monospace">
                        {plateNumber}
                      </text>
                    </svg>
                    <div className="absolute top-1 left-1 bg-black/70 text-[8px] text-white px-1 rounded font-mono">
                      车牌识别
                    </div>
                  </div>

                  {/* Crop 3: Side wheel and road */}
                  <div className="flex-1 rounded-xs border border-slate-300 overflow-hidden bg-slate-900 relative shadow-inner aspect-[16/10] md:aspect-auto">
                    <svg className="w-full h-full" viewBox="0 0 150 90">
                      <rect width="150" height="90" fill="#475569" />
                      <path d="M 0 45 L 150 35 L 150 90 L 0 90 Z" fill="#334155" />
                      <ellipse cx="65" cy="55" rx="28" ry="32" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
                      <circle cx="65" cy="55" r="14" fill="#cbd5e1" />
                    </svg>
                    <div className="absolute top-1 left-1 bg-black/70 text-[8px] text-white px-1 rounded font-mono">
                      压线抓拍
                    </div>
                  </div>

                  {/* 🔊 远程通知 BUTTON FROM SCREENSHOT (Blue button under 3 crops!) */}
                  <button
                    onClick={() => setIsRemoteNotifyModalOpen(true)}
                    className="w-full py-2.5 rounded bg-[#5b96f7] hover:bg-[#3b82f6] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>远程通知</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Bottom Card: 预警信息 + Mini GIS Map (matching screenshot) */}
            <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                <h3 className="font-bold text-sm text-white">预警信息</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left Metadata 7 columns */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                  {/* Row 1 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">事件编号:</span>
                    <span className="text-slate-200 font-mono font-medium">{eventId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">预警摄像头:</span>
                    <span className="text-slate-200 font-medium">{alertCamera}</span>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 shrink-0">违规类型:</span>
                    <span className="text-slate-200 font-medium">{eventType}</span>
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
                    <span className="text-slate-200 font-medium leading-relaxed">
                      {locationText}
                    </span>
                  </div>
                </div>

                {/* Right Mini GIS Map View (5 cols) matching screenshot */}
                <div className="md:col-span-5 rounded-xs border border-slate-700 overflow-hidden relative min-h-[160px] bg-[#090e1c]">
                  <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                    <rect width="320" height="180" fill="#1e293b" />
                    
                    {/* Vertical Jinlong Road */}
                    <rect x="230" y="0" width="30" height="180" fill="#334155" stroke="#475569" strokeWidth="1" />
                    <line x1="245" y1="0" x2="245" y2="180" stroke="#fde047" strokeWidth="2" strokeDasharray="8,4" />

                    {/* Secondary cross streets */}
                    <polygon points="0,50 320,50 320,72 0,72" fill="#334155" stroke="#475569" strokeWidth="1" />
                    <polygon points="0,135 230,135 230,155 0,155" fill="#334155" stroke="#475569" strokeWidth="1" />

                    {/* Green park zones */}
                    <path d="M 270 10 C 300 15, 315 50, 290 80 L 270 80 Z" fill="#064e3b" stroke="#047857" />
                    <path d="M 10 145 C 30 140, 60 150, 70 175 L 10 175 Z" fill="#064e3b" stroke="#047857" />

                    {/* Residential building blocks */}
                    <rect x="30" y="80" width="40" height="30" rx="2" fill="#0f172a" stroke="#334155" />
                    <rect x="85" y="80" width="40" height="30" rx="2" fill="#0f172a" stroke="#334155" />
                    <rect x="140" y="80" width="45" height="30" rx="2" fill="#0f172a" stroke="#334155" />

                    {/* GIS Street Labels */}
                    <text x="245" y="95" textAnchor="middle" fill="#94a3b8" fontSize="7" transform="rotate(90 245 95)">
                      金龙路
                    </text>
                    <text x="110" y="64" textAnchor="middle" fill="#94a3b8" fontSize="7">
                      云星钱隆首府社区内街
                    </text>

                    {/* Red Location Marker Pin on Coordinates */}
                    <g transform="translate(222, 115)">
                      <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.2" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#ef4444" opacity="0.4" />
                      <path
                        d="M 0 -18 C -7 -18 -11 -12 -11 -6 C -11 3 0 10 0 10 C 0 10 11 3 11 -6 C 11 -12 7 -18 0 -18 Z"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle cx="0" cy="-7" r="3.5" fill="#ffffff" />
                    </g>
                  </svg>

                  <div className="absolute bottom-1 right-1 bg-slate-900/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 shadow-xs border border-slate-700">
                    良庆区 · 金龙路8号
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR COLUMN (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* 1. 事件状态 Card (matching screenshot) */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                  <h3 className="font-bold text-sm text-white">事件状态</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  {/* 预警状态 */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">预警状态</div>
                    <div className="text-xs font-bold text-rose-400">
                      {currentStatus}
                    </div>
                  </div>

                  {/* 核实情况 */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">核实情况</div>
                    <div className="text-xs font-bold text-rose-400">
                      {verificationResult}
                    </div>
                  </div>

                  {/* 责任主体 (未关联 with blue link icon, matching screenshot) */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">责任主体</div>
                    <div className="text-xs font-medium text-amber-400 flex items-center justify-center gap-1 cursor-pointer hover:underline">
                      <span>{assignee}</span>
                      <LinkIcon className="w-3 h-3 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 事件流程 Card (matching screenshot: 2 steps!) */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                  <h3 className="font-bold text-sm text-white">事件流程</h3>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-5 py-1">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0 border-l border-dashed border-slate-700" />

                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot Icon */}
                      <div className="absolute -left-6 top-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 flex items-center justify-center ring-4 ring-cyan-950" />
                      </div>

                      {/* Timeline Content */}
                      <div className="text-xs space-y-0.5">
                        {step.time && (
                          <div className="font-mono text-cyan-400 text-[11px] font-medium">
                            {step.time}
                          </div>
                        )}
                        <div className="text-slate-200 font-medium leading-relaxed">
                          {step.isRedHighlight ? (
                            <span>
                              {step.text.split(step.isRedHighlight).map((part, i, arr) => (
                                <React.Fragment key={i}>
                                  {part}
                                  {i < arr.length - 1 && (
                                    <span className="text-rose-400 font-bold">{step.isRedHighlight}</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </span>
                          ) : (
                            step.text
                          )}
                        </div>
                        {step.subText && (
                          <div className="text-[11px] text-slate-300 bg-[#090e1c] p-1.5 rounded border border-slate-700 mt-1">
                            {step.subText}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Action Buttons: 处置 (Green) & 第三方平台处置 (Blue) (matching screenshot exactly!) */}
            <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 flex items-center justify-center gap-3">
              {/* 处置 Button (Green on left) */}
              <button
                onClick={() => setIsDispatchModalOpen(true)}
                className="flex-1 py-2.5 rounded-xs bg-[#2e9e66] hover:bg-[#15803d] text-white text-xs font-bold tracking-wider shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>处置</span>
              </button>

              {/* 第三方平台处置 Button (Blue on right) */}
              <button
                onClick={() => setIsThirdPartyModalOpen(true)}
                className="flex-1 py-2.5 rounded-xs bg-[#4080ff] hover:bg-[#2563eb] text-white text-xs font-bold tracking-wider shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>第三方平台处置</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 4. MODAL 1: 🔊 远程通知 (Voice Loudspeaker Broadcast Modal) */}
      {isRemoteNotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/30 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  现场监控音柱 · 远程喊话与语音播报通知
                </h3>
              </div>
              <button onClick={() => setIsRemoteNotifyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-200">
              <div className="bg-[#090e1c] p-3 rounded border border-slate-700 space-y-1">
                <div className="text-slate-400">联动设备：</div>
                <div className="font-bold text-slate-100">{cameraName}（金龙路8号智能音柱 #SPK-02）</div>
                <div className="text-[11px] text-cyan-400 font-mono">目标车辆：{plateNumber} · 违规占用人行禁停网格线</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">播报内容模板 / 自定义喊话内容：</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-xs focus:outline-hidden focus:border-cyan-500 text-slate-100 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">喇叭广播音量 (当前 {broadcastVolume}%)</label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={broadcastVolume}
                    onChange={(e) => setBroadcastVolume(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">播报频次</label>
                  <select
                    value={broadcastRepeats}
                    onChange={(e) => setBroadcastRepeats(e.target.value)}
                    className="w-full bg-[#090e1c] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="1">单次播报 (立即提醒)</option>
                    <option value="3">连续播报 3 次 (标准规范)</option>
                    <option value="loop">间隔 2 分钟循环播报 (严重阻塞)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsRemoteNotifyModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                >
                  取消
                </button>
                <button
                  disabled={isBroadcasting}
                  onClick={handleConfirmRemoteBroadcast}
                  className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isBroadcasting ? '正在向音柱推流中...' : '立即现场喊话广播'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: 处置 (Internal Dispatch Modal) */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/30 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  指派执勤力量处置 · {eventId}
                </h3>
              </div>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-200">
              <div className="bg-[#090e1c] p-3 rounded border border-slate-700 space-y-1">
                <div className="font-semibold text-slate-100">{locationText}</div>
                <div className="text-[11px] text-cyan-400 font-mono">违规类型：{eventType} · 号牌：{plateNumber}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">指定承办部门 / 执法中队</label>
                <select
                  value={dispatchDepartment}
                  onChange={(e) => setDispatchDepartment(e.target.value)}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                >
                  <option value="良庆区城市管理综合行政执法大队 (蟠龙中队)">良庆区城市管理综合行政执法大队 (蟠龙中队)</option>
                  <option value="青秀区城市管理综合行政执法大队 (民族中队)">青秀区城市管理综合行政执法大队 (民族中队)</option>
                  <option value="西乡塘区城市管理综合行政执法大队 (衡阳中队)">西乡塘区城市管理综合行政执法大队 (衡阳中队)</option>
                  <option value="江南区城市管理综合行政执法大队">江南区城市管理综合行政执法大队</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">指派执勤力量</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('officer')}
                    className={`p-2 rounded border text-center transition ${
                      dispatchTargetType === 'officer'
                        ? 'bg-blue-900/40 border-blue-500 text-cyan-300 font-bold'
                        : 'bg-[#090e1c] border-slate-700 text-slate-400'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span>网格执法队员</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('car')}
                    className={`p-2 rounded border text-center transition ${
                      dispatchTargetType === 'car'
                        ? 'bg-blue-900/40 border-blue-500 text-cyan-300 font-bold'
                        : 'bg-[#090e1c] border-slate-700 text-slate-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span>巡逻执勤车辆</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('grid')}
                    className={`p-2 rounded border text-center transition ${
                      dispatchTargetType === 'grid'
                        ? 'bg-blue-900/40 border-blue-500 text-cyan-300 font-bold'
                        : 'bg-[#090e1c] border-slate-700 text-slate-400'
                    }`}
                  >
                    <Layers className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span>网格责任单位</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">规定办结时限</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '30m', label: '30分钟 (特急)' },
                    { id: '1h', label: '1小时 (标准)' },
                    { id: '2h', label: '2小时内' },
                    { id: 'today', label: '当日办结' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDispatchDeadline(d.id as any)}
                      className={`py-1.5 px-2 rounded border text-center text-[11px] transition ${
                        dispatchDeadline === d.id
                          ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#090e1c] border-slate-700 text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">处置规范要求与批示说明</label>
                <textarea
                  rows={2}
                  value={dispatchInstructions}
                  onChange={(e) => setDispatchInstructions(e.target.value)}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] text-slate-300 border border-slate-700 text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDispatch}
                  className="px-5 py-1.5 rounded bg-[#2e9e66] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>确认下发处置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: 第三方平台处置 (Third-party Platform Disposition Modal) */}
      {isThirdPartyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/30 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  第三方平台协同处置 · {eventId}
                </h3>
              </div>
              <button onClick={() => setIsThirdPartyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-200">
              <div className="bg-[#090e1c] p-3 rounded border border-slate-700 space-y-1">
                <div className="font-semibold text-slate-100">{locationText}</div>
                <div className="text-[11px] text-cyan-400 font-mono">违规事项：{eventType} · 车牌：{plateNumber}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">目标第三方协同处置平台</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                >
                  <option value="南宁市公安交警集成指挥调度平台">南宁市公安交警集成指挥调度平台 (推荐 - 违停拖车与处罚)</option>
                  <option value="南宁市12345便民服务热线联动系统">南宁市12345便民服务热线联动系统</option>
                  <option value="数字市政基础设施应急管养系统">数字市政基础设施应急管养系统</option>
                  <option value="市生态环境局移动综合监管预警平台">市生态环境局移动综合监管预警平台</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">推送说明与协同要求备注</label>
                <textarea
                  rows={3}
                  value={thirdPartyNotes}
                  onChange={(e) => setThirdPartyNotes(e.target.value)}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs resize-none"
                />
              </div>

              <div className="bg-[#090e1c] p-2.5 rounded border border-cyan-500/30 text-[11px] text-cyan-300 space-y-0.5">
                <div className="font-semibold">已自动附带数据证据包：</div>
                <div>• 2 张现场原尺寸抓拍水印图、车牌识别特征包</div>
                <div>• 经纬度定位（108.376026, 22.770844）及违章时段录像切片</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsThirdPartyModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] text-slate-300 border border-slate-700 text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmThirdParty}
                  className="px-5 py-1.5 rounded bg-[#4080ff] hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>确认推送到第三方平台</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
