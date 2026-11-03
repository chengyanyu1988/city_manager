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
  Menu,
  ChevronDown,
  ChevronRight,
  Tv,
  Layers,
  Box,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

export interface MenuRecord {
  id: string;
  menuName: string;
  icon: string;
  sort: number;
  perms: string;
  path: string;
  status: '正常' | '停用';
  createTime: string;
  children?: MenuRecord[];
}

interface MenuManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States matching screenshot image_0b9d971b.png
  const [filterMenuName, setFilterMenuName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['MENU-1', 'MENU-2']));

  // Menu List State sorted in DESCENDING ORDER by Creation Time (recent 2026 dates)
  const [menuList, setMenuList] = useState<MenuRecord[]>([
    {
      id: 'MENU-1',
      menuName: '预警中心',
      icon: 'Bell',
      sort: 1,
      perms: 'sys:alert:view',
      path: '/alerts',
      status: '正常',
      createTime: '2026-10-19 14:21:23',
      children: [
        {
          id: 'MENU-1-1',
          menuName: '实时预警',
          icon: 'Activity',
          sort: 1,
          perms: 'sys:alert:realtime',
          path: '/alerts/realtime',
          status: '正常',
          createTime: '2026-10-19 13:10:00'
        },
        {
          id: 'MENU-1-2',
          menuName: '视频监控',
          icon: 'Tv',
          sort: 2,
          perms: 'sys:surveillance:view',
          path: '/surveillance',
          status: '正常',
          createTime: '2026-10-19 12:00:00'
        }
      ]
    },
    {
      id: 'MENU-2',
      menuName: '事件管理',
      icon: 'Layers',
      sort: 2,
      perms: 'sys:event:view',
      path: '/events',
      status: '正常',
      createTime: '2026-10-18 14:21:23',
      children: [
        {
          id: 'MENU-2-1',
          menuName: '未处置工单',
          icon: 'AlertTriangle',
          sort: 1,
          perms: 'sys:event:unhandled',
          path: '/events/unhandled',
          status: '正常',
          createTime: '2026-10-18 11:30:00'
        },
        {
          id: 'MENU-2-2',
          menuName: '工单档案库',
          icon: 'Box',
          sort: 2,
          perms: 'sys:event:archive',
          path: '/events/archive',
          status: '正常',
          createTime: '2026-10-18 10:15:00'
        }
      ]
    },
    {
      id: 'MENU-3',
      menuName: '主体管理',
      icon: 'Box',
      sort: 3,
      perms: 'sys:subject:view',
      path: '/subjects',
      status: '正常',
      createTime: '2026-10-17 09:12:00'
    },
    {
      id: 'MENU-4',
      menuName: '统计分析',
      icon: 'BarChart3',
      sort: 4,
      perms: 'sys:report:view',
      path: '/reports',
      status: '正常',
      createTime: '2026-10-16 08:30:00'
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Fields
  const [selectedParentId, setSelectedParentId] = useState('');
  const [editingMenu, setEditingMenu] = useState<MenuRecord | null>(null);
  const [targetDeleteMenu, setTargetDeleteMenu] = useState<MenuRecord | null>(null);

  const [formMenuName, setFormMenuName] = useState('');
  const [formIcon, setFormIcon] = useState('Bell');
  const [formSort, setFormSort] = useState<number>(0);
  const [formPerms, setFormPerms] = useState('');
  const [formPath, setFormPath] = useState('');
  const [formStatus, setFormStatus] = useState<'正常' | '停用'>('正常');

  // Toggle expand
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

  // Filter list
  const filteredList = useMemo(() => {
    return menuList
      .map((parent) => {
        const parentMatch = !filterMenuName.trim() || parent.menuName.includes(filterMenuName.trim());
        const statusMatch = !filterStatus || parent.status === filterStatus;

        const matchingChildren = (parent.children || []).filter((child) => {
          const childMatch = !filterMenuName.trim() || child.menuName.includes(filterMenuName.trim());
          const childStatus = !filterStatus || child.status === filterStatus;
          return childMatch && childStatus;
        });

        if ((parentMatch && statusMatch) || matchingChildren.length > 0) {
          return {
            ...parent,
            children: matchingChildren
          };
        }
        return null;
      })
      .filter(Boolean) as MenuRecord[];
  }, [menuList, filterMenuName, filterStatus]);

  // Toggle Status
  const handleToggleStatus = (menu: MenuRecord) => {
    const nextStatus = menu.status === '正常' ? '停用' : '正常';
    setMenuList((prev) =>
      prev.map((item) => {
        if (item.id === menu.id) return { ...item, status: nextStatus };
        if (item.children) {
          return {
            ...item,
            children: item.children.map((c) => (c.id === menu.id ? { ...c, status: nextStatus } : c))
          };
        }
        return item;
      })
    );
    showToast(`菜单【${menu.menuName}】状态已切换为「${nextStatus}」`);
  };

  // Open Add Modal
  const openAddModal = (parentId = '') => {
    setSelectedParentId(parentId);
    setFormMenuName('');
    setFormIcon('Bell');
    setFormSort(0);
    setFormPerms('');
    setFormPath('');
    setFormStatus('正常');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (menu: MenuRecord) => {
    setEditingMenu(menu);
    setFormMenuName(menu.menuName);
    setFormIcon(menu.icon || 'Bell');
    setFormSort(menu.sort);
    setFormPerms(menu.perms || '');
    setFormPath(menu.path || '');
    setFormStatus(menu.status);
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (menu: MenuRecord) => {
    setTargetDeleteMenu(menu);
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMenuName.trim()) {
      alert('请填写菜单名称！');
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newNode: MenuRecord = {
      id: `MENU-${Date.now()}`,
      menuName: formMenuName.trim(),
      icon: formIcon,
      sort: formSort,
      perms: formPerms.trim() || 'sys:custom:view',
      path: formPath.trim() || '/custom',
      status: formStatus,
      createTime: formattedTime,
      children: []
    };

    if (!selectedParentId) {
      setMenuList((prev) => [newNode, ...prev]);
    } else {
      setMenuList((prev) =>
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
      setExpandedIds((prev) => new Set(prev).add(selectedParentId));
    }

    setIsAddModalOpen(false);
    showToast(`已成功新增菜单【${newNode.menuName}】！`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu || !formMenuName.trim()) return;

    setMenuList((prev) =>
      prev.map((item) => {
        if (item.id === editingMenu.id) {
          return {
            ...item,
            menuName: formMenuName.trim(),
            icon: formIcon,
            sort: formSort,
            perms: formPerms.trim(),
            path: formPath.trim(),
            status: formStatus
          };
        }
        if (item.children) {
          return {
            ...item,
            children: item.children.map((c) => {
              if (c.id === editingMenu.id) {
                return {
                  ...c,
                  menuName: formMenuName.trim(),
                  icon: formIcon,
                  sort: formSort,
                  perms: formPerms.trim(),
                  path: formPath.trim(),
                  status: formStatus
                };
              }
              return c;
            })
          };
        }
        return item;
      })
    );

    setIsEditModalOpen(false);
    showToast(`已成功保存菜单【${formMenuName.trim()}】信息！`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!targetDeleteMenu) return;

    setMenuList((prev) =>
      prev
        .filter((item) => item.id !== targetDeleteMenu.id)
        .map((item) => ({
          ...item,
          children: item.children ? item.children.filter((c) => c.id !== targetDeleteMenu.id) : []
        }))
    );

    setIsDeleteModalOpen(false);
    showToast(`已成功删除菜单【${targetDeleteMenu.menuName}】！`);
    setTargetDeleteMenu(null);
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
              <span>● 菜单管理</span>
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
            {/* 菜单名称 Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">菜单名称</span>
              <input
                type="text"
                placeholder="请输入菜单名称"
                value={filterMenuName}
                onChange={(e) => setFilterMenuName(e.target.value)}
                className="bg-[#09101f] border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
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
              onClick={() => showToast('已成功过滤菜单列表！')}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            <button
              onClick={() => {
                setFilterMenuName('');
                setFilterStatus('');
                showToast('已重置菜单筛选条件');
              }}
              className="px-3.5 py-1.5 rounded bg-[#131f37] hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* ACTION TOOLBAR & TREE TABLE CONTAINER MATCHING SCREENSHOT */}
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col justify-between">
          {/* Action Toolbar Header */}
          <div className="p-3 bg-[#09101f] border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* + 新增 Button */}
              <button
                onClick={() => openAddModal()}
                className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>

              {/* 📥 导出 Button */}
              <button
                onClick={() => showToast('已成功导出系统菜单路由表！')}
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
                onClick={() => showToast('菜单列表已刷新')}
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

          {/* Table View matching image_0b9d971b.png */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#09101f] text-slate-300 font-bold border-b border-cyan-500/30">
                <tr>
                  <th className="py-3 px-4 w-72">菜单名称</th>
                  <th className="py-3 px-4 w-24 text-center">图标</th>
                  <th className="py-3 px-4 w-20 text-center">排序</th>
                  <th className="py-3 px-4">权限标识</th>
                  <th className="py-3 px-4">组件路径</th>
                  <th className="py-3 px-4 w-24 text-center">状态</th>
                  <th className="py-3 px-4">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      暂无匹配的菜单路由数据
                    </td>
                  </tr>
                ) : (
                  filteredList.map((parent) => {
                    const hasChildren = parent.children && parent.children.length > 0;
                    const isExpanded = expandedIds.has(parent.id);

                    return (
                      <React.Fragment key={parent.id}>
                        {/* Parent Row */}
                        <tr className="hover:bg-cyan-950/40 transition bg-[#0b1324]/60 font-semibold">
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
                              <Menu className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="text-white font-bold">{parent.menuName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-cyan-300 font-mono">
                            {parent.icon}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-300">
                            {parent.sort}
                          </td>
                          <td className="py-3 px-4 font-mono text-amber-300">{parent.perms}</td>
                          <td className="py-3 px-4 font-mono text-slate-300">{parent.path}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              onClick={() => handleToggleStatus(parent)}
                              className={`px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition ${
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

                              {/* 删除 Button */}
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

                        {/* Children Sub-Rows */}
                        {isExpanded &&
                          parent.children?.map((child) => (
                            <tr key={child.id} className="hover:bg-cyan-950/20 transition bg-[#080d1a]/80">
                              <td className="py-2.5 px-4 pl-12">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600 font-mono">└─</span>
                                  <span className="text-slate-200">{child.menuName}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                                {child.icon}
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                                {child.sort}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-amber-300/80">{child.perms}</td>
                              <td className="py-2.5 px-4 font-mono text-slate-400">{child.path}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span
                                  onClick={() => handleToggleStatus(child)}
                                  className={`px-2 py-0.5 rounded border text-[10px] cursor-pointer ${
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
                                  <button
                                    onClick={() => openEditModal(child)}
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                                  >
                                    <Edit className="w-3 h-3" />
                                    <span>修改</span>
                                  </button>
                                  <button
                                    onClick={() => openAddModal(child.id)}
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>新增</span>
                                  </button>
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

          {/* Bottom Pagination matching image_0b9d971b.png */}
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

      {/* 3. MODAL 1: 新增菜单 (ADD MENU MODAL) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>新增系统菜单路由</span>
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
                <label className="block text-slate-300 mb-1 font-semibold">上级菜单</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">无 (顶级菜单)</option>
                  {menuList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.menuName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    菜单名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：应急调度"
                    value={formMenuName}
                    onChange={(e) => setFormMenuName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">菜单图标</label>
                  <input
                    type="text"
                    placeholder="如：Bell / Layers"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">显示排序</label>
                  <input
                    type="number"
                    value={formSort}
                    onChange={(e) => setFormSort(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">菜单状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                  >
                    <option value="正常">正常</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">权限标识</label>
                  <input
                    type="text"
                    placeholder="如：sys:menu:add"
                    value={formPerms}
                    onChange={(e) => setFormPerms(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">组件路径</label>
                  <input
                    type="text"
                    placeholder="如：/alerts/dispatch"
                    value={formPath}
                    onChange={(e) => setFormPath(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
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

      {/* 4. MODAL 2: 修改菜单 (EDIT MENU MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#09101f] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <span>修改系统菜单路由</span>
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
                  <label className="block text-slate-300 mb-1 font-semibold">菜单名称</label>
                  <input
                    type="text"
                    value={formMenuName}
                    onChange={(e) => setFormMenuName(e.target.value)}
                    required
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">菜单图标</label>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">显示排序</label>
                  <input
                    type="number"
                    value={formSort}
                    onChange={(e) => setFormSort(Number(e.target.value))}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">菜单状态</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as '正常' | '停用')}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white"
                  >
                    <option value="正常">正常</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">权限标识</label>
                  <input
                    type="text"
                    value={formPerms}
                    onChange={(e) => setFormPerms(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">组件路径</label>
                  <input
                    type="text"
                    value={formPath}
                    onChange={(e) => setFormPath(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-mono"
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

      {/* 5. MODAL 3: 删除确认 (DELETE CONFIRMATION MODAL) */}
      {isDeleteModalOpen && targetDeleteMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-rose-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-rose-950/40 border-b border-rose-500/30 flex items-center justify-between">
              <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>确认删除菜单项</span>
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
                确定要删除菜单 <b className="text-white">【{targetDeleteMenu.menuName}】</b> 吗？
              </p>
              <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px]">
                警告：删除该菜单路由将同时移除子路由并撤销相关角色的侧边栏渲染，此操作不可撤销。
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
