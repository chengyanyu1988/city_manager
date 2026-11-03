import React, { useState, useMemo } from 'react';
import {
  Archive,
  Search,
  RotateCcw,
  Download,
  List,
  LayoutGrid,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  Layers,
  MapPin,
  Camera,
  ShieldCheck,
  UserCheck,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { EventArchiveDetailPage } from './EventArchiveDetailPage';

export interface ArchiveItem {
  id: string;
  type: string;
  time: string;
  location: string;
  cameraName: string;
  plateNumber: string;
  platform: string;
  result: string;
  handler: string;
  categoryKey: string;
}

interface EventArchivePageProps {
  onBackToHome?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectDetail?: (item: ArchiveItem) => void;
}

// 20 Recent Mock Archive Items (Dated 2026-10-18 to 2026-10-19)
const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'DA-20261019-001',
    type: '机动车乱停放',
    time: '2026-10-19 15:58',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '粤B·2N66V',
    platform: '综合行政执法平台',
    result: '执法队员现场劝离，拍摄整改照片符合结案标准并归档',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  {
    id: 'DA-20261019-002',
    type: '无照经营游商',
    time: '2026-10-19 15:42',
    location: '广西壮族自治区南宁市良庆区金龙路12号商业街广场',
    cameraName: '金龙路商业街C204摄像头',
    plateNumber: '流动流动摊贩',
    platform: '蓝麒麟指挥调度平台',
    result: '网格员现场柔性劝导离场，场地已恢复整洁',
    handler: '张队员 (良庆02组)',
    categoryKey: 'vendor'
  },
  {
    id: 'DA-20261019-003',
    type: '出店经营',
    time: '2026-10-19 15:10',
    location: '广西壮族自治区南宁市良庆区金龙路8号钱隆首府11栋商铺',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '柏花水会东侧商家',
    platform: '综合行政执法平台',
    result: '商家自行将违规占道摆放物料入店，已核验通过',
    handler: '王巡查员',
    categoryKey: 'store'
  },
  {
    id: 'DA-20261019-004',
    type: '占道经营',
    time: '2026-10-19 14:35',
    location: '广西壮族自治区南宁市良庆区金东路口盲道旁',
    cameraName: '金东路口C102球机',
    plateNumber: '占道三轮车',
    platform: '蓝麒麟指挥调度平台',
    result: '联动交警协同处置完毕，通道恢复畅通',
    handler: '刘警官 (铁骑队)',
    categoryKey: 'road_occupy'
  },
  {
    id: 'DA-20261019-005',
    type: '非机动车乱停放',
    time: '2026-10-19 14:02',
    location: '广西壮族自治区南宁市良庆区金龙路地铁口C口',
    cameraName: '地铁金龙路站C口高清摄像头',
    plateNumber: '共享单车堆叠',
    platform: '综合行政执法平台',
    result: '通知单车运营运维人员在15分钟内完成集中摆放整治',
    handler: '单车运维网格员',
    categoryKey: 'bike'
  },
  {
    id: 'DA-20261019-006',
    type: '违规户外广告',
    time: '2026-10-19 13:20',
    location: '广西壮族自治区南宁市良庆区五象大道108号',
    cameraName: '五象大道C301球机',
    plateNumber: '未经审批立式灯箱',
    platform: '综合行政执法平台',
    result: '已依法下发整改通知，当事人自行拆除违规广告牌',
    handler: '陈执法官',
    categoryKey: 'ad'
  },
  {
    id: 'DA-20261019-007',
    type: '乱堆物料',
    time: '2026-10-19 12:45',
    location: '广西壮族自治区南宁市良庆区云星钱隆首府15栋侧巷',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '装修废弃建材',
    platform: '蓝麒麟指挥调度平台',
    result: '物业协助装修业主清理完毕，现场已拍照回传归档',
    handler: '物业专员',
    categoryKey: 'dump'
  },
  {
    id: 'DA-20261019-008',
    type: '渣土车检测 (抛洒、未加盖等)',
    time: '2026-10-19 11:30',
    location: '广西壮族自治区南宁市良庆区五象大道路口',
    cameraName: '五象大道卡口渣土车专项抓拍',
    plateNumber: '桂A·883K9',
    platform: '综合行政执法平台',
    result: 'AI自动比对准运证，联动市生态环境与渣土办跟进非现场处罚',
    handler: '渣土专项整治组',
    categoryKey: 'muck_truck'
  },
  {
    id: 'DA-20261018-009',
    type: '工地扬尘',
    time: '2026-10-18 17:15',
    location: '广西壮族自治区南宁市良庆区金龙路在建工地2标段',
    cameraName: '金龙工地PM2.5+扬尘监控C501',
    plateNumber: '工地喷淋系统',
    platform: '综合行政执法平台',
    result: '自动触发工地高空喷淋，10分钟内雾炮开启下降PM10',
    handler: '工地安全员',
    categoryKey: 'dust'
  },
  {
    id: 'DA-20261018-010',
    type: '道路积水',
    time: '2026-10-18 16:05',
    location: '广西壮族自治区南宁市良庆区五象立交下穿隧道',
    cameraName: '下穿隧道水深雷达传感器相机',
    plateNumber: '水深12cm',
    platform: '蓝麒麟指挥调度平台',
    result: '数字市政泵站自动开启抽排，半小时内积水退去恢复通车',
    handler: '市政应急抢险组',
    categoryKey: 'water'
  },
  {
    id: 'DA-20261018-011',
    type: '围挡施工规范',
    time: '2026-10-18 14:50',
    location: '广西壮族自治区南宁市良庆区金风路管道施工现场',
    cameraName: '金风路C402枪机',
    plateNumber: '水马围挡破损',
    platform: '综合行政执法平台',
    result: '施工方补齐反光水马与夜间警示红灯，隐患已排除',
    handler: '施工现场负责人',
    categoryKey: 'fence'
  },
  {
    id: 'DA-20261018-012',
    type: '执法人员工作规范',
    time: '2026-10-18 11:10',
    location: '广西壮族自治区南宁市良庆区五象网格执法服务站',
    cameraName: '服务站执法记录仪网关',
    plateNumber: '记录仪音视频规范',
    platform: '蓝麒麟指挥调度平台',
    result: '执法规范核验合格，考评得分100分',
    handler: '督察法规科',
    categoryKey: 'officer_norm'
  }
];

export const EventArchivePage: React.FC<EventArchivePageProps> = ({
  onBackToHome,
  onNavigateToTab,
  onSelectDetail
}) => {
  // Filter States
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('全部');
  const [dateInput, setDateInput] = useState<string>('2026-10-19 ~ 2026-10-19');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('全部');
  const [selectedDevice, setSelectedDevice] = useState<string>('全部');

  // Display view mode: 'grid' (视图) or 'list' (列表)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Multi-selection checkboxes
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Selected Detail Modal State
  const [activeArchiveDetail, setActiveArchiveDetail] = useState<ArchiveItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 13 Category Options matching exact screenshot buttons
  const eventTypeOptions = [
    '全部',
    '无照经营游商',
    '出店经营',
    '占道经营',
    '非机动车乱停放',
    '机动车乱停放',
    '违规户外广告',
    '乱堆物料',
    '渣土车检测',
    '工地扬尘',
    '道路积水',
    '围挡施工规范',
    '执法人员工作规范'
  ];

  // Time options matching screenshot buttons
  const timeOptions = ['今天', '昨天', '本周', '本月'];

  // Disposition platforms matching screenshot buttons
  const platformOptions = ['全部', '综合行政执法平台', '蓝麒麟指挥调度平台'];

  // Devices dropdown options
  const deviceOptions = [
    '全部',
    '直接部南门东侧球机C201',
    '金龙路商业街C204摄像头',
    '金东路口C102球机',
    '地铁金龙路站C口高清摄像头',
    '五象大道C301球机',
    '五象大道卡口渣土车专项抓拍'
  ];

  // Filtered Archive Items
  const filteredArchiveList = useMemo(() => {
    return MOCK_ARCHIVE_ITEMS.filter((item) => {
      // Type Filter
      if (selectedType !== '全部') {
        if (!item.type.includes(selectedType) && selectedType !== item.type) {
          return false;
        }
      }
      // Platform Filter
      if (selectedPlatform !== '全部' && !item.platform.includes(selectedPlatform)) {
        return false;
      }
      // Device Filter
      if (selectedDevice !== '全部' && !item.cameraName.includes(selectedDevice)) {
        return false;
      }
      return true;
    });
  }, [selectedType, selectedPlatform, selectedDevice]);

  // Handle Checkbox Selection
  const handleToggleSelect = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // If activeArchiveDetail is selected, render full-page EventArchiveDetailPage matching screenshot
  if (activeArchiveDetail) {
    return (
      <EventArchiveDetailPage
        item={activeArchiveDetail}
        onBack={() => setActiveArchiveDetail(null)}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-y-auto font-sans">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1890ff] text-white text-xs px-5 py-2.5 rounded shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. SUB-NAVIGATION TAG BAR: 首页 | ● 档案库 × (exact matching screenshot) */}
      <div className="bg-[#090e1c] border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          {/* Breadcrumb Home Button */}
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded text-xs text-slate-300 hover:text-white bg-[#0d1629] hover:bg-slate-800 transition border border-slate-700"
          >
            首页
          </button>

          {/* Active Tag: 档案库 */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded text-xs bg-[#1890ff] text-white font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>档案库</span>
            <button
              onClick={onBackToHome}
              className="ml-1 hover:bg-blue-600 rounded-full p-0.5 text-white/80 hover:text-white"
              title="关闭标签页"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          城管卷宗全量数据库 · 沉淀历史治理证据链
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="p-3.5 space-y-3.5">
        
        {/* ================= CARD 1: TOP MULTI-ROW FILTER PANEL (Exact Screenshot Layout) ================= */}
        <div className="bg-[#0d1629] rounded border border-slate-800 p-4 shadow-md space-y-3.5 text-xs">
          
          {/* Row 1: 预警类型 (13 Pill Buttons matching screenshot) */}
          <div className="flex items-start gap-3">
            <span className="text-slate-300 font-medium shrink-0 pt-1 w-16">预警类型</span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {eventTypeOptions.map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded transition text-xs font-medium ${
                      isActive
                        ? 'bg-[#1890ff] text-white font-bold shadow-xs'
                        : 'bg-[#090e1c] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: 预警时间 (Quick date buttons + Input) */}
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium shrink-0 w-16">预警时间</span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {timeOptions.map((time) => {
                const isActive = selectedTimeRange === time;
                return (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTimeRange(time);
                      if (time === '今天') setDateInput('2026-10-19 ~ 2026-10-19');
                      else if (time === '昨天') setDateInput('2026-10-18 ~ 2026-10-18');
                      else if (time === '本周') setDateInput('2026-10-13 ~ 2026-10-19');
                      else if (time === '本月') setDateInput('2026-10-01 ~ 2026-10-19');
                    }}
                    className={`px-4 py-1 rounded transition text-xs font-medium ${
                      isActive
                        ? 'bg-[#1890ff] text-white font-bold shadow-xs'
                        : 'bg-[#090e1c] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}

              <div className="flex items-center gap-1.5 bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1 text-slate-200">
                <input
                  type="text"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder="开始时间-结束时间"
                  className="w-44 bg-transparent text-xs focus:outline-hidden text-slate-200 placeholder:text-slate-500 font-mono"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Row 3: 处置平台 */}
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium shrink-0 w-16">处置平台</span>
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {platformOptions.map((plat) => {
                const isActive = selectedPlatform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => setSelectedPlatform(plat)}
                    className={`px-3 py-1 rounded transition text-xs font-medium ${
                      isActive
                        ? 'bg-[#1890ff] text-white font-bold shadow-xs'
                        : 'bg-[#090e1c] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {plat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: 设备名称 */}
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium shrink-0 w-16">设备名称</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDevice('全部')}
                className={`px-3 py-1 rounded transition text-xs font-medium ${
                  selectedDevice === '全部'
                    ? 'bg-[#1890ff] text-white font-bold shadow-xs'
                    : 'bg-[#090e1c] text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                全部
              </button>

              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="bg-[#090e1c] border border-slate-700 rounded px-3 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[160px]"
              >
                <option value="全部">请选择预警设备</option>
                {deviceOptions.slice(1).map((dev) => (
                  <option key={dev} value={dev}>{dev}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* ================= CARD 2: MAIN CONTENT ARCHIVE GRID & LIST (Matching Screenshot) ================= */}
        <div className="bg-[#0d1629] rounded border border-slate-800 p-3.5 shadow-md space-y-3">
          
          {/* Action Bar & View Switcher Bar */}
          <div className="flex items-center justify-between">
            {/* Left Yellow Export Button (matching screenshot) */}
            <button
              onClick={() => showToast('已成功导出选中档案库卷宗报表 (Excel)...')}
              className="px-3.5 py-1 rounded border border-amber-500/60 text-amber-400 hover:bg-amber-950/30 text-xs font-medium flex items-center gap-1.5 bg-[#090e1c] transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>导出</span>
            </button>

            {/* Right View Switch & Search/Refresh Utility */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded border border-slate-700 overflow-hidden bg-[#090e1c]">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition ${
                    viewMode === 'list'
                      ? 'bg-[#1890ff] text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>列表</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition ${
                    viewMode === 'grid'
                      ? 'bg-[#1890ff] text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>视图</span>
                </button>
              </div>

              <button
                onClick={() => showToast('档案库快速搜索框已激活')}
                title="搜索"
                className="p-1.5 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 text-slate-300 transition"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => showToast('已从档案云端数据库即时同步最新全量卷宗')}
                title="刷新数据"
                className="p-1.5 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 text-slate-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid View Mode (视图) - 8 Cards Grid matching screenshot */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredArchiveList.slice(0, 8).map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectDetail) {
                        onSelectDetail(item);
                      } else {
                        setActiveArchiveDetail(item);
                      }
                    }}
                    className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden shadow-xs hover:border-cyan-500/60 hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
                  >
                    {/* Card Image Viewport */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                      {/* High fidelity SVG Street Scene reproducing user screenshot */}
                      <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
                        {/* Street Asphalt */}
                        <rect width="400" height="250" fill="#475569" />
                        
                        {/* Upper Storefronts */}
                        <rect x="0" y="0" width="400" height="75" fill="#1e293b" />
                        
                        {/* Storefront 1: 柏花水会 */}
                        <rect x="10" y="15" width="110" height="40" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                        <text x="65" y="42" textAnchor="middle" fill="#dc2626" fontSize="17" fontWeight="bold">
                          柏花水会
                        </text>

                        {/* Storefront 2: 木屋烧烤 */}
                        <rect x="125" y="15" width="120" height="40" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                        <text x="185" y="42" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold">
                          木屋烧烤
                        </text>

                        {/* Storefront 3 */}
                        <rect x="250" y="15" width="90" height="40" fill="#ca8a04" />
                        <text x="295" y="42" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                          便民超市
                        </text>

                        {/* Sidewalk */}
                        <polygon points="0,75 145,75 155,250 0,250" fill="#64748b" />
                        <line x1="0" y1="130" x2="148" y2="130" stroke="#475569" strokeWidth="1" />
                        <line x1="0" y1="190" x2="152" y2="190" stroke="#475569" strokeWidth="1" />

                        {/* Roadway */}
                        <polygon points="145,75 400,75 400,250 155,250" fill="#334155" />
                        <line x1="200" y1="75" x2="220" y2="250" stroke="#ffffff" strokeWidth="2" strokeDasharray="15,10" />

                        {/* YELLOW perspective region */}
                        <polygon
                          points="170,240 310,240 275,95 240,95"
                          fill="rgba(234, 179, 8, 0.12)"
                          stroke="#eab308"
                          strokeWidth="1.5"
                        />

                        {/* Audi sedan */}
                        <g transform="translate(200, 120) scale(0.55)">
                          <path
                            d="M 15 135 L 35 48 C 45 28, 120 28, 130 48 L 150 135 Z"
                            fill="#cbd5e1"
                            stroke="#94a3b8"
                            strokeWidth="2"
                          />
                          <path d="M 40 52 L 48 35 C 55 30, 110 30, 118 35 L 125 52 Z" fill="#0f172a" />
                          <rect x="58" y="85" width="48" height="19" rx="2" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />
                          <text x="82" y="99" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                            {item.plateNumber.length > 8 ? '粤B·2N66V' : item.plateNumber}
                          </text>
                          <rect x="22" y="70" width="22" height="12" rx="2" fill="#ef4444" />
                          <rect x="122" y="70" width="22" height="12" rx="2" fill="#ef4444" />
                        </g>

                        {/* AI Detection box */}
                        <rect
                          x="205"
                          y="125"
                          width="85"
                          height="85"
                          fill="rgba(244, 63, 94, 0.08)"
                          stroke="#f43f5e"
                          strokeWidth="1.8"
                        />
                      </svg>

                      {/* Top-Left Select Checkbox */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(item.id);
                        }}
                        className="absolute top-2 left-2 z-10 w-4 h-4 rounded bg-slate-900/90 border border-slate-600 flex items-center justify-center cursor-pointer hover:border-cyan-400"
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                      </div>

                      {/* Top-Right Recent Time OSD */}
                      <div className="absolute top-1.5 right-2 text-white font-mono text-[9.5px] drop-shadow-md">
                        {item.time}
                      </div>

                      {/* Bottom-Left Camera Location Badge */}
                      <div className="absolute bottom-1.5 left-2 bg-black/75 px-1.5 py-0.5 rounded text-white text-[9px] font-mono">
                        直接部南门东侧球机
                      </div>

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-blue-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded bg-[#1890ff] text-white text-[11px] font-medium flex items-center gap-1 shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                          <span>调取调阅卷宗</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom Info matching exact screenshot format */}
                    <div className="p-2.5 space-y-1 bg-[#0d1629]">
                      {/* Line 1: Type on Left, Recent Date on Right */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.type}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{item.time}</span>
                      </div>

                      {/* Line 2: Location text */}
                      <div className="text-[11px] text-slate-400 truncate" title={item.location}>
                        {item.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View Mode (列表) */
            <div className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1629] text-slate-300 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.length === filteredArchiveList.length && filteredArchiveList.length > 0}
                        onChange={() => {
                          if (selectedItemIds.length === filteredArchiveList.length) {
                            setSelectedItemIds([]);
                          } else {
                            setSelectedItemIds(filteredArchiveList.map(e => e.id));
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="py-2.5 px-3">卷宗编号</th>
                    <th className="py-2.5 px-3">预警类型</th>
                    <th className="py-2.5 px-3">号牌/目标</th>
                    <th className="py-2.5 px-3">发生地点</th>
                    <th className="py-2.5 px-3">归档时间 (近期)</th>
                    <th className="py-2.5 px-3">处置平台</th>
                    <th className="py-2.5 px-3">归档整改结论</th>
                    <th className="py-2.5 px-3 text-right">调阅卷宗</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredArchiveList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-cyan-400">{item.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{item.type}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-100 font-medium">{item.plateNumber}</td>
                      <td className="py-2.5 px-3 max-w-xs truncate" title={item.location}>{item.location}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{item.time}</td>
                      <td className="py-2.5 px-3 text-slate-300">{item.platform}</td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-slate-400">{item.result}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setActiveArchiveDetail(item)}
                          className="px-2.5 py-1 rounded bg-[#1890ff] hover:bg-blue-600 text-white text-[11px] font-medium transition"
                        >
                          查看档案
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Bar at Bottom (Exact Screenshot Alignment) */}
          <div className="bg-[#090e1c] rounded border border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-300 shadow-xs">
            {/* Total Count */}
            <span>共 213 条</span>

            {/* Page Size Dropdown */}
            <select
              value={`${pageSize}条/页`}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="bg-[#0d1629] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-hidden"
            >
              <option value="8条/页">8条/页</option>
              <option value="10条/页">10条/页</option>
              <option value="20条/页">20条/页</option>
              <option value="50条/页">50条/页</option>
            </select>

            {/* Page buttons */}
            <div className="flex items-center gap-1 font-mono">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded border border-slate-700 bg-[#0d1629] hover:bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition ${
                    currentPage === p
                      ? 'bg-[#1890ff] text-white border border-[#1890ff]'
                      : 'bg-[#0d1629] border border-slate-700 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}

              <span className="px-1 text-slate-500">...</span>

              <button
                onClick={() => setCurrentPage(10)}
                className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition ${
                  currentPage === 10
                    ? 'bg-[#1890ff] text-white border border-[#1890ff]'
                    : 'bg-[#0d1629] border border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                10
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
                disabled={currentPage === 10}
                className="w-7 h-7 rounded border border-slate-700 bg-[#0d1629] hover:bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-1">
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-9 h-7 bg-[#0d1629] border border-slate-700 rounded text-center font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
              />
              <span>页</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
