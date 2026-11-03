import React, { useState, useMemo } from 'react';
import {
  Building2,
  Building,
  MapPin,
  Search,
  RotateCcw,
  Plus,
  Upload,
  Download,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Phone,
  User,
  CreditCard,
  Store,
  Home,
  Check,
  Calendar,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { EnterpriseSubjectDetailPage } from './EnterpriseSubjectDetailPage';

export interface EnterpriseSubject {
  id: string;
  name: string;
  creditCode: string;
  address: string;
  street: '衡阳街道' | '北湖街道' | '西乡塘街道' | '良庆街道';
  manager: string;
  phone: string;
  status: '正常经营' | '已注销' | '暂停营业' | '营业中';
  registeredDate: string;
  deregisteredDate?: string;
  cancelReason?: string;
  imageUrl: string;
  category: string;
  safetyScore: number;
}

interface SubjectManagementPageProps {
  onBackToHome: () => void;
  currentSubTab?: 'enterprise' | 'cancelled';
  onSubTabChange?: (sub: 'enterprise' | 'cancelled') => void;
  theme?: string;
}

// Mock initial data matching screenshot content and recent 2026 timestamps
const INITIAL_ENTERPRISE_SUBJECTS: EnterpriseSubject[] = [
  {
    id: 'ENT-001',
    name: '好味道烫菜坊',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '西乡塘街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-09-12 10:30',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 98,
  },
  {
    id: 'ENT-002',
    name: '好味道烫菜坊 (衡阳店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '衡阳街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-09-15 11:20',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 95,
  },
  {
    id: 'ENT-003',
    name: '好味道烫菜坊 (第二分店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '衡阳街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-09-20 09:15',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 92,
  },
  {
    id: 'ENT-004',
    name: '好味道烫菜坊 (北湖店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '北湖街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-09-25 14:00',
    imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 96,
  },
  {
    id: 'ENT-005',
    name: '桂林米粉旗舰店',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '衡阳街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-10-01 16:45',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 90,
  },
  {
    id: 'ENT-006',
    name: '柳州螺蛳粉专营店',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '北湖街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-10-05 08:30',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    category: '小吃快餐',
    safetyScore: 94,
  },
  {
    id: 'ENT-007',
    name: '老百姓大药房',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '北湖街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-10-10 11:10',
    imageUrl: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=400&q=80',
    category: '医药零售',
    safetyScore: 99,
  },
  {
    id: 'ENT-008',
    name: '便利蜂生鲜超市',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '衡阳街道',
    manager: '张良东',
    phone: '13800138000',
    status: '正常经营',
    registeredDate: '2026-10-14 15:20',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80',
    category: '便利零售',
    safetyScore: 97,
  },
];

const INITIAL_CANCELLED_SUBJECTS: EnterpriseSubject[] = [
  {
    id: 'ENT-CAN-001',
    name: '好味道烫菜坊',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '良庆街道',
    manager: '李亮',
    phone: '13800138000',
    status: '已注销',
    registeredDate: '2025-05-10 09:00',
    deregisteredDate: '2026-10-02 14:30',
    cancelReason: '营业执照到期，自主申请注销关停',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 82,
  },
  {
    id: 'ENT-CAN-002',
    name: '好味道烫菜坊 (二分店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '良庆街道',
    manager: '李亮',
    phone: '13800138000',
    status: '已注销',
    registeredDate: '2025-06-15 10:20',
    deregisteredDate: '2026-10-05 11:15',
    cancelReason: '店铺搬迁合并，注销登记',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 88,
  },
  {
    id: 'ENT-CAN-003',
    name: '好味道烫菜坊 (三分店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '良庆街道',
    manager: '李亮',
    phone: '13800138000',
    status: '已注销',
    registeredDate: '2025-07-20 14:00',
    deregisteredDate: '2026-10-10 16:50',
    cancelReason: '经营调整，自主办理关停注销',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 85,
  },
  {
    id: 'ENT-CAN-004',
    name: '好味道烫菜坊 (四分店)',
    creditCode: '92360902MA3A847Y9M',
    address: '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府12栋212',
    street: '良庆街道',
    manager: '李亮',
    phone: '13800138000',
    status: '已注销',
    registeredDate: '2025-08-11 11:30',
    deregisteredDate: '2026-10-12 09:40',
    cancelReason: '店铺转让关停，注销主体',
    imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 90,
  },
  {
    id: 'ENT-CAN-005',
    name: '旧市井麻辣烫店',
    creditCode: '92360902MA3A112X8A',
    address: '广西壮族自治区南宁市衡阳西路42号',
    street: '衡阳街道',
    manager: '刘志强',
    phone: '13977112233',
    status: '已注销',
    registeredDate: '2025-05-10 09:00',
    deregisteredDate: '2026-10-02 14:30',
    cancelReason: '营业执照到期，自主申请注销',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    category: '餐饮服务',
    safetyScore: 80,
  },
  {
    id: 'ENT-CAN-006',
    name: '西乡塘快客便利店',
    creditCode: '92360902MA3B889Y1C',
    address: '广西壮族自治区南宁市西乡塘大道108号',
    street: '西乡塘街道',
    manager: '陈建国',
    phone: '13788119900',
    status: '已注销',
    registeredDate: '2025-08-18 10:20',
    deregisteredDate: '2026-10-08 11:15',
    cancelReason: '店铺搬迁合并，注销登记',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
    category: '零售超市',
    safetyScore: 85,
  },
  {
    id: 'ENT-CAN-007',
    name: '北湖冷饮小吃店',
    creditCode: '92360902MA3C776Z2B',
    address: '广西壮族自治区南宁市北湖路28号',
    street: '北湖街道',
    manager: '王秀英',
    phone: '13666228811',
    status: '已注销',
    registeredDate: '2025-03-01 14:00',
    deregisteredDate: '2026-10-12 16:50',
    cancelReason: '无照经营屡教不改，依法吊销注销',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    category: '小吃冷饮',
    safetyScore: 60,
  },
  {
    id: 'ENT-CAN-008',
    name: '良庆街角小夜市',
    creditCode: '92360902MA3D998W3D',
    address: '广西壮族自治区南宁市良庆区金龙路16号',
    street: '良庆街道',
    manager: '赵国庆',
    phone: '13500001122',
    status: '已注销',
    registeredDate: '2025-09-01 18:00',
    deregisteredDate: '2026-10-15 10:30',
    cancelReason: '夜市场地调整关停',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    category: '餐饮夜市',
    safetyScore: 75,
  },
];

export const SubjectManagementPage: React.FC<SubjectManagementPageProps> = ({
  onBackToHome,
  currentSubTab = 'enterprise',
  onSubTabChange,
}) => {
  // Active Tab state
  const [activeTab, setActiveTab] = useState<'enterprise' | 'cancelled'>(currentSubTab);

  React.useEffect(() => {
    if (currentSubTab) {
      setActiveTab(currentSubTab);
    }
  }, [currentSubTab]);

  // Data state
  const [enterprises, setEnterprises] = useState<EnterpriseSubject[]>(INITIAL_ENTERPRISE_SUBJECTS);
  const [cancelledList, setCancelledList] = useState<EnterpriseSubject[]>(INITIAL_CANCELLED_SUBJECTS);

  // View Mode: 'grid' (田 视图) or 'list' (☰ 列表) - default 'grid' matching screenshot
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search filter states
  const [searchName, setSearchName] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [searchManager, setSearchManager] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  // Selected checkbox IDs for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [activeDetailItem, setActiveDetailItem] = useState<EnterpriseSubject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New subject form state
  const [newSubject, setNewSubject] = useState({
    name: '',
    creditCode: '',
    street: '衡阳街道' as const,
    address: '',
    manager: '',
    phone: '',
    category: '餐饮服务',
  });

  const handleTabSwitch = (tab: 'enterprise' | 'cancelled') => {
    setActiveTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  // Current list based on active tab
  const currentRawList = activeTab === 'enterprise' ? enterprises : cancelledList;

  // Filtered dataset
  const filteredList = useMemo(() => {
    return currentRawList.filter((item) => {
      const matchName = searchName === '' || item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchStreet = selectedStreet === '' || item.street === selectedStreet;
      const matchManager = searchManager === '' || item.manager.includes(searchManager);
      const matchPhone = searchPhone === '' || item.phone.includes(searchPhone);
      return matchName && matchStreet && matchManager && matchPhone;
    });
  }, [currentRawList, searchName, selectedStreet, searchManager, searchPhone]);

  // Handle Search Reset
  const handleReset = () => {
    setSearchName('');
    setSelectedStreet('');
    setSearchManager('');
    setSearchPhone('');
  };

  // Add new Enterprise Subject
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.creditCode) {
      alert('请填写完整企业名称和统一社会信用代码');
      return;
    }
    const createdItem: EnterpriseSubject = {
      id: `ENT-${Date.now()}`,
      name: newSubject.name,
      creditCode: newSubject.creditCode,
      street: newSubject.street,
      address: newSubject.address || '广西壮族自治区南宁市良庆区金龙路8号',
      manager: newSubject.manager || '张良东',
      phone: newSubject.phone || '13800138000',
      status: '正常经营',
      registeredDate: '2026-10-19 18:30',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      category: newSubject.category,
      safetyScore: 100,
    };

    setEnterprises([createdItem, ...enterprises]);
    setIsAddModalOpen(false);
    showToast(`成功新增企业主体【${newSubject.name}】！`);
    setNewSubject({
      name: '',
      creditCode: '',
      street: '衡阳街道',
      address: '',
      manager: '',
      phone: '',
      category: '餐饮服务',
    });
  };

  // Deregister / Cancel Enterprise
  const handleCancelEnterprise = (item: EnterpriseSubject) => {
    if (confirm(`确定将【${item.name}】标注为已注销主体吗？`)) {
      setEnterprises((prev) => prev.filter((i) => i.id !== item.id));
      const cancelledItem: EnterpriseSubject = {
        ...item,
        status: '已注销',
        deregisteredDate: '2026-10-19 18:35',
        cancelReason: '自主申办关停注销',
      };
      setCancelledList([cancelledItem, ...cancelledList]);
      showToast(`已将【${item.name}】移至【已注销主体】档案库！`);
      if (activeDetailItem?.id === item.id) {
        setActiveDetailItem(null);
      }
    }
  };

  // Restore Cancelled Enterprise
  const handleRestoreEnterprise = (item: EnterpriseSubject) => {
    setCancelledList((prev) => prev.filter((i) => i.id !== item.id));
    const restoredItem: EnterpriseSubject = {
      ...item,
      status: '正常经营',
    };
    setEnterprises([restoredItem, ...enterprises]);
    showToast(`已还原恢复【${item.name}】为正常经营企业主体！`);
    if (activeDetailItem?.id === item.id) {
      setActiveDetailItem(null);
    }
  };

  // Stats calculation
  const totalCount = activeTab === 'enterprise' ? 347 : 42;
  const hengyangCount = activeTab === 'enterprise' ? 173 : 21;
  const beihuCount = activeTab === 'enterprise' ? 75 : 12;
  const xixiangtangCount = activeTab === 'enterprise' ? 99 : 9;

  // If activeDetailItem is selected, render full-page detail matching screenshot
  if (activeDetailItem) {
    return (
      <EnterpriseSubjectDetailPage
        subject={activeDetailItem}
        onBack={() => setActiveDetailItem(null)}
        onCancel={handleCancelEnterprise}
        onRestore={handleRestoreEnterprise}
      />
    );
  }

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-hidden select-text relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP SUB-NAV & BREADCRUMB BAR */}
      <div className="bg-[#0b1324] border-b border-cyan-500/20 px-5 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded bg-[#131f37] hover:bg-cyan-950 text-slate-300 hover:text-white text-xs font-medium border border-cyan-500/30 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>首页</span>
          </button>

          <span className="text-slate-600">/</span>

          {/* Subtab Badges Matching User Screenshot */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabSwitch('enterprise')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'enterprise'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                  : 'bg-[#131f37] text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
              <span>● 企业主体</span>
              {activeTab === 'enterprise' && <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />}
            </button>

            <button
              onClick={() => handleTabSwitch('cancelled')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'cancelled'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/30'
                  : 'bg-[#131f37] text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>● 已注销主体</span>
              {activeTab === 'cancelled' && <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">数据状态:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            全量同步 (近期 2026)
          </span>
        </div>
      </div>

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* 2. TOP STATS CARDS SECTION */}
        {activeTab === 'cancelled' ? (
          /* Single Stat Card for Cancelled Subjects matching screenshot image_a1a1c0e8.png */
          <div className="flex">
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3.5 pr-10 flex items-center gap-4 shadow-lg hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">已注销店铺总数</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">347</div>
              </div>
            </div>
          </div>
        ) : (
          /* 4 Stats Cards Grid for Enterprise Subjects */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: 店铺总数 */}
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3.5 flex items-center gap-3 shadow-lg hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">店铺总数</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{totalCount}</div>
              </div>
            </div>

            {/* Card 2: 衡阳街道 */}
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3.5 flex items-center gap-3 shadow-lg hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">衡阳街道</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{hengyangCount}</div>
              </div>
            </div>

            {/* Card 3: 北湖街道 */}
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3.5 flex items-center gap-3 shadow-lg hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">北湖街道</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{beihuCount}</div>
              </div>
            </div>

            {/* Card 4: 西乡塘街道 */}
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3.5 flex items-center gap-3 shadow-lg hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">西乡塘街道</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{xixiangtangCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FILTER / SEARCH FORM BAR MATCHING SCREENSHOT */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {/* 店铺名称 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">店铺名称</span>
              <input
                type="text"
                placeholder="请输入店铺名称"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* 所属街道 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">所属街道</span>
              <select
                value={selectedStreet}
                onChange={(e) => setSelectedStreet(e.target.value)}
                className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="">请选择</option>
                <option value="衡阳街道">衡阳街道</option>
                <option value="北湖街道">北湖街道</option>
                <option value="西乡塘街道">西乡塘街道</option>
                <option value="良庆街道">良庆街道</option>
              </select>
            </div>

            {/* 信誉分 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300 shrink-0">信誉分</span>
              <input
                type="text"
                placeholder=""
                className="w-12 bg-[#09101f] border border-cyan-500/30 rounded text-center py-1 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-500">-</span>
              <input
                type="text"
                placeholder=""
                className="w-12 bg-[#09101f] border border-cyan-500/30 rounded text-center py-1 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 信誉等级 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">信誉等级</span>
              <select className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-400 transition">
                <option value="">请选择</option>
                <option value="A">AAA 极佳</option>
                <option value="B">AA 良好</option>
                <option value="C">A 一般</option>
              </select>
            </div>

            {/* 负责人 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">负责人</span>
              <input
                type="text"
                placeholder="请输入负责人"
                value={searchManager}
                onChange={(e) => setSearchManager(e.target.value)}
                className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* 联系电话 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 shrink-0">联系电话</span>
              <input
                type="text"
                placeholder="请输入联系电话"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Search Button Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => {}}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 4. ACTION BAR & VIEW SWITCHER */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3 shadow-lg">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            {activeTab === 'enterprise' ? (
              <>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 rounded bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-semibold shadow-md border border-blue-400/30 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>

                <button
                  onClick={() => showToast('已成功导入 12 家企业主体数据！')}
                  className="px-3 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-medium border border-amber-600/40 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>导入</span>
                </button>

                <button
                  onClick={() => showToast('已成功导出主体数据报表为 Excel 文件！')}
                  className="px-3 py-1.5 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-medium border border-amber-600/40 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出</span>
                </button>
              </>
            ) : (
              /* Cancelled Subject Tab shows ONLY 导出 button matching screenshot image_a1a1c0e8.png */
              <button
                onClick={() => showToast('已成功导出已注销主体数据报表为 Excel 文件！')}
                className="px-3.5 py-1.5 rounded bg-amber-950/90 hover:bg-amber-900 text-amber-200 text-xs font-medium border border-amber-600/50 shadow-md transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出</span>
              </button>
            )}
          </div>

          {/* Right View Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#09101f] p-0.5 rounded border border-cyan-500/30">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'list' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>列表</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>视图</span>
              </button>
            </div>

            <button
              onClick={() => showToast('视图已重载更新！')}
              className="p-1.5 rounded bg-[#09101f] border border-cyan-500/30 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. MAIN CONTENT DISPLAY (GRID OR LIST) */}
        {viewMode === 'grid' ? (
          /* GRID VIEW MODE (田 视图) MATCHING SCREENSHOT */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredList.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveDetailItem(item)}
                className="bg-[#0d1629] border border-cyan-500/20 hover:border-cyan-400/60 rounded-xl p-3 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex gap-3 group relative overflow-hidden"
              >
                {/* Store Front Image */}
                <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      item.status === '正常经营' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Right Store Info Stack */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden text-xs space-y-1">
                  {/* Name */}
                  <div className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition">
                    {item.name}
                  </div>

                  {/* Credit Code */}
                  <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px] truncate">
                    <CreditCard className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{item.creditCode}</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1 text-slate-400 text-[11px] leading-tight line-clamp-2">
                    <MapPin className="w-3 h-3 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{item.address}</span>
                  </div>

                  {/* Street Badge */}
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-medium flex items-center gap-1">
                      <Store className="w-2.5 h-2.5" />
                      {item.street}
                    </span>
                  </div>

                  {/* Manager & Phone */}
                  <div className="pt-1 border-t border-slate-800/80 text-[11px] space-y-0.5">
                    <div className="text-slate-300">
                      负责人: <span className="text-white font-medium">{item.manager}</span>
                    </div>
                    <div className="text-slate-300 font-mono">
                      联系电话: <span className="text-cyan-300 font-semibold">{item.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW MODE (☰ 列表) */
          <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#09101f] text-slate-300 border-b border-cyan-500/30">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                      />
                    </th>
                    <th className="p-3">店铺名称</th>
                    <th className="p-3">统一社会信用代码</th>
                    <th className="p-3">所属街道</th>
                    <th className="p-3">详细地址</th>
                    <th className="p-3">负责人</th>
                    <th className="p-3">联系电话</th>
                    <th className="p-3">状态</th>
                    <th className="p-3">登记时间</th>
                    <th className="p-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-cyan-950/30 transition group cursor-pointer"
                      onClick={() => setActiveDetailItem(item)}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                        />
                      </td>
                      <td className="p-3 font-semibold text-white group-hover:text-cyan-300">
                        {item.name}
                      </td>
                      <td className="p-3 font-mono text-cyan-400">{item.creditCode}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px]">
                          {item.street}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{item.address}</td>
                      <td className="p-3">{item.manager}</td>
                      <td className="p-3 font-mono text-slate-300">{item.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.status === '正常经营'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{item.registeredDate}</td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveDetailItem(item)}
                            className="text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            详情
                          </button>
                          {activeTab === 'enterprise' ? (
                            <button
                              onClick={() => handleCancelEnterprise(item)}
                              className="text-rose-400 hover:text-rose-300 font-medium"
                            >
                              注销
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestoreEnterprise(item)}
                              className="text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                              还原
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. BOTTOM PAGINATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3 text-xs text-slate-400 shadow-lg">
          <div>
            共 <span className="text-cyan-400 font-mono font-bold">{totalCount}</span> 条
          </div>

          <div className="flex items-center gap-3">
            <select
              defaultValue="8"
              className="bg-[#09101f] border border-cyan-500/30 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value="8">8条/页</option>
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>

            <div className="flex items-center gap-1">
              <button className="p-1 rounded bg-[#09101f] border border-slate-700 text-slate-500 cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">2</button>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">3</button>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">4</button>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">5</button>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">6</button>
              <span>...</span>
              <button className="px-2.5 py-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">10</button>
              <button className="p-1 rounded bg-[#09101f] border border-slate-700 text-slate-300 hover:bg-slate-800">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-10 bg-[#09101f] border border-cyan-500/30 rounded text-center py-0.5 text-white"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>



      {/* 8. ADD NEW SUBJECT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#09101f] border-b border-cyan-500/30 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">新增企业主体</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">店铺 / 企业名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：好味道烫菜坊"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">统一社会信用代码 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：92360902MA3A847Y9M"
                  value={newSubject.creditCode}
                  onChange={(e) => setNewSubject({ ...newSubject, creditCode: e.target.value })}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">所属街道</label>
                  <select
                    value={newSubject.street}
                    onChange={(e) => setNewSubject({ ...newSubject, street: e.target.value as any })}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="衡阳街道">衡阳街道</option>
                    <option value="北湖街道">北湖街道</option>
                    <option value="西乡塘街道">西乡塘街道</option>
                    <option value="良庆街道">良庆街道</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">行业类别</label>
                  <input
                    type="text"
                    value={newSubject.category}
                    onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">详细地址</label>
                <input
                  type="text"
                  placeholder="如：广西壮族自治区南宁市良庆区金龙路8号"
                  value={newSubject.address}
                  onChange={(e) => setNewSubject({ ...newSubject, address: e.target.value })}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">负责人</label>
                  <input
                    type="text"
                    placeholder="如：张良东"
                    value={newSubject.manager}
                    onChange={(e) => setNewSubject({ ...newSubject, manager: e.target.value })}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">联系电话</label>
                  <input
                    type="text"
                    placeholder="如：13800138000"
                    value={newSubject.phone}
                    onChange={(e) => setNewSubject({ ...newSubject, phone: e.target.value })}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  保存并生成档案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
