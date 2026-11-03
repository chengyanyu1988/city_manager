import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Navigation,
  BatteryCharging,
  Phone,
  UserCheck,
  ShieldCheck,
  Radio,
  Search,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  MapPin,
  Calendar,
  Clock,
  Layers,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Send,
  Camera,
  Maximize2,
  Minimize2,
  Download,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  Tv,
  Bell,
  Volume2,
  VolumeX,
  X,
  FileSpreadsheet,
  Activity,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Crosshair,
  Sliders
} from 'lucide-react';
import { AppTheme } from '../types';

interface PatrolVehicleItem {
  id: string;
  plate: string;
  name: string;
  type: '网格巡查车' | '车载AI巡检车' | '环卫机动车' | '铁骑执法组';
  driver: string;
  phone: string;
  district: string;
  street: string;
  road: string;
  status: 'patrolling' | 'handling' | 'idle' | 'warning';
  statusText: string;
  speed: number;
  battery: number;
  inspectionsToday: number;
  inspectionsTotal: number;
  anomaliesFound: number;
  mileageKm: number;
  startTime: string;
  lastReportTime: string;
  currentCoords: [number, number]; // x%, y% in map
  trackPoints: { x: number; y: number; time: string; speed: number; event?: string }[];
  findings: {
    id: string;
    type: string;
    level: '紧急' | '重要' | '一般';
    time: string;
    location: string;
    confidence: number;
    image: string;
    status: '已派单' | '已处置' | '待复核';
    actionTaken: string;
  }[];
}

interface PatrolManagementPageProps {
  onBackToHome: () => void;
  onNavigateToSurveillance?: () => void;
  onNavigateToAlerts?: () => void;
  theme?: AppTheme;
}

export const PatrolManagementPage: React.FC<PatrolManagementPageProps> = ({
  onBackToHome: _onBackToHome,
  onNavigateToSurveillance: _onNavigateToSurveillance,
  onNavigateToAlerts: _onNavigateToAlerts,
  theme: _theme = 'tactical-dark'
}) => {
  // Current recent clock
  const [currentTime, setCurrentTime] = useState('2026-10-19 15:36:20');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      // Anchor to 2026-10-19
      setCurrentTime(`2026-10-19 ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  // Patrol Vehicles Dataset with rich realistic details
  const [vehicles, setVehicles] = useState<PatrolVehicleItem[]>([
    {
      id: 'VEH-01',
      plate: '桂A·883K9',
      name: '城管网格巡查01号车',
      type: '网格巡查车',
      driver: '黄建新 (巡检组长)',
      phone: '138-7881-7291',
      district: '兴宁区',
      street: '北湖街道',
      road: '北湖北路 · 恒大新城巡查段',
      status: 'patrolling',
      statusText: '在勤巡查中',
      speed: 28,
      battery: 88,
      inspectionsToday: 42,
      inspectionsTotal: 48,
      anomaliesFound: 6,
      mileageKm: 64.2,
      startTime: '2026-10-19 08:30:00',
      lastReportTime: '2026-10-19 15:35:42',
      currentCoords: [34, 28],
      trackPoints: [
        { x: 18, y: 15, time: '08:35:00', speed: 25 },
        { x: 22, y: 20, time: '09:15:00', speed: 32 },
        { x: 26, y: 22, time: '10:00:00', speed: 20, event: '占道经营劝离' },
        { x: 30, y: 24, time: '11:30:00', speed: 35 },
        { x: 33, y: 26, time: '13:45:00', speed: 22, event: '发现机动车违停' },
        { x: 34, y: 28, time: '15:35:00', speed: 28 }
      ],
      findings: [
        {
          id: 'FND-20261019-01',
          type: '机动车乱停放',
          level: '紧急',
          time: '2026-10-19 14:42:15',
          location: '北湖南路清厢快速路辅道交叉口',
          confidence: 0.982,
          image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          status: '已派单',
          actionTaken: '车载AI自动抓拍识别车牌，现场贴单并推送车主短信挪车'
        },
        {
          id: 'FND-20261019-02',
          type: '出店跨门槛经营',
          level: '重要',
          time: '2026-10-19 13:28:10',
          location: '北湖商业街38号水果生鲜店前',
          confidence: 0.965,
          image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=400&q=80',
          status: '已处置',
          actionTaken: '巡检组现场劝导商户收回占道货架，完成整改复核'
        },
        {
          id: 'FND-20261019-03',
          type: '非机动车无序堆放',
          level: '一般',
          time: '2026-10-19 10:15:22',
          location: '恒大新城地铁站B出口人行道',
          confidence: 0.941,
          image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80',
          status: '已处置',
          actionTaken: '联合共享单车运维人员定点规范摆放52辆'
        }
      ]
    },
    {
      id: 'VEH-02',
      plate: '桂A·561A2',
      name: '车载移动AI全景巡检 03号车',
      type: '车载AI巡检车',
      driver: '韦志明 (巡检执法副长)',
      phone: '139-7814-4021',
      district: '西乡塘区',
      street: '衡阳街道',
      road: '衡阳东路 · 友爱南路立交桥下',
      status: 'patrolling',
      statusText: '在勤巡查中',
      speed: 36,
      battery: 76,
      inspectionsToday: 58,
      inspectionsTotal: 60,
      anomaliesFound: 9,
      mileageKm: 82.5,
      startTime: '2026-10-19 08:15:00',
      lastReportTime: '2026-10-19 15:34:50',
      currentCoords: [48, 42],
      trackPoints: [
        { x: 38, y: 35, time: '08:20:00', speed: 30 },
        { x: 42, y: 38, time: '09:40:00', speed: 40 },
        { x: 45, y: 40, time: '11:15:00', speed: 32, event: '渣土车未密闭遮盖' },
        { x: 48, y: 42, time: '15:34:00', speed: 36 }
      ],
      findings: [
        {
          id: 'FND-20261019-04',
          type: '重型渣土车未密闭',
          level: '紧急',
          time: '2026-10-19 11:15:30',
          location: '友爱南路立交桥下辅道',
          confidence: 0.978,
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
          status: '已派单',
          actionTaken: '车载全景双目抓拍并推送交警与住建综合执法专班拦截'
        },
        {
          id: 'FND-20261019-05',
          type: '施工物料露天占道',
          level: '重要',
          time: '2026-10-19 09:45:00',
          location: '衡阳东路万里汽配城北侧',
          confidence: 0.952,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&w=400&q=80',
          status: '待复核',
          actionTaken: '责令施工方30分钟内完成绿网覆盖并清理路面砂石'
        }
      ]
    },
    {
      id: 'VEH-03',
      plate: '桂A·319V8',
      name: '环境卫生移动监测 05号车',
      type: '环卫机动车',
      driver: '陆俊华 (环卫巡查专员)',
      phone: '137-7798-6110',
      district: '青秀区',
      street: '上尧街道',
      road: '金湖路 · 金湖广场环岛南侧',
      status: 'handling',
      statusText: '现场处置中',
      speed: 0,
      battery: 92,
      inspectionsToday: 36,
      inspectionsTotal: 40,
      anomaliesFound: 4,
      mileageKm: 48.3,
      startTime: '2026-10-19 09:00:00',
      lastReportTime: '2026-10-19 15:32:15',
      currentCoords: [68, 72],
      trackPoints: [
        { x: 55, y: 65, time: '09:10:00', speed: 22 },
        { x: 62, y: 68, time: '11:20:00', speed: 25 },
        { x: 68, y: 72, time: '15:32:00', speed: 0, event: '垃圾散落驻车处置' }
      ],
      findings: [
        {
          id: 'FND-20261019-06',
          type: '生活垃圾桶满溢散落',
          level: '一般',
          time: '2026-10-19 14:10:20',
          location: '金湖广场南侧果皮箱收集点',
          confidence: 0.946,
          image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80',
          status: '已处置',
          actionTaken: '环卫专车调集两名保洁员快速清扫并完成高压冲洗'
        }
      ]
    },
    {
      id: 'VEH-04',
      plate: '桂A·902D1',
      name: '铁骑机动快反 01号组',
      type: '铁骑执法组',
      driver: '苏建国 (铁骑特勤)',
      phone: '136-6922-8371',
      district: '兴宁区',
      street: '华强街道',
      road: '公园北路 · 人民公园北门',
      status: 'patrolling',
      statusText: '在勤巡查中',
      speed: 42,
      battery: 95,
      inspectionsToday: 64,
      inspectionsTotal: 65,
      anomaliesFound: 5,
      mileageKm: 76.8,
      startTime: '2026-10-19 08:00:00',
      lastReportTime: '2026-10-19 15:36:01',
      currentCoords: [44, 58],
      trackPoints: [
        { x: 38, y: 50, time: '08:15:00', speed: 45 },
        { x: 42, y: 55, time: '10:30:00', speed: 38 },
        { x: 44, y: 58, time: '15:36:00', speed: 42 }
      ],
      findings: [
        {
          id: 'FND-20261019-07',
          type: '游商无证流动兜售',
          level: '一般',
          time: '2026-10-19 12:40:18',
          location: '人民公园北门正对人行道',
          confidence: 0.957,
          image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=400&q=80',
          status: '已处置',
          actionTaken: '铁骑队员5分钟到达现场，引导摊主进入规定便民疏导点'
        }
      ]
    },
    {
      id: 'VEH-05',
      plate: '桂A·118T6',
      name: '城管网格巡查02号车',
      type: '网格巡查车',
      driver: '潘少峰 (网格专员)',
      phone: '135-9011-2345',
      district: '兴宁区',
      street: '长堽街道',
      road: '长堽路三里 · 广西工业职院东门',
      status: 'patrolling',
      statusText: '在勤巡查中',
      speed: 25,
      battery: 82,
      inspectionsToday: 38,
      inspectionsTotal: 45,
      anomaliesFound: 3,
      mileageKm: 51.4,
      startTime: '2026-10-19 08:45:00',
      lastReportTime: '2026-10-19 15:33:10',
      currentCoords: [58, 36],
      trackPoints: [
        { x: 50, y: 30, time: '09:00:00', speed: 28 },
        { x: 55, y: 34, time: '11:45:00', speed: 24 },
        { x: 58, y: 36, time: '15:33:00', speed: 25 }
      ],
      findings: []
    },
    {
      id: 'VEH-06',
      plate: '桂A·723C5',
      name: '综合应急巡查 06号车',
      type: '网格巡查车',
      driver: '邓启明 (副队长)',
      phone: '138-1234-5678',
      district: '青秀区',
      street: '新阳街道',
      road: '民族大道中段辅道',
      status: 'warning',
      statusText: '越界告警待确认',
      speed: 15,
      battery: 65,
      inspectionsToday: 29,
      inspectionsTotal: 35,
      anomaliesFound: 2,
      mileageKm: 42.0,
      startTime: '2026-10-19 09:10:00',
      lastReportTime: '2026-10-19 15:30:20',
      currentCoords: [74, 82],
      trackPoints: [
        { x: 65, y: 78, time: '09:30:00', speed: 30 },
        { x: 74, y: 82, time: '15:30:00', speed: 15, event: '偏离网格巡查路线' }
      ],
      findings: []
    },
    {
      id: 'VEH-07',
      plate: '桂A·446H8',
      name: '车载AI巡检 08号车',
      type: '车载AI巡检车',
      driver: '蒙天成 (技术专员)',
      phone: '139-8877-6655',
      district: '西乡塘区',
      street: '安吉街道',
      road: '秀厢大道 · 恒大新城东门',
      status: 'patrolling',
      statusText: '在勤巡查中',
      speed: 31,
      battery: 89,
      inspectionsToday: 47,
      inspectionsTotal: 50,
      anomaliesFound: 4,
      mileageKm: 69.1,
      startTime: '2026-10-19 08:20:00',
      lastReportTime: '2026-10-19 15:35:10',
      currentCoords: [28, 22],
      trackPoints: [
        { x: 22, y: 18, time: '08:30:00', speed: 35 },
        { x: 28, y: 22, time: '15:35:00', speed: 31 }
      ],
      findings: []
    },
    {
      id: 'VEH-08',
      plate: '桂A·229M3',
      name: '备勤轮值 09号车',
      type: '网格巡查车',
      driver: '何志辉 (待命特勤)',
      phone: '137-5544-3322',
      district: '兴宁区',
      street: '北湖街道',
      road: '北湖城管执法基地停车场',
      status: 'idle',
      statusText: '基地待命整备',
      speed: 0,
      battery: 100,
      inspectionsToday: 12,
      inspectionsTotal: 20,
      anomaliesFound: 0,
      mileageKm: 18.2,
      startTime: '2026-10-19 12:00:00',
      lastReportTime: '2026-10-19 15:20:00',
      currentCoords: [30, 20],
      trackPoints: [
        { x: 30, y: 20, time: '12:00:00', speed: 0 }
      ],
      findings: []
    }
  ]);

  // Selected Active Vehicle for track display & operations
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-01');
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Track Playback States
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [trackProgress, setTrackProgress] = useState(100); // 0 - 100%
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x, 8x
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Map Layer Toggles
  const [layerTrackVisible, setLayerTrackVisible] = useState(true);
  const [layerCheckpointsVisible, setLayerCheckpointsVisible] = useState(true);
  const [layerFindingsVisible, setLayerFindingsVisible] = useState(true);
  const [layerGeofenceVisible, setLayerGeofenceVisible] = useState(true);

  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showFindingModal, setShowFindingModal] = useState<any>(null);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchDistrict = selectedDistrict === 'all' || v.district === selectedDistrict || v.street.includes(selectedDistrict);
    const matchStatus = selectedStatus === 'all' || v.status === selectedStatus;
    const matchKeyword =
      !searchKeyword ||
      v.plate.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.name.includes(searchKeyword) ||
      v.driver.includes(searchKeyword) ||
      v.road.includes(searchKeyword);
    return matchDistrict && matchStatus && matchKeyword;
  });

  // Track playback animation
  useEffect(() => {
    if (isPlayingTrack) {
      playbackTimerRef.current = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingTrack(false);
            return 100;
          }
          return Math.min(100, prev + 1 * playbackSpeed);
        });
      }, 150);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlayingTrack, playbackSpeed]);

  // Overall Statistics
  const totalVehicles = vehicles.length;
  const patrollingCount = vehicles.filter((v) => v.status === 'patrolling').length;
  const handlingCount = vehicles.filter((v) => v.status === 'handling').length;
  const warningCount = vehicles.filter((v) => v.status === 'warning').length;
  const totalMileage = vehicles.reduce((sum, v) => sum + v.mileageKm, 0).toFixed(1);
  const totalFindings = vehicles.reduce((sum, v) => sum + v.anomaliesFound, 0);
  const totalInspected = vehicles.reduce((sum, v) => sum + v.inspectionsToday, 0);
  const totalTasks = vehicles.reduce((sum, v) => sum + v.inspectionsTotal, 0);
  const completionRate = Math.round((totalInspected / (totalTasks || 1)) * 100);

  // Calculate current playback vehicle position
  const getInterpolatedPosition = () => {
    if (!activeVehicle.trackPoints || activeVehicle.trackPoints.length === 0) {
      return activeVehicle.currentCoords;
    }
    const points = activeVehicle.trackPoints;
    if (points.length === 1) return [points[0].x, points[0].y];

    const totalSegments = points.length - 1;
    const currentSegmentIndex = Math.min(
      Math.floor((trackProgress / 100) * totalSegments),
      totalSegments - 1
    );
    const subProgress = ((trackProgress / 100) * totalSegments) - currentSegmentIndex;

    const p1 = points[currentSegmentIndex];
    const p2 = points[currentSegmentIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * subProgress;
    const currentY = p1.y + (p2.y - p1.y) * subProgress;
    return [currentX, currentY];
  };

  const [currentCarX, currentCarY] = getInterpolatedPosition();

  // Handle Export Click
  const handleExport = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#050811] text-slate-100 overflow-hidden select-none relative">
      {/* 1. Top Sub-Navigation Header Bar */}
      <div className="h-12 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">预警研判</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              巡查管理指挥中心
            </span>
          </div>
        </div>

        {/* Right Info: Live Time & System Telemetry */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{currentTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded text-[11px] text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>网格北斗RTK高精定位 在线</span>
          </div>
        </div>
      </div>

      {/* 2. Top Filter / Query Search Bar */}
      <div className="bg-[#0b1224] border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索车牌、驾驶员、责任路段..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded pl-8 pr-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 transition"
            />
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">所属区域:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-hidden focus:border-cyan-400"
            >
              <option value="all">全域网格 (全部)</option>
              <option value="兴宁区">兴宁辖区</option>
              <option value="西乡塘区">西乡塘辖区</option>
              <option value="青秀区">青秀辖区</option>
              <option value="北湖街道">北湖街道</option>
              <option value="衡阳街道">衡阳街道</option>
              <option value="华强街道">华强街道</option>
              <option value="上尧街道">上尧街道</option>
              <option value="长堽街道">长堽街道</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">巡查状态:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-hidden focus:border-cyan-400"
            >
              <option value="all">全部状态 ({totalVehicles})</option>
              <option value="patrolling">在勤巡查 ({patrollingCount})</option>
              <option value="handling">现场处置 ({handlingCount})</option>
              <option value="warning">偏离异常 ({warningCount})</option>
              <option value="idle">基地待命 (1)</option>
            </select>
          </div>



          {/* Reset button */}
          <button
            onClick={() => {
              setSearchKeyword('');
              setSelectedDistrict('all');
              setSelectedStatus('all');
              setSelectedDateRange('today');
            }}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="重置筛选条件"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
          {showExportSuccess && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-fade-in font-medium">
              <CheckCircle2 className="w-3 h-3" />
              台账导出成功 (XLSX)
            </span>
          )}
          <button
            onClick={handleExport}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>导出巡检台账</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Area: Left List (Fleet) + Center Map & Playback + Right Findings */}
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================
            LEFT COLUMN: Patrol Fleet & Metrics Panel
            ========================================= */}
        <div className="w-80 border-r border-slate-800 bg-[#070c18] flex flex-col shrink-0">
          {/* Top KPI Metrics 4-Grid */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
            <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
                全区巡防态势指标 (今日)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">10-19 实时</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0b1326] p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">在勤率 / 车辆</span>
                  <span className="text-base font-bold font-mono text-cyan-300">
                    {patrollingCount + handlingCount}
                    <span className="text-xs text-slate-400 font-normal"> / {totalVehicles} 辆</span>
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
                  88%
                </div>
              </div>

              <div className="bg-[#0b1326] p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">累计巡检里程</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {totalMileage}
                    <span className="text-xs text-slate-400 font-normal"> km</span>
                  </span>
                </div>
                <Navigation className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-[#0b1326] p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">打卡点位完成率</span>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {completionRate}%
                    <span className="text-[10px] text-slate-500 font-normal"> ({totalInspected}/{totalTasks})</span>
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>

              <div className="bg-[#0b1326] p-2 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">移动AI识别告警</span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    {totalFindings}
                    <span className="text-xs text-slate-400 font-normal"> 起</span>
                  </span>
                </div>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Vehicles List Header */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              巡查执勤编队 ({filteredVehicles.length})
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              点击卡片联动轨迹
            </span>
          </div>

          {/* Vehicles Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredVehicles.map((veh) => {
              const isSelected = veh.id === selectedVehicleId;
              const isPatrolling = veh.status === 'patrolling';
              const isHandling = veh.status === 'handling';
              const isWarning = veh.status === 'warning';

              return (
                <div
                  key={veh.id}
                  onClick={() => {
                    setSelectedVehicleId(veh.id);
                    setTrackProgress(100);
                  }}
                  className={`p-2.5 rounded-lg border transition cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800/90'
                  }`}
                >
                  {/* Left Accent indicator */}
                  <div
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${
                      isSelected
                        ? 'bg-cyan-400'
                        : isPatrolling
                        ? 'bg-emerald-500'
                        : isHandling
                        ? 'bg-blue-500'
                        : isWarning
                        ? 'bg-rose-500'
                        : 'bg-slate-600'
                    }`}
                  />

                  {/* Header Row: Plate + Type Badge + Status */}
                  <div className="flex items-center justify-between mb-1.5 pl-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs font-mono text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
                        {veh.plate}
                      </span>
                      <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800">
                        {veh.type}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                        isPatrolling
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : isHandling
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                          : isWarning
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPatrolling
                            ? 'bg-emerald-400 animate-ping'
                            : isHandling
                            ? 'bg-blue-400'
                            : isWarning
                            ? 'bg-rose-400'
                            : 'bg-slate-500'
                        }`}
                      />
                      {veh.statusText}
                    </span>
                  </div>

                  {/* Name and Driver */}
                  <div className="pl-1.5 text-xs text-slate-300 font-medium truncate mb-1">
                    {veh.name}
                  </div>

                  {/* Location & Street */}
                  <div className="pl-1.5 text-[11px] text-slate-400 flex items-center gap-1 truncate mb-2">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{veh.road}</span>
                  </div>

                  {/* Key Stats Bar: Speed, Battery, Points, Findings */}
                  <div className="pl-1.5 grid grid-cols-4 gap-1 text-[10px] bg-slate-950/60 p-1.5 rounded border border-slate-800/80 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">车速</span>
                      <span className="text-cyan-300 font-bold">{veh.speed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">电量</span>
                      <span className="text-emerald-400 font-bold">{veh.battery}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">打卡</span>
                      <span className="text-amber-300 font-bold">{veh.inspectionsToday}/{veh.inspectionsTotal}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">告警</span>
                      <span className="text-rose-400 font-bold">{veh.anomaliesFound}起</span>
                    </div>
                  </div>

                  {/* Hover or Active Fast Actions */}
                  <div className="pl-1.5 mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-blue-400" />
                      {veh.driver.split(' ')[0]}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(veh.id);
                          setShowVideoModal(true);
                        }}
                        className="px-2 py-0.5 rounded bg-cyan-900/60 hover:bg-cyan-700 text-cyan-200 text-[10px] flex items-center gap-1 transition"
                        title="查看车载高清视频"
                      >
                        <Tv className="w-2.5 h-2.5" />
                        <span>图传</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(veh.id);
                          setTrackProgress(0);
                          setIsPlayingTrack(true);
                        }}
                        className="px-2 py-0.5 rounded bg-amber-900/60 hover:bg-amber-700 text-amber-200 text-[10px] flex items-center gap-1 transition"
                        title="回放今日巡查轨迹"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>轨迹</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================
            CENTER COLUMN: GIS Tactical Map & Track Playback
            ========================================= */}
        <div className="flex-1 flex flex-col bg-[#040711] overflow-hidden relative">
          {/* Map Floating HUD Tools Header */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
            {/* Active Vehicle Floating Badge */}
            <div className="pointer-events-auto bg-[#0a1124]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-cyan-500/40 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <Truck className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{activeVehicle.name}</span>
                  <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800">
                    {activeVehicle.plate}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {activeVehicle.statusText}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>当前定位: {activeVehicle.road}</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-mono text-cyan-300">瞬时速度: {activeVehicle.speed} km/h</span>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-slate-800 ml-2" />

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-2.5 py-1 rounded bg-cyan-700/80 hover:bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>实时车载图传</span>
              </button>
            </div>

            {/* Layer Controls & GIS Display Switches */}
            <div className="pointer-events-auto bg-[#0a1124]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                图层:
              </span>

              <button
                onClick={() => setLayerTrackVisible(!layerTrackVisible)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  layerTrackVisible
                    ? 'bg-cyan-600/80 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                巡查轨迹线
              </button>

              <button
                onClick={() => setLayerCheckpointsVisible(!layerCheckpointsVisible)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  layerCheckpointsVisible
                    ? 'bg-amber-600/80 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                巡检打卡点
              </button>

              <button
                onClick={() => setLayerFindingsVisible(!layerFindingsVisible)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  layerFindingsVisible
                    ? 'bg-rose-600/80 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                AI抓拍标定
              </button>

              <button
                onClick={() => setLayerGeofenceVisible(!layerGeofenceVisible)}
                className={`px-2 py-0.5 rounded text-[11px] transition ${
                  layerGeofenceVisible
                    ? 'bg-purple-600/80 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                责任网格围栏
              </button>
            </div>
          </div>

          {/* Map Canvas with SVG Vector Roads, Routes, Vehicle and Points */}
          <div className="flex-1 relative overflow-hidden bg-radial from-[#0c162f] via-[#070e1e] to-[#03060c]">
            {/* Vector Map Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <pattern id="patrolGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="1" />
                  <circle cx="60" cy="60" r="1.5" fill="rgba(34, 211, 238, 0.25)" />
                </pattern>
                {/* Glowing track gradient */}
                <linearGradient id="trackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#patrolGrid)" />
            </svg>

            {/* Simulated Road Arteries */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Main Arteries (Qingxiang Expressway, Beihu Rd, Minzu Ave, etc.) */}
              <path
                d="M 50 120 Q 250 180 500 240 T 950 340 T 1400 480"
                fill="none"
                stroke="rgba(51, 65, 85, 0.7)"
                strokeWidth="18"
              />
              <path
                d="M 50 120 Q 250 180 500 240 T 950 340 T 1400 480"
                fill="none"
                stroke="rgba(148, 163, 184, 0.35)"
                strokeWidth="3"
                strokeDasharray="8 8"
              />

              <path
                d="M 380 40 L 420 320 L 460 620 L 520 900"
                fill="none"
                stroke="rgba(51, 65, 85, 0.7)"
                strokeWidth="14"
              />
              <path
                d="M 120 480 Q 400 450 780 460 T 1350 490"
                fill="none"
                stroke="rgba(51, 65, 85, 0.7)"
                strokeWidth="12"
              />

              {/* Electronic Geofence Boundary Polygon */}
              {layerGeofenceVisible && (
                <polygon
                  points="180,90 520,70 680,240 640,580 320,520 190,320"
                  fill="rgba(56, 189, 248, 0.05)"
                  stroke="rgba(56, 189, 248, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Dynamic Vehicle Track Polyline */}
              {layerTrackVisible && activeVehicle.trackPoints && activeVehicle.trackPoints.length > 1 && (
                <polyline
                  points={activeVehicle.trackPoints
                    .map((pt) => `${(pt.x / 100) * 1100 + 40}, ${(pt.y / 100) * 600 + 60}`)
                    .join(' ')}
                  fill="none"
                  stroke="url(#trackGlow)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
              )}
            </svg>

            {/* Map Place Labels */}
            <div className="absolute top-[16%] left-[18%] text-[10px] font-mono text-cyan-400/70 border border-cyan-500/20 bg-slate-950/60 px-1.5 py-0.5 rounded pointer-events-none">
              南宁·北湖网格责任区 01
            </div>
            <div className="absolute top-[28%] left-[45%] text-[10px] font-mono text-cyan-400/70 border border-cyan-500/20 bg-slate-950/60 px-1.5 py-0.5 rounded pointer-events-none">
              清厢快速路与衡阳东路枢纽
            </div>
            <div className="absolute top-[68%] left-[62%] text-[10px] font-mono text-cyan-400/70 border border-cyan-500/20 bg-slate-950/60 px-1.5 py-0.5 rounded pointer-events-none">
              青秀·金湖广场商业核心区
            </div>

            {/* Checkpoint Markers Along the Track */}
            {layerCheckpointsVisible && (
              <>
                <div
                  className="absolute cursor-pointer transition transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: '20%', top: '22%' }}
                  title="点位01: 恒大新城东门 (已打卡 08:45)"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[9px] shadow-lg shadow-emerald-500/50">
                    ✓
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
                    点位01: 恒大新城东门 (已打卡)
                  </div>
                </div>

                <div
                  className="absolute cursor-pointer transition transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: '28%', top: '26%' }}
                  title="点位02: 北湖商业广场 (已打卡 10:10)"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-[9px] shadow-lg shadow-emerald-500/50">
                    ✓
                  </div>
                </div>

                <div
                  className="absolute cursor-pointer transition transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: '33%', top: '30%' }}
                  title="点位03: 清厢快速路辅道 (重点排查点 14:40)"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/40 border-2 border-rose-400 flex items-center justify-center text-rose-300 font-bold text-[9px] shadow-lg shadow-rose-500/50 animate-pulse">
                    !
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-rose-950/90 text-rose-300 text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-rose-700">
                    告警发生点 (违停)
                  </div>
                </div>

                <div
                  className="absolute cursor-pointer transition transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: '42%', top: '38%' }}
                  title="点位04: 万里汽配城北侧 (待巡检)"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-700/60 border-2 border-slate-500 flex items-center justify-center text-slate-300 font-bold text-[9px]">
                    4
                  </div>
                </div>
              </>
            )}

            {/* AI Findings Pins on Map */}
            {layerFindingsVisible &&
              activeVehicle.findings.map((fnd, idx) => (
                <div
                  key={fnd.id}
                  onClick={() => setShowFindingModal(fnd)}
                  className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${32 + idx * 8}%`, top: `${28 + idx * 6}%` }}
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-rose-600/90 border-2 border-white flex items-center justify-center shadow-xl shadow-rose-500/60 hover:scale-125 transition">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black animate-ping" />
                  </div>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#091124] text-white p-2 rounded-lg shadow-2xl border border-rose-500/50 text-[11px] w-48 z-30 pointer-events-none">
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {fnd.type}
                    </span>
                    <span className="text-slate-300 truncate">{fnd.location}</span>
                    <span className="text-[10px] text-cyan-300 font-mono">置信度: {(fnd.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}

            {/* Moving Car / Active Patrol Vehicle Beacon */}
            <div
              className="absolute z-30 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${currentCarX}%`,
                top: `${currentCarY}%`
              }}
              onClick={() => setShowVideoModal(true)}
            >
              {/* Radar pulse ripples */}
              <div className="absolute -inset-4 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
              <div className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-pulse pointer-events-none" />

              {/* Car Icon Card */}
              <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-cyan-500 p-0.5 rounded-full shadow-2xl shadow-cyan-500/50 hover:scale-110 transition">
                <div className="w-8 h-8 rounded-full bg-[#0a1224] flex items-center justify-center text-amber-300 font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="bg-[#0b1328]/95 px-2 py-0.5 rounded-full pr-2.5 border border-cyan-500/30">
                  <span className="text-[10px] font-mono font-bold text-white block leading-tight">
                    {activeVehicle.plate}
                  </span>
                  <span className="text-[9px] text-cyan-300 font-mono block">
                    {activeVehicle.speed} km/h
                  </span>
                </div>
              </div>
            </div>

            {/* Other Patrol Vehicles Beacons (semi-transparent) */}
            {vehicles
              .filter((v) => v.id !== selectedVehicleId)
              .map((veh) => (
                <div
                  key={veh.id}
                  onClick={() => {
                    setSelectedVehicleId(veh.id);
                    setTrackProgress(100);
                  }}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-75 hover:opacity-100 hover:scale-110 transition group"
                  style={{ left: `${veh.currentCoords[0]}%`, top: `${veh.currentCoords[1]}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900/90 border border-slate-500 flex items-center justify-center text-slate-300 shadow">
                    <Truck className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="hidden group-hover:block absolute top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap z-20">
                    {veh.plate} · {veh.driver.split(' ')[0]}
                  </div>
                </div>
              ))}
          </div>

          {/* =========================================
              BOTTOM PLAYBACK BAR: Track Scrubber & Telemetry
              ========================================= */}
          <div className="h-20 bg-[#080d1c] border-t border-slate-800/90 px-4 py-2 flex flex-col justify-between shrink-0 z-20">
            {/* Top row: Playback Controls & Live Telemetry */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {/* Play / Pause Button */}
                <button
                  onClick={() => setIsPlayingTrack(!isPlayingTrack)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md transition ${
                    isPlayingTrack
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                  title={isPlayingTrack ? '暂停回放' : '开始轨迹回放'}
                >
                  {isPlayingTrack ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setTrackProgress(0);
                    setIsPlayingTrack(true);
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="重新从起点回放"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Speed Multiplier */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
                  {[1, 2, 4, 8].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-1.5 py-0.2 rounded font-mono transition ${
                        playbackSpeed === sp
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sp}X
                    </button>
                  ))}
                </div>

                <div className="h-4 w-[1px] bg-slate-800" />

                {/* Current Playhead Time display */}
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-slate-400">回放时间:</span>
                  <span className="text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    2026-10-19 {
                      String(8 + Math.floor((trackProgress / 100) * 7)).padStart(2, '0')
                    }:{
                      String(Math.floor(((trackProgress % 15) / 15) * 59)).padStart(2, '0')
                    }:30
                  </span>
                </div>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">回放车速:</span>
                  <span className="text-emerald-400 font-bold">{activeVehicle.speed} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">已巡里程:</span>
                  <span className="text-amber-400 font-bold">
                    {((activeVehicle.mileageKm * trackProgress) / 100).toFixed(1)} km
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">定位精度:</span>
                  <span className="text-cyan-400 font-bold">RTK ±0.05m</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">车载AI模组:</span>
                  <span className="text-emerald-400 font-bold">4K双目在勤</span>
                </div>
              </div>
            </div>

            {/* Bottom Scrubber Slider */}
            <div className="relative flex items-center gap-3 pt-1">
              <span className="text-[10px] font-mono text-slate-500">08:00</span>
              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trackProgress}
                  onChange={(e) => setTrackProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">18:00</span>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: Patrol Findings & Snapshots Log
            ========================================= */}
        <div className="w-84 border-l border-slate-800 bg-[#070c18] flex flex-col shrink-0">
          {/* Header of Findings */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                车载移动AI抓拍成果 ({activeVehicle.findings.length})
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                所选车辆实时识别 · 自动生成核查台账
              </p>
            </div>

            <button
              onClick={() => setShowDispatchModal(true)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="针对违规快速派单"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Findings List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {activeVehicle.findings.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
                <span>该巡查责任段暂无异常告警</span>
                <span className="text-[10px] text-slate-600">网格环境秩序良好</span>
              </div>
            ) : (
              activeVehicle.findings.map((fnd) => (
                <div
                  key={fnd.id}
                  onClick={() => setShowFindingModal(fnd)}
                  className="bg-slate-900/80 hover:bg-slate-800/90 rounded-lg border border-slate-800 hover:border-cyan-500/40 p-2.5 transition cursor-pointer group"
                >
                  {/* Top row: Type + Status */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {fnd.type}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        fnd.status === '已处置'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : fnd.status === '已派单'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {fnd.status}
                    </span>
                  </div>

                  {/* Thumbnail Image + Details */}
                  <div className="flex gap-2.5 mb-2">
                    <div className="w-20 h-14 rounded overflow-hidden bg-black shrink-0 relative border border-slate-700 group-hover:border-cyan-400 transition">
                      <img
                        src={fnd.image}
                        alt={fnd.type}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[8px] font-mono text-cyan-300">
                        {(fnd.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between text-[11px]">
                      <div className="text-slate-300 line-clamp-2 leading-tight">
                        {fnd.location}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {fnd.time.split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  {/* Action Taken description */}
                  <div className="text-[10px] text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-800/80 leading-normal">
                    <span className="text-cyan-400 font-medium">现场措施: </span>
                    {fnd.actionTaken}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary: Street Patrol Coverage Breakdown */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs">
            <div className="font-semibold text-slate-300 mb-2 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <TrendingUp className="w-3.5 h-3.5" />
                各网格巡查达标率排名
              </span>
              <span className="text-[10px] text-slate-500">全区通报</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              {[
                { name: '北湖街道网格', rate: 96.5, count: '42/44点位' },
                { name: '衡阳街道网格', rate: 94.2, count: '58/60点位' },
                { name: '上尧街道网格', rate: 91.0, count: '36/40点位' },
                { name: '华强街道网格', rate: 89.5, count: '64/65点位' },
              ].map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span className="w-3.5 text-center font-mono text-slate-500 font-bold">{idx + 1}</span>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] text-slate-500">{item.count}</span>
                    <span className="text-emerald-400 font-bold">{item.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL 1: In-Car 4K Dashcam & Intercom Modal
          ========================================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#091124] border border-cyan-500/50 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col text-slate-100">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#0d1730] border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">车载移动4K实时图传 & 指挥对讲</h3>
                    <span className="font-mono text-xs text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      {activeVehicle.plate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    执勤驾驶员: {activeVehicle.driver} · 电话: {activeVehicle.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport Simulated */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Dashcam Stream"
                className="w-full h-full object-cover"
              />

              {/* OSD Info Overlay */}
              <div className="absolute top-3 left-3 bg-black/75 px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>REC · 4K 60FPS · 5G移动专网</span>
              </div>

              <div className="absolute top-3 right-3 bg-black/75 px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-slate-200">
                {currentTime}
              </div>

              {/* AI Detection Bounding Box on Video */}
              <div
                className="absolute border-2 border-rose-500 bg-rose-500/20 rounded pointer-events-none"
                style={{ top: '45%', left: '32%', width: '28%', height: '36%' }}
              >
                <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  机动车乱停放 98.2%
                </span>
              </div>

              {/* Bottom Intercom Call Toolbar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/40">
                <button className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>语音对讲喊话</span>
                </button>
                <button className="px-3 py-1 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition">
                  <Camera className="w-3.5 h-3.5" />
                  <span>高清手动抓拍</span>
                </button>
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setShowDispatchModal(true);
                  }}
                  className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>立即派单处置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 2: Snapshot Details Modal
          ========================================= */}
      {showFindingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#091124] border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-slate-100">
            <div className="px-4 py-3 bg-[#0d1730] border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">{showFindingModal.type} · 移动AI抓拍凭证</h3>
              </div>
              <button
                onClick={() => setShowFindingModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="w-full h-56 rounded-lg overflow-hidden border border-slate-700 bg-black relative">
                <img
                  src={showFindingModal.image}
                  alt={showFindingModal.type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">
                  AI算法置信度: {(showFindingModal.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">发生地点:</span>
                  <span className="font-medium text-slate-200 text-right">{showFindingModal.location}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">抓拍时间:</span>
                  <span className="font-mono text-cyan-300">{showFindingModal.time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">核查处置措施:</span>
                  <span className="text-slate-300">{showFindingModal.actionTaken}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowFindingModal(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setShowFindingModal(null);
                    setShowDispatchModal(true);
                  }}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  生成正式处置工单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 3: New Patrol Task / Dispatch Modal
          ========================================= */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#091124] border border-cyan-500/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-slate-100">
            <div className="px-4 py-3 bg-[#0d1730] border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">新增巡查排班 / 紧急调度指令</h3>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">指派巡查编组 / 车辆</label>
                <select
                  defaultValue={activeVehicle.id}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-cyan-400"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} · {v.name} ({v.driver})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">责任巡查路线 / 网格区</label>
                <input
                  type="text"
                  defaultValue="北湖商业街至清厢辅道沿线机动巡查"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">巡查重点与特别指令</label>
                <textarea
                  rows={3}
                  defaultValue="重点检查放学高峰期校门口流动摊贩占道与机动车非机动车乱停放违规，发现问题先劝导、复核不改直接派单。"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white focus:outline-hidden focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowDispatchModal(false);
                    alert('巡查指令已通过专网无线呼叫成功推送到车载终端！');
                  }}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition shadow-md shadow-cyan-500/20"
                >
                  立即下发指令
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
