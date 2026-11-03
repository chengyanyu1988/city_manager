import React, { useState } from 'react';
import {
  Home,
  X,
  Plus,
  Search,
  RotateCcw,
  Download,
  Building2,
  UserCheck,
  Shield,
  Award,
  Menu,
  BookOpen,
  Sliders,
  FileText,
  Key,
  Cog,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Trash2,
  Lock,
  Eye,
  RefreshCw,
  Phone,
  Radio,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { EnforcementAgencyManagement } from './EnforcementAgencyManagement';
import { EnforcementPersonnelManagement } from './EnforcementPersonnelManagement';
import { RoleManagement } from './RoleManagement';
import { PositionManagement } from './PositionManagement';
import { MenuManagement } from './MenuManagement';
import { DictionaryManagement } from './DictionaryManagement';
import { ParameterManagement } from './ParameterManagement';
import { OperationLogManagement } from './OperationLogManagement';
import { LoginLogManagement } from './LoginLogManagement';

export type SystemSubTab =
  | 'agency'
  | 'personnel'
  | 'roles'
  | 'positions'
  | 'menus'
  | 'dict'
  | 'params'
  | 'op_logs'
  | 'login_logs'
  | 'settings';

interface SystemManagementPageProps {
  onBackToHome: () => void;
  currentSubTab?: SystemSubTab;
  onSubTabChange?: (tab: SystemSubTab) => void;
  theme?: string;
}

export const SystemManagementPage: React.FC<SystemManagementPageProps> = ({
  onBackToHome,
  currentSubTab = 'agency',
  onSubTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<SystemSubTab>(currentSubTab);

  React.useEffect(() => {
    if (currentSubTab) {
      setActiveTab(currentSubTab);
    }
  }, [currentSubTab]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleTabSwitch = (tab: SystemSubTab) => {
    setActiveTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const menuList: { id: SystemSubTab; label: string; icon: any }[] = [
    { id: 'agency', label: '执法机构管理', icon: Building2 },
    { id: 'personnel', label: '执法人员管理', icon: UserCheck },
    { id: 'roles', label: '角色管理', icon: Shield },
    { id: 'positions', label: '职务管理', icon: Award },
    { id: 'menus', label: '菜单管理', icon: Menu },
    { id: 'dict', label: '字典管理', icon: BookOpen },
    { id: 'params', label: '参数管理', icon: Sliders },
    { id: 'op_logs', label: '操作日志', icon: FileText },
    { id: 'login_logs', label: '登录日志', icon: Key },
    { id: 'settings', label: '系统设置', icon: Cog },
  ];

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-hidden select-text relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-16 right-8 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP SUB-NAV BREADCRUMB & SUBTAB PILLS */}
      <div className="bg-[#0b1324] border-b border-cyan-500/20 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1 rounded bg-[#131f37] hover:bg-cyan-950 text-slate-300 hover:text-white text-xs font-medium border border-cyan-500/30 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>首页</span>
          </button>

          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-white">系统管理</span>
          <span className="text-slate-600">/</span>

          {/* Subtab Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {menuList.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabSwitch(m.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 border border-blue-400/40'
                      : 'bg-[#131f37] text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            系统服务运行正常
          </span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* SUBTAB 1: 执法机构管理 (AGENCY) */}
        {activeTab === 'agency' && (
          <EnforcementAgencyManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 2: 执法人员管理 (PERSONNEL) */}
        {activeTab === 'personnel' && (
          <EnforcementPersonnelManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 3: 角色管理 (ROLES) */}
        {activeTab === 'roles' && (
          <RoleManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 4: 职务管理 (POSITIONS) */}
        {activeTab === 'positions' && (
          <PositionManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 5: 菜单管理 (MENUS) */}
        {activeTab === 'menus' && (
          <MenuManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 6: 字典管理 (DICT) */}
        {activeTab === 'dict' && (
          <DictionaryManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 7: 参数管理 (PARAMS) */}
        {activeTab === 'params' && (
          <ParameterManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 8: 操作日志 (OP_LOGS) */}
        {activeTab === 'op_logs' && (
          <OperationLogManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 9: 登录日志 (LOGIN_LOGS) */}
        {activeTab === 'login_logs' && (
          <LoginLogManagement
            onBackToHome={onBackToHome}
            showToast={showToast}
          />
        )}

        {/* SUBTAB 10: 系统设置 (SETTINGS) */}
        {activeTab === 'settings' && (
          <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-5 space-y-5 shadow-xl max-w-3xl">
            <div className="border-b border-cyan-500/20 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <Cog className="w-4 h-4 text-cyan-400" />
                <span>平台全局系统选项配置</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">平台显示名称</label>
                <input
                  type="text"
                  defaultValue="智慧城市综合治理平台 V3.8 DIGITAL TWIN"
                  className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">系统告警语音提示</label>
                  <select className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white">
                    <option value="on">开启 (高音质TTS核查语音)</option>
                    <option value="off">关闭 (仅闪烁视觉告警)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">数据自动备份策略</label>
                  <select className="w-full bg-[#09101f] border border-cyan-500/30 rounded px-3 py-2 text-white">
                    <option value="daily">每日凌晨 03:00 增量备份</option>
                    <option value="weekly">每周全量备份</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => showToast('已成功保存系统配置选项！')}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  保存系统配置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
