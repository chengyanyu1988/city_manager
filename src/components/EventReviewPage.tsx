import React, { useState, useMemo } from 'react';
import {
  Bell,
  UserX,
  Store,
  Truck,
  Bike,
  Car,
  Tv,
  Boxes,
  Container,
  Sparkles,
  Waves,
  Hammer,
  ShieldAlert,
  Search,
  RotateCcw,
  Download,
  List,
  LayoutGrid,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  X,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  CornerUpLeft,
  Eye,
  Filter
} from 'lucide-react';
import { EventReviewDetailPage } from './EventReviewDetailPage';

export interface ReviewEventItem {
  id: string;
  type: string;
  time: string;
  location: string;
  cameraName: string;
  plateNumber: string;
  status: '待复核' | '已通过' | '已退回';
  dispatcher: string;
  dispatchTime: string;
  finishTime: string;
  rectificationNotes: string;
  handler: string;
  categoryKey: string;
}

interface EventReviewPageProps {
  onBackToHome?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectEventDetail?: (event: ReviewEventItem) => void;
}

// 43 Review Events with recent timestamps on October 18-19, 2026
const MOCK_REVIEW_EVENTS: ReviewEventItem[] = [
  {
    id: 'FH-20261019-001',
    type: '机动车乱停放',
    time: '2026-10-19 14:27',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府13栋',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '粤B·2N66V',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 14:35',
    finishTime: '2026-10-19 14:55',
    rectificationNotes: '已由网格执勤员现场拍照取证并劝离车辆，车主已将车辆驶入地下负一层泊位，黄色禁停网格线区域恢复畅通。',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-002',
    type: '机动车乱停放',
    time: '2026-10-19 11:56',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·998G1',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 12:05',
    finishTime: '2026-10-19 12:20',
    rectificationNotes: '现场张贴违法停车温馨告知单，车主在15分钟内赶到并自行移车，现场已复拍整改后照片。',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-003',
    type: '机动车乱停放',
    time: '2026-10-19 11:03',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府14栋',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·312K8',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 11:10',
    finishTime: '2026-10-19 11:28',
    rectificationNotes: '违停车辆占用无障碍通道，执勤队员到场协助拖移至合法路侧临泊位，通道恢复正常使用。',
    handler: '张警官 (铁骑02组)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-004',
    type: '机动车乱停放',
    time: '2026-10-19 10:55',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府商铺前',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·883K9',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 11:00',
    finishTime: '2026-10-19 11:18',
    rectificationNotes: '已由商管保安与执法队员联合处置，违规停放车辆已驶离商业步行内街。',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-005',
    type: '机动车乱停放',
    time: '2026-10-19 10:30',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府东门',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '粤S·775F2',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 10:35',
    finishTime: '2026-10-19 10:48',
    rectificationNotes: '车主临时装卸行李，现场已完成宣传教育，车主承诺不再占用人行盲道停靠并已驶离。',
    handler: '王队员 (机动巡查队)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-006',
    type: '机动车乱停放',
    time: '2026-10-19 10:21',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府地下车库入口旁',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·662T0',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 10:25',
    finishTime: '2026-10-19 10:42',
    rectificationNotes: '妨碍车库出入通道车辆已在物业协助下联系车主完成挪车。',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-007',
    type: '机动车乱停放',
    time: '2026-10-19 09:58',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府西侧主干道',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·112Y6',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 10:02',
    finishTime: '2026-10-19 10:20',
    rectificationNotes: '交警二大队铁骑到场依法录入非现场抓拍系统，违停车辆已被车主驶离。',
    handler: '交警二大队 (联合处置)',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-008',
    type: '机动车乱停放',
    time: '2026-10-19 09:36',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府南门辅道',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·054W8',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 09:40',
    finishTime: '2026-10-19 09:55',
    rectificationNotes: '违停车辆已劝离，现场人非隔离带护栏无破损，交通恢复顺畅。',
    handler: '李巡查员 (良庆第04网格)',
    categoryKey: 'car'
  },
  // Additional items for pages 2-6
  {
    id: 'FH-20261019-009',
    type: '机动车乱停放',
    time: '2026-10-19 09:12',
    location: '良庆区金龙路8号云星钱隆首府北门辅道',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '桂A·771M2',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 09:15',
    finishTime: '2026-10-19 09:30',
    rectificationNotes: '违停车辆已驶离现场。',
    handler: '李巡查员',
    categoryKey: 'car'
  },
  {
    id: 'FH-20261019-010',
    type: '机动车乱停放',
    time: '2026-10-19 08:45',
    location: '良庆区金龙路与歌海路交叉口西南角',
    cameraName: '金龙歌海交叉口球机',
    plateNumber: '桂A·229D5',
    status: '待复核',
    dispatcher: '良庆区智慧指挥中心',
    dispatchTime: '2026-10-19 08:50',
    finishTime: '2026-10-19 09:10',
    rectificationNotes: '已由执勤铁骑现场劝离。',
    handler: '张警官',
    categoryKey: 'car'
  }
];

export const EventReviewPage: React.FC<EventReviewPageProps> = ({
  onBackToHome,
  onNavigateToTab: _onNavigateToTab,
  onSelectEventDetail: _onSelectEventDetail
}) => {
  // Active Category Key for filtering
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('car');
  
  // Filter Toolbar States
  const [alertTypeFilter, setAlertTypeFilter] = useState('机动车乱停放');
  const [deviceNameFilter, setDeviceNameFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('2026-10-19 ~ 2026-10-19');
  const [alertStatusFilter, setAlertStatusFilter] = useState('预警中');
  const [handlePlatformFilter, setHandlePlatformFilter] = useState('');

  // View switch: 'grid' (视图) or 'list' (列表)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected cards for batch actions
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalCount = 43;

  // Review Inspection Modal
  const [activeReviewEvent, setActiveReviewEvent] = useState<ReviewEventItem | null>(null);
  const [reviewResult, setReviewResult] = useState<'approved' | 'rejected' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 13 Category Stats Cards matching the screenshot exactly
  const categoryCards = [
    { key: 'all', title: '全部预警', count: 238, icon: Bell },
    { key: 'vendor', title: '无照经营游商', count: 12, icon: UserX },
    { key: 'store_front', title: '出店经营', count: 31, icon: Store },
    { key: 'street_occupy', title: '占道经营', count: 64, icon: Truck },
    { key: 'bike', title: '非机动车乱停放', count: 29, icon: Bike },
    { key: 'car', title: '机动车乱停放', count: 43, icon: Car },
    { key: 'ad', title: '违规户外广告', count: 5, icon: Tv },
    { key: 'material', title: '乱堆物料', count: 26, icon: Boxes },
    { key: 'dirt_truck', title: '渣土车检测 (抛洒、未加盖等)', count: 9, icon: Container },
    { key: 'dust', title: '工地扬尘', count: 6, icon: Sparkles },
    { key: 'water', title: '道路积水', count: 5, icon: Waves },
    { key: 'construction', title: '围挡施工规范', count: 6, icon: Hammer },
    { key: 'personnel', title: '执法人员工作规范 (着装、玩手机)', count: 2, icon: ShieldAlert }
  ];

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered Events
  const displayedEvents = useMemo(() => {
    return MOCK_REVIEW_EVENTS.slice(0, pageSize);
  }, []);

  // Handle Approve Review
  const handleApprove = (event: ReviewEventItem) => {
    showToast(`工单 ${event.id} 复核通过，整改合规，已正式结案归档！`);
    setActiveReviewEvent(null);
  };

  // Handle Reject Review
  const handleReject = (event: ReviewEventItem) => {
    showToast(`工单 ${event.id} 复核未通过，已退回责任执勤队员限期20分钟内二次整改！`);
    setActiveReviewEvent(null);
  };

  // If an event is selected for review detail, render the dedicated EventReviewDetailPage (matching user screenshot)
  if (activeReviewEvent) {
    const currentIndex = MOCK_REVIEW_EVENTS.findIndex(e => e.id === activeReviewEvent.id);
    const prevEvent = currentIndex > 0 ? MOCK_REVIEW_EVENTS[currentIndex - 1] : undefined;
    const nextEvent = currentIndex < MOCK_REVIEW_EVENTS.length - 1 ? MOCK_REVIEW_EVENTS[currentIndex + 1] : undefined;

    return (
      <EventReviewDetailPage
        event={activeReviewEvent}
        onBack={() => setActiveReviewEvent(null)}
        onPrev={prevEvent ? () => setActiveReviewEvent(prevEvent) : undefined}
        onNext={nextEvent ? () => setActiveReviewEvent(nextEvent) : undefined}
        onArchive={(ev) => {
          handleApprove(ev);
        }}
        onRollback={(ev, reason) => {
          handleReject(ev);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-y-auto font-sans">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1890ff] text-white text-xs px-5 py-2.5 rounded shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. SUB-NAVIGATION TAG BAR: 首页 | ● 待复核 × (matching screenshot) */}
      <div className="bg-[#090e1c] border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          {/* Breadcrumb Home */}
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded text-xs text-slate-300 hover:text-white bg-[#0d1629] hover:bg-slate-800 transition border border-slate-700"
          >
            首页
          </button>

          {/* Active Tag: 待复核 */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded text-xs bg-[#1890ff] text-white font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>待复核</span>
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
          预警复核管理中心 · 待核验工单队列
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="p-3.5 space-y-3">
        
        {/* 2.1 CATEGORY METRICS CARDS (13 Cards in 2 Rows matching screenshot) */}
        <div className="space-y-2">
          {/* Row 1: 7 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {categoryCards.slice(0, 7).map((card) => {
              const Icon = card.icon;
              const isSelected = selectedCategoryKey === card.key;
              return (
                <div
                  key={card.key}
                  onClick={() => {
                    setSelectedCategoryKey(card.key);
                    setAlertTypeFilter(card.title === '全部预警' ? '全部' : card.title);
                  }}
                  className={`bg-[#0d1629] rounded border cursor-pointer transition flex overflow-hidden shadow-xs hover:border-emerald-500/50 ${
                    isSelected ? 'ring-2 ring-[#10b981] border-[#10b981]' : 'border-slate-800'
                  }`}
                >
                  {/* Left Green Square with White Icon */}
                  <div className="w-12 sm:w-14 bg-[#10b981] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Right Content */}
                  <div className="flex-1 py-1.5 px-2 flex flex-col justify-center text-center overflow-hidden">
                    <div className="text-[11px] text-slate-400 truncate font-medium leading-tight mb-0.5" title={card.title}>
                      {card.title}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white leading-tight">
                      {card.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: 6 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {categoryCards.slice(7, 13).map((card) => {
              const Icon = card.icon;
              const isSelected = selectedCategoryKey === card.key;
              return (
                <div
                  key={card.key}
                  onClick={() => {
                    setSelectedCategoryKey(card.key);
                    setAlertTypeFilter(card.title);
                  }}
                  className={`bg-[#0d1629] rounded border cursor-pointer transition flex overflow-hidden shadow-xs hover:border-emerald-500/50 ${
                    isSelected ? 'ring-2 ring-[#10b981] border-[#10b981]' : 'border-slate-800'
                  }`}
                >
                  {/* Left Green Square with White Icon */}
                  <div className="w-12 sm:w-14 bg-[#10b981] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Right Content */}
                  <div className="flex-1 py-1.5 px-2 flex flex-col justify-center text-center overflow-hidden">
                    <div className="text-[11px] text-slate-400 truncate font-medium leading-tight mb-0.5" title={card.title}>
                      {card.title}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white leading-tight">
                      {card.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.2 FILTER TOOLBAR (matching screenshot) */}
        <div className="bg-[#0d1629] rounded border border-slate-800 p-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* 预警类型 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">预警类型</span>
              <select
                value={alertTypeFilter}
                onChange={(e) => setAlertTypeFilter(e.target.value)}
                className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[130px]"
              >
                <option value="全部">全部类型</option>
                <option value="机动车乱停放">机动车乱停放</option>
                <option value="无照经营游商">无照经营游商</option>
                <option value="出店经营">出店经营</option>
                <option value="占道经营">占道经营</option>
                <option value="非机动车乱停放">非机动车乱停放</option>
                <option value="违规户外广告">违规户外广告</option>
                <option value="乱堆物料">乱堆物料</option>
                <option value="渣土车检测 (抛洒、未加盖等)">渣土车检测 (抛洒、未加盖等)</option>
              </select>
            </div>

            {/* 设备名称 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">设备名称</span>
              <input
                type="text"
                placeholder="请输入设备名称"
                value={deviceNameFilter}
                onChange={(e) => setDeviceNameFilter(e.target.value)}
                className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 w-36 placeholder:text-slate-500"
              />
            </div>

            {/* 预警时间 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">预警时间</span>
              <div className="flex items-center gap-1.5 bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200">
                <input
                  type="text"
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  placeholder="请选择日期 ~ 请选择日期"
                  className="w-48 bg-transparent text-xs focus:outline-hidden text-slate-200"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* 预警状态 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">预警状态</span>
              <select
                value={alertStatusFilter}
                onChange={(e) => setAlertStatusFilter(e.target.value)}
                className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[100px]"
              >
                <option value="预警中">预警中</option>
                <option value="待复核">待复核</option>
                <option value="已结案">已结案</option>
                <option value="全部">全部状态</option>
              </select>
            </div>

            {/* 处置平台 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">处置平台</span>
              <select
                value={handlePlatformFilter}
                onChange={(e) => setHandlePlatformFilter(e.target.value)}
                className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[110px]"
              >
                <option value="">请选择</option>
                <option value="智慧城管网格系统">智慧城管网格系统</option>
                <option value="公安交警集成指挥调度平台">公安交警集成指挥调度平台</option>
                <option value="12345市民热线联动平台">12345市民热线联动平台</option>
                <option value="数字市政管理云平台">数字市政管理云平台</option>
              </select>
            </div>

            {/* Action Buttons: 搜索 & 重置 */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => showToast('已按照筛选条件刷新待复核列表')}
                className="px-3.5 py-1.5 rounded bg-[#1890ff] hover:bg-blue-600 text-white font-medium flex items-center gap-1 transition shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              <button
                onClick={() => {
                  setAlertTypeFilter('机动车乱停放');
                  setDeviceNameFilter('');
                  setDateRangeFilter('2026-10-19 ~ 2026-10-19');
                  setAlertStatusFilter('预警中');
                  setHandlePlatformFilter('');
                  showToast('已重置搜索筛选条件');
                }}
                className="px-3.5 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>

          </div>
        </div>

        {/* 2.3 ACTION BAR & VIEW TOGGLE (matching screenshot) */}
        <div className="flex items-center justify-between">
          {/* Left Export Button */}
          <button
            onClick={() => showToast('正在导出待复核事件报表 (Excel)...')}
            className="px-3 py-1 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-950/30 text-xs font-medium flex items-center gap-1 bg-[#0d1629] transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>导出</span>
          </button>

          {/* Right View Switch & Utility */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center rounded border border-slate-700 overflow-hidden bg-[#090e1c]">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'list'
                    ? 'bg-[#1890ff] text-white'
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
                    ? 'bg-[#1890ff] text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>视图</span>
              </button>
            </div>

            <button
              title="搜索展开"
              className="p-1 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 text-slate-300 transition"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => showToast('待复核数据已即时刷新')}
              title="刷新数据"
              className="p-1 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2.4 MAIN CONTENT: 8 SURVEILLANCE CARDS GRID (4 cols x 2 rows, matching screenshot exactly!) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {displayedEvents.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveReviewEvent(item)}
                  className="bg-[#0d1629] rounded border border-slate-800 overflow-hidden shadow-xs hover:border-cyan-500/50 hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
                >
                  {/* Card Image Viewport */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    {/* SVG Vector Snapshot replicating street scene from screenshot */}
                    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
                      {/* Dark Asphalt Street */}
                      <rect width="400" height="250" fill="#475569" />
                      
                      {/* Upper Storefronts */}
                      <rect x="0" y="0" width="400" height="75" fill="#1e293b" />
                      
                      {/* Storefront 1: 柏花水会 (White sign with red text) */}
                      <rect x="10" y="15" width="110" height="40" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                      <text x="65" y="42" textAnchor="middle" fill="#dc2626" fontSize="17" fontWeight="bold">
                        柏花水会
                      </text>

                      {/* Storefront 2: 木屋烧烤 (Dark sign with red neon) */}
                      <rect x="125" y="15" width="120" height="40" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                      <text x="185" y="42" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="bold">
                        木屋烧烤
                      </text>

                      {/* Storefront 3 */}
                      <rect x="250" y="15" width="90" height="40" fill="#ca8a04" />
                      <text x="295" y="42" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                        便民超市
                      </text>

                      {/* Left Sidewalk */}
                      <polygon points="0,75 145,75 155,250 0,250" fill="#64748b" />
                      {/* Sidewalk pavement line */}
                      <line x1="0" y1="130" x2="148" y2="130" stroke="#475569" strokeWidth="1" />
                      <line x1="0" y1="190" x2="152" y2="190" stroke="#475569" strokeWidth="1" />

                      {/* Roadway asphalt */}
                      <polygon points="145,75 400,75 400,250 155,250" fill="#334155" />
                      
                      {/* Lane divider */}
                      <line x1="200" y1="75" x2="220" y2="250" stroke="#ffffff" strokeWidth="2" strokeDasharray="15,10" />

                      {/* YELLOW NO-PARKING ZONE POLYGON (matching screenshot) */}
                      <polygon
                        points="170,240 310,240 275,95 240,95"
                        fill="rgba(234, 179, 8, 0.12)"
                        stroke="#eab308"
                        strokeWidth="1.5"
                      />

                      {/* Violating Silver Car */}
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
                          {item.plateNumber}
                        </text>
                        <rect x="22" y="70" width="22" height="12" rx="2" fill="#ef4444" />
                        <rect x="122" y="70" width="22" height="12" rx="2" fill="#ef4444" />
                        <ellipse cx="22" cy="138" rx="12" ry="16" fill="#0f172a" />
                        <ellipse cx="144" cy="138" rx="12" ry="16" fill="#0f172a" />
                      </g>

                      {/* RED AI DETECTION BOUNDING BOX (matching screenshot) */}
                      <rect
                        x="205"
                        y="125"
                        width="85"
                        height="85"
                        fill="rgba(244, 63, 94, 0.08)"
                        stroke="#f43f5e"
                        strokeWidth="1.8"
                      />

                      {/* Foreground Red Vehicle Corner */}
                      <g transform="translate(90, 155) scale(0.5)">
                        <path d="M 50 190 L 120 40 L 290 85 L 280 190 Z" fill="#7f1d1d" stroke="#991b1b" strokeWidth="2" />
                      </g>
                    </svg>

                    {/* Checkbox at Top-Left */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(item.id);
                      }}
                      className="absolute top-2 left-2 z-10 w-4 h-4 rounded bg-slate-900/90 border border-slate-600 flex items-center justify-center cursor-pointer hover:border-cyan-400"
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                    </div>

                    {/* Camera OSD at Top-Right */}
                    <div className="absolute top-1.5 right-2 text-white font-mono text-[9px] drop-shadow-md">
                      {item.time}
                    </div>

                    {/* Camera Location Badge at Bottom-Left */}
                    <div className="absolute bottom-1.5 left-2 bg-black/70 px-1.5 py-0.5 rounded text-white text-[9px] font-mono">
                      直接部南门东侧球机
                    </div>

                    {/* Hover Review Hint */}
                    <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded bg-[#1890ff] text-white text-[11px] font-medium flex items-center gap-1 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>点击进行审核复核</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Info (matching screenshot exactly!) */}
                  <div className="p-2.5 space-y-1">
                    {/* Row 1: Event Type on Left, Recent Time on Right */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{item.type}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.time}</span>
                    </div>

                    {/* Row 2: Location Address */}
                    <div className="text-[11px] text-slate-400 truncate" title={item.location}>
                      {item.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-[#0d1629] rounded border border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1c] text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.length === displayedEvents.length && displayedEvents.length > 0}
                      onChange={() => {
                        if (selectedItemIds.length === displayedEvents.length) {
                          setSelectedItemIds([]);
                        } else {
                          setSelectedItemIds(displayedEvents.map(e => e.id));
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="py-2.5 px-3">工单编号</th>
                  <th className="py-2.5 px-3">预警类型</th>
                  <th className="py-2.5 px-3">号牌/目标</th>
                  <th className="py-2.5 px-3">发生地点</th>
                  <th className="py-2.5 px-3">预警时间 (近期)</th>
                  <th className="py-2.5 px-3">处置人员</th>
                  <th className="py-2.5 px-3">整改结果</th>
                  <th className="py-2.5 px-3 text-right">复核操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {displayedEvents.map((item) => (
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
                    <td className="py-2.5 px-3">{item.handler}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-400">{item.rectificationNotes}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setActiveReviewEvent(item)}
                        className="px-2.5 py-1 rounded bg-[#1890ff] hover:bg-blue-600 text-white text-[11px] font-medium transition"
                      >
                        审核复核
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2.5 PAGINATION BAR AT BOTTOM (matching screenshot exactly!) */}
        <div className="bg-[#0d1629] rounded border border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-300 shadow-xs">
          {/* Total Count */}
          <span>共 {totalCount} 条</span>

          {/* Page Size Select */}
          <select
            defaultValue="8条/页"
            className="bg-[#090e1c] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-hidden"
          >
            <option>8条/页</option>
            <option>16条/页</option>
            <option>24条/页</option>
            <option>32条/页</option>
          </select>

          {/* Page buttons */}
          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
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
                    : 'bg-[#090e1c] border border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
              disabled={currentPage === 6}
              className="w-7 h-7 rounded border border-slate-700 bg-[#090e1c] hover:bg-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Go to page */}
          <div className="flex items-center gap-1">
            <span>前往</span>
            <input
              type="text"
              defaultValue="1"
              className="w-9 h-7 bg-[#090e1c] border border-slate-700 rounded text-center font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
            />
            <span>页</span>
          </div>
        </div>

      </div>

    </div>
  );
};
