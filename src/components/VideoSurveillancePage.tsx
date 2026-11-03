import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Search,
  RefreshCw,
  Eye,
  Crosshair,
  ShieldAlert,
  Mic,
  MicOff,
  Sun,
  Droplets,
  BellRing,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ZoomIn,
  ZoomOut,
  Focus,
  Aperture,
  Calendar,
  FastForward,
  Rewind,
  Download,
  Share2,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Tv,
  List,
  Filter,
  Truck
} from 'lucide-react';
import { CameraDevice, AppTheme } from '../types';

interface VideoSurveillancePageProps {
  onBackToHome: () => void;
  onOpenAlerts?: () => void;
  onNavigateToPatrol?: () => void;
  theme?: AppTheme;
}

// Tree node definition
interface ChannelNode {
  id: string;
  name: string;
  code: string;
  type: 'ball' | 'gun' | 'eagle' | 'ai';
  quality: '4K' | '1080P' | '2K';
  status: 'online' | 'alert' | 'offline';
  alertDesc?: string;
  street: string;
  ip: string;
  bitrate: string;
  fps: number;
  presets: string[];
}

interface AreaGroup {
  id: string;
  name: string;
  count: number;
  onlineCount: number;
  channels: ChannelNode[];
}

const SURVEILLANCE_GROUPS: AreaGroup[] = [
  {
    id: 'grp-1',
    name: '蟠龙街道综合网格',
    count: 6,
    onlineCount: 6,
    channels: [
      {
        id: 'CAM-PL-01',
        name: '01-金龙路与歌海路交汇球机',
        code: 'IPC-GX-NN-0421',
        type: 'ball',
        quality: '4K',
        status: 'alert',
        alertDesc: '机动车占用非机动车道',
        street: '蟠龙街道·金龙路',
        ip: '10.128.45.18',
        bitrate: '4.6 Mbps',
        fps: 25,
        presets: ['01-十字路口全景', '02-斑马线特写', '03-商铺违停角', '04-高空俯瞰'],
      },
      {
        id: 'CAM-PL-02',
        name: '02-云星钱隆首府西门全景枪机',
        code: 'IPC-GX-NN-0422',
        type: 'gun',
        quality: '4K',
        status: 'online',
        street: '蟠龙街道·金龙路8号',
        ip: '10.128.45.19',
        bitrate: '4.2 Mbps',
        fps: 30,
        presets: ['01-大门出入口', '02-消防通道口', '03-外围非机动车点'],
      },
      {
        id: 'CAM-PL-03',
        name: '03-五象大道地铁C口全景监控',
        code: 'IPC-GX-NN-0425',
        type: 'ball',
        quality: '1080P',
        status: 'online',
        street: '蟠龙街道·五象大道',
        ip: '10.128.45.23',
        bitrate: '2.8 Mbps',
        fps: 25,
        presets: ['01-地铁出入口', '02-共享单车停放区', '03-人行过街天桥'],
      },
      {
        id: 'CAM-PL-04',
        name: '04-体强路商业街高空鹰眼',
        code: 'IPC-GX-NN-0430',
        type: 'eagle',
        quality: '4K',
        status: 'alert',
        alertDesc: '出店占道经营聚集',
        street: '蟠龙街道·体强路',
        ip: '10.128.45.31',
        bitrate: '5.1 Mbps',
        fps: 30,
        presets: ['01-商业步道俯览', '02-沿街外摆监测点', '03-外卖骑手聚集点'],
      },
      {
        id: 'CAM-PL-05',
        name: '05-凯旋路与飞龙路交叉口枪机',
        code: 'IPC-GX-NN-0433',
        type: 'gun',
        quality: '1080P',
        status: 'online',
        street: '蟠龙街道·凯旋路',
        ip: '10.128.45.34',
        bitrate: '2.4 Mbps',
        fps: 25,
        presets: ['01-北向车流', '02-南向车流'],
      },
      {
        id: 'CAM-PL-06',
        name: '06-总部基地二期地下车库出入口',
        code: 'IPC-GX-NN-0438',
        type: 'gun',
        quality: '1080P',
        status: 'online',
        street: '蟠龙街道·云英路',
        ip: '10.128.45.40',
        bitrate: '2.5 Mbps',
        fps: 25,
        presets: ['01-地库坡道', '02-道闸立杆'],
      },
    ],
  },
  {
    id: 'grp-2',
    name: '玉洞街道综合网格',
    count: 4,
    onlineCount: 4,
    channels: [
      {
        id: 'CAM-YD-01',
        name: '07-凤凰路农贸市场主入口球机',
        code: 'IPC-GX-NN-0511',
        type: 'ball',
        quality: '4K',
        status: 'alert',
        alertDesc: '商贩流动游商占道',
        street: '玉洞街道·凤凰路',
        ip: '10.128.46.12',
        bitrate: '4.3 Mbps',
        fps: 25,
        presets: ['01-市场大门', '02-卸货通道', '03-流动摊贩常发区'],
      },
      {
        id: 'CAM-YD-02',
        name: '08-玉洞大道立交桥南卡口测速',
        code: 'IPC-GX-NN-0518',
        type: 'gun',
        quality: '4K',
        status: 'online',
        street: '玉洞街道·玉洞大道',
        ip: '10.128.46.20',
        bitrate: '4.8 Mbps',
        fps: 30,
        presets: ['01-主线1车道', '02-主线2车道', '03-应急车道'],
      },
      {
        id: 'CAM-YD-03',
        name: '09-玉象路康岭路口人行道',
        code: 'IPC-GX-NN-0524',
        type: 'gun',
        quality: '1080P',
        status: 'online',
        street: '玉洞街道·玉象路',
        ip: '10.128.46.28',
        bitrate: '2.6 Mbps',
        fps: 25,
        presets: ['01-人行道全景', '02-盲道监控'],
      },
      {
        id: 'CAM-YD-04',
        name: '10-玉龙社区党群服务中心外立面',
        code: 'IPC-GX-NN-0530',
        type: 'ball',
        quality: '1080P',
        status: 'online',
        street: '玉洞街道·玉龙路',
        ip: '10.128.46.35',
        bitrate: '2.5 Mbps',
        fps: 25,
        presets: ['01-广场活动区', '02-便民停车场'],
      },
    ],
  },
  {
    id: 'grp-3',
    name: '重点防范与水文专项',
    count: 4,
    onlineCount: 3,
    channels: [
      {
        id: 'CAM-SP-01',
        name: '11-总部基地金融岛超高空全景鹰眼',
        code: 'IPC-GX-NN-0801',
        type: 'eagle',
        quality: '4K',
        status: 'online',
        street: '蟠龙街道·金融岛顶层',
        ip: '10.128.48.05',
        bitrate: '8.2 Mbps',
        fps: 30,
        presets: ['01-全域天际线', '02-五象大桥全览', '03-南宁大桥全景', '04-邕江两岸'],
      },
      {
        id: 'CAM-SP-02',
        name: '12-良庆河防汛水文监测站',
        code: 'IPC-GX-NN-0809',
        type: 'ai',
        quality: '4K',
        status: 'online',
        street: '良庆区·良庆河堤段',
        ip: '10.128.48.14',
        bitrate: '3.9 Mbps',
        fps: 25,
        presets: ['01-水位警戒标尺', '02-排水闸口', '03-亲水步道'],
      },
      {
        id: 'CAM-SP-03',
        name: '13-歌海路夜市摊群核心监管球机',
        code: 'IPC-GX-NN-0815',
        type: 'ball',
        quality: '4K',
        status: 'alert',
        alertDesc: '油烟直排/外摆超规',
        street: '蟠龙街道·歌海路',
        ip: '10.128.48.22',
        bitrate: '4.5 Mbps',
        fps: 25,
        presets: ['01-夜市主道', '02-垃圾分类桶点', '03-油烟收集口'],
      },
      {
        id: 'CAM-SP-04',
        name: '14-建设路小学东侧人行天桥',
        code: 'IPC-GX-NN-0820',
        type: 'gun',
        quality: '1080P',
        status: 'offline',
        street: '建设街道·建设路',
        ip: '10.128.48.30',
        bitrate: '0.0 Mbps',
        fps: 0,
        presets: ['01-校门口斑马线'],
      },
    ],
  },
];

export const VideoSurveillancePage: React.FC<VideoSurveillancePageProps> = ({
  onBackToHome,
  onOpenAlerts,
  onNavigateToPatrol,
  theme = 'tactical-dark',
}) => {
  // Current recent clock timestamp: 2026-10-19
  const [currentDateStr, setCurrentDateStr] = useState('2026-10-19');
  const [currentTimeStr, setCurrentTimeStr] = useState('10:48:22');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Keep date as recent 2026-10-19
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Split-screen grid mode: 1 (single), 4 (2x2), 9 (3x3), 16 (4x4)
  const [splitMode, setSplitMode] = useState<1 | 4 | 9>(4);

  // Active selected video slot index (0 to splitMode-1)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // Channel mapped to each slot
  const allFlattenChannels = SURVEILLANCE_GROUPS.flatMap((g) => g.channels);
  const [slotChannels, setSlotChannels] = useState<ChannelNode[]>([
    allFlattenChannels[0],
    allFlattenChannels[1],
    allFlattenChannels[2],
    allFlattenChannels[3],
    allFlattenChannels[4],
    allFlattenChannels[5],
    allFlattenChannels[6],
    allFlattenChannels[7],
    allFlattenChannels[8],
  ]);

  // Selected channel in the right PTZ panel is the one in the selected slot
  const activeChannel = slotChannels[selectedSlotIndex] || allFlattenChannels[0];

  // Tree expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'grp-1': true,
    'grp-2': true,
    'grp-3': true,
  });

  // Tree filter search
  const [treeSearch, setTreeSearch] = useState('');
  const [treeStatusFilter, setTreeStatusFilter] = useState<'all' | 'online' | 'alert' | 'offline'>('all');

  // PTZ State
  const [ptzSpeed, setPtzSpeed] = useState<number>(4);
  const [activePtzDirection, setActivePtzDirection] = useState<string | null>(null);
  const [ptzFeedback, setPtzFeedback] = useState<string>('云台就绪 · 待操作');
  const [isWiperActive, setIsWiperActive] = useState(false);
  const [isLightActive, setIsLightActive] = useState(false);
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // AI Overlay toggle
  const [showAiOverlay, setShowAiOverlay] = useState(true);

  // Patrol tour state
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [patrolCountdown, setPatrolCountdown] = useState(10);

  // Playback vs Live Mode
  const [mode, setMode] = useState<'live' | 'playback'>('live');
  const [playbackTime, setPlaybackTime] = useState<string>('10:48:22');
  const [isPlayingPlayback, setIsPlayingPlayback] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');

  // Fullscreen video slot index or null
  const [fullscreenSlot, setFullscreenSlot] = useState<number | null>(null);

  // Audio mute per slot
  const [unmutedSlot, setUnmutedSlot] = useState<number | null>(0);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // PTZ Command trigger
  const handlePtzAction = (action: string) => {
    setActivePtzDirection(action);
    setPtzFeedback(`正在向 [${action}] 方向微调 (速度: ${ptzSpeed}档)...`);
    setTimeout(() => {
      setActivePtzDirection(null);
      setPtzFeedback(`已完成 [${action}] 转向到位`);
    }, 800);
  };

  // Preset recall
  const handleRecallPreset = (preset: string) => {
    setPtzFeedback(`正在调用预置位: ${preset}...`);
    triggerToast(`云台转向预置位: ${preset}`);
    setTimeout(() => {
      setPtzFeedback(`已成功锁定预置位: ${preset}`);
    }, 1200);
  };

  // Auto patrol tour interval
  useEffect(() => {
    if (!isPatrolling) return;
    const tourInterval = setInterval(() => {
      setPatrolCountdown((prev) => {
        if (prev <= 1) {
          // Rotate channels in the active slot
          setSlotChannels((curr) => {
            const next = [...curr];
            const randIdx = Math.floor(Math.random() * allFlattenChannels.length);
            next[selectedSlotIndex] = allFlattenChannels[randIdx];
            return next;
          });
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tourInterval);
  }, [isPatrolling, selectedSlotIndex, allFlattenChannels]);

  // Filter channels in tree
  const filterGroupChannels = (channels: ChannelNode[]) => {
    return channels.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(treeSearch.toLowerCase()) ||
        c.street.toLowerCase().includes(treeSearch.toLowerCase());
      const matchStatus =
        treeStatusFilter === 'all' ||
        (treeStatusFilter === 'online' && c.status !== 'offline') ||
        (treeStatusFilter === 'alert' && c.status === 'alert') ||
        (treeStatusFilter === 'offline' && c.status === 'offline');
      return matchSearch && matchStatus;
    });
  };

  // Select channel from tree into current slot
  const handleSelectChannelToSlot = (channel: ChannelNode) => {
    setSlotChannels((prev) => {
      const next = [...prev];
      next[selectedSlotIndex] = channel;
      return next;
    });
    triggerToast(`通道 [${channel.name}] 已载入窗口 ${selectedSlotIndex + 1}`);
  };

  return (
    <div className="flex-1 w-full h-full bg-[#050811] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Toast notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header Bar */}
      <div className="h-12 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
            title="返回态势大屏"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回大屏</span>
          </button>

          <span className="text-slate-600">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">预警研判</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              智能视频监控全景矩阵
            </h2>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
              IPC MATRIX 4K
            </span>
          </div>
        </div>

        {/* Center Mode Switch: Live vs Playback */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/80">
          <button
            onClick={() => setMode('live')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'live'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${mode === 'live' ? 'animate-pulse text-rose-400' : ''}`} />
            <span>实时监视</span>
          </button>
          <button
            onClick={() => setMode('playback')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
              mode === 'playback'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>录像回放</span>
          </button>
        </div>

        {/* Right Timestamp & Shortcut */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 font-mono text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/20">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentDateStr}</span>
            <span className="text-slate-500">|</span>
            <span className="font-bold">{currentTimeStr}</span>
          </div>

          {onNavigateToPatrol && (
            <button
              onClick={onNavigateToPatrol}
              className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>巡查管理</span>
            </button>
          )}

          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>实时预警工单</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main 3-Column Body */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* ================= LEFT COLUMN: Device Tree ================= */}
        <div className="w-72 bg-[#080d19] border-r border-slate-800 flex flex-col shrink-0">
          {/* Tree Header & Search */}
          <div className="p-3 border-b border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                <span>监控资源目录树</span>
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                14 点位在线
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索点位名称/编码/路段..."
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Status Filter Badges */}
            <div className="flex items-center gap-1 text-[10px]">
              {[
                { id: 'all', label: '全部' },
                { id: 'online', label: '在线' },
                { id: 'alert', label: '告警中' },
                { id: 'offline', label: '离线' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTreeStatusFilter(filter.id as any)}
                  className={`flex-1 py-1 rounded text-center transition ${
                    treeStatusFilter === filter.id
                      ? 'bg-cyan-600 text-white font-bold shadow-xs'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tree Node List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-xs">
            {SURVEILLANCE_GROUPS.map((group) => {
              const visibleChannels = filterGroupChannels(group.channels);
              const isExpanded = expandedGroups[group.id];

              if (visibleChannels.length === 0 && treeSearch) return null;

              return (
                <div key={group.id} className="rounded-lg bg-slate-900/40 border border-slate-800/60 overflow-hidden">
                  {/* Group header */}
                  <div
                    onClick={() =>
                      setExpandedGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                    }
                    className="px-2.5 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <Folder className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold text-slate-200">{group.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {visibleChannels.length} 点位
                    </span>
                  </div>

                  {/* Group channels */}
                  {isExpanded && (
                    <div className="pl-4 pr-1.5 pb-1 space-y-1 border-t border-slate-800/40 pt-1">
                      {visibleChannels.map((channel) => {
                        const isCurrentActive = activeChannel.id === channel.id;
                        return (
                          <div
                            key={channel.id}
                            onClick={() => handleSelectChannelToSlot(channel)}
                            className={`p-2 rounded-md flex flex-col gap-1 cursor-pointer transition ${
                              isCurrentActive
                                ? 'bg-cyan-950/80 border border-cyan-500/50 text-white'
                                : 'hover:bg-slate-800/70 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 truncate">
                                <Video
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    channel.status === 'alert'
                                      ? 'text-rose-400 animate-pulse'
                                      : channel.status === 'offline'
                                      ? 'text-slate-600'
                                      : 'text-cyan-400'
                                  }`}
                                />
                                <span className="font-medium truncate text-xs">{channel.name}</span>
                              </div>
                              <span
                                className={`px-1 py-0.2 rounded text-[9px] font-mono shrink-0 ${
                                  channel.quality === '4K'
                                    ? 'bg-amber-950/70 text-amber-300 border border-amber-600/40'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {channel.quality}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                              <span>{channel.code}</span>
                              {channel.status === 'alert' ? (
                                <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                  预警中
                                </span>
                              ) : channel.status === 'offline' ? (
                                <span className="text-slate-500">离线</span>
                              ) : (
                                <span className="text-emerald-400">在线</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tree Footer Shortcut */}
          <div className="p-2.5 border-t border-slate-800 bg-[#060a14] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>点击通道载入选中窗口</span>
            </span>
            <button
              onClick={() => {
                setSlotChannels(allFlattenChannels.slice(0, 9));
                triggerToast('已重置多路通道排列');
              }}
              className="text-cyan-400 hover:text-cyan-300"
            >
              重置排列
            </button>
          </div>
        </div>

        {/* ================= CENTER COLUMN: Video Wall Matrix ================= */}
        <div className="flex-1 bg-[#060912] flex flex-col overflow-hidden relative">
          {/* Top Video Wall Operations Toolbar */}
          <div className="h-10 bg-[#090f20] border-b border-slate-800 px-3 flex items-center justify-between shrink-0 text-xs">
            {/* Split Screen Selectors */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1">分屏模式:</span>
              <button
                onClick={() => setSplitMode(1)}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                  splitMode === 1
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="单分屏 (1x1)"
              >
                <span>单屏</span>
              </button>
              <button
                onClick={() => setSplitMode(4)}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                  splitMode === 4
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="四分屏 (2x2)"
              >
                <span>4 分屏</span>
              </button>
              <button
                onClick={() => setSplitMode(9)}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                  splitMode === 9
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="九分屏 (3x3)"
              >
                <span>9 分屏</span>
              </button>
            </div>

            {/* Middle Feature Toggles */}
            <div className="flex items-center gap-3">
              {/* AI Detection Overlay Toggle */}
              <button
                onClick={() => setShowAiOverlay(!showAiOverlay)}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                  showAiOverlay
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI智能分析框: {showAiOverlay ? '开启' : '关闭'}</span>
              </button>

              {/* Auto Tour / Patrol Toggle */}
              <button
                onClick={() => {
                  setIsPatrolling(!isPatrolling);
                  triggerToast(isPatrolling ? '已停止轮巡' : '开启多路定时轮巡 (10s/次)');
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                  isPatrolling
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPatrolling ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isPatrolling ? `轮巡中 (${patrolCountdown}s)` : '轮巡巡检'}</span>
              </button>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerToast('已对当前所有窗口执行批量抓拍并存档')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                title="全屏截图"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>批量抓拍</span>
              </button>

              <button
                onClick={() => triggerToast('已启动全通道高清录像存档')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                title="全通道录像"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>全部录像</span>
              </button>

              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="全屏显示"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* The Multi-Screen Video Grid */}
          <div
            className={`flex-1 p-2 gap-2 grid overflow-hidden ${
              splitMode === 1
                ? 'grid-cols-1 grid-rows-1'
                : splitMode === 4
                ? 'grid-cols-2 grid-rows-2'
                : 'grid-cols-3 grid-rows-3'
            }`}
          >
            {Array.from({ length: splitMode }).map((_, slotIdx) => {
              const channel = slotChannels[slotIdx] || allFlattenChannels[0];
              const isSelected = selectedSlotIndex === slotIdx;
              const isUnmuted = unmutedSlot === slotIdx;

              return (
                <div
                  key={slotIdx}
                  onClick={() => setSelectedSlotIndex(slotIdx)}
                  className={`relative rounded-lg overflow-hidden bg-black flex flex-col group border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top OSD Bar */}
                  <div className="absolute top-0 left-0 right-0 z-20 px-2.5 py-1.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white drop-shadow-md">
                        {channel.name}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 drop-shadow-xs">
                        {channel.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-amber-300 drop-shadow-md">
                      <span>{channel.quality}</span>
                      <span className="text-slate-400">·</span>
                      <span>{channel.bitrate}</span>
                      <span className="text-slate-400">·</span>
                      <span>{channel.fps}FPS</span>
                    </div>
                  </div>

                  {/* Dynamic Realistic Surveillance Scene Graphic (SVG / Canvas rendering) */}
                  <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
                    <svg
                      viewBox="0 0 640 360"
                      className="w-full h-full object-cover select-none pointer-events-none"
                    >
                      <defs>
                        <linearGradient id={`skyGrad-${slotIdx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#121b2d" />
                          <stop offset="60%" stopColor="#253549" />
                          <stop offset="100%" stopColor="#3d4e63" />
                        </linearGradient>
                        <linearGradient id={`roadGrad-${slotIdx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2c333e" />
                          <stop offset="100%" stopColor="#1a1e24" />
                        </linearGradient>
                      </defs>

                      {/* Sky & Horizon */}
                      <rect x="0" y="0" width="640" height="150" fill={`url(#skyGrad-${slotIdx})`} />

                      {/* Distant City Skyline & Towers */}
                      <g opacity="0.6">
                        <rect x="40" y="50" width="50" height="100" fill="#1b2434" />
                        <rect x="100" y="30" width="70" height="120" fill="#151e2e" />
                        <rect x="190" y="60" width="45" height="90" fill="#1e293b" />
                        <rect x="250" y="20" width="80" height="130" fill="#0f172a" />
                        <rect x="350" y="55" width="60" height="95" fill="#1c2538" />
                        <rect x="430" y="40" width="75" height="110" fill="#172033" />
                        <rect x="520" y="70" width="80" height="80" fill="#202c40" />
                        {/* Windows glow */}
                        <circle cx="280" cy="45" r="2" fill="#38bdf8" opacity="0.8" />
                        <circle cx="290" cy="65" r="2" fill="#38bdf8" opacity="0.8" />
                        <circle cx="130" cy="55" r="2" fill="#facc15" opacity="0.7" />
                        <circle cx="460" cy="60" r="2" fill="#38bdf8" opacity="0.8" />
                      </g>

                      {/* Tree line & Street Lamps */}
                      <rect x="0" y="145" width="640" height="15" fill="#1e3a2f" opacity="0.8" />
                      {/* Streetlight poles */}
                      <line x1="80" y1="110" x2="80" y2="160" stroke="#64748b" strokeWidth="2" />
                      <line x1="280" y1="105" x2="280" y2="160" stroke="#64748b" strokeWidth="2" />
                      <line x1="480" y1="110" x2="480" y2="160" stroke="#64748b" strokeWidth="2" />
                      <circle cx="80" cy="110" r="4" fill="#fef08a" opacity="0.8" />
                      <circle cx="280" cy="105" r="4" fill="#fef08a" opacity="0.8" />
                      <circle cx="480" cy="110" r="4" fill="#fef08a" opacity="0.8" />

                      {/* Road Ground Perspective */}
                      <polygon
                        points="0,160 640,160 640,360 0,360"
                        fill={`url(#roadGrad-${slotIdx})`}
                      />

                      {/* Sidewalk & Curbs */}
                      <polygon points="0,160 140,160 60,360 0,360" fill="#475569" />
                      <line x1="140" y1="160" x2="60" y2="360" stroke="#cbd5e1" strokeWidth="3" />
                      <polygon points="500,160 640,160 640,360 580,360" fill="#475569" />
                      <line x1="500" y1="160" x2="580" y2="360" stroke="#cbd5e1" strokeWidth="3" />

                      {/* Yellow Center Traffic Dividers */}
                      <line
                        x1="320"
                        y1="160"
                        x2="320"
                        y2="360"
                        stroke="#facc15"
                        strokeWidth="3"
                        strokeDasharray="16 12"
                      />

                      {/* Zebra Crosswalk */}
                      <g opacity="0.4">
                        <polygon points="120,240 520,240 510,252 110,252" fill="#ffffff" />
                        <polygon points="105,260 505,260 495,272 95,272" fill="#ffffff" />
                        <polygon points="90,280 490,280 480,292 80,292" fill="#ffffff" />
                      </g>

                      {/* Traffic Vehicles Scene depending on slot */}
                      {slotIdx % 2 === 0 ? (
                        <>
                          {/* Moving Sedan Car 1 (White Audi SUV) */}
                          <g transform="translate(180, 200)">
                            {/* Car shadow */}
                            <ellipse cx="60" cy="58" rx="65" ry="12" fill="#000000" opacity="0.5" />
                            {/* Car body */}
                            <path
                              d="M 10 40 L 25 22 L 55 18 L 90 22 L 110 42 L 115 54 L 5 54 Z"
                              fill="#f8fafc"
                            />
                            {/* Car windows */}
                            <path
                              d="M 28 24 L 54 21 L 54 38 L 22 38 Z"
                              fill="#0ea5e9"
                              opacity="0.7"
                            />
                            <path
                              d="M 58 21 L 86 24 L 102 38 L 58 38 Z"
                              fill="#0ea5e9"
                              opacity="0.7"
                            />
                            {/* Wheels */}
                            <circle cx="30" cy="54" r="11" fill="#1e293b" />
                            <circle cx="30" cy="54" r="6" fill="#94a3b8" />
                            <circle cx="92" cy="54" r="11" fill="#1e293b" />
                            <circle cx="92" cy="54" r="6" fill="#94a3b8" />
                            {/* License plate */}
                            <rect x="50" y="46" width="22" height="7" fill="#1d4ed8" rx="1" />
                            <text
                              x="61"
                              y="52"
                              fill="#ffffff"
                              fontSize="4"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              粤B·2N66V
                            </text>
                          </g>

                          {/* Commercial Vendor handcart on sidewalk */}
                          <g transform="translate(45, 230)">
                            <rect x="0" y="10" width="40" height="25" fill="#b45309" rx="2" />
                            <circle cx="10" cy="38" r="8" fill="#334155" />
                            <circle cx="30" cy="38" r="8" fill="#334155" />
                            {/* Vendor umbrella */}
                            <path d="M -5 10 Q 20 -15 45 10 Z" fill="#ef4444" />
                          </g>
                        </>
                      ) : (
                        <>
                          {/* Moving City Bus / Patrol vehicle */}
                          <g transform="translate(260, 180)">
                            <ellipse cx="80" cy="72" rx="85" ry="14" fill="#000000" opacity="0.6" />
                            <rect x="5" y="10" width="150" height="60" rx="6" fill="#0284c7" />
                            <rect x="15" y="18" width="130" height="22" rx="2" fill="#e0f2fe" opacity="0.8" />
                            <circle cx="40" cy="70" r="12" fill="#0f172a" />
                            <circle cx="120" cy="70" r="12" fill="#0f172a" />
                            <rect x="130" y="55" width="20" height="6" fill="#f59e0b" rx="1" />
                          </g>
                          {/* Pedestrian on crosswalk */}
                          <g transform="translate(200, 240)">
                            <circle cx="10" cy="10" r="6" fill="#fcd34d" />
                            <rect x="6" y="17" width="8" height="18" fill="#3b82f6" rx="2" />
                            <line x1="8" y1="35" x2="6" y2="52" stroke="#1e293b" strokeWidth="3" />
                            <line x1="12" y1="35" x2="14" y2="52" stroke="#1e293b" strokeWidth="3" />
                          </g>
                        </>
                      )}

                      {/* AI Bounding Boxes & Violation Overlays */}
                      {showAiOverlay && (
                        <>
                          {slotIdx % 2 === 0 ? (
                            <g>
                              {/* Car Detection Box */}
                              <rect
                                x="175"
                                y="210"
                                width="135"
                                height="65"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="2"
                                strokeDasharray="6 3"
                              />
                              {/* Top Tag */}
                              <rect x="175" y="194" width="145" height="16" fill="#f43f5e" rx="2" />
                              <text
                                x="180"
                                y="206"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                fontFamily="sans-serif"
                              >
                                机动车违停 · 98.4%
                              </text>

                              {/* Vendor Detection Box */}
                              <rect
                                x="35"
                                y="215"
                                width="65"
                                height="65"
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="2"
                              />
                              <rect x="35" y="200" width="80" height="15" fill="#eab308" rx="2" />
                              <text
                                x="38"
                                y="212"
                                fill="#000000"
                                fontSize="9"
                                fontWeight="bold"
                              >
                                占道摆卖 · 96.1%
                              </text>
                            </g>
                          ) : (
                            <g>
                              {/* Bus Box */}
                              <rect
                                x="255"
                                y="185"
                                width="165"
                                height="75"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="1.5"
                              />
                              <rect x="255" y="172" width="115" height="14" fill="#06b6d4" rx="2" />
                              <text
                                x="260"
                                y="183"
                                fill="#000000"
                                fontSize="9"
                                fontWeight="bold"
                              >
                                公交客运车辆 · 99.2%
                              </text>
                            </g>
                          )}
                        </>
                      )}

                      {/* Live Scanning Laser Line */}
                      <line
                        x1="0"
                        y1="180"
                        x2="640"
                        y2="180"
                        stroke="#06b6d4"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    </svg>

                    {/* Bottom OSD Timestamp Watermark (Recent 2026-10-19) */}
                    <div className="absolute bottom-2 left-2.5 z-20 font-mono text-[11px] text-white/90 drop-shadow-lg flex items-center gap-2 pointer-events-none">
                      <span className="px-1 py-0.5 rounded bg-black/60 text-cyan-400 font-bold border border-cyan-500/30">
                        REC ●
                      </span>
                      <span className="tracking-wider bg-black/50 px-2 py-0.5 rounded">
                        {currentDateStr} {mode === 'playback' ? playbackTime : currentTimeStr}
                      </span>
                    </div>

                    {/* Window Floating Controls (Hover to see) */}
                    <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md p-1 rounded-lg border border-slate-700/80">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerToast(`已抓拍通道 [${channel.name}] 实时画面`);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition"
                        title="画面抓拍"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerToast(`已对通道 [${channel.name}] 启动本地录像`);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition"
                        title="紧急录像"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUnmutedSlot(isUnmuted ? null : slotIdx);
                        }}
                        className={`p-1 rounded transition ${
                          isUnmuted
                            ? 'text-cyan-400 bg-cyan-950/60'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                        title={isUnmuted ? '静音' : '开启音频'}
                      >
                        {isUnmuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlotIndex(slotIdx);
                          triggerToast(`已锁定通道 [${channel.name}] 到云台控制器`);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition"
                        title="控制该点位云台"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSplitMode(splitMode === 1 ? 4 : 1);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition"
                        title="单屏放大"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= BOTTOM BAR: Timeline / Video Playback ================= */}
          <div className="h-28 bg-[#090e1c] border-t border-slate-800 px-4 py-2 flex flex-col justify-between shrink-0">
            {/* Timeline Header Info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>24小时录像时序轴</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentDateStr} · 选中通道: <span className="text-cyan-300">{activeChannel.name}</span>
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-xs bg-cyan-600" />
                  <span>常规录像 (连续)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-xs bg-rose-500" />
                  <span>AI预警告警片段</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 rounded-xs bg-amber-500" />
                  <span>抓拍事件记录</span>
                </span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingPlayback(!isPlayingPlayback)}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                >
                  {isPlayingPlayback ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>暂停回放</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>播放录像</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded text-[10px]">
                  {['0.5x', '1.0x', '2.0x', '4.0x'].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackSpeed === sp ? 'bg-cyan-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => triggerToast('正在导出所选时间段的1080P录像切片...')}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="下载录像切片"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Timeline Ruler */}
            <div className="relative w-full h-10 bg-slate-950 rounded-md border border-slate-800 flex flex-col justify-end overflow-hidden px-2">
              {/* Continuous video recording track */}
              <div className="relative w-full h-4 bg-slate-900 rounded-sm overflow-hidden flex items-center">
                {/* 00:00 to 24:00 background recording */}
                <div className="absolute inset-y-0 left-0 right-0 bg-cyan-900/40" />

                {/* AI Alert highlighted blocks */}
                <div
                  className="absolute inset-y-0 bg-rose-500/80"
                  style={{ left: '31%', width: '4%' }}
                  title="07:30 - 08:25 早高峰违停预警"
                />
                <div
                  className="absolute inset-y-0 bg-amber-500/80"
                  style={{ left: '42%', width: '3%' }}
                  title="10:05 - 10:45 出店摆卖预警"
                />
                <div
                  className="absolute inset-y-0 bg-rose-500/80"
                  style={{ left: '44%', width: '2%' }}
                  title="10:35 - 10:48 消防通道占用告警"
                />
                <div
                  className="absolute inset-y-0 bg-rose-500/80"
                  style={{ left: '72%', width: '5%' }}
                  title="17:15 - 18:30 晚高峰拥堵监控"
                />

                {/* Draggable Playhead Cursor */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-30"
                  style={{ left: '45%' }}
                >
                  <div className="absolute -top-3 -left-2.5 px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-mono font-bold rounded shadow-md">
                    {mode === 'playback' ? playbackTime : currentTimeStr}
                  </div>
                </div>
              </div>

              {/* Time axis ticks (00:00 to 24:00) */}
              <div className="w-full flex justify-between text-[9px] font-mono text-slate-500 pt-1 pb-0.5 select-none">
                <span>00:00</span>
                <span>02:00</span>
                <span>04:00</span>
                <span>06:00</span>
                <span className="text-cyan-400 font-bold">08:00</span>
                <span className="text-rose-400 font-bold">10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span className="text-cyan-400 font-bold">18:00</span>
                <span>20:00</span>
                <span>22:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PTZ & AI Analysis Panel ================= */}
        <div className="w-80 bg-[#080d19] border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          {/* Active Channel Details Card */}
          <div className="p-3.5 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>当前受控通道</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeChannel.status === 'alert'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                }`}
              >
                {activeChannel.status === 'alert' ? 'AI 告警中' : '在线正常'}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
              <div className="font-bold text-white text-sm truncate">{activeChannel.name}</div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500">编码: </span>
                  {activeChannel.code}
                </div>
                <div>
                  <span className="text-slate-500">IP: </span>
                  {activeChannel.ip}
                </div>
                <div>
                  <span className="text-slate-500">分辨率: </span>
                  {activeChannel.quality} UHD
                </div>
                <div>
                  <span className="text-slate-500">帧率: </span>
                  {activeChannel.fps} FPS
                </div>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5 border-t border-slate-800">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{activeChannel.street}</span>
              </div>
            </div>
          </div>

          {/* PTZ Joystick Steering Disc */}
          <div className="p-3.5 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span>八向高精度云台操纵盘</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                转速: {ptzSpeed} 档
              </span>
            </div>

            {/* 8-Direction Dial */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-44 h-44 rounded-full bg-slate-900 border-2 border-slate-700/80 shadow-2xl flex items-center justify-center p-2">
                {/* Circular tick marks */}
                <div className="absolute inset-2 rounded-full border border-slate-800 border-dashed pointer-events-none" />

                {/* 8 Direction Buttons */}
                {/* Up */}
                <button
                  onClick={() => handlePtzAction('向上仰俯')}
                  className={`absolute top-2 w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '向上仰俯' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="向上仰俯"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Up Right */}
                <button
                  onClick={() => handlePtzAction('右上')}
                  className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '右上' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="右上"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {/* Right */}
                <button
                  onClick={() => handlePtzAction('向右水平')}
                  className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '向右水平' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="向右水平"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Down Right */}
                <button
                  onClick={() => handlePtzAction('右下')}
                  className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '右下' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="右下"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>

                {/* Down */}
                <button
                  onClick={() => handlePtzAction('向下仰俯')}
                  className={`absolute bottom-2 w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '向下仰俯' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="向下仰俯"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Down Left */}
                <button
                  onClick={() => handlePtzAction('左下')}
                  className={`absolute bottom-6 left-6 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '左下' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="左下"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </button>

                {/* Left */}
                <button
                  onClick={() => handlePtzAction('向左水平')}
                  className={`absolute left-2 w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '向左水平' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="向左水平"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Up Left */}
                <button
                  onClick={() => handlePtzAction('左上')}
                  className={`absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 transition ${
                    activePtzDirection === '左上' ? 'bg-cyan-600 text-white' : 'bg-slate-800'
                  }`}
                  title="左上"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>

                {/* Center Reset */}
                <button
                  onClick={() => handlePtzAction('居中复位')}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg active:scale-95 transition"
                  title="居中归位"
                >
                  <span>复位</span>
                </button>
              </div>

              {/* PTZ Status Feedback Text */}
              <div className="mt-2 text-[11px] text-cyan-400 font-mono text-center">
                {ptzFeedback}
              </div>
            </div>

            {/* PTZ Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>云台旋转速度</span>
                <span className="font-mono text-cyan-300">{ptzSpeed} / 8 档</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={ptzSpeed}
                onChange={(e) => setPtzSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Lens Adjustment: Zoom / Focus / Aperture */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Zoom */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-cyan-400" />
                  <span>变焦</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePtzAction('变倍缩小 (-) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handlePtzAction('变倍放大 (+) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Focus */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Focus className="w-3 h-3 text-blue-400" />
                  <span>聚焦</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePtzAction('后焦聚焦 (-) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handlePtzAction('前焦聚焦 (+) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Iris */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Aperture className="w-3 h-3 text-amber-400" />
                  <span>光圈</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePtzAction('光圈调小 (-) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handlePtzAction('光圈调大 (+) ')}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Presets Table (预置位) */}
          <div className="p-3.5 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>预置位巡航调用</span>
              </span>
              <button
                onClick={() => triggerToast('已保存当前镜头角度为新预置位')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                + 设为预置位
              </button>
            </div>

            <div className="space-y-1.5">
              {activeChannel.presets.map((preset, pIdx) => (
                <div
                  key={pIdx}
                  className="px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                >
                  <span className="text-slate-200 font-medium truncate">{preset}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRecallPreset(preset)}
                      className="px-2 py-0.5 rounded bg-cyan-700/60 hover:bg-cyan-600 text-cyan-100 text-[11px] font-semibold transition"
                    >
                      调用
                    </button>
                    <button
                      onClick={() => triggerToast(`已覆盖设置预置位: ${preset}`)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] transition"
                    >
                      覆盖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auxiliary Operations (雨刷、补光、声光报警、语音对讲喊话) */}
          <div className="p-3.5 space-y-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>镜头辅助与现场联动</span>
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Wiper */}
              <button
                onClick={() => {
                  setIsWiperActive(!isWiperActive);
                  triggerToast(isWiperActive ? '镜头雨刷已停止' : '镜头雨刷清洁中...');
                }}
                className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                  isWiperActive
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>雨刷: {isWiperActive ? '运行中' : '关闭'}</span>
              </button>

              {/* Aux Light */}
              <button
                onClick={() => {
                  setIsLightActive(!isLightActive);
                  triggerToast(isLightActive ? '红外补光已关闭' : '红外夜视补光已开启');
                }}
                className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                  isLightActive
                    ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>补光: {isLightActive ? '开启' : '关闭'}</span>
              </button>

              {/* Alarm Flasher */}
              <button
                onClick={() => {
                  setIsAlarmActive(!isAlarmActive);
                  triggerToast(isAlarmActive ? '现场声光警戒已关闭' : '现场声光警戒警报启动中！');
                }}
                className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                  isAlarmActive
                    ? 'bg-rose-600/40 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <BellRing className="w-4 h-4 text-rose-400" />
                <span>声光警报</span>
              </button>

              {/* Intercom Broadcast */}
              <button
                onClick={() => {
                  setIsIntercomActive(!isIntercomActive);
                  triggerToast(isIntercomActive ? '已断开远程广播喊话' : '已接通现场高音喇叭远程喊话！');
                }}
                className={`p-2 rounded-lg border flex items-center gap-2 transition ${
                  isIntercomActive
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isIntercomActive ? (
                  <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
                ) : (
                  <MicOff className="w-4 h-4 text-slate-400" />
                )}
                <span>{isIntercomActive ? '正在喊话...' : '远程对讲'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
