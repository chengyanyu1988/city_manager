import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
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
  FileCheck,
  MapPin,
  Camera,
  Layers,
  Store,
  Car,
  Truck,
  Box,
  Droplets,
  HardHat,
  UserCheck,
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';
import { EventFalseAlarmDetailPage } from './EventFalseAlarmDetailPage';

export interface FalseAlarmItem {
  id: string;
  type: string;
  time: string;
  location: string;
  cameraName: string;
  plateNumber: string;
  platform: string;
  reason: string;
  reviewer: string;
  imgUrl: string;
}

interface EventFalseAlarmPageProps {
  onBackToHome?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

// Mock False Alarm Items matching screenshot with recent 2026-10-19 timestamps
const MOCK_FALSE_ALARM_ITEMS: FalseAlarmItem[] = [
  {
    id: 'WB-20261019-001',
    type: '机动车乱停放',
    time: '2026-10-19 15:58',
    location: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府13栋',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '粤B·2N66V',
    platform: '综合行政执法平台',
    reason: '临停卸货/准停时段车辆 (算法光线误判)',
    reviewer: '王明 (值班员)',
    imgUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-002',
    type: '无照经营游商',
    time: '2026-10-19 15:45',
    location: '广西壮族自治区南宁市良庆区金龙路12号商业街广场',
    cameraName: '金龙路商业街C204摄像头',
    plateNumber: '合规宣传展台',
    platform: '蓝麒麟指挥调度平台',
    reason: '已报备社区合规公益活动',
    reviewer: '李巡查员',
    imgUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-003',
    type: '出店经营',
    time: '2026-10-19 15:20',
    location: '广西壮族自治区南宁市良庆区金龙路8号钱隆首府11栋商铺',
    cameraName: '直接部南门东侧球机C201',
    plateNumber: '柏花水会门前摆件',
    platform: '综合行政执法平台',
    reason: '商家临时装卸货物物品',
    reviewer: '张珊珊',
    imgUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-004',
    type: '占道经营',
    time: '2026-10-19 14:50',
    location: '广西壮族自治区南宁市良庆区金东路口盲道旁',
    cameraName: '金东路口C102球机',
    plateNumber: '市政作业三轮车',
    platform: '蓝麒麟指挥调度平台',
    reason: '市政绿化维护作业车辆',
    reviewer: '王振',
    imgUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-005',
    type: '乱堆物料',
    time: '2026-10-19 14:15',
    location: '广西壮族自治区南宁市良庆区五象大道C301段',
    cameraName: '五象大道C301球机',
    plateNumber: '修路临时材料',
    platform: '综合行政执法平台',
    reason: '道路修补工程临时堆料',
    reviewer: '刘队长',
    imgUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-006',
    type: '渣土车检测 (抛洒、未加盖等)',
    time: '2026-10-19 13:40',
    location: '广西壮族自治区南宁市良庆区五象大道卡口',
    cameraName: '五象大道卡口渣土车专项抓拍',
    plateNumber: '桂A·90812',
    platform: '蓝麒麟指挥调度平台',
    reason: '顶棚已完全闭合 (反光误识别)',
    reviewer: '李亮',
    imgUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-007',
    type: '工地扬尘',
    time: '2026-10-19 12:30',
    location: '广西壮族自治区南宁市良庆区金凤路工程工地',
    cameraName: '金凤路工地C401',
    plateNumber: '喷淋降尘水雾',
    platform: '综合行政执法平台',
    reason: '降尘喷雾误识别为扬尘',
    reviewer: '王明',
    imgUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'WB-20261019-008',
    type: '机动车乱停放',
    time: '2026-10-19 11:10',
    location: '广西壮族自治区南宁市良庆区金龙路地铁口C口',
    cameraName: '地铁金龙路站C口高清摄像头',
    plateNumber: '桂A·K8821',
    platform: '蓝麒麟指挥调度平台',
    reason: '即停即走打车乘客上下车',
    reviewer: '张珊珊',
    imgUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
  }
];

export const EventFalseAlarmPage: React.FC<EventFalseAlarmPageProps> = ({
  onBackToHome,
  onNavigateToTab
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('全部');
  const [deviceSearch, setDeviceSearch] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [activeDetailItem, setActiveDetailItem] = useState<FalseAlarmItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 13 Category Cards Data matching exact screenshot numbers
  const statCategories = [
    { key: '全部', title: '全部误报', count: 345, icon: ShieldAlert, color: 'text-purple-400' },
    { key: '无照经营游商', title: '无照经营游商', count: 347, icon: Store, color: 'text-emerald-400' },
    { key: '出店经营', title: '出店经营', count: 347, icon: Store, color: 'text-blue-400' },
    { key: '占道经营', title: '占道经营', count: 347, icon: Truck, color: 'text-indigo-400' },
    { key: '非机动车乱停放', title: '非机动车乱停放', count: 347, icon: Car, color: 'text-cyan-400' },
    { key: '机动车乱停放', title: '机动车乱停放', count: 347, icon: Car, color: 'text-rose-400' },
    { key: '违规户外广告', title: '违规户外广告', count: 347, icon: Layers, color: 'text-purple-400' },
    { key: '乱堆物料', title: '乱堆物料', count: 347, icon: Box, color: 'text-yellow-400' },
    { key: '渣土车检测', title: '渣土车检测 (抛洒、未加盖等)', count: 347, icon: Truck, color: 'text-amber-500' },
    { key: '工地扬尘', title: '工地扬尘', count: 347, icon: HardHat, color: 'text-slate-400' },
    { key: '道路积水', title: '道路积水', count: 347, icon: Droplets, color: 'text-cyan-300' },
    { key: '围挡施工规范', title: '围挡施工规范', count: 347, icon: FileCheck, color: 'text-teal-400' },
    { key: '执法人员工作规范', title: '执法人员工作规范 (着装、玩手机)', count: 347, icon: UserCheck, color: 'text-emerald-300' }
  ];

  // Filter items
  const filteredList = useMemo(() => {
    return MOCK_FALSE_ALARM_ITEMS.filter(item => {
      if (selectedType !== '全部') {
        if (!item.type.includes(selectedType) && selectedType !== item.type) {
          return false;
        }
      }
      if (selectedPlatform !== '全部' && !item.platform.includes(selectedPlatform)) {
        return false;
      }
      if (deviceSearch.trim() && !item.cameraName.includes(deviceSearch) && !item.location.includes(deviceSearch)) {
        return false;
      }
      return true;
    });
  }, [selectedType, selectedPlatform, deviceSearch]);

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchExport = () => {
    if (selectedItemIds.length === 0) {
      showToast('已生成当前全部 213 条误报归档卷宗分析报告 (Excel/PDF)');
    } else {
      showToast(`已成功导出选中的 ${selectedItemIds.length} 条误报事件记录`);
    }
  };

  // If viewing detail modal/view
  if (activeDetailItem) {
    return (
      <EventFalseAlarmDetailPage
        item={activeDetailItem}
        onBack={() => setActiveDetailItem(null)}
        onDelete={(id) => {
          showToast(`已成功彻底删除误报事件记录 [${id}]`);
          setActiveDetailItem(null);
        }}
        onRestore={(id) => {
          showToast(`已成功将误报事件 [${id}] 还原至未处置事件中心！`);
          setActiveDetailItem(null);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-y-auto font-sans">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs px-5 py-2.5 rounded shadow-xl flex items-center gap-2 animate-bounce border border-indigo-300/40">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. SUB-NAVIGATION TAG BAR: 首页 | ● 误报事件 × (exact screenshot match) */}
      <div className="bg-[#090e1c] border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded bg-[#0d1629] hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 transition"
          >
            首页
          </button>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2f74ff] text-white text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-300" />
            <span>误报事件</span>
            <button className="ml-1 hover:text-slate-200">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          <span>全区算法误报优化与归档库</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-3 flex-1">

        {/* 2. TOP 13 CATEGORY STAT CARDS GRID (Exact Screenshot Match) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {statCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedType === cat.key;
            return (
              <div
                key={cat.key}
                onClick={() => setSelectedType(cat.key)}
                className={`bg-[#0d1629] rounded-md border p-2.5 flex items-center gap-2 cursor-pointer transition shadow-sm ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 shadow-purple-500/10'
                    : 'border-slate-800 hover:border-cyan-500/40 hover:bg-[#131f38]'
                }`}
              >
                {/* Green/Cyan Badge Icon Square (Screenshot Style) */}
                <div className="w-9 h-9 rounded bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-300 font-medium truncate" title={cat.title}>
                    {cat.title}
                  </p>
                  <p className="text-base font-bold font-mono text-white leading-tight">
                    {cat.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. MULTI-CONDITION FILTER TOOLBAR (Exact Screenshot Match) */}
        <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 p-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs shadow-md">
          {/* 预警类型 Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">预警类型</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[130px]"
            >
              <option value="全部">无照经营游商</option>
              {statCategories.filter(c => c.key !== '全部').map((c) => (
                <option key={c.key} value={c.key}>{c.key}</option>
              ))}
            </select>
          </div>

          {/* 设备名称 Input */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">设备名称</span>
            <input
              type="text"
              placeholder="请输入设备名称"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 w-36"
            />
          </div>

          {/* 预警时间 Date Range Picker */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">预警时间</span>
            <div className="flex items-center gap-1 bg-[#090e1c] border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs">
              <input
                type="text"
                placeholder="请选择日期"
                defaultValue="2026-10-18"
                className="bg-transparent w-20 text-center focus:outline-hidden text-slate-200"
              />
              <span className="text-slate-500">~</span>
              <input
                type="text"
                placeholder="请选择日期"
                defaultValue="2026-10-19"
                className="bg-transparent w-20 text-center focus:outline-hidden text-slate-200"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* 预警状态 Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">预警状态</span>
            <select
              defaultValue="预警中"
              className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
            >
              <option value="预警中">预警中</option>
              <option value="已归档">误报归档</option>
              <option value="全部">全部状态</option>
            </select>
          </div>

          {/* 处置平台 Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">处置平台</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#090e1c] border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500 min-w-[120px]"
            >
              <option value="全部">请选择</option>
              <option value="综合行政执法平台">综合行政执法平台</option>
              <option value="蓝麒麟指挥调度平台">蓝麒麟指挥调度平台</option>
            </select>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => showToast('已筛选更新近期误报归档事件')}
              className="px-3 py-1 rounded bg-[#1890ff] hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('全部');
                setSelectedPlatform('全部');
                setDeviceSearch('');
                showToast('已重置筛选条件');
              }}
              className="px-3 py-1 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 4. WORKSPACE TOOLBAR (Export + View Mode Toggle) */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchExport}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: 列表 vs 视图 */}
            <div className="bg-[#0d1629] p-0.5 rounded border border-slate-700 flex items-center text-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition font-medium cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#1890ff] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>列表</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition font-medium cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#1890ff] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>视图</span>
              </button>
            </div>

            <button
              onClick={() => showToast('已刷新近期误报事件状态')}
              className="p-1.5 rounded bg-[#0d1629] border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. CARDS GRID VIEW OR LIST VIEW */}
        {viewMode === 'grid' ? (
          /* GRID MODE (Exact Screenshot Layout - 4 columns x 2 rows) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredList.slice(0, 8).map((item) => {
              const isChecked = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveDetailItem(item)}
                  className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg overflow-hidden group hover:border-purple-500/60 hover:shadow-purple-500/10 transition flex flex-col cursor-pointer"
                >
                  {/* Image Header Container */}
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img
                      src={item.imgUrl}
                      alt={item.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Red Detection Bounding Box Simulation */}
                    <div className="absolute inset-x-6 inset-y-4 border-2 border-rose-500 bg-rose-500/10 rounded-xs pointer-events-none" />

                    {/* Checkbox (Top Left) */}
                    <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(item.id)}
                        className="w-4 h-4 rounded border-slate-600 text-purple-600 focus:ring-0 bg-black/60 cursor-pointer"
                      />
                    </div>

                    {/* Blue/Purple False Alarm Pill Badge (Top Right - Exact Screenshot Match) */}
                    <div className="absolute top-2 right-2 z-10 bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded shadow-md flex items-center gap-1 font-mono">
                      <FileCheck className="w-3 h-3 text-white" />
                      <span>误报</span>
                    </div>

                    {/* Detail Hover Badge Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDetailItem(item);
                      }}
                      className="absolute bottom-2 right-2 bg-black/80 hover:bg-cyan-600 text-white text-[11px] px-2.5 py-1 rounded shadow transition flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>调阅详情</span>
                    </button>
                  </div>

                  {/* Card Bottom Body */}
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition">{item.type}</span>
                        <span className="text-[11px] font-mono text-slate-400">{item.time}</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug" title={item.location}>
                        {item.location}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-purple-300 truncate max-w-[170px]" title={item.reason}>原因: {item.reason}</span>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">{item.reviewer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE LIST MODE */
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#090e1c] border-b border-cyan-500/20 text-slate-300 font-semibold">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.length === filteredList.length && filteredList.length > 0}
                      onChange={() => {
                        if (selectedItemIds.length === filteredList.length) {
                          setSelectedItemIds([]);
                        } else {
                          setSelectedItemIds(filteredList.map(i => i.id));
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="py-2.5 px-3">预警编号</th>
                  <th className="py-2.5 px-3">违规类型</th>
                  <th className="py-2.5 px-3">发生位置</th>
                  <th className="py-2.5 px-3">预警时间 (近期)</th>
                  <th className="py-2.5 px-3">误报判定原因</th>
                  <th className="py-2.5 px-3">审核责任人</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveDetailItem(item)}
                    className="hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{item.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{item.type}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate" title={item.location}>{item.location}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{item.time}</td>
                    <td className="py-2.5 px-3 text-purple-300">{item.reason}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">{item.reviewer}</td>
                    <td className="py-2.5 px-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveDetailItem(item)}
                        className="px-2.5 py-1 rounded bg-[#1890ff] hover:bg-blue-600 text-white text-[11px] font-medium cursor-pointer"
                      >
                        调阅
                      </button>
                      <button
                        onClick={() => showToast(`已将工单 ${item.id} 提交二次算法标注复核`)}
                        className="px-2.5 py-1 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                      >
                        算法训练
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. PAGINATION BAR AT BOTTOM (Exact Screenshot Match: 共213条 10条/页) */}
        <div className="bg-[#090e1c] rounded border border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-end gap-3 text-xs text-slate-300 shadow-xs">
          <span>共 213 条</span>

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
                className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
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
              className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
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
  );
};
