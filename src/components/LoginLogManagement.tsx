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
  Key,
  ShieldCheck,
  Lock
} from 'lucide-react';

export interface LoginLogRecord {
  id: string;
  username: string;
  loginIp: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: '成功' | '失败';
  msg: string;
  loginTime: string;
}

interface LoginLogManagementProps {
  onBackToHome: () => void;
  showToast: (msg: string) => void;
}

export const LoginLogManagement: React.FC<LoginLogManagementProps> = ({
  onBackToHome,
  showToast,
}) => {
  // Filter States matching image_8089e92f.png
  const [filterIp, setFilterIp] = useState('');
  const [filterUsername, setFilterUsername] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Login Logs sorted in DESCENDING ORDER by recent October 2026 dates matching screenshot
  const [loginLogs, setLoginLogs] = useState<LoginLogRecord[]>([
    {
      id: 'LOG-L1',
      username: 'admin',
      loginIp: '180.140.153.35:56550',
      loginLocation: '内网IP',
      browser: 'Chrome 12',
      os: 'Windows 10',
      status: '成功',
      msg: '登录成功',
      loginTime: '2026-10-19 14:23:14'
    },
    {
      id: 'LOG-L2',
      username: 'admin',
      loginIp: '180.140.153.35:56550',
      loginLocation: '内网IP',
      browser: 'Chrome 12',
      os: 'Windows 10',
      status: '成功',
      msg: '登录成功',
      loginTime: '2026-10-18 14:23:14'
    },
    {
      id: 'LOG-L3',
      username: 'liliang',
      loginIp: '183.232.119.5:41021',
      loginLocation: '广西南宁',
      browser: 'Mobile Safari 17',
      os: 'Android 14',
      status: '成功',
      msg: '移动终端鉴权成功',
      loginTime: '2026-10-17 11:10:40'
    },
    {
      id: 'LOG-L4',
      username: 'zhangld',
      loginIp: '116.255.44.12:33210',
      loginLocation: '广西玉林',
      browser: 'Edge 120',
      os: 'Windows 11',
      status: '成功',
      msg: '指挥大屏登录成功',
      loginTime: '2026-10-16 09:20:15'
    }
  ]);

  // Detail Modal & Delete States
  const [detailRecord, setDetailRecord] = useState<LoginLogRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filtered list
  const filteredLogs = useMemo(() => {
    return loginLogs.filter(item => {
      const matchIp = !filterIp || item.loginIp.includes(filterIp);
      const matchUser = !filterUsername || item.username.includes(filterUsername);
      const matchStatus = !filterStatus || item.status === filterStatus;
      return matchIp && matchUser && matchStatus;
    });
  }, [loginLogs, filterIp, filterUsername, filterStatus]);

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
      showToast('请先勾选需要删除的登录日志记录');
      return;
    }
    setDeleteTargetId('batch');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId === 'batch') {
      setLoginLogs(prev => prev.filter(item => !selectedRowIds.has(item.id)));
      setSelectedRowIds(new Set());
      showToast(`成功删除所选的 ${selectedRowIds.size} 条登录日志`);
    } else if (deleteTargetId) {
      setLoginLogs(prev => prev.filter(item => item.id !== deleteTargetId));
      showToast('成功删除该条登录日志记录');
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmClear = () => {
    setLoginLogs([]);
    setSelectedRowIds(new Set());
    setIsClearModalOpen(false);
    showToast('已清空所有登录日志记录');
  };

  const handleResetFilters = () => {
    setFilterIp('');
    setFilterUsername('');
    setFilterStatus('');
    showToast('已重置登录日志查询条件');
  };

  return (
    <div className="space-y-4">
      {/* FILTER HEADER CARD */}
      <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">登录地址</label>
            <input
              type="text"
              placeholder="请输入登录地址"
              value={filterIp}
              onChange={e => setFilterIp(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">用户名称</label>
            <input
              type="text"
              placeholder="请输入用户名称"
              value={filterUsername}
              onChange={e => setFilterUsername(e.target.value)}
              className="w-full bg-[#060911] border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
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
            onClick={() => showToast(`查询到 ${filteredLogs.length} 条符合条件的登录日志`)}
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
              <span>清空</span>
            </button>
            <button
              onClick={() => showToast('已解除所选IP的安全锁定状态')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 text-cyan-200 border border-cyan-800 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-900 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>解锁</span>
            </button>
            <button
              onClick={() => showToast('已成功导出登录日志列表')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-950 text-blue-200 border border-blue-800 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-900 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>导出</span>
            </button>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            显示近期降序登录日志共 <span className="text-cyan-400 font-bold">{filteredLogs.length}</span> 条
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
                <th className="p-3">用户名称</th>
                <th className="p-3">登录地址</th>
                <th className="p-3">登录地点</th>
                <th className="p-3">浏览器</th>
                <th className="p-3">操作系统</th>
                <th className="p-3">登录状态</th>
                <th className="p-3">操作信息</th>
                <th className="p-3">访问时间</th>
                <th className="p-3 text-center w-24">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 font-sans">
                    暂无符合条件的登录日志记录
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
                    <td className="p-3 font-sans font-bold text-white">{log.username}</td>
                    <td className="p-3 text-cyan-400">{log.loginIp}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.loginLocation}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.browser}</td>
                    <td className="p-3 text-slate-300 font-sans">{log.os}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        log.status === '成功'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-sans">{log.msg}</td>
                    <td className="p-3 text-slate-400">{log.loginTime}</td>
                    <td className="p-3 text-center font-sans">
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
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>用户登录鉴权日志详情</span>
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
                <span className="text-slate-500 block text-[10px]">用户名称</span>
                <span className="text-white font-bold font-sans text-sm">{detailRecord.username}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">登录状态</span>
                <span className="text-emerald-400 font-bold">{detailRecord.status} ({detailRecord.msg})</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">登录IP地址</span>
                <span className="text-cyan-300">{detailRecord.loginIp}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">地理位置</span>
                <span className="text-slate-200 font-sans">{detailRecord.loginLocation}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">客户端浏览器</span>
                <span className="text-slate-200 font-sans">{detailRecord.browser}</span>
              </div>
              <div className="bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">操作系统</span>
                <span className="text-slate-200 font-sans">{detailRecord.os}</span>
              </div>
              <div className="col-span-2 bg-[#060911] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">完整登录时间戳</span>
                <span className="text-slate-300">{detailRecord.loginTime}</span>
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
                ? `确认要彻底删除选中的 ${selectedRowIds.size} 条登录日志记录吗？`
                : '确认要彻底删除该条登录日志记录吗？'}
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
              <h3 className="font-bold text-white text-sm">清空登录日志高危警告</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              您即将清空平台所有的用户安全登录日志。该操作不可逆，请确认执行！
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
