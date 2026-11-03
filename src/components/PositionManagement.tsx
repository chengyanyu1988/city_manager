import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Grid,
  AlertTriangle,
  X,
  Home,
  Award,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

export interface PositionRecord {
  id: string;
  posCode: string;
  posName: string;
  orderNum: number;
  status: '正常' | '停用';
  createTime: string;
  remark?: string;
}

interface PositionManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const PositionManagement: React.FC<PositionManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States matching screenshot image_99e29645.png
  const [filterPosCode, setFilterPosCode] = useState('');
  const [filterPosName, setFilterPosName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Position List State sorted in DESCENDING ORDER by Creation Time (recent 2026 dates)
  const [positionList, setPositionList] = useState<PositionRecord[]>([
    {
      id: 'POS-1',
      posCode: 'DDZ',
      posName: '大队长',
      orderNum: 0,
      status: '正常',
      createTime: '2026-10-19 14:21:23',
      remark: '综合行政执法大队主要负责人'
    },
    {
      id: 'POS-2',
      posCode: 'ZDZ',
      posName: '中队长',
      orderNum: 1,
      status: '正常',
      createTime: '2026-10-18 14:21:23',
      remark: '网格中队直接指挥与派单责任人'
    },
    {
      id: 'POS-3',
      posCode: 'WGZ',
      posName: '专职网格长',
      orderNum: 2,
      status: '正常',
      createTime: '2026-10-17 10:15:00',
      remark: '责任网格工单核验与现场处置组长'
    },
    {
      id: 'POS-4',
      posCode: 'XCY',
      posName: '巡查队员',
      orderNum: 3,
      status: '正常',
      createTime: '2026-10-16 09:30:12',
      remark: '移动执法终端现场取证与处置打卡员'
    },
    {
      id: 'POS-5',
      posCode: 'FZR',
      posName: '部门负责人',
      orderNum: 4,
      status: '正常',
      createTime: '2026-10-15 08:45:00',
      remark: '法律法规及后勤综合保障审核人员'
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Fields
  const [editingPos, setEditingPos] = useState<PositionRecord | null>(null);
  const [targetDeletePos, setTargetDeletePos] = useState<PositionRecord | null>(null);

  const [formPosCode, setFormPosCode] = useState('');
  const [formPosName, setFormPosName] = useState('');
  const [formOrderNum, setFormOrderNum] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'正常' | '停用'>('正常');
  const [formRemark, setFormRemark] = useState('');

  // Filter List
  const filteredList = useMemo(() => {
    return positionList.filter((pos) => {
      const matchCode = !filterPosCode.trim() || pos.posCode.toLowerCase().includes(filterPosCode.trim().toLowerCase());
      const matchName = !filterPosName.trim() || pos.posName.includes(filterPosName.trim());
      const matchStatus = !filterStatus || pos.status === filterStatus;
      return matchCode && matchName && matchStatus;
    });
  }, [positionList, filterPosCode, filterPosName, filterStatus]);

  // Row Select Logic
  const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(filteredList.map((p) => p.id)));
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

  // Toggle Position Status
  const handleToggleStatus = (pos: PositionRecord) => {
    const nextStatus = pos.status === '正常' ? '停用' : '正常';
    setPositionList((prev) =>
      prev.map((p) => (p.id === pos.id ? { ...p, status: nextStatus } : p))
    );
    showToast(`岗位【${pos.posName}】状态已切换为「${nextStatus}」`);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormPosCode('');
    setFormPosName('');
    setFormOrderNum(positionList.length);
    setFormStatus('正常');
    setFormRemark('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (pos: PositionRecord) => {
    setEditingPos(pos);
    setFormPosCode(pos.posCode);
    setFormPosName(pos.posName);
    setFormOrderNum(pos.orderNum);
    setFormStatus(pos.status);
    setFormRemark(pos.remark || '');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (pos?: PositionRecord) => {
    if (pos) {
      setTargetDeletePos(pos);
    } else {
      setTargetDeletePos(null);
    }
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPosCode.trim() || !formPosName.trim()) {
      alert('请填写岗位编号和岗位名称！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newPos: PositionRecord = {
      id: `POS-${Date.now()}`,
      posCode: formPosCode.trim().toUpperCase(),
      posName: formPosName.trim(),
      orderNum: formOrderNum,
      status: formStatus,
      createTime: formattedTime,
      remark: formRemark.trim()
    };

    // Prepend to array for DESCENDING order by Creation Time
    setPositionList((prev) => [newPos, ...prev]);
    setIsAddModalOpen(false);
    showToast(`已成功新增职务/岗位【${newPos.posName}】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPos || !formPosName.trim()) return;

    setPositionList((prev) =>
      prev.map((p) => {
        if (p.id === editingPos.id) {
          return {
            ...p,
            posCode: formPosCode.trim().toUpperCase(),
            posName: formPosName.trim(),
            orderNum: formOrderNum,
            status: formStatus,
            remark: formRemark.trim()
          };
        }
        return p;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功保存岗位【${formPosName.trim()}】信息！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (targetDeletePos) {
      setPositionList((prev) => prev.filter((p) => p.id !== targetDeletePos.id));
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(targetDeletePos.id);
        return next;
      });
      showToast(`已成功删除岗位【${targetDeletePos.posName}】！`);
    } else if (selectedRowIds.size > 0) {
      setPositionList((prev) => prev.filter((p) => !selectedRowIds.has(p.id)));
      showToast(`已成功批量删除 ${selectedRowIds.size} 个岗位！`);
      setSelectedRowIds(new Set());
    }

    setIsDeleteModalOpen(false);
    setTargetDeletePos(null);
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
              <span>● 职务管理</span>
              <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono">
            近期创建时间 · 降序排列
          </span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* SEARCH FILTER BAR MATCHING SCREENSHOT */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* 岗位编号 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">岗位编号</span>
              <input
                type="text"
                placeholder="请输入岗位编号"
                value={filterPosCode}
                onChange={(e) => setFilterPosCode(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 font-mono"
              />
            </div>

            {/* 岗位名称 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">岗位名称</span>
              <input
                type="text"
                placeholder="请输入岗位名称"
                value={filterPosName}
                onChange={(e) => setFilterPosName(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
              />
            </div>

            {/* 状态 Select Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">状态</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-36 cursor-pointer"
              >
                <option value="">请选择</option>
                <option value="正常">正常</option>
                <option value="停用">停用</option>
              </select>
            </div>

            {/* 🔍 搜索 & 🔄 重置 Buttons */}
            <button
              onClick={() => showToast('已成功检索岗位数据！')}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={() => {
                setFilterPosCode('');
                setFilterPosName('');
                setFilterStatus('');
                showToast('已重置岗位筛选条件');
              }}
              className="px-3.5 py-1.5 rounded bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* ACTION TOOLBAR & TABLE CONTAINER MATCHING SCREENSHOT */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
          {/* Action Toolbar Header */}
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
                    const record = positionList.find((p) => p.id === selectedId);
                    if (record) openEditModal(record);
                  } else {
                    showToast('请勾选单项岗位进行修改！');
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

              {/* 📥 导出 Button */}
              <button
                onClick={() => showToast('已成功导出岗位编制数据表！')}
                className="px-3.5 py-1.5 rounded-md bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>导出</span>
              </button>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-2 text-slate-400">
              <button
                onClick={() => showToast('搜索开启')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="搜索"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => showToast('岗位列表已刷新')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="刷新"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => showToast('表格密度切换')}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition"
                title="密度"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table View matching image_99e29645.png */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#09101f] text-slate-300 font-bold border-b border-cyan-500/30">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredList.length > 0 &&
                        filteredList.every((p) => selectedRowIds.has(p.id))
                      }
                      onChange={handleSelectAllRows}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-16 text-center">序号</th>
                  <th className="py-3 px-4 font-mono">岗位编号</th>
                  <th className="py-3 px-4">岗位名称</th>
                  <th className="py-3 px-4 text-center">岗位排序</th>
                  <th className="py-3 px-4 text-center">状态</th>
                  <th className="py-3 px-4">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      暂无匹配的岗位职务数据
                    </td>
                  </tr>
                ) : (
                  filteredList.map((pos, index) => {
                    const isSelected = selectedRowIds.has(pos.id);

                    return (
                      <tr
                        key={pos.id}
                        className={`hover:bg-cyan-950/40 transition ${
                          isSelected ? 'bg-cyan-950/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRowSelect(pos.id)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                          {pos.posCode}
                        </td>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{pos.posName}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-300">
                          {pos.orderNum}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            onClick={() => handleToggleStatus(pos)}
                            className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold cursor-pointer transition ${
                              pos.status === '正常'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                            title="点击切换状态"
                          >
                            {pos.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{pos.createTime}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-3 text-xs font-medium">
                            {/* 修改 Button */}
                            <button
                              onClick={() => openEditModal(pos)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                            >
                              <Edit className="w-3 h-3" />
                              <span>修改</span>
                            </button>

                            {/* 删除 Button */}
                            <button
                              onClick={() => openDeleteModal(pos)}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>删除</span>
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

          {/* Bottom Pagination matching image_99e29645.png */}
          <div className="p-3 bg-[#09101f] border-t border-cyan-500/20 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-400">
            <span>共 {filteredList.length} 条</span>

            <select className="bg-[#0d1629] border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
              <option>10条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
            </select>

            <div className="flex items-center gap-1">
              <button disabled className="px-2 py-1 rounded bg-[#131f37] text-slate-300 disabled:opacity-40">
                &lt;
              </button>
              <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
              <button disabled className="px-2 py-1 rounded bg-[#131f37] text-slate-300 disabled:opacity-40">
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

      {/* 3. MODAL 1: 新增岗位 (ADD POSITION MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>新增岗位/职务</span>
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
                    岗位编号 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：DDZ"
                    value={formPosCode}
                    onChange={(e) => setFormPosCode(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    岗位名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：大队长"
                    value={formPosName}
                    onChange={(e) => setFormPosName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">岗位排序</label>
                  <input
                    type="number"
                    value={formOrderNum}
                    onChange={(e) => setFormOrderNum(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">岗位状态</label>
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

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">备注说明</label>
                <textarea
                  rows={2}
                  placeholder="请输入岗位的职责及编制范围说明..."
                  value={formRemark}
                  onChange={(e) => setFormRemark(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded p-2.5 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
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

      {/* 4. MODAL 2: 修改岗位 (EDIT POSITION MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改岗位职务信息</span>
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
                  <label className="block text-slate-300 mb-1 font-semibold">岗位编号</label>
                  <input
                    type="text"
                    value={formPosCode}
                    onChange={(e) => setFormPosCode(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">岗位名称</label>
                  <input
                    type="text"
                    value={formPosName}
                    onChange={(e) => setFormPosName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">岗位排序</label>
                  <input
                    type="number"
                    value={formOrderNum}
                    onChange={(e) => setFormOrderNum(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">岗位状态</label>
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

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">备注说明</label>
                <textarea
                  rows={2}
                  value={formRemark}
                  onChange={(e) => setFormRemark(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                />
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
                <span>确认删除岗位职务</span>
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
                {targetDeletePos ? (
                  <>
                    确定要删除岗位 <b className="text-white">【{targetDeletePos.posName} ({targetDeletePos.posCode})】</b> 吗？
                  </>
                ) : (
                  <>
                    确定要批量删除选中的 <b className="text-rose-400 font-bold">{selectedRowIds.size}</b> 个岗位吗？
                  </>
                )}
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                警告：删除岗位将影响归属该职务的执法人员考勤与调度派单关联，此操作不可撤销。
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
