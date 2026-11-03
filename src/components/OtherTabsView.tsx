import React, { useState } from 'react';
import { GovernanceAlert } from '../types';
import { 
  AlertTriangle, 
  Tv, 
  Box, 
  BarChart3, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Truck
} from 'lucide-react';

interface OtherTabsViewProps {
  currentTab: string;
  onBackToHome: () => void;
  alerts: GovernanceAlert[];
}

export const OtherTabsView: React.FC<OtherTabsViewProps> = ({
  currentTab,
  onBackToHome,
  alerts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter alerts for the alerts tab
  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch = a.type.includes(searchTerm) || a.location.includes(searchTerm) || a.deviceId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 w-full bg-slate-950 text-slate-100 overflow-y-auto p-6 select-text">
      {/* Tab Context Banner */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                ← 返回首页地图大屏
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentTab === 'alerts' && '全域治理预警研判中心'}
              {currentTab === 'events' && '城市治理工单闭环管理'}
              {currentTab === 'entities' && '城市治理重点监管主体库'}
              {currentTab === 'reports' && '综合治理多维统计研判报表'}
              {currentTab === 'system' && '平台物联设备与系统运维'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              数据截止: 2026-10-19 近期动态 · 南宁市城市管理综合行政执法支队
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition"
            >
              返回大屏看板
            </button>
          </div>
        </div>

        {/* Tab 1: 预警中心 */}
        {currentTab === 'alerts' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索预警类型、发生地址或设备编号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">状态过滤:</span>
                {['all', '未处置', '待复核', '已处置'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md font-medium transition ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st === 'all' ? '全部状态' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">预警编号</th>
                    <th className="py-3 px-4">事件分类</th>
                    <th className="py-3 px-4">等级</th>
                    <th className="py-3 px-4">发生位置</th>
                    <th className="py-3 px-4">检出来源</th>
                    <th className="py-3 px-4">抓拍时间</th>
                    <th className="py-3 px-4">状态</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-normal text-slate-200">
                  {filteredAlerts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 font-mono text-cyan-400">{item.id}</td>
                      <td className="py-3 px-4 font-medium text-white">{item.type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.level === '紧急' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{item.location}</td>
                      <td className="py-3 px-4 text-slate-400">{item.source} ({item.deviceId})</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          item.status === '未处置' ? 'bg-sky-500/20 text-sky-400' :
                          item.status === '待复核' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-blue-400 hover:text-blue-300 font-medium">
                          指派处置
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: 事件管理 */}
        {currentTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: '待派发 (12)', color: 'border-rose-500', bg: 'bg-rose-500/10' },
              { title: '处置中 (38)', color: 'border-amber-500', bg: 'bg-amber-500/10' },
              { title: '待复核 (42)', color: 'border-blue-500', bg: 'bg-blue-500/10' },
              { title: '已结案 (145)', color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((col, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                  <h3 className="font-bold text-sm text-white">{col.title}</h3>
                  <span className="text-xs text-slate-400">实时流水</span>
                </div>
                <div className="space-y-2.5">
                  {[1, 2, 3].map((card) => (
                    <div key={card} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">机动车违停·工单 #{2026101900 + card}</span>
                        <span className="text-[10px] text-slate-400 font-mono">14:{10 + card * 8}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">清厢快速路辅道北侧违停车辆核查</p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>责任网格: 北湖街道第3网格</span>
                        <span className="text-blue-400">查看追踪</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: 主体管理 */}
        {currentTab === 'entities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" />
                <span>沿街商户信用码监管 (4,820家)</span>
              </h3>
              <p className="text-xs text-slate-400">
                集成商户门前三包责任制评分、出店经营AI自动抓拍预警与信用分联动。
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-medium">信用优良率: 96.8%</div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>渣土清运与重型工程车 (38家企业)</span>
              </h3>
              <p className="text-xs text-slate-400">
                全流程北斗GPS轨迹监测、过境卡口AI未密闭倾倒检测与电子联单核销。
              </p>
              <div className="pt-2 text-xs text-blue-400 font-medium">今日过境合规核验: 312车次</div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>户外广告与立面招牌 (1,240处)</span>
              </h3>
              <p className="text-xs text-slate-400">
                户外大屏、楼宇发光字与临时宣传横幅数字化审批及违规悬挂巡查。
              </p>
              <div className="pt-2 text-xs text-amber-400 font-medium">本月违规拆除整改: 18处</div>
            </div>
          </div>
        )}

        {/* Tab 4: 统计报表 */}
        {currentTab === 'reports' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">近期城市治理效能指标研报 (2026年10月)</h3>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition">
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>导出分析简报 (PDF / Excel)</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xs text-slate-400">本月累计事件</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">1,842 件</div>
                <div className="text-[11px] text-emerald-400 mt-1">同比下降 14.2%</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xs text-slate-400">平均处置耗时</div>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">18.4 分钟</div>
                <div className="text-[11px] text-emerald-400 mt-1">提速 23.5%</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xs text-slate-400">AI自动发现率</div>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-1">87.6%</div>
                <div className="text-[11px] text-slate-400 mt-1">算法准确率 98.4%</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-xs text-slate-400">市民满意评价率</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">98.9%</div>
                <div className="text-[11px] text-emerald-400 mt-1">回访履约率 100%</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: 系统管理 */}
        {currentTab === 'system' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>边缘AI视频计算引擎</span>
                </div>
                <p className="text-xs text-slate-400">YOLOv10-UrbanCity 增强模型在线部署中</p>
                <div className="text-xs text-emerald-400 font-mono">推理平均时延: 18ms</div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>视频专网与接入网关</span>
                </div>
                <p className="text-xs text-slate-400">GB/T 28181 视频监控协议及移动车载流接入</p>
                <div className="text-xs text-cyan-300 font-mono">已在线摄像头: 235 / 238</div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>区块链可信存证中心</span>
                </div>
                <p className="text-xs text-slate-400">行政执法取证图像防篡改与电子签名归档</p>
                <div className="text-xs text-purple-300 font-mono">区块高度: #1,492,088</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
