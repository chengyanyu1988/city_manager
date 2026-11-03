import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Grid,
  CheckCircle2,
  AlertTriangle,
  X,
  Building2,
  Home,
  User,
  Phone,
  Lock,
  MoreHorizontal,
  ChevronLeft,
  Key,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export interface PersonnelRecord {
  id: string;
  username: string;
  name: string;
  department: string;
  phone: string;
  status: '正常' | '停用';
  createTime: string;
}

interface EnforcementPersonnelManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const EnforcementPersonnelManagement: React.FC<EnforcementPersonnelManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Left Tree Filter State
  const [agencySearchText, setAgencySearchText] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('全部部门');

  // Left Tree Expand States
  const [expandedAgencies, setExpandedAgencies] = useState<Set<string>>(
    new Set(['hz_city', 'hz_zhifa'])
  );

  // Right Table Search Filters matching screenshot
  const [filterUsername, setFilterUsername] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Table Selected Rows (Set of IDs)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Personnel List State sorted in DESCENDING ORDER by recent 2026 dates
  const [personnelList, setPersonnelList] = useState<PersonnelRecord[]>([
    {
      id: 'USER-1001',
      username: 'admin',
      name: '超级管理员',
      department: '城管监察大队',
      phone: '13800138000',
      status: '正常',
      createTime: '2026-10-19 18:31:34'
    },
    {
      id: 'USER-1002',
      username: 'zhangsan',
      name: '张磊',
      department: '城管监察大队',
      phone: '13800138001',
      status: '正常',
      createTime: '2026-10-18 18:31:34'
    },
    {
      id: 'USER-1003',
      username: 'liliang',
      name: '李亮',
      department: '西乡塘综合行政执法大队',
      phone: '13877112233',
      status: '正常',
      createTime: '2026-10-17 14:20:10'
    },
    {
      id: 'USER-1004',
      username: 'wangming',
      name: '王明',
      department: '两违监察大队',
      phone: '13977223344',
      status: '正常',
      createTime: '2026-10-16 11:15:00'
    },
    {
      id: 'USER-1005',
      username: 'zhaoqiang',
      name: '赵强',
      department: '法律法规部门',
      phone: '13788119922',
      status: '正常',
      createTime: '2026-10-15 09:40:22'
    },
    {
      id: 'USER-1006',
      username: 'chengyu',
      name: '程宇',
      department: '良庆区综合行政执法大队',
      phone: '13666554433',
      status: '正常',
      createTime: '2026-10-14 16:05:00'
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoreActionsModalOpen, setIsMoreActionsModalOpen] = useState(false);

  // Form Fields
  const [editingRecord, setEditingRecord] = useState<PersonnelRecord | null>(null);
  const [targetDeleteRecord, setTargetDeleteRecord] = useState<PersonnelRecord | null>(null);
  const [targetMoreRecord, setTargetMoreRecord] = useState<PersonnelRecord | null>(null);

  const [formUsername, setFormUsername] = useState('');
  const [formName, setFormName] = useState('');
  const [formDepartment, setFormDepartment] = useState('城管监察大队');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'正常' | '停用'>('正常');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Toggle Left Tree Agency
  const toggleAgencyExpand = (id: string) => {
    setExpandedAgencies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter Personnel List
  const filteredList = useMemo(() => {
    return personnelList.filter((item) => {
      const matchDept =
        selectedDeptFilter === '全部部门' || item.department === selectedDeptFilter;
      const matchUsername =
        !filterUsername.trim() || item.username.toLowerCase().includes(filterUsername.trim().toLowerCase());
      const matchPhone =
        !filterPhone.trim() || item.phone.includes(filterPhone.trim());
      const matchStatus =
        !filterStatus || item.status === filterStatus;

      return matchDept && matchUsername && matchPhone && matchStatus;
    });
  }, [personnelList, selectedDeptFilter, filterUsername, filterPhone, filterStatus]);

  // Checkbox Selection Logic
  const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredList.map((item) => item.id));
      setSelectedRowIds(allIds);
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle Personnel Status Switch
  const handleToggleStatus = (record: PersonnelRecord) => {
    const nextStatus = record.status === '正常' ? '停用' : '正常';
    setPersonnelList((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`执法人员【${record.name}】状态已切换为「${nextStatus}」`);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormUsername('');
    setFormName('');
    setFormDepartment(selectedDeptFilter !== '全部部门' ? selectedDeptFilter : '城管监察大队');
    setFormPhone('');
    setFormStatus('正常');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (record: PersonnelRecord) => {
    setEditingRecord(record);
    setFormUsername(record.username);
    setFormName(record.name);
    setFormDepartment(record.department);
    setFormPhone(record.phone);
    setFormStatus(record.status);
    setIsEditModalOpen(true);
  };

  // Open Single or Batch Delete Modal
  const openDeleteModal = (record?: PersonnelRecord) => {
    if (record) {
      setTargetDeleteRecord(record);
    } else {
      setTargetDeleteRecord(null);
    }
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim()) {
      alert('请填写账号和姓名！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newRecord: PersonnelRecord = {
      id: `USER-${Date.now()}`,
      username: formUsername.trim(),
      name: formName.trim(),
      department: formDepartment,
      phone: formPhone.trim() || '13800000000',
      status: formStatus,
      createTime: formattedTime
    };

    // Prepend to array to preserve DESCENDING order by Creation Time
    setPersonnelList((prev) => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    showToast(`已成功添加执法人员【${newRecord.name} (${newRecord.username})】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !formName.trim()) return;

    setPersonnelList((prev) =>
      prev.map((item) => {
        if (item.id === editingRecord.id) {
          return {
            ...item,
            username: formUsername.trim(),
            name: formName.trim(),
            department: formDepartment,
            phone: formPhone.trim(),
            status: formStatus
          };
        }
        return item;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功保存执法人员【${formName.trim()}】信息！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (targetDeleteRecord) {
      // Single Delete
      setPersonnelList((prev) => prev.filter((item) => item.id !== targetDeleteRecord.id));
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(targetDeleteRecord.id);
        return next;
      });
      showToast(`已成功删除执法人员【${targetDeleteRecord.name}】！`);
    } else if (selectedRowIds.size > 0) {
      // Batch Delete
      setPersonnelList((prev) => prev.filter((item) => !selectedRowIds.has(item.id)));
      showToast(`已成功批量删除 ${selectedRowIds.size} 名执法人员！`);
      setSelectedRowIds(new Set());
    }

    setIsDeleteModalOpen(false);
    setTargetDeleteRecord(null);
  };

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-hidden select-text relative">
      {/* 1. TOP SUB-NAV BREADCRUMB BAR MATCHING SCREENSHOT */}
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

          {/* Active Blue Pill Tag Matching Screenshot */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
              <span>● 执法人员管理</span>
              <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono">
            近期实时创建 · 降序排列
          </span>
        </div>
      </div>

      {/* 2. MAIN SPLIT CONTENT AREA (LEFT AGENCY TREE + RIGHT PERSONNEL TABLE) */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT PANEL: AGENCY TREE SEARCH & NAVIGATION MATCHING SCREENSHOT */}
        <div className="w-64 bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3 flex flex-col gap-3 shrink-0 shadow-xl overflow-hidden">
          {/* Agency Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="请输入案件承办机构名称"
              value={agencySearchText}
              onChange={(e) => setAgencySearchText(e.target.value)}
              className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-2.5 py-1.5 pl-8 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Department Tree Hierarchy Matching Screenshot */}
          <div className="flex-1 overflow-y-auto space-y-1 text-xs pr-1">
            <button
              onClick={() => setSelectedDeptFilter('全部部门')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between font-bold transition ${
                selectedDeptFilter === '全部部门'
                  ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>全部承办部门</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono text-cyan-300">
                {personnelList.length}人
              </span>
            </button>

            {/* Tree Node 1: 贺州市城市管理局 */}
            <div className="space-y-1 pt-1">
              <div
                onClick={() => toggleAgencyExpand('hz_city')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-slate-200 font-bold hover:bg-slate-800/60 cursor-pointer select-none"
              >
                {expandedAgencies.has('hz_city') ? (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate">贺州市城市管理局</span>
              </div>

              {expandedAgencies.has('hz_city') && (
                <div className="pl-4 space-y-1 border-l border-cyan-500/20 ml-3">
                  {/* Sub Node: 贺州城市管理综合行政执法局 */}
                  <div
                    onClick={() => toggleAgencyExpand('hz_zhifa')}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-slate-300 hover:bg-slate-800/60 cursor-pointer select-none"
                  >
                    {expandedAgencies.has('hz_zhifa') ? (
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">贺州城市管理综合行政执法局</span>
                  </div>

                  {expandedAgencies.has('hz_zhifa') && (
                    <div className="pl-4 space-y-1 border-l border-cyan-500/20 ml-3 text-[11px]">
                      {['城管监察大队', '两违监察大队', '法律法规部门'].map((dept) => {
                        const count = personnelList.filter((p) => p.department === dept).length;
                        const isSelected = selectedDeptFilter === dept;
                        return (
                          <button
                            key={dept}
                            onClick={() => setSelectedDeptFilter(dept)}
                            className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="truncate">└ {dept}</span>
                            <span className="font-mono text-[9px] opacity-80">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tree Node 2: 南宁市城市管理综合行政执法支队 */}
            <div className="space-y-1 pt-2">
              <div
                onClick={() => toggleAgencyExpand('nn_city')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-slate-200 font-bold hover:bg-slate-800/60 cursor-pointer select-none"
              >
                {expandedAgencies.has('nn_city') ? (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate">南宁市城管行政执法支队</span>
              </div>

              {expandedAgencies.has('nn_city') && (
                <div className="pl-4 space-y-1 border-l border-cyan-500/20 ml-3 text-[11px]">
                  {['西乡塘综合行政执法大队', '良庆区综合行政执法大队'].map((dept) => {
                    const count = personnelList.filter((p) => p.department === dept).length;
                    const isSelected = selectedDeptFilter === dept;
                    return (
                      <button
                        key={dept}
                        onClick={() => setSelectedDeptFilter(dept)}
                        className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">└ {dept}</span>
                        <span className="font-mono text-[9px] opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN PANEL: FILTERS, ACTION BAR & PERSONNEL TABLE */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {/* SEARCH FILTER BAR MATCHING SCREENSHOT */}
          <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* 用户账号 Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">用户账号</span>
                <input
                  type="text"
                  placeholder="请输入用户账号"
                  value={filterUsername}
                  onChange={(e) => setFilterUsername(e.target.value)}
                  className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-40"
                />
              </div>

              {/* 手机号码 Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">手机号码</span>
                <input
                  type="text"
                  placeholder="请输入手机号码"
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-40"
                />
              </div>

              {/* 状态 Select Filter */}
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">状态</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 w-32 cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="正常">正常</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              {/* 🔍 搜索 & 🔄 重置 Buttons */}
              <button
                onClick={() => showToast('已成功检索执法人员记录！')}
                className="px-3.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              <button
                onClick={() => {
                  setFilterUsername('');
                  setFilterPhone('');
                  setFilterStatus('');
                  showToast('已重置人员筛选条件');
                }}
                className="px-3.5 py-1 rounded bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER & ACTION BAR MATCHING SCREENSHOT */}
          <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
            {/* Top Action Bar */}
            <div className="p-3 bg-[#09101f] border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* + 新增 Button */}
                <button
                  onClick={openAddModal}
                  className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>

                {/* ✏️ 修改 Button */}
                <button
                  onClick={() => {
                    if (selectedRowIds.size === 1) {
                      const selectedId = Array.from(selectedRowIds)[0];
                      const record = personnelList.find((p) => p.id === selectedId);
                      if (record) openEditModal(record);
                    } else {
                      showToast('请选择且仅选择 1 项进行修改！');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                    selectedRowIds.size === 1
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md'
                      : 'bg-[#131f37] text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>修改</span>
                </button>

                {/* 🗑️ 删除 Button */}
                <button
                  onClick={() => openDeleteModal()}
                  disabled={selectedRowIds.size === 0}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                    selectedRowIds.size > 0
                      ? 'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                      : 'bg-[#131f37] text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                </button>

                {/* 📤 导入 Button */}
                <button
                  onClick={() => showToast('已打开人员批量导入数据接口')}
                  className="px-3.5 py-1.5 rounded-md bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>导入</span>
                </button>

                {/* 📥 导出 Button */}
                <button
                  onClick={() => showToast('已成功导出执法人员台账数据！')}
                  className="px-3.5 py-1.5 rounded-md bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>导出</span>
                </button>
              </div>

              {/* Right Tools */}
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={() => showToast('搜索过滤切换')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                  title="搜索"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('人员列表已刷新')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                  title="刷新"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('切换表格密度')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                  title="密度"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Personnel Table matching image_464b7ce6.png */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#09101f] text-slate-300 font-bold border-b border-cyan-500/30">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredList.length > 0 &&
                          filteredList.every((item) => selectedRowIds.has(item.id))
                        }
                        onChange={handleSelectAllRows}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 w-16 text-center">序号</th>
                    <th className="py-3 px-3">用户账号</th>
                    <th className="py-3 px-3">姓名</th>
                    <th className="py-3 px-3">部门</th>
                    <th className="py-3 px-3">手机号</th>
                    <th className="py-3 px-3 text-center">状态</th>
                    <th className="py-3 px-3">创建时间</th>
                    <th className="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                        暂无符合条件的执法人员数据
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((record, index) => {
                      const isSelected = selectedRowIds.has(record.id);

                      return (
                        <tr
                          key={record.id}
                          className={`hover:bg-cyan-950/40 transition ${
                            isSelected ? 'bg-cyan-950/50' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRowSelect(record.id)}
                              className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-400">
                            {index + 1}
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                            {record.username}
                          </td>
                          <td className="py-3 px-3 font-bold text-white">{record.name}</td>
                          <td className="py-3 px-3 text-slate-300">{record.department}</td>
                          <td className="py-3 px-3 font-mono text-slate-300">{record.phone}</td>
                          <td className="py-3 px-3 text-center">
                            {/* Toggle Switch Component matching screenshot */}
                            <button
                              onClick={() => handleToggleStatus(record)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                record.status === '正常' ? 'bg-blue-600' : 'bg-slate-700'
                              }`}
                              title={`点击切换为 ${record.status === '正常' ? '停用' : '正常'}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  record.status === '正常' ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-3 px-3 font-mono text-cyan-300">{record.createTime}</td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-3 text-xs font-medium">
                              {/* 修改 Button */}
                              <button
                                onClick={() => openEditModal(record)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                              >
                                <Edit className="w-3 h-3" />
                                <span>修改</span>
                              </button>

                              {/* 删除 Button */}
                              <button
                                onClick={() => openDeleteModal(record)}
                                className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>删除</span>
                              </button>

                              {/* 更多 Actions */}
                              <button
                                onClick={() => {
                                  setTargetMoreRecord(record);
                                  setIsMoreActionsModalOpen(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                              >
                                <span>» 更多</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination matching image_464b7ce6.png */}
            <div className="p-3 bg-[#09101f] border-t border-cyan-500/20 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-400">
              <span>共 {filteredList.length} 条</span>

              <select className="bg-[#0d1629] border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded bg-[#131f37] hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                >
                  &lt;
                </button>
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
                <button
                  disabled
                  className="px-2 py-1 rounded bg-[#131f37] text-slate-300 disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>

              <div className="flex items-center gap-1">
                <span>前往</span>
                <input
                  type="number"
                  defaultValue={1}
                  className="w-10 bg-[#0d1629] border border-slate-700 rounded px-1.5 py-1 text-center text-white focus:outline-none"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL 1: 新增执法人员 (ADD PERSONNEL MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>新增执法人员</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    用户账号 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：liliang"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    姓名 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：李亮"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">所属部门</label>
                <select
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="城管监察大队">城管监察大队</option>
                  <option value="两违监察大队">两违监察大队</option>
                  <option value="法律法规部门">法律法规部门</option>
                  <option value="西乡塘综合行政执法大队">西乡塘综合行政执法大队</option>
                  <option value="良庆区综合行政执法大队">良庆区综合行政执法大队</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">手机号码</label>
                  <input
                    type="text"
                    placeholder="如：13800138000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">账号状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="正常">正常</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#131f37] text-slate-300 hover:text-white border border-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/30"
                >
                  确定保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL 2: 修改执法人员 (EDIT PERSONNEL MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改执法人员信息</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">用户账号</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">姓名</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">所属部门</label>
                <select
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="城管监察大队">城管监察大队</option>
                  <option value="两违监察大队">两违监察大队</option>
                  <option value="法律法规部门">法律法规部门</option>
                  <option value="西乡塘综合行政执法大队">西乡塘综合行政执法大队</option>
                  <option value="良庆区综合行政执法大队">良庆区综合行政执法大队</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">手机号码</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">账号状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="正常">正常</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#131f37] text-slate-300 hover:text-white border border-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/30"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL 3: 删除确认 (DELETE CONFIRMATION MODAL) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-rose-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
              <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>确认删除执法人员</span>
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-200 leading-relaxed">
                {targetDeleteRecord ? (
                  <>
                    确定要删除执法人员 <b className="text-white">【{targetDeleteRecord.name} ({targetDeleteRecord.username})】</b> 吗？
                  </>
                ) : (
                  <>
                    确定要批量删除选中的 <b className="text-rose-400 font-bold">{selectedRowIds.size}</b> 名执法人员吗？
                  </>
                )}
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                警告：删除人员将收回其执法终端登录鉴权，历史经办工单保留审计线索，此操作不可撤销。
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#131f37] text-slate-300 hover:text-white border border-slate-700 font-medium"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>确定删除</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 4: 更多操作 (MORE ACTIONS DRAWER/POPOVER) */}
      {isMoreActionsModalOpen && targetMoreRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4 text-cyan-400" />
                <span>【{targetMoreRecord.name}】更多操作</span>
              </h3>
              <button
                onClick={() => setIsMoreActionsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <button
                onClick={() => {
                  setIsMoreActionsModalOpen(false);
                  showToast(`已成功将【${targetMoreRecord.name}】的密码重置为 123456`);
                }}
                className="w-full p-2.5 rounded bg-[#131f37] hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-left flex items-center gap-2 transition"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>重置登录密码 (123456)</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreActionsModalOpen(false);
                  showToast(`已调出【${targetMoreRecord.name}】全景执法档案`);
                }}
                className="w-full p-2.5 rounded bg-[#131f37] hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-left flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>查看人员全景档案</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreActionsModalOpen(false);
                  showToast(`已解绑【${targetMoreRecord.name}】绑定的移动执法 Pad`);
                }}
                className="w-full p-2.5 rounded bg-[#131f37] hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-left flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>解绑移动终端设备</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
