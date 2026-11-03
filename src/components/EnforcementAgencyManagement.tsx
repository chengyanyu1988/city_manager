import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Grid,
  CheckCircle2,
  AlertTriangle,
  X,
  Building2,
  Home,
  SlidersHorizontal
} from 'lucide-react';

export interface AgencyNode {
  id: string;
  name: string;
  orderNum: number;
  status: '正常' | '停用';
  createTime: string;
  parentId?: string;
  manager?: string;
  phone?: string;
  children?: AgencyNode[];
}

interface EnforcementAgencyManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const EnforcementAgencyManagement: React.FC<EnforcementAgencyManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter states matching screenshot
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Tree Expansion state (set of expanded agency IDs)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['ORG-7001', 'ORG-7002']));

  // Initial Tree Data sorted in DESCENDING ORDER by recent 2026 dates
  const [agencyList, setAgencyList] = useState<AgencyNode[]>([
    {
      id: 'ORG-7001',
      name: '贺州市城市管理局',
      orderNum: 0,
      status: '正常',
      createTime: '2026-10-19 16:11:33',
      manager: '黄局长',
      phone: '0774-5123110',
      children: [
        {
          id: 'ORG-7001-1',
          name: '城管监察大队',
          orderNum: 0,
          status: '正常',
          createTime: '2026-10-19 15:40:00',
          parentId: 'ORG-7001',
          manager: '张大队',
          phone: '0774-5123112'
        },
        {
          id: 'ORG-7001-2',
          name: '两违监察大队',
          orderNum: 1,
          status: '正常',
          createTime: '2026-10-19 14:20:15',
          parentId: 'ORG-7001',
          manager: '陈大队',
          phone: '0774-5123115'
        },
        {
          id: 'ORG-7001-3',
          name: '法律法规部门',
          orderNum: 2,
          status: '正常',
          createTime: '2026-10-19 11:05:30',
          parentId: 'ORG-7001',
          manager: '林主任',
          phone: '0774-5123118'
        }
      ]
    },
    {
      id: 'ORG-7002',
      name: '南宁市城市管理综合行政执法支队',
      orderNum: 1,
      status: '正常',
      createTime: '2026-10-18 17:30:00',
      manager: '李建国',
      phone: '0771-5588110',
      children: [
        {
          id: 'ORG-7002-1',
          name: '西乡塘综合行政执法大队',
          orderNum: 0,
          status: '正常',
          createTime: '2026-10-18 16:15:20',
          parentId: 'ORG-7002',
          manager: '张良东',
          phone: '0771-3322110'
        },
        {
          id: 'ORG-7002-2',
          name: '良庆区综合行政执法大队',
          orderNum: 1,
          status: '正常',
          createTime: '2026-10-18 14:10:00',
          parentId: 'ORG-7002',
          manager: '王建平',
          phone: '0771-4433110'
        },
        {
          id: 'ORG-7002-3',
          name: '北湖网格执法中队',
          orderNum: 2,
          status: '正常',
          createTime: '2026-10-18 10:05:00',
          parentId: 'ORG-7002',
          manager: '赵强',
          phone: '13977223344'
        }
      ]
    },
    {
      id: 'ORG-7003',
      name: '高新产业园区网格特勤大队',
      orderNum: 2,
      status: '正常',
      createTime: '2026-10-17 09:20:00',
      manager: '刘队长',
      phone: '13788119922',
      children: [
        {
          id: 'ORG-7003-1',
          name: '夜间应急巡查专班',
          orderNum: 0,
          status: '正常',
          createTime: '2026-10-17 08:15:00',
          parentId: 'ORG-7003',
          manager: '周副队',
          phone: '13877112233'
        }
      ]
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Modal Form States
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [editingAgency, setEditingAgency] = useState<AgencyNode | null>(null);
  const [targetDeleteAgency, setTargetDeleteAgency] = useState<AgencyNode | null>(null);

  const [formName, setFormName] = useState('');
  const [formOrderNum, setFormOrderNum] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'正常' | '停用'>('正常');
  const [formManager, setFormManager] = useState('');
  const [formPhone, setFormPhone] = useState('');

  // Toggle single row expand
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle ALL expand/collapse
  const toggleExpandAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set());
    } else {
      const allParentIds = agencyList.filter((a) => a.children && a.children.length > 0).map((a) => a.id);
      setExpandedIds(new Set(allParentIds));
    }
  };

  // Open Add Modal
  const openAddModal = (parentId: string = '') => {
    setSelectedParentId(parentId);
    setFormName('');
    setFormOrderNum(0);
    setFormStatus('正常');
    setFormManager('');
    setFormPhone('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (agency: AgencyNode) => {
    setEditingAgency(agency);
    setSelectedParentId(agency.parentId || '');
    setFormName(agency.name);
    setFormOrderNum(agency.orderNum);
    setFormStatus(agency.status);
    setFormManager(agency.manager || '');
    setFormPhone(agency.phone || '');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (agency: AgencyNode) => {
    setTargetDeleteAgency(agency);
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('请输入机构名称！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newId = `ORG-${Date.now()}`;

    const newNode: AgencyNode = {
      id: newId,
      name: formName.trim(),
      orderNum: formOrderNum,
      status: formStatus,
      createTime: formattedTime,
      parentId: selectedParentId || undefined,
      manager: formManager.trim() || '未设定',
      phone: formPhone.trim() || '未设定',
      children: []
    };

    if (!selectedParentId) {
      // Add as Top-Level Node (Insert at top for Descending order)
      setAgencyList((prev) => [newNode, ...prev]);
    } else {
      // Add as Child Node under Parent
      setAgencyList((prev) =>
        prev.map((parent) => {
          if (parent.id === selectedParentId) {
            return {
              ...parent,
              children: [newNode, ...(parent.children || [])]
            };
          }
          return parent;
        })
      );
      // Ensure parent is expanded
      setExpandedIds((prev) => new Set(prev).add(selectedParentId));
    }

    setIsAddModalOpen(false);
    showToast(`已成功新增执法机构【${newNode.name}】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgency || !formName.trim()) return;

    setAgencyList((prev) =>
      prev.map((node) => {
        if (node.id === editingAgency.id) {
          return {
            ...node,
            name: formName.trim(),
            orderNum: formOrderNum,
            status: formStatus,
            manager: formManager.trim(),
            phone: formPhone.trim()
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) => {
              if (child.id === editingAgency.id) {
                return {
                  ...child,
                  name: formName.trim(),
                  orderNum: formOrderNum,
                  status: formStatus,
                  manager: formManager.trim(),
                  phone: formPhone.trim()
                };
              }
              return child;
            })
          };
        }
        return node;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功更新执法机构【${formName.trim()}】！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!targetDeleteAgency) return;

    setAgencyList((prev) =>
      prev
        .filter((node) => node.id !== targetDeleteAgency.id)
        .map((node) => ({
          ...node,
          children: node.children ? node.children.filter((child) => child.id !== targetDeleteAgency.id) : []
        }))
    );

    setIsDeleteModalOpen(false);
    showToast(`已成功删除执法机构【${targetDeleteAgency.name}】！`);
    setTargetDeleteAgency(null);
  };

  // Filter logic
  const filteredList = agencyList
    .map((parent) => {
      const parentMatchesName = parent.name.includes(searchName.trim());
      const parentMatchesStatus = !statusFilter || parent.status === statusFilter;

      const matchingChildren = (parent.children || []).filter((child) => {
        const childMatchesName = child.name.includes(searchName.trim());
        const childMatchesStatus = !statusFilter || child.status === statusFilter;
        return childMatchesName && childMatchesStatus;
      });

      if ((parentMatchesName && parentMatchesStatus) || matchingChildren.length > 0) {
        return {
          ...parent,
          children: matchingChildren
        };
      }
      return null;
    })
    .filter(Boolean) as AgencyNode[];

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-y-auto select-text relative">
      {/* 1. TOP SUB-NAV BREADCRUMB BAR MATCHING USER SCREENSHOT */}
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
              <span>● 执法机构管理</span>
              <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono">
            降序排列 · 2026年最新实时组织架构
          </span>
        </div>
      </div>

      {/* 2. FILTER SEARCH BAR MATCHING SCREENSHOT */}
      <div className="p-5 space-y-4">
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* 机构名称 Search Input */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">机构名称</span>
              <input
                type="text"
                placeholder="请输入机构名称"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 transition"
              />
            </div>

            {/* 状态 Select Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">状态</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-36 cursor-pointer"
              >
                <option value="">请选择</option>
                <option value="正常">正常</option>
                <option value="停用">停用</option>
              </select>
            </div>

            {/* 🔍 搜索 & 🔄 重置 Buttons */}
            <button
              onClick={() => showToast('已筛选匹配机构！')}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={() => {
                setSearchName('');
                setStatusFilter('');
                showToast('已重置筛选条件');
              }}
              className="px-3.5 py-1.5 rounded-md bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 3. ACTION TOOLBAR & TREE TABLE MATCHING SCREENSHOT */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
          {/* Action Toolbar Header */}
          <div className="px-4 py-3 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* + 新增 Button */}
              <button
                onClick={() => openAddModal()}
                className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>

              {/* ↕️ 展开/折叠 Button */}
              <button
                onClick={toggleExpandAll}
                className="px-3.5 py-1.5 rounded-md bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{expandedIds.size > 0 ? '折叠全部' : '展开全部'}</span>
              </button>
            </div>

            {/* Right Quick Tools */}
            <div className="flex items-center gap-2 text-slate-400">
              <button
                onClick={() => showToast('快捷模糊定位已启用')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="搜索"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => showToast('机构列表已刷新')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="刷新"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => showToast('列密度视图切换')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="密度"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tree Table View matching image_796e2d07.png */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#09101f] text-slate-300 font-bold border-b border-cyan-500/30">
                <tr>
                  <th className="py-3 px-4 w-80">机构名称</th>
                  <th className="py-3 px-4 w-24 text-center">序号</th>
                  <th className="py-3 px-4 w-28 text-center">状态</th>
                  <th className="py-3 px-4 w-48">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      暂无匹配的执法机构数据
                    </td>
                  </tr>
                ) : (
                  filteredList.map((parent) => {
                    const hasChildren = parent.children && parent.children.length > 0;
                    const isExpanded = expandedIds.has(parent.id);

                    return (
                      <React.Fragment key={parent.id}>
                        {/* Parent Node Row */}
                        <tr className="hover:bg-cyan-950/40 transition group bg-[#0b1324]/60 font-semibold">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {hasChildren ? (
                                <button
                                  onClick={() => toggleExpand(parent.id)}
                                  className="p-0.5 rounded hover:bg-slate-700 text-cyan-400 transition"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-4 h-4 inline-block" />
                              )}
                              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="text-white font-bold tracking-wide">{parent.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-300">{parent.orderNum}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold ${
                                parent.status === '正常'
                                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-700'
                              }`}
                            >
                              {parent.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-cyan-300">{parent.createTime}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-3 text-xs font-medium">
                              {/* 修改 Button */}
                              <button
                                onClick={() => openEditModal(parent)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                              >
                                <Edit className="w-3 h-3" />
                                <span>修改</span>
                              </button>

                              {/* + 新增 Button */}
                              <button
                                onClick={() => openAddModal(parent.id)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                              >
                                <Plus className="w-3 h-3" />
                                <span>新增</span>
                              </button>

                              {/* 删除 Button (Optional for root) */}
                              <button
                                onClick={() => openDeleteModal(parent)}
                                className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>删除</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Children Sub-Nodes Rows (when expanded) */}
                        {isExpanded &&
                          parent.children?.map((child) => (
                            <tr key={child.id} className="hover:bg-cyan-950/20 transition bg-[#080d1a]/80">
                              <td className="py-2.5 px-4 pl-12">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600 font-mono">└─</span>
                                  <span className="text-slate-200">{child.name}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono text-slate-400">{child.orderNum}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded border text-[10px] ${
                                    child.status === '正常'
                                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                                      : 'bg-slate-900 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  {child.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-mono text-slate-400">{child.createTime}</td>
                              <td className="py-2.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-3 text-xs font-medium">
                                  {/* 修改 Button */}
                                  <button
                                    onClick={() => openEditModal(child)}
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                                  >
                                    <Edit className="w-3 h-3" />
                                    <span>修改</span>
                                  </button>

                                  {/* + 新增 Button */}
                                  <button
                                    onClick={() => openAddModal(child.id)}
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>新增</span>
                                  </button>

                                  {/* 删除 Button */}
                                  <button
                                    onClick={() => openDeleteModal(child)}
                                    className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>删除</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. MODAL 1: 新增执法机构 (ADD AGENCY MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>新增执法机构</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">上级机构</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">无 (顶级机构)</option>
                  {agencyList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  机构名称 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入机构名称（如：青秀区综合行政执法大队）"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">显示排序</label>
                  <input
                    type="number"
                    value={formOrderNum}
                    onChange={(e) => setFormOrderNum(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">机构状态</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">负责人</label>
                  <input
                    type="text"
                    placeholder="如：张队长"
                    value={formManager}
                    onChange={(e) => setFormManager(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">联系电话</label>
                  <input
                    type="text"
                    placeholder="如：0771-5588110"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
                  />
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

      {/* 5. MODAL 2: 修改执法机构 (EDIT AGENCY MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改执法机构信息</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">机构名称</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">显示排序</label>
                  <input
                    type="number"
                    value={formOrderNum}
                    onChange={(e) => setFormOrderNum(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">机构状态</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">负责人</label>
                  <input
                    type="text"
                    value={formManager}
                    onChange={(e) => setFormManager(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">联系电话</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
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

      {/* 6. MODAL 3: 删除确认 (DELETE CONFIRMATION MODAL) */}
      {isDeleteModalOpen && targetDeleteAgency && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-rose-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
              <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>确认删除执法机构</span>
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
                确定要删除执法机构 <b className="text-white">【{targetDeleteAgency.name}】</b> 吗？
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                注意：删除该机构将同步解除该部门下执法人员的组织归属绑定，此操作不可撤销。
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
    </div>
  );
};
