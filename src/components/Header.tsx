import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  Layers, 
  Radio, 
  Search, 
  Maximize2, 
  Minimize2, 
  Bell, 
  Palette, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Tv, 
  Box, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  Compass,
  Cpu,
  Truck,
  LogOut
} from 'lucide-react';
import { AppTheme, MapDisplayMode } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  onToggleAlertDrawer: () => void;
  alertCount: number;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  mapMode: MapDisplayMode;
  onMapModeChange: (mode: MapDisplayMode) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  onToggleAlertDrawer,
  alertCount,
  theme,
  onThemeChange,
  mapMode,
  onMapModeChange,
  onLogout,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()];
      setTimeStr(`${year}.${month}.${day} ${hours}:${minutes}:${seconds} ${weekDay}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const navItems = [
    { id: 'home', label: '首页', icon: Activity },
    { id: 'alerts', label: '预警中心', icon: AlertTriangle },
    { id: 'events', label: '事件管理', icon: Layers },
    { id: 'entities', label: '主体管理', icon: Box },
    { id: 'reports', label: '统计报表', icon: BarChart3 },
    { id: 'system', label: '系统管理', icon: Settings },
  ];

  return (
    <header className="w-full z-40 relative shrink-0 select-none border-b border-cyan-500/20 shadow-2xl">
      {/* Top Aerospace / Command Control Bar */}
      <div className="bg-[#080d1a] text-slate-100 px-6 py-2.5 flex items-center justify-between relative overflow-hidden">
        {/* Subtle top laser glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative w-9 h-9 rounded-md bg-gradient-to-br from-cyan-500 to-blue-700 p-[1px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-[#091124] rounded-md flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            {/* Corner tech tick */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                智慧城市综合治理平台
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-400 border border-cyan-500/40">
                V3.8 DIGITAL TWIN
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono tracking-wider">
              <span>Smart City Integrated Governance Platform</span>
              <span className="text-cyan-500">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                全域网格联动中
              </span>
            </div>
          </div>
        </div>

        {/* Center: Current Module Breadcrumb & Status */}
        <div className="flex items-center gap-3 bg-[#0f172a]/80 px-4 py-1.5 rounded-lg border border-slate-700/60 shadow-inner">
          <span className="text-xs text-slate-400">当前位置:</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            {currentTab === 'home' && (
              <>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>综合治理态势大屏</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                  全域GIS
                </span>
              </>
            )}
            {currentTab === 'alerts' && (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-400">预警研判</span>
                <span className="text-slate-600">/</span>
                <span className="text-rose-300">实时预警工单中心</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
                  AI巡检
                </span>
              </>
            )}
            {currentTab === 'surveillance' && (
              <>
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">预警研判</span>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-300">智能视频监控矩阵</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                  4K超清
                </span>
              </>
            )}
            {currentTab === 'patrol' && (
              <>
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">预警研判</span>
                <span className="text-slate-600">/</span>
                <span className="text-amber-300">巡查管理指挥平台</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                  网格巡防
                </span>
              </>
            )}
            {(currentTab === 'events' || currentTab.startsWith('events_')) && (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">事件管理</span>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-300">
                  {currentTab === 'events_unhandled' || currentTab === 'events' ? '未处置工单中心' :
                   currentTab === 'events_reviewing' ? '待复核工单中心' :
                   currentTab === 'events_archive' ? '档案库数据中心' :
                   currentTab === 'events_overdue' ? '逾期事件督办专区' :
                   currentTab === 'events_false_alarm' ? '误报事件归档专区' : '工单中心'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
                  {currentTab === 'events_reviewing' ? '43件待复核' :
                   currentTab === 'events_archive' ? '142件档案' :
                   currentTab === 'events_overdue' ? '12件逾期' :
                   currentTab === 'events_false_alarm' ? '8件误报' : '18件待办'}
                </span>
              </>
            )}
            {(currentTab === 'entities' || currentTab.startsWith('subjects_')) && (
              <>
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">主体管理</span>
                <span className="text-slate-600">/</span>
                <span className="text-indigo-300">
                  {currentTab === 'subjects_cancelled' ? '已注销主体' : '企业主体'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                  {currentTab === 'subjects_cancelled' ? '42家注销' : '347家企业'}
                </span>
              </>
            )}
            {currentTab === 'reports' && (
              <>
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>综合治理多维统计分析</span>
              </>
            )}
            {(currentTab === 'system' || currentTab.startsWith('system_')) && (
              <>
                <Settings className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">系统管理</span>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-300">
                  {currentTab === 'system_personnel' ? '执法人员管理' :
                   currentTab === 'system_roles' ? '角色管理' :
                   currentTab === 'system_positions' ? '职务管理' :
                   currentTab === 'system_menus' ? '菜单管理' :
                   currentTab === 'system_dict' ? '字典管理' :
                   currentTab === 'system_params' ? '参数管理' :
                   currentTab === 'system_op_logs' ? '操作日志' :
                   currentTab === 'system_login_logs' ? '登录日志' :
                   currentTab === 'system_settings' ? '系统设置' : '执法机构管理'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Map Modes, Theme Switcher & System Telemetry */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Map Display Mode Switcher (Tactical / Twin / Heatmap) */}
          {currentTab === 'home' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-0.5 rounded border border-slate-800 text-[11px] font-medium">
              {[
                { id: 'tactical', label: '暗夜战术' },
                { id: 'twin', label: '数字孪生' },
                { id: 'heatmap', label: '态势热力' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onMapModeChange(mode.id as MapDisplayMode)}
                  className={`px-2.5 py-1 rounded transition ${
                    mapMode === mode.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          )}

          {/* Theme Selector (Dark Tactical / Digital Twin / Clean Light) */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="切换系统视觉风格"
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700/80 flex items-center gap-1.5 transition"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">风格</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900/95 border border-slate-700/90 rounded-lg shadow-2xl p-1.5 z-50 text-xs backdrop-blur-md">
                <button
                  onClick={() => { onThemeChange('tactical-dark'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                    theme === 'tactical-dark' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🌌 暗夜深空战术</span>
                  {theme === 'tactical-dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
                <button
                  onClick={() => { onThemeChange('digital-twin'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                    theme === 'digital-twin' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🏙️ 赛博数智孪生</span>
                  {theme === 'digital-twin' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
                <button
                  onClick={() => { onThemeChange('clean-light'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                    theme === 'clean-light' ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>☀️ 极简钛白现代</span>
                  {theme === 'clean-light' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Sound Alarm Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? '声光预警已开启' : '声光预警已静音'}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            title="搜索网格地名/设备/工单"
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? '退出全屏' : '全屏展示'}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Real-time Ticking Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b1324] border border-cyan-500/20 text-xs font-mono text-cyan-300 tabular-nums">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{timeStr || '2026.10.19 14:48:32'}</span>
          </div>

          {/* Alert Quick Counter */}
          <button
            onClick={onToggleAlertDrawer}
            className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>{alertCount} 待办</span>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="退出登录"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">退出</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern HUD Ribbon: City Pulse Telemetry Strip */}
      <div className="bg-[#0b1220]/95 border-t border-slate-800/80 px-6 py-1.5 flex items-center justify-between text-xs text-slate-300 overflow-x-auto whitespace-nowrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400">物联接入:</span>
            <span className="font-mono font-bold text-white">235台摄像机</span>
            <span className="text-[11px] text-emerald-400 font-mono">(在线率 98.7%)</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">移动巡检:</span>
            <span className="font-mono font-bold text-white">32辆车载AI</span>
            <span className="text-[11px] text-cyan-300 font-mono">(今日巡查 136 km)</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">处置闭环率:</span>
            <span className="font-mono font-bold text-emerald-400">92.4%</span>
            <span className="text-[11px] text-slate-400 font-mono">(平均耗时 18.4min)</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>边缘推理负荷: <b className="text-cyan-300 font-mono">42.8%</b></span>
          </span>
          <span className="text-slate-700">|</span>
          <span>南宁核心城区重点保障 · 一级指挥响应</span>
        </div>
      </div>
    </header>
  );
};
