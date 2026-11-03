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
  Sliders
} from 'lucide-react';

export interface ParamRecord {
  id: string;
  paramName: string;
  paramKey: string;
  paramValue: string;
  isInternal: '是' | '否';
  createTime: string;
  remark?: string;
}

interface ParameterManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const ParameterManagement: React.FC<ParameterManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States matching screenshot image_eb2b3bdc.png
  const [filterParamName, setFilterParamName] = useState('');
  const [filterParamKey, setFilterParamKey] = useState('');
  const [filterIsInternal, setFilterIsInternal] = useState('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Parameter List State sorted in DESCENDING ORDER by Creation Time matching screenshot (2025-12-20)
  const [paramList, setParamList] = useState<ParamRecord[]>([
    {
      id: 'PARAM-1',
      paramName: '主框架页-默认皮肤样式名称',
      paramKey: 'sys.index.skinName',
      paramValue: 'skin-blue',
      isInternal: '是',
      createTime: '2026-10-19 18:31:39',
      remark: '默认暗夜战术与科技蓝皮肤风格'
    },
    {
      id: 'PARAM-2',
      paramName: '用户管理-账号初始密码',
      paramKey: 'sys.user.initPassword',
      paramValue: 'Aa@123456',
      isInternal: '是',
      createTime: '2026-10-18 14:21:23',
      remark: '新创建执法人员的默认临时登录口令'
    },
    {
      id: 'PARAM-3',
      paramName: 'AI防重复预警触发间隔',
      paramKey: 'sys.ai.dedup.interval',
      paramValue: '180',
      isInternal: '否',
      createTime: '2026-10-17 11:10:00',
      remark: '同一摄像头对同一抓拍目标的去重等待时间(秒)'
    },
    {
      id: 'PARAM-4',
      paramName: '事件工单逾期督办阈值',
      paramKey: 'sys.event.overdue.threshold',
      paramValue: '120',
      isInternal: '否',
      createTime: '2026-10-16 09:25:40',
      remark: '超出该限时未处置自动标记为逾期事件(分钟)'
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Fields
  const [editingParam, setEditingParam] = useState<ParamRecord | null>(null);
  const [targetDeleteParam, setTargetDeleteParam] = useState<ParamRecord | null>(null);

  const [formParamName, setFormParamName] = useState('');
  const [formParamKey, setFormParamKey] = useState('');
  const [formParamValue, setFormParamValue] = useState('');
  const [formIsInternal, setFormIsInternal] = useState<'是' | '否'>('是');
  const [formRemark, setFormRemark] = useState('');

  // Filter List
  const filteredList = useMemo(() => {
    return paramList.filter((p) => {
      const matchName = !filterParamName.trim() || p.paramName.includes(filterParamName.trim());
      const matchKey = !filterParamKey.trim() || p.paramKey.toLowerCase().includes(filterParamKey.trim().toLowerCase());
      const matchInternal = !filterIsInternal || p.isInternal === filterIsInternal;
      return matchName && matchKey && matchInternal;
    });
  }, [paramList, filterParamName, filterParamKey, filterIsInternal]);

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

  // Open Add Modal
  const openAddModal = () => {
    setFormParamName('');
    setFormParamKey('');
    setFormParamValue('');
    setFormIsInternal('是');
    setFormRemark('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (param: ParamRecord) => {
    setEditingParam(param);
    setFormParamName(param.paramName);
    setFormParamKey(param.paramKey);
    setFormParamValue(param.paramValue);
    setFormIsInternal(param.isInternal);
    setFormRemark(param.remark || '');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (param?: ParamRecord) => {
    if (param) {
      setTargetDeleteParam(param);
    } else {
      setTargetDeleteParam(null);
    }
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParamName.trim() || !formParamKey.trim() || !formParamValue.trim()) {
      alert('请完整填写参数名称、键名和键值！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newParam: ParamRecord = {
      id: `PARAM-${Date.now()}`,
      paramName: formParamName.trim(),
      paramKey: formParamKey.trim(),
      paramValue: formParamValue.trim(),
      isInternal: formIsInternal,
      createTime: formattedTime,
      remark: formRemark.trim()
    };

    // Prepend for DESCENDING order
    setParamList((prev) => [newParam, ...prev]);
    setIsAddModalOpen(false);
    showToast(`已成功新增系统参数【${newParam.paramName}】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParam || !formParamName.trim()) return;

    setParamList((prev) =>
      prev.map((p) => {
        if (p.id === editingParam.id) {
          return {
            ...p,
            paramName: formParamName.trim(),
            paramKey: formParamKey.trim(),
            paramValue: formParamValue.trim(),
            isInternal: formIsInternal,
            remark: formRemark.trim()
          };
        }
        return p;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功更新系统参数【${formParamName.trim()}】！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (targetDeleteParam) {
      setParamList((prev) => prev.filter((p) => p.id !== targetDeleteParam.id));
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(targetDeleteParam.id);
        return next;
      });
      showToast(`已成功删除参数【${targetDeleteParam.paramName}】！`);
    } else if (selectedRowIds.size > 0) {
      setParamList((prev) => prev.filter((p) => !selectedRowIds.has(p.id)));
      showToast(`已成功批量删除 ${selectedRowIds.size} 个系统参数！`);
      setSelectedRowIds(new Set());
    }

    setIsDeleteModalOpen(false);
    setTargetDeleteParam(null);
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
              <span>● 参数管理</span>
              <X className="w-3 h-3 text-white/70 ml-1 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono">
            近期时间 · 降序排列
          </span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* SEARCH FILTER BAR MATCHING SCREENSHOT image_eb2b3bdc.png */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* 参数名称 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">参数名称</span>
              <input
                type="text"
                placeholder="请输入参数名称"
                value={filterParamName}
                onChange={(e) => setFilterParamName(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
              />
            </div>

            {/* 参数键名 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">参数键名</span>
              <input
                type="text"
                placeholder="请输入参数键名"
                value={filterParamKey}
                onChange={(e) => setFilterParamKey(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 font-mono"
              />
            </div>

            {/* 是否内置 Select Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">是否内置</span>
              <select
                value={filterIsInternal}
                onChange={(e) => setFilterIsInternal(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-36 cursor-pointer"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>

            {/* 🔍 搜索 & 🔄 重置 Buttons */}
            <button
              onClick={() => showToast('已成功检索系统参数配置！')}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={() => {
                setFilterParamName('');
                setFilterParamKey('');
                setFilterIsInternal('');
                showToast('已重置参数筛选条件');
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
                    const record = paramList.find((p) => p.id === selectedId);
                    if (record) openEditModal(record);
                  } else {
                    showToast('请勾选单项参数进行修改！');
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
                onClick={() => showToast('已成功导出系统参数配置文件！')}
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
                onClick={() => showToast('参数列表已刷新')}
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

          {/* Table View matching image_eb2b3bdc.png */}
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
                  <th className="py-3 px-4">参数名称</th>
                  <th className="py-3 px-4 font-mono">参数键名</th>
                  <th className="py-3 px-4 font-mono">参数键值</th>
                  <th className="py-3 px-4 text-center">系统内置</th>
                  <th className="py-3 px-4">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      暂无匹配的系统参数记录
                    </td>
                  </tr>
                ) : (
                  filteredList.map((param, index) => {
                    const isSelected = selectedRowIds.has(param.id);

                    return (
                      <tr
                        key={param.id}
                        className={`hover:bg-cyan-950/40 transition ${
                          isSelected ? 'bg-cyan-950/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRowSelect(param.id)}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{param.paramName}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                          {param.paramKey}
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-300">
                          {param.paramValue}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded border border-cyan-500/50 bg-cyan-950/80 text-cyan-300 font-semibold text-[11px]">
                            {param.isInternal}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300">{param.createTime}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-3 text-xs font-medium">
                            {/* 修改 Button */}
                            <button
                              onClick={() => openEditModal(param)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                            >
                              <Edit className="w-3 h-3" />
                              <span>修改</span>
                            </button>

                            {/* 删除 Button */}
                            <button
                              onClick={() => openDeleteModal(param)}
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

          {/* Bottom Pagination matching image_eb2b3bdc.png */}
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

      {/* 3. MODAL 1: 新增参数 (ADD PARAM MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>新增系统参数配置</span>
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
                <label className="block text-slate-300 mb-1 font-semibold">
                  参数名称 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="如：视频流无感加密传输开关"
                  value={formParamName}
                  onChange={(e) => setFormParamName(e.target.value)}
                  required
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    参数键名 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：sys.video.encrypt"
                    value={formParamKey}
                    onChange={(e) => setFormParamKey(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    参数键值 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：true / 180"
                    value={formParamValue}
                    onChange={(e) => setFormParamValue(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">系统内置</label>
                <select
                  value={formIsInternal}
                  onChange={(e) => setFormIsInternal(e.target.value as '是' | '否')}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">备注说明</label>
                <textarea
                  rows={2}
                  placeholder="请输入参数的作用与配置约束..."
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

      {/* 4. MODAL 2: 修改参数 (EDIT PARAM MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改系统参数配置</span>
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
                <label className="block text-slate-300 mb-1 font-semibold">参数名称</label>
                <input
                  type="text"
                  value={formParamName}
                  onChange={(e) => setFormParamName(e.target.value)}
                  required
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">参数键名</label>
                  <input
                    type="text"
                    value={formParamKey}
                    onChange={(e) => setFormParamKey(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">参数键值</label>
                  <input
                    type="text"
                    value={formParamValue}
                    onChange={(e) => setFormParamValue(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">系统内置</label>
                <select
                  value={formIsInternal}
                  onChange={(e) => setFormIsInternal(e.target.value as '是' | '否')}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="是">是</option>
                  <option value="否">否</option>
                </select>
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
                <span>确认删除系统参数</span>
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
                {targetDeleteParam ? (
                  <>
                    确定要删除系统参数 <b className="text-white">【{targetDeleteParam.paramName} ({targetDeleteParam.paramKey})】</b> 吗？
                  </>
                ) : (
                  <>
                    确定要批量删除选中的 <b className="text-rose-400 font-bold">{selectedRowIds.size}</b> 个系统参数吗？
                  </>
                )}
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                警告：删除内置核心参数可能导致平台功能配置失效，此操作不可撤销。
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
