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
  Shield,
  Key,
  Users,
  CheckSquare,
  Square,
  Lock,
  MoreVertical,
  Check
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  code: string;
  sortOrder: number;
  status: 'normal' | 'disabled';
  createdAt: string;
}

interface RoleManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ onBackToHome, showToast }) => {
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  
  // Recent 2026 dates in descending order
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'r1',
      name: '超级管理员',
      code: 'admin',
      sortOrder: 1,
      status: 'normal',
      createdAt: '2026-10-19 18:30:15'
    },
    {
      id: 'r2',
      name: '案件主办人员',
      code: 'case_sponsor',
      sortOrder: 2,
      status: 'normal',
      createdAt: '2026-10-19 15:20:44'
    },
    {
      id: 'r3',
      name: '法制审核员',
      code: 'legal_auditor',
      sortOrder: 3,
      status: 'normal',
      createdAt: '2026-10-18 10:15:30'
    },
    {
      id: 'r4',
      name: '分局指挥长',
      code: 'branch_commander',
      sortOrder: 4,
      status: 'normal',
      createdAt: '2026-10-17 09:00:12'
    },
    {
      id: 'r5',
      name: '普通执法队员',
      code: 'officer',
      sortOrder: 5,
      status: 'normal',
      createdAt: '2026-10-15 14:22:05'
    },
    {
      id: 'r6',
      name: '系统访客/观察员',
      code: 'visitor',
      sortOrder: 6,
      status: 'disabled',
      createdAt: '2026-10-10 11:05:00'
    }
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    sortOrder: 10,
    status: 'normal' as 'normal' | 'disabled',
    remark: ''
  });

  // Filtered and sorted by createdAt descending
  const filteredRoles = useMemo(() => {
    return roles.filter(item => {
      const matchName = !searchName || item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchCode = !searchCode || item.code.toLowerCase().includes(searchCode.toLowerCase());
      const matchStatus = !searchStatus || item.status === searchStatus;
      return matchName && matchCode && matchStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [roles, searchName, searchCode, searchStatus]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRoles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRoles.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: '',
      sortOrder: roles.length + 1,
      status: 'normal',
      remark: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('角色名称和权限字符不能为空');
      return;
    }
    const newRole: Role = {
      id: 'r_' + Date.now(),
      name: formData.name.trim(),
      code: formData.code.trim(),
      sortOrder: Number(formData.sortOrder) || 1,
      status: formData.status,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setRoles(prev => [newRole, ...prev]);
    setIsAddModalOpen(false);
    showToast('成功新增角色');
  };

  const handleOpenEdit = (role: Role) => {
    setCurrentRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      sortOrder: role.sortOrder,
      status: role.status,
      remark: '系统内置或自定义角色权限配置'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentRole) return;
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('角色名称和权限字符不能为空');
      return;
    }
    setRoles(prev =>
      prev.map(r =>
        r.id === currentRole.id
          ? {
              ...r,
              name: formData.name.trim(),
              code: formData.code.trim(),
              sortOrder: Number(formData.sortOrder) || r.sortOrder,
              status: formData.status
            }
          : r
      )
    );
    setIsEditModalOpen(false);
    showToast('角色修改成功');
  };

  const handleDeleteConfirm = (role: Role) => {
    setCurrentRole(role);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (currentRole) {
      setRoles(prev => prev.filter(r => r.id !== currentRole.id));
      setSelectedIds(prev => prev.filter(id => id !== currentRole.id));
      showToast(`已成功删除角色: ${currentRole.name}`);
    } else if (selectedIds.length > 0) {
      setRoles(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      showToast('已成功批量删除选中角色');
    }
    setIsDeleteModalOpen(false);
    setCurrentRole(null);
  };

  const toggleStatus = (id: string) => {
    setRoles(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: r.status === 'normal' ? 'disabled' : 'normal' } : r
      )
    );
    showToast('角色状态已更新');
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Top Breadcrumb Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1629] border border-cyan-500/20 rounded-xl px-5 py-3.5 shadow-lg shadow-black/40">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button onClick={onBackToHome} className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <Home className="w-4 h-4" />
            <span>首页</span>
          </button>
          <span>/</span>
          <span className="text-slate-300">系统管理</span>
          <span>/</span>
          <span className="text-cyan-400 font-medium px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded-md">
            角色管理
          </span>
        </div>
        <div className="text-xs text-slate-400 bg-[#060911] px-3 py-1.5 rounded-lg border border-slate-800">
          系统时间: <span className="text-cyan-400 font-mono">2026-10-19</span> (近期降序排列)
        </div>
      </div>

      {/* Filter / Search Bar Card */}
      <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-5 shadow-lg shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">角色名称</label>
            <input
              type="text"
              placeholder="请输入角色名称查询"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="w-full bg-[#060911] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">权限字符</label>
            <input
              type="text"
              placeholder="请输入权限字符查询"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="w-full bg-[#060911] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400">状态</label>
            <select
              value={searchStatus}
              onChange={e => setSearchStatus(e.target.value)}
              className="w-full bg-[#060911] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">所有状态</option>
              <option value="normal">正常</option>
              <option value="disabled">停用</option>
            </select>
          </div>
          <div className="flex items-end gap-2 pt-5">
            <button
              onClick={() => showToast('已执行检索')}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-cyan-900/30"
            >
              <Search className="w-4 h-4" />
              <span>搜索</span>
            </button>
            <button
              onClick={() => {
                setSearchName('');
                setSearchCode('');
                setSearchStatus('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar & Table Container */}
      <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-5 shadow-lg shadow-black/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-900/20"
            >
              <Plus className="w-4 h-4" />
              <span>新增</span>
            </button>
            <button
              onClick={() => {
                if (selectedIds.length !== 1) {
                  showToast('请先勾选且仅勾选一项进行修改');
                  return;
                }
                const target = roles.find(r => r.id === selectedIds[0]);
                if (target) handleOpenEdit(target);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border border-cyan-500/30"
            >
              <Edit className="w-4 h-4" />
              <span>修改</span>
            </button>
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  showToast('请至少勾选一项进行删除');
                  return;
                }
                setCurrentRole(null);
                setIsDeleteModalOpen(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-rose-400 px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border border-rose-500/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>删除</span>
            </button>
            <button
              onClick={() => showToast('数据导出成功')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('数据已刷新')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="表格密度"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#09101f] text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button onClick={handleSelectAll}>
                    {selectedIds.length > 0 && selectedIds.length === filteredRoles.length ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="p-3">角色名称</th>
                <th className="p-3">权限字符</th>
                <th className="p-3">显示顺序</th>
                <th className="p-3">状态</th>
                <th className="p-3">创建时间 (近期降序)</th>
                <th className="p-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRoles.map(role => {
                const isSelected = selectedIds.includes(role.id);
                return (
                  <tr key={role.id} className="hover:bg-cyan-500/5 transition-colors group">
                    <td className="p-3 text-center">
                      <button onClick={() => toggleSelect(role.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 font-medium text-slate-200 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>{role.name}</span>
                    </td>
                    <td className="p-3 font-mono text-xs text-cyan-300">{role.code}</td>
                    <td className="p-3 text-slate-300">{role.sortOrder}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleStatus(role.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-max transition-colors ${
                          role.status === 'normal'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${role.status === 'normal' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{role.status === 'normal' ? '正常' : '停用'}</span>
                      </button>
                    </td>
                    <td className="p-3 text-xs text-slate-400 font-mono">{role.createdAt}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(role)}
                          className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded text-xs transition-colors flex items-center gap-1 border border-cyan-500/20"
                        >
                          <Edit className="w-3 h-3" />
                          <span>修改</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRole(role);
                            setIsPermissionsModalOpen(true);
                          }}
                          className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded text-xs transition-colors flex items-center gap-1 border border-indigo-500/20"
                        >
                          <Key className="w-3 h-3" />
                          <span>权限</span>
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(role)}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-xs transition-colors flex items-center gap-1 border border-rose-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>删除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRoles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    暂无符合条件的角色数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm text-slate-400">
          <div>显示第 1 到第 {filteredRoles.length} 条，共 {filteredRoles.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition-colors">上一页</button>
            <button className="px-3 py-1 bg-cyan-600 rounded text-white font-medium">1</button>
            <button className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition-colors">下一页</button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#09101f] border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>{isAddModalOpen ? '新增执法角色' : '修改执法角色'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">角色名称 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="例如：高级督察员"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">权限字符 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="例如：senior_inspector"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">显示排序</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">状态</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'normal' | 'disabled' })}
                    className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="normal">正常</option>
                    <option value="disabled">停用</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">备注说明</label>
                <textarea
                  rows={3}
                  placeholder="请输入角色职责与权限范围说明..."
                  value={formData.remark}
                  onChange={e => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#09101f] border-t border-slate-800">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                取消
              </button>
              <button
                onClick={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-900/30"
              >
                保存提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMISSIONS MODAL */}
      {isPermissionsModalOpen && currentRole && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-indigo-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#09101f] border-b border-slate-800">
              <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span>分配权限 — {currentRole.name}</span>
              </h3>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="text-xs text-slate-400 mb-2">请勾选该角色可操作的系统功能菜单与数据权限：</div>
              {[
                { title: '综合治理大屏与一张图', checked: true },
                { title: '智能违规事件预警与处置', checked: true },
                { title: '多维执法对象监管档案', checked: true },
                { title: '综合治理统计分析报表', checked: true },
                { title: '系统管理与用户权限配置', checked: currentRole.code === 'admin' }
              ].map((perm, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-[#060911] border border-slate-800 rounded-lg hover:border-indigo-500/40 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked={perm.checked} className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                  <span className="text-sm text-slate-200 font-medium">{perm.title}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#09101f] border-t border-slate-800">
              <button onClick={() => setIsPermissionsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700">取消</button>
              <button onClick={() => { setIsPermissionsModalOpen(false); showToast('权限配置保存成功'); }} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm">确认保存</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-rose-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#09101f] border-b border-slate-800">
              <h3 className="text-base font-semibold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>删除安全警告</span>
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-300">
                {currentRole
                  ? `您确定要删除执法角色 "${currentRole.name}" 吗？`
                  : `您确定要批量删除选中的 ${selectedIds.length} 个执法角色吗？`}
              </p>
              <p className="text-xs text-rose-400/90 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                注意：删除后关联该角色的执法人员权限将会失效，请谨慎操作！
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#09101f] border-t border-slate-800">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                取消
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-rose-900/30"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
