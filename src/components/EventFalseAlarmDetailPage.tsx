import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  X,
  Camera,
  CornerUpLeft,
  Megaphone,
  Share2,
  Send,
  UserCheck,
  Truck,
  Layers,
  Clock,
  Radio,
  ExternalLink,
  Trash2,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  Download,
  Video
} from 'lucide-react';
import { FalseAlarmItem } from './EventFalseAlarmPage';

interface EventFalseAlarmDetailPageProps {
  item: FalseAlarmItem;
  onBack: () => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export const EventFalseAlarmDetailPage: React.FC<EventFalseAlarmDetailPageProps> = ({
  item,
  onBack,
  onDelete,
  onRestore
}) => {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'live' | 'history'>('snapshot');
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(3);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);
  const [isRemoteNotifyModalOpen, setIsRemoteNotifyModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 5 Left Carousel Snapshots matching screenshot
  const snapshots = [
    { time: '2026-10-19 10:31:12', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
    { time: '2026-10-19 10:31:11', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' },
    { time: '2026-10-19 10:31:10', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80' },
    { time: '2026-10-19 10:31:09', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
    { time: '2026-10-19 10:31:08', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg shadow-xl border border-indigo-300/40 font-semibold animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header / Breadcrumb Bar (Matching screenshot: ← 返回 | 误报事件) */}
      <div className="h-11 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d1629] hover:bg-cyan-900/40 border border-cyan-500/30 text-xs text-slate-200 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>返回</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-bold text-slate-200 tracking-wide">误报事件详情</span>
          <span className="text-xs text-purple-400 font-mono font-bold pl-2">[{item.id}]</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">误报判定：</span>
          <span className="text-purple-300 font-bold">{item.reason}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">复核责任人：</span>
          <span className="text-cyan-300 font-bold">{item.reviewer}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 relative">
        
        {/* LEFT COLUMN: Main Surveillance & Info Panel (approx 75% width) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          
          {/* Top Big Card: Tabs + Left Thumbnails + Main Viewport + Detail Crops */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 flex flex-col">
            
            {/* Tab Navigation Header: 事件抓拍 | 实时监控 | 历史视频 */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <div className="flex items-center gap-1 font-bold text-xs">
                <button
                  onClick={() => setActiveTab('snapshot')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer ${
                    activeTab === 'snapshot'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  事件抓拍
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'live'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>实时监控</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'bg-[#1890ff] text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-[#090e1c]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>历史视频</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-purple-300">
                归档标记：预警触发已判定为误报
              </div>
            </div>

            {/* Media Content Grid Layout */}
            <div className="grid grid-cols-12 gap-3">
              
              {/* 1. Left Thumbnail Strip (2 cols - 5 thumbnails) */}
              <div className="col-span-2 space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {snapshots.map((snap, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedSnapshotIndex(idx)}
                    className={`rounded overflow-hidden border cursor-pointer transition ${
                      selectedSnapshotIndex === idx
                        ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-md'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="relative h-16 bg-slate-900">
                      <img src={snap.url} alt={snap.time} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-2 inset-y-2 border border-purple-500 bg-purple-500/10" />
                    </div>
                    <div className="bg-[#090e1c] text-[10px] text-center font-mono py-0.5 text-slate-300">
                      {snap.time.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Main Viewport Player (7 cols) */}
              <div className="col-span-7 bg-[#090e1c] rounded border border-cyan-500/30 overflow-hidden relative group flex flex-col justify-between h-[380px]">
                <img
                  src={snapshots[selectedSnapshotIndex].url}
                  alt="Main Camera View"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-1/3 left-1/3 w-36 h-24 border-2 border-purple-500 bg-purple-500/20 rounded-xs" />

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-bold text-cyan-300">{item.cameraName || 'C201摄像头'}</span>
                    <span className="text-slate-300">{snapshots[selectedSnapshotIndex].time}</span>
                  </div>

                  <button
                    onClick={() => showToast('已开启 1080P 高清监看大屏')}
                    className="p-1 rounded hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Right Crop Detail Thumbnails Column (3 cols) */}
              <div className="col-span-3 flex flex-col justify-between space-y-2">
                <div className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden h-24 relative">
                  <img
                    src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80"
                    alt="Vehicle Zoom"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-purple-300 font-mono">
                    算法抓拍识别
                  </div>
                </div>

                <div className="bg-[#090e1c] rounded border border-purple-500/40 overflow-hidden h-24 relative flex items-center justify-center">
                  <div className="bg-indigo-900 border-2 border-slate-100 text-white font-bold font-mono px-3 py-1 rounded text-sm shadow-md tracking-wider">
                    {item.plateNumber || '粤B·2N66V'}
                  </div>
                  <div className="absolute bottom-1 right-1 text-[9px] text-purple-300 font-mono">
                    审核归档判定
                  </div>
                </div>

                <div className="bg-[#090e1c] rounded border border-slate-800 overflow-hidden h-24 relative">
                  <img
                    src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80"
                    alt="Side View"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-slate-300 font-mono">
                    全景环境对比
                  </div>
                </div>

                <button
                  onClick={() => setIsRemoteNotifyModalOpen(true)}
                  className="w-full py-2 rounded bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer active:scale-98"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>远程喊话通知</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Card: 预警信息 + Mini GIS Map */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-3.5 bg-purple-400 rounded-full" />
              <h3 className="text-sm font-bold text-purple-300">预警信息</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sans">
                <div>
                  <span className="text-slate-400">事件编号：</span>
                  <span className="text-slate-300 font-mono font-medium">{item.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">预警摄像头：</span>
                  <span className="text-slate-200 font-medium">{item.cameraName || 'C204摄像头'}</span>
                </div>
                <div>
                  <span className="text-slate-400">违规类型：</span>
                  <span className="text-purple-300 font-bold">{item.type}</span>
                </div>
                <div>
                  <span className="text-slate-400">误报判定原因：</span>
                  <span className="text-slate-200">{item.reason}</span>
                </div>
                <div>
                  <span className="text-slate-400">开始预警时间：</span>
                  <span className="text-slate-200 font-mono">{item.time}</span>
                </div>
                <div>
                  <span className="text-slate-400">审核责任人：</span>
                  <span className="text-cyan-300 font-mono">{item.reviewer}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">位置信息：</span>
                  <span className="text-slate-200">{item.location}</span>
                </div>
              </div>

              <div className="relative rounded overflow-hidden border border-cyan-500/30 bg-[#090e1c] h-36 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"
                  alt="GIS Map Preview"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[1px]" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-400 fill-purple-400" />
                  <span>良庆区电子地图</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Status & Timeline Panel (approx 25% width) */}
        <div className="w-80 shrink-0 space-y-3 flex flex-col">
          
          {/* Card 1: 事件状态 */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <div className="w-1 h-3.5 bg-purple-400 rounded-full" />
              <h3 className="text-sm font-bold text-purple-300">事件状态</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <p className="text-slate-400">预警状态</p>
                <p className="text-purple-300 font-bold">误报归档</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">核实情况</p>
                <p className="text-slate-300 font-bold">非违规</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">审核结论</p>
                <p className="text-emerald-400 font-medium">已结案</p>
              </div>
            </div>
          </div>

          {/* Card 2: 事件流程 */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4 space-y-3 flex-1 flex flex-col">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <div className="w-1 h-3.5 bg-purple-400 rounded-full" />
              <h3 className="text-sm font-bold text-purple-300">事件流程</h3>
            </div>

            <div className="space-y-4 text-xs relative pl-4 pt-1 flex-1">
              <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-purple-500/30" />

              <div className="relative space-y-1">
                <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400 ring-4 ring-[#0d1629]" />
                <p className="font-mono text-purple-300 text-[11px]">{item.time}</p>
                <div className="bg-[#090e1c] p-2 rounded border border-slate-800 text-slate-300 leading-relaxed">
                  算法捕捉到 <span className="text-purple-300 font-bold">{item.type}</span> 预警
                </div>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#1890ff] ring-4 ring-[#0d1629]" />
                <p className="font-mono text-cyan-300 text-[11px]">{item.time}</p>
                <div className="bg-[#090e1c] p-2 rounded border border-slate-800 text-slate-300 leading-relaxed space-y-1">
                  <p>
                    <span className="text-cyan-300 font-bold">{item.reviewer}</span> 判定为 <span className="text-purple-300 font-bold">误报</span> 并归档
                  </p>
                  <p className="text-[11px] text-slate-400 pt-0.5 border-t border-slate-800">
                    判定原因: {item.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Card (精确改写为：删除 和 还原 两个按钮) */}
          <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-3 grid grid-cols-2 gap-3">
            
            {/* 按钮 1: 删除 (Delete) */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="py-2.5 rounded bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Trash2 className="w-4 h-4" />
              <span>删除</span>
            </button>

            {/* 按钮 2: 还原 (Restore) */}
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="py-2.5 rounded bg-[#1890ff] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>还原</span>
            </button>

          </div>

        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-rose-500/50 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 bg-[#090e1c] border-b border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white">删除误报归档记录确认</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-200 font-sans">
              <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded text-rose-200 leading-relaxed font-mono">
                ⚠️ 高危操作：确定要彻底删除误报档案 <span className="font-bold underline">[{item.id}]</span> 吗？删除后此条算法历史快照将不再保留。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    onDelete?.(item.id);
                    showToast(`已成功删除误报档案记录 [${item.id}]`);
                    onBack();
                  }}
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  确认彻底删除
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE CONFIRMATION MODAL */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/50 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 bg-[#090e1c] border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">还原误报记录至未处置列表</h3>
              </div>
              <button onClick={() => setIsRestoreModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-200 font-sans">
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded text-cyan-200 leading-relaxed font-mono">
                🔄 还原提示：确定要将工单 <span className="font-bold underline">[{item.id}]</span> 从误报库中还原吗？还原后该事件将重新返回至【未处置】列表中等待现场派单。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsRestoreModalOpen(false);
                    onRestore?.(item.id);
                    showToast(`工单 [${item.id}] 已成功还原至未处置事件中心！`);
                    onBack();
                  }}
                  className="px-4 py-1.5 rounded bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  确认还原派单
                </button>
                <button
                  onClick={() => setIsRestoreModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remote Voice Broadcast Modal */}
      {isRemoteNotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] rounded-lg border border-cyan-500/40 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">音柱远程喊话喊告</h3>
              </div>
              <button onClick={() => setIsRemoteNotifyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-200">
              <div>
                <label className="text-slate-400 block mb-1">喊话音质选定：</label>
                <select className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs">
                  <option>标准男声 - 严肃告诫</option>
                  <option>标准女声 - 柔性劝导</option>
                  <option>实时麦克风喊话</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">语音文本广播内容：</label>
                <textarea
                  defaultValue={`【城管云视告诫】牌号 ${item.plateNumber || '目标'} 的车主您好，请注意交通规则！`}
                  className="w-full bg-[#090e1c] border border-slate-700 rounded p-2 text-slate-200 text-xs h-20 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsRemoteNotifyModalOpen(false);
                    showToast('已下发远程广播通知！');
                  }}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                >
                  广播喊话
                </button>
                <button
                  onClick={() => setIsRemoteNotifyModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-[#090e1c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
