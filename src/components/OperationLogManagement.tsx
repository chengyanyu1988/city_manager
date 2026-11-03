import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';

export interface OperationLogRecord {
  id: string;
  module: string;
  opType: string;
  operator: string;
  ip: string;
  location: string;
  status: '成功' | '失败';
  time: string;
  cost: string;
  requestParam?: string;
  responseResult?: string;
}

interface OperationLogManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const OperationLogManagement: React.FC<OperationLogManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States
  const [filterModule, setFilterModule] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterOpType, setFilterOpType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Log Records sorted in DESCENDING ORDER by recent October 2026 dates matching screenshot
  const [logList, setLogList] = useState<OperationLogRecord[]>([
    {
      id: 'LOG-101',
      module: '实时预警',
      opType: '修改',
      operator: 'admin',
      ip: '171.107.6.108:57945',
      location: '内网IP',
      status: '成功',
      time: '2026-10-19 16:07:27',
      cost: '137毫秒',
      requestParam: '{"id":"ALRT-9982","action":"update_status","level":"high"}',
      responseResult: '{"code":200,"msg":"操作成功","data":true}'
    },
    {
      id: 'LOG-102',
      module: '实时预警',
      opType: '修改',
      operator: 'admin',
      ip: '171.107.6.108:57945',
      location: '内网IP',
      status: '成功',
      time: '2026-10-18 16:07:27',
      cost: '137毫秒',
      requestParam: '{"id":"ALRT-9981","action":"batch_dismiss"}',
      responseResult: '{"code":200,"msg":"操作成功","data":true}'
    },
    {
      id: 'LOG-103',
      module: '主体管理',
      opType: '新增',
      operator: '李亮',
      ip: '192.168.1.102:44210',
      location: '内网IP',
      status: '成功',
      time: '2026-10-17 14:20:10',
      cost: '215毫秒',
      requestParam: '{"name":"好味道烫菜坊","category":"餐饮美食","license":"92450100MA...","operator":"黄老板"}',
      responseResult: '{"code":200,"msg":"新增餐饮主体成功","id":"SUBJ-8812"}'
    },
    {
      id: 'LOG-104',
      module: '系统管理',
      opType: '删除',
      operator: 'admin',
      ip: '171.107.6.108:33211',
      location: '内网IP',
      status: '成功',
      time: '2026-10-16 11:15:00',
      cost: '98毫秒',
      requestParam: '{"id":"ROLE-009","name":"临时测试角色"}',
      responseResult: '{"code":200,"msg":"删除角色成功"}'
    },
    {
      id: 'LOG-105',
      module: '执法人员管理',
      opType: '修改',
      operator: 'admin',
      ip: '171.107.6.108:11029',
      location: '内网IP',
      status: '成功',
      time: '2026-10-15 09:40:22',
      cost: '160毫秒',
      requestParam: '{"userId":"USER-1002","phone":"13800138001","status":"正常"}',
      responseResult: '{"code":200,"msg":"更新执法人员成功"}'
    }
  ]);

  // Modals
  const [detailRecord, setDetailRecord] = useState<OperationLogRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filtered list
  const filteredLogs = useMemo(() => {
    return logList.filter(item => {
      const matchModule = !filterModule || item.module.includes(filterModule);
      const matchOperator = !filterOperator || item.operator.includes(filterOperator);
      const matchOpType = !filterOpType || item.opType === filterOpType;
      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchModule && matchOperator && matchOpType && matchStatus;
    });
  }, [logList, filterModule, filterOperator, filterOpType, filterStatus]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(filteredLogs.map(l => l.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleToggleRow = (id: string) => {
    const next = new Set(selectedRowIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRowIds(next);
  };

  const handleDeleteSelected = () => {
    if (selectedRowIds.size === 0) {
      showToast('请先勾选需要删除的操作日志记录');
      return;
    }
    setDeleteTargetId('batch');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === 'batch') {
      setLogList(prev => prev.filter(item => !selectedRowIds.has(item.id)));
      setSelectedRowIds(new Set());
      showToast(`成功删除所选的 ${selectedRowIds.size} 条操作日志`);
    } else if (deleteTargetId) {
      setLogList(prev => prev.filter(item => item.id !== deleteTargetId));
      showToast('成功删除该条操作日志记录');
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmClear = () => {
    setLogList([]);
    setSelectedRowIds(new Set());
    setIsClearModalOpen(false);
    showToast('已清空所有操作日志记录');
  };

  const handleResetFilters = () => {
    setFilterModule('');
    setFilterOperator('');
    setFilterOpType('');
    setFilterStatus('');
    showToast('已重置查询过滤条件');
  };

  return (
    <div className="space-y-4">
      {/* FILTER HEADER CARD */}
      <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">系统模块</label>
            <input
              type="text"
              placeholder="请输入系统模块"
              value={filterModule}
              onChange={e => setFilterModule(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">操作人员</label>
            <input
              type="text"
              placeholder="请输入操作人员"
              value={filterOperator}
              onChange={e => setFilterOperator(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">类型</label>
            <select
              value={filterOpType}
              onChange={e => setFilterOpType(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="">全部类型</option>
              <option value="新增">新增</option>
              <option value="修改">修改</option>
              <option value="删除">删除</option>
              <option value="导出">导出</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">状态</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="">全部状态</option>
              <option value="成功">成功</option>
              <option value="失败">失败</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-cyan-500/10">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
          <button
            onClick={() => showToast(`查询到 ${filteredLogs.length} 条符合条件的操作日志`)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>搜索</span>
          </button>
        </div>
      </div>

      {/* TABLE ACTION TOOLBAR */}
      <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteSelected}
              className="px-3.5 py-1.5 rounded-lg bg-rose-950 text-rose-200 border border-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-900 transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>删除</span>
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-950 text-amber-200 border border-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-900 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>清空日志</span>
            </button>
            <button
              onClick={() => showToast('已成功导出操作日志列表')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-950 text-blue-200 border border-blue-800 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-900 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>导出</span>
            </button>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            显示近期降序日志共 <span className="text-cyan-400 font-bold">{filteredLogs.length}</span> 条
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="overflow-x-auto rounded-lg border border-cyan-500/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#09101f] text-slate-300 border-b border-cyan-500/30">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredLogs.length > 0 && selectedRowIds.size === filteredLogs.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-16">序号</th>
                <th className="p-3">系统模块</th>
                <th className="p-3">操作类型</th>
                <th className="p-3">操作人员</th>
                <th className="p-3">操作地址</th>
                <th className="p-3">操作地点</th>
                <th className="p-3">操作状态</th>
                <th className="p-3">操作时间</th>
                <th className="p-3">消耗时间</th>
                <th className="p-3 text-center w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 font-sans">
                    暂无符合条件的操作日志记录
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-cyan-950/30 transition">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.has(log.id)}
                        onChange={() => handleToggleRow(log.id)}
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-slate-400">{index + 1}</td>
                    <td className="p-3 font-sans text-amber-300 font-bold">{log.module}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-sans">
                        {log.opType}
                      </span>
                    </td>
                    <td className="p-3 font-sans font-bold text-white">{log.operator}</td>
                    <td className="p-3 text-cyan-400">{log.ip}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        log.status === '成功'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{log.time}</td>
                    <td className="p-3 text-blue-300">{log.cost}</td>
                    <td className="p-3 text-center space-x-2 font-sans">
                      <button
                        onClick={() => {
                          setDetailRecord(log);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-0.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>详情</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTargetId(log.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>删除</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && detailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>操作日志详情审计</span>
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">系统模块</span>
                <span className="text-amber-300 font-bold font-sans">{detailRecord.module}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">操作类型</span>
                <span className="text-cyan-300 font-bold">{detailRecord.opType}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">操作人员 / IP</span>
                <span className="text-white font-bold">{detailRecord.operator} ({detailRecord.ip})</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">执行状态 / 耗时</span>
                <span className="text-emerald-400 font-bold">{detailRecord.status} / {detailRecord.cost}</span>
              </div>
              <div className="col-span-2 bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">操作发生时间</span>
                <span className="text-slate-300">{detailRecord.time} ({detailRecord.location})</span>
              </div>
              <div className="col-span-2 bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">请求参数 (JSON Payload)</span>
                <pre className="text-cyan-300 text-[11px] bg-slate-950 p-2 rounded overflow-x-auto mt-1">
                  {detailRecord.requestParam || '无请求参数'}
                </pre>
              </div>
              <div className="col-span-2 bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">返回结果 (JSON Response)</span>
                <pre className="text-emerald-300 text-[11px] bg-slate-950 p-2 rounded overflow-x-auto mt-1">
                  {detailRecord.responseResult || '无返回结果'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-cyan-500/20">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1629] border border-rose-500/40 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-400 border-b border-rose-500/20 pb-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-sm">高危操作确认提示</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {deleteTargetId === 'batch'
                ? `确认要彻底删除选中的 ${selectedRowIds.size} 条操作日志记录吗？删除后将无法恢复。`
                : '确认要彻底删除该条操作日志记录吗？删除后将无法恢复。'}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL MODAL */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1629] border border-amber-500/40 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-400 border-b border-amber-500/20 pb-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-sm">清空日志高危警告</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              您即将清空平台所有的操作审计日志。该操作不可逆，所有历史审计记录将被永久清除，请确认执行！
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                取消
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/30"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
