import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Tv,
  Box,
  BarChart3,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Bell,
  Palette,
  Volume2,
  VolumeX,
  Radio,
  Layers,
  Sparkles,
  UserCheck,
  Video,
  Truck,
  Archive,
  Clock,
  ShieldAlert,
  Building2,
  Store,
  Building,
  Award,
  Menu,
  BookOpen,
  Sliders,
  FileText,
  Key,
  Cog
} from 'lucide-react';
import { AppTheme } from '../types';

interface LeftSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  alertCount: number;
  onToggleAlertDrawer: () => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  onTabChange,
  alertCount,
  onToggleAlertDrawer,
  theme,
  onThemeChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Submenu expansion state for '预警研判'
  const isAlertsActive = currentTab === 'alerts' || currentTab === 'surveillance' || currentTab === 'patrol';
  const [alertsGroupOpen, setAlertsGroupOpen] = useState(false);

  // Submenu expansion state for '事件管理'
  const isEventsActive = currentTab === 'events' || currentTab.startsWith('events_');
  const [eventsGroupOpen, setEventsGroupOpen] = useState(true);

  // Submenu expansion state for '主体管理'
  const isSubjectsActive = currentTab === 'entities' || currentTab.startsWith('subjects_');
  const [subjectsGroupOpen, setSubjectsGroupOpen] = useState(true);

  // Submenu expansion state for '系统管理'
  const isSystemActive = currentTab === 'system' || currentTab.startsWith('system_');
  const [systemGroupOpen, setSystemGroupOpen] = useState(true);

  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  const mainNavItems = [
    {
      id: 'home',
      label: '态势大屏',
      icon: Activity,
    },
    {
      id: 'alerts_group',
      label: '预警研判',
      icon: AlertTriangle,
      hasSubmenu: true,
      subItems: [
        { id: 'alerts', label: '实时预警', icon: Bell },
        { id: 'surveillance', label: '视频监控', icon: Video },
        { id: 'patrol', label: '巡查管理', icon: Truck },
      ],
    },
    {
      id: 'events_group',
      label: '事件管理',
      icon: Layers,
      hasSubmenu: true,
      subItems: [
        { id: 'events_unhandled', label: '未处置', icon: AlertTriangle },
        { id: 'events_reviewing', label: '待复核', icon: UserCheck },
        { id: 'events_archive', label: '档案库', icon: Archive },
        { id: 'events_overdue', label: '逾期事件', icon: Clock },
        { id: 'events_false_alarm', label: '误报事件', icon: ShieldAlert },
      ],
    },
    {
      id: 'subjects_group',
      label: '主体管理',
      icon: Box,
      hasSubmenu: true,
      subItems: [
        { id: 'subjects_enterprise', label: '企业主体', icon: Store },
        { id: 'subjects_cancelled', label: '已注销主体', icon: Building },
      ],
    },
    {
      id: 'reports',
      label: '统计分析',
      icon: BarChart3,
    },
    {
      id: 'system_group',
      label: '系统管理',
      icon: Settings,
      hasSubmenu: true,
      subItems: [
        { id: 'system_agency', label: '执法机构管理', icon: Building2 },
        { id: 'system_personnel', label: '执法人员管理', icon: UserCheck },
        { id: 'system_roles', label: '角色管理', icon: Shield },
        { id: 'system_positions', label: '职务管理', icon: Award },
        { id: 'system_menus', label: '菜单管理', icon: Menu },
        { id: 'system_dict', label: '字典管理', icon: BookOpen },
        { id: 'system_params', label: '参数管理', icon: Sliders },
        { id: 'system_op_logs', label: '操作日志', icon: FileText },
        { id: 'system_login_logs', label: '登录日志', icon: Key },
        { id: 'system_settings', label: '系统设置', icon: Cog },
      ],
    },
  ];

  return (
    <aside
      className={`h-screen bg-[#070b16] border-r border-cyan-500/20 flex flex-col justify-between shrink-0 select-none z-40 transition-all duration-300 relative shadow-2xl ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Laser Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />

      {/* 1. Header / Logo Brand */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 p-[1px] shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-[#091124] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-400" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 truncate">
                智慧城市综合治理
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
                <span className="px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-[9px]">
                  V3.8 TWIN
                </span>
                <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  指挥联动
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
          title={isCollapsed ? '展开左侧菜单' : '收起左侧菜单'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Middle: Navigation Menu Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 text-xs">
        {mainNavItems.map((item) => {
          const Icon = item.icon;

          if (item.hasSubmenu) {
            const isEventItem = item.id === 'events_group';
            const isSubjectItem = item.id === 'subjects_group';
            const isSystemItem = item.id === 'system_group';
            const isGroupActive = isEventItem ? isEventsActive : isSubjectItem ? isSubjectsActive : isSystemItem ? isSystemActive : isAlertsActive;
            const isGroupOpen = isEventItem ? eventsGroupOpen : isSubjectItem ? subjectsGroupOpen : isSystemItem ? systemGroupOpen : alertsGroupOpen;

            return (
              <div
                key={item.id}
                className="space-y-1 relative"
                onMouseEnter={() => {
                  if (isCollapsed) setHoveredGroupId(item.id);
                }}
                onMouseLeave={() => {
                  setHoveredGroupId(null);
                }}
              >
                {/* Parent Group Header */}
                <button
                  onClick={() => {
                    if (isCollapsed) {
                      onToggleCollapse();
                    }
                    if (isEventItem) {
                      setEventsGroupOpen(!eventsGroupOpen);
                      if (!isEventsActive) {
                        onTabChange('events_unhandled');
                      }
                    } else if (isSubjectItem) {
                      setSubjectsGroupOpen(!subjectsGroupOpen);
                      if (!isSubjectsActive) {
                        onTabChange('subjects_enterprise');
                      }
                    } else if (isSystemItem) {
                      setSystemGroupOpen(!systemGroupOpen);
                      if (!isSystemActive) {
                        onTabChange('system_agency');
                      }
                    } else {
                      setAlertsGroupOpen(!alertsGroupOpen);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isGroupActive
                      ? 'bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isGroupActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!isCollapsed && <span className="tracking-wide text-xs">{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold ${
                          isEventItem 
                            ? 'bg-blue-600/80 text-white' 
                            : 'bg-rose-500 text-white animate-pulse'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isGroupOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Unified Submenu items matching 预警研判 */}
                {!isCollapsed && isGroupOpen && (
                  <div className="pl-4 pr-1 space-y-1 border-l-2 border-cyan-500/20 ml-4 py-1">
                    {item.subItems?.map((sub) => {
                      const SubIcon = (sub as any).icon;
                      const isSubActive =
                        currentTab === sub.id ||
                        (currentTab === 'events' && sub.id === 'events_unhandled');
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onTabChange(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition ${
                            isSubActive
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 shrink-0" />}
                            <span>{sub.label}</span>
                          </div>
                          {(sub as any).badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                                isSubActive
                                  ? 'bg-black/30 text-white'
                                  : sub.id === 'alerts' || sub.id === 'events_unhandled'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : sub.id === 'events_reviewing'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : sub.id === 'events_overdue'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : sub.id === 'events_false_alarm'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : sub.id === 'events_archive'
                                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              }`}
                            >
                              {(sub as any).badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Floating Popover when Sidebar is Collapsed */}
                {isCollapsed && hoveredGroupId === item.id && (
                  <div className="absolute left-14 top-0 w-36 rounded-lg bg-[#0b1324]/95 border border-cyan-500/30 shadow-2xl p-1.5 space-y-1 z-50 backdrop-blur-md animate-fadeIn">
                    <div className="px-2 py-1 text-[11px] font-bold text-cyan-300 border-b border-cyan-500/20 mb-1 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && <span className="text-[9px] text-slate-400 font-mono">{item.badge}</span>}
                    </div>
                    {item.subItems?.map((sub) => {
                      const SubIcon = (sub as any).icon;
                      const isSubActive =
                        currentTab === sub.id ||
                        (currentTab === 'events' && sub.id === 'events_unhandled');
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTabChange(sub.id);
                            setHoveredGroupId(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition ${
                            isSubActive
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {SubIcon && <SubIcon className="w-3.5 h-3.5 shrink-0" />}
                            <span>{sub.label}</span>
                          </div>
                          {(sub as any).badge && (
                            <span className="text-[9px] font-mono text-slate-400">
                              {(sub as any).badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && <span className="tracking-wide text-xs">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Bottom: System Actions, Theme Selector & User Status */}
      <div className="p-2.5 border-t border-slate-800 bg-[#060913] space-y-2 shrink-0">
        {/* Quick Alert Bell Drawer Trigger */}
        <button
          onClick={onToggleAlertDrawer}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-semibold transition ${
            isCollapsed ? 'px-1' : 'px-3'
          }`}
          title="打开实时警情处置抽屉"
        >
          <Bell className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <span>待处置预警</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono text-[10px]">
                {alertCount}条
              </span>
            </div>
          )}
        </button>

        {/* Theme Selector Popover */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition ${
              isCollapsed ? 'px-1' : 'px-3'
            }`}
            title="切换界面风格"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>界面风格</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
            )}
          </button>

          {showThemeMenu && (
            <div
              className={`absolute bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 text-xs backdrop-blur-md ${
                isCollapsed ? 'left-14 w-44' : 'left-0 right-0'
              }`}
            >
              <button
                onClick={() => {
                  onThemeChange('tactical-dark');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  theme === 'tactical-dark' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🌌 暗夜战术</span>
                {theme === 'tactical-dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  onThemeChange('digital-twin');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  theme === 'digital-twin' ? 'bg-blue-600/30 text-blue-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🌐 数字孪生</span>
                {theme === 'digital-twin' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
              <button
                onClick={() => {
                  onThemeChange('clean-light');
                  setShowThemeMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  theme === 'clean-light' ? 'bg-amber-600/30 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>☀️ 政务浅色</span>
                {theme === 'clean-light' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* User Status Bar */}
        {!isCollapsed && (
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <div className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-[10px]">
                城
              </div>
              <span className="truncate">指挥中心值班员</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="在线" />
          </div>
        )}
      </div>
    </aside>
  );
};
