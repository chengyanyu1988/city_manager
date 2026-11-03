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
  BookOpen
} from 'lucide-react';

export interface DictRecord {
  id: string;
  dictName: string;
  dictType: string;
  status: '正常' | '停用';
  createTime: string;
  remark?: string;
}

interface DictManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const DictManagement: React.FC<DictManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States matching screenshot image_3f6a1784.png
  const [filterDictName, setFilterDictName] = useState('');
  const [filterDictType, setFilterDictType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Dict List State sorted in DESCENDING ORDER by Creation Time (recent 2026 dates)
  const [dictList, setDictList] = useState<DictRecord[]>([
    {
      id: 'DICT-1',
      dictName: '用户性别',
      dictType: 'sys_user_sex',
      status: '正常',
      createTime: '2026-10-19 14:21:23',
      remark: '性别列表 (男/女/未知)'
    },
    {
      id: 'DICT-2',
      dictName: '菜单状态',
      dictType: 'sys_show_hide',
      status: '正常',
      createTime: '2026-10-18 14:21:23',
      remark: '菜单显示与隐藏状态字典'
    },
    {
      id: 'DICT-3',
      dictName: '违规事件类型',
      dictType: 'sys_event_type',
      status: '正常',
      createTime: '2026-10-17 11:10:00',
      remark: '涵盖机动车违停、占道经营、游商等'
    },
    {
      id: 'DICT-4',
      dictName: '网格片区编码',
      dictType: 'sys_grid_code',
      status: '正常',
      createTime: '2026-10-16 09:30:15',
      remark: '城市各街道网格片区对应代号'
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Fields
  const [editingDict, setEditingDict] = useState<DictRecord | null>(null);
  const [targetDeleteDict, setTargetDeleteDict] = useState<DictRecord | null>(null);

  const [formDictName, setFormDictName] = useState('');
  const [formDictType, setFormDictType] = useState('');
  const [formStatus, setFormStatus] = useState<'正常' | '停用'>('正常');
  const [formRemark, setFormRemark] = useState('');

  // Filter List
  const filteredList = useMemo(() => {
    return dictList.filter((d) => {
      const matchName = !filterDictName.trim() || d.dictName.includes(filterDictName.trim());
      const matchType = !filterDictType.trim() || d.dictType.toLowerCase().includes(filterDictType.trim().toLowerCase());
      const matchStatus = !filterStatus || d.status === filterStatus;
      return matchName && matchType && matchStatus;
    });
  }, [dictList, filterDictName, filterDictType, filterStatus]);

  // Row selection logic
  const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(filteredList.map((d) => d.id)));
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

  // Toggle Dict Status
  const handleToggleStatus = (dict: DictRecord) => {
    const nextStatus = dict.status === '正常' ? '停用' : '正常';
    setDictList((prev) =>
      prev.map((d) => (d.id === dict.id ? { ...d, status: nextStatus } : d))
    );
    showToast(`字典【${dict.dictName}】状态已切换为「${nextStatus}」`);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormDictName('');
    setFormDictType('');
    setFormStatus('正常');
    setFormRemark('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (dict: DictRecord) => {
    setEditingDict(dict);
    setFormDictName(dict.dictName);
    setFormDictType(dict.dictType);
    setFormStatus(dict.status);
    setFormRemark(dict.remark || '');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (dict?: DictRecord) => {
    if (dict) {
      setTargetDeleteDict(dict);
    } else {
      setTargetDeleteDict(null);
    }
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDictName.trim() || !formDictType.trim()) {
      alert('请填写字典名称和字典类型！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newDict: DictRecord = {
      id: `DICT-${Date.now()}`,
      dictName: formDictName.trim(),
      dictType: formDictType.trim().toLowerCase(),
      status: formStatus,
      createTime: formattedTime,
      remark: formRemark.trim()
    };

    // Prepend for DESCENDING order by Creation Time
    setDictList((prev) => [newDict, ...prev]);
    setIsAddModalOpen(false);
    showToast(`已成功新增数据字典【${newDict.dictName}】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDict || !formDictName.trim()) return;

    setDictList((prev) =>
      prev.map((d) => {
        if (d.id === editingDict.id) {
          return {
            ...d,
            dictName: formDictName.trim(),
            dictType: formDictType.trim().toLowerCase(),
            status: formStatus,
            remark: formRemark.trim()
          };
        }
        return d;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功保存字典【${formDictName.trim()}】信息！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (targetDeleteDict) {
      setDictList((prev) => prev.filter((d) => d.id !== targetDeleteDict.id));
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(targetDeleteDict.id);
        return next;
      });
      showToast(`已成功删除数据字典【${targetDeleteDict.dictName}】！`);
    } else if (selectedRowIds.size > 0) {
      setDictList((prev) => prev.filter((d) => !selectedRowIds.has(d.id)));
      showToast(`已成功批量删除 ${selectedRowIds.size} 个数据字典！`);
      setSelectedRowIds(new Set());
    }

    setIsDeleteModalOpen(false);
    setTargetDeleteDict(null);
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
              <span>● 字典管理</span>
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
            {/* 字典名称 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">字典名称</span>
              <input
                type="text"
                placeholder="请输入字典名称"
                value={filterDictName}
                onChange={(e) => setFilterDictName(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
              />
            </div>

            {/* 字典类型 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">字典类型</span>
              <input
                type="text"
                placeholder="请输入字典类型"
                value={filterDictType}
                onChange={(e) => setFilterDictType(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 font-mono"
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
              onClick={() => showToast('已成功检索数据字典！')}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={() => {
                setFilterDictName('');
                setFilterDictType('');
                setFilterStatus('');
                showToast('已重置字典筛选条件');
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
                    const record = dictList.find((d) => d.id === selectedId);
                    if (record) openEditModal(record);
                  } else {
                    showToast('请勾选单项字典进行修改！');
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
                onClick={() => showToast('已成功导出系统数据字典表！')}
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
                onClick={() => showToast('字典列表已刷新')}
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

          {/* Table View matching image_3f6a1784.png */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#09101f] text-slate-300 font-bold border-b border-cyan-500/30">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredList.length > 0 &&
                        filteredList.every((d) => selectedRowIds.has(d.id))
                      }
                      onChange={handleSelectAllRows}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-16 text-center">序号</th>
                  <th className="py-3 px-4">字典名称</th>
                  <th className="py-3 px-4 font-mono">字典类型</th>
                  <th className="py-3 px-4 text-center">状态</th>
                  <th className="py-3 px-4">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      暂无匹配的数据字典项目
                    </td>
                  </tr>
                ) : (
                  filteredList.map((dict, index) => {
                    const isSelected = selectedRowIds.has(dict.id);

                    return (
                      <tr
                        key={dict.id}
                        className={`hover:bg-cyan-950/40 transition ${
                          isSelected ? 'bg-cyan-950/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRowSelect(dict.id)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{dict.dictName}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                          {dict.dictType}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            onClick={() => handleToggleStatus(dict)}
                            className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold cursor-pointer transition ${
                              dict.status === '正常'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                            title="点击切换状态"
                          >
                            {dict.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{dict.createTime}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-3 text-xs font-medium">
                            {/* 修改 Button */}
                            <button
                              onClick={() => openEditModal(dict)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                            >
                              <Edit className="w-3 h-3" />
                              <span>修改</span>
                            </button>

                            {/* 删除 Button */}
                            <button
                              onClick={() => openDeleteModal(dict)}
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

          {/* Bottom Pagination matching image_3f6a1784.png */}
          <div className="p-3 bg-[#09101f] border-t border-cyan-500/20 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-400">
            <span>共 {filteredList.length} 条</span>

            <select className="bg-[#0d1629] border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
              <option>10条/页</option>
              <option>20条/页</option>
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

      {/* 3. MODAL 1: 新增字典 (ADD DICT MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>新增系统数据字典</span>
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
                    字典名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：事件紧急程度"
                    value={formDictName}
                    onChange={(e) => setFormDictName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    字典类型 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：sys_event_level"
                    value={formDictType}
                    onChange={(e) => setFormDictType(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">字典状态</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                >
                  <option value="正常">正常</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">备注说明</label>
                <textarea
                  rows={2}
                  placeholder="请输入该字典项的业务范畴与明细说明..."
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

      {/* 4. MODAL 2: 修改字典 (EDIT DICT MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改系统数据字典</span>
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
                  <label className="block text-slate-300 mb-1 font-semibold">字典名称</label>
                  <input
                    type="text"
                    value={formDictName}
                    onChange={(e) => setFormDictName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">字典类型</label>
                  <input
                    type="text"
                    value={formDictType}
                    onChange={(e) => setFormDictType(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">字典状态</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                >
                  <option value="正常">正常</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">备注说明</label>
                <textarea
                  rows={2}
                  value={formRemark}
                  onChange={(e) => setFormRemark(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded p-2.5 text-white"
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
                <span>确认删除数据字典</span>
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
                {targetDeleteDict ? (
                  <>
                    确定要删除数据字典 <b className="text-white">【{targetDeleteDict.dictName} ({targetDeleteDict.dictType})】</b> 吗？
                  </>
                ) : (
                  <>
                    确定要批量删除选中的 <b className="text-rose-400 font-bold">{selectedRowIds.size}</b> 个数据字典吗？
                  </>
                )}
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                警告：删除数据字典将导致前端下拉选项渲染失效，此操作不可撤销。
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
