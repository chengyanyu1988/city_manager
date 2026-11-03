import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  User,
  Phone,
  Store,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
  Building,
  Radio,
  Clock
} from 'lucide-react';
import { EnterpriseSubject } from './SubjectManagementPage';
import { EnterpriseRestorePage } from './EnterpriseRestorePage';

interface EnterpriseSubjectDetailPageProps {
  subject: EnterpriseSubject;
  onBack: () => void;
  onCancel?: (subject: EnterpriseSubject) => void;
  onRestore?: (subject: EnterpriseSubject) => void;
}

export interface RelatedAlertEvent {
  id: string;
  type: string;
  deviceName: string;
  startTime: string;
  status: '已处置' | '未处置' | '待复核';
}

export const EnterpriseSubjectDetailPage: React.FC<EnterpriseSubjectDetailPageProps> = ({
  subject,
  onBack,
  onCancel,
  onRestore,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeEventDetail, setActiveEventDetail] = useState<RelatedAlertEvent | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Mock related alert events matching screenshot with recent 2026 timestamps
  const relatedEvents: RelatedAlertEvent[] = [
    {
      id: '2026101900003',
      type: '机动车乱停放',
      deviceName: 'C204',
      startTime: '2026-10-19 15:19:35',
      status: '已处置',
    },
    {
      id: '2026101800004',
      type: '机动车乱停放',
      deviceName: 'C204',
      startTime: '2026-10-18 15:19:35',
      status: '已处置',
    },
    {
      id: '2026101700005',
      type: '机动车乱停放',
      deviceName: 'C204',
      startTime: '2026-10-17 15:19:35',
      status: '已处置',
    },
    {
      id: '2026101600006',
      type: '沿街晾晒占道',
      deviceName: 'C201',
      startTime: '2026-10-16 11:20:10',
      status: '已处置',
    },
    {
      id: '2026101500007',
      type: '店外违规经营',
      deviceName: 'C202',
      startTime: '2026-10-15 09:40:22',
      status: '已处置',
    },
    {
      id: '2026101400008',
      type: '垃圾乱堆占道',
      deviceName: 'C205',
      startTime: '2026-10-14 14:10:05',
      status: '已处置',
    },
  ];

  if (isRestoring) {
    return (
      <EnterpriseRestorePage
        subject={subject}
        onBack={() => setIsRestoring(false)}
        onConfirmRestore={(restoredSubject) => {
          if (onRestore) {
            onRestore(restoredSubject);
          }
          setIsRestoring(false);
        }}
      />
    );
  }

  return (
    <div className="flex-1 w-full bg-[#060911] text-slate-100 flex flex-col overflow-y-auto select-text relative">
      {/* 1. TOP BREADCRUMB HEADER */}
      <div className="bg-[#0b1324] border-b border-cyan-500/20 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded bg-[#131f37] hover:bg-cyan-950 text-slate-200 hover:text-white text-xs font-semibold border border-cyan-500/30 transition flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>返回</span>
          </button>

          <span className="text-slate-600">|</span>

          <span className="text-sm font-bold text-white tracking-wide">
            企业主体
          </span>

          <span className="text-slate-600">/</span>

          <span className="text-xs text-cyan-400 font-medium">
            {subject.name} 档案详情
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">登记状态:</span>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
              subject.status !== '已注销'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
            }`}
          >
            {subject.status}
          </span>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN CONTENT AREA */}
      <div className="p-5 flex-1 space-y-6 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT PANEL: Enterprise Details Table & Media Photos (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
              {/* Structured Info Table Matching Screenshot */}
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {/* Row 1: 名称 | 统一社会信用代码 | 所属街道 */}
                  <tr>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold w-1/6">
                      名称
                    </td>
                    <td className="bg-[#0d1629] text-white border border-cyan-500/20 p-3 text-center font-bold text-sm w-2/6">
                      {subject.name}
                    </td>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold w-1/6">
                      统一社会信用代码
                    </td>
                    <td className="bg-[#0d1629] text-cyan-300 font-mono border border-cyan-500/20 p-3 text-center font-medium w-2/6" colSpan={3}>
                      {subject.creditCode}
                    </td>
                  </tr>

                  {/* Row 2: 所属街道 | 经营范围 | 详细地址 */}
                  <tr>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      所属街道
                    </td>
                    <td className="bg-[#0d1629] text-slate-200 border border-cyan-500/20 p-3 text-center font-medium">
                      {subject.street || '金龙片区'}
                    </td>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      经营范围
                    </td>
                    <td className="bg-[#0d1629] text-slate-200 border border-cyan-500/20 p-3 text-center font-medium" colSpan={3}>
                      {subject.category || '中餐'}
                    </td>
                  </tr>

                  {/* Row 3: 详细地址 Full Row */}
                  <tr>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      详细地址
                    </td>
                    <td className="bg-[#0d1629] text-slate-200 border border-cyan-500/20 p-3 text-left pl-4 font-medium" colSpan={5}>
                      {subject.address}
                    </td>
                  </tr>

                  {/* Row 4: 负责人 | 联系电话 | 经营状态 */}
                  <tr>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      负责人
                    </td>
                    <td className="bg-[#0d1629] text-white border border-cyan-500/20 p-3 text-center font-semibold">
                      {subject.manager || '张三'}
                    </td>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      联系电话
                    </td>
                    <td className="bg-[#0d1629] text-slate-200 font-mono border border-cyan-500/20 p-3 text-center font-medium">
                      {subject.phone || '13800138000'}
                    </td>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-semibold">
                      经营状态
                    </td>
                    <td className="bg-[#0d1629] border border-cyan-500/20 p-3 text-center font-medium">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-emerald-400 font-bold">
                          {subject.status === '已注销' ? '已注销' : '营业中'}
                        </span>
                        {subject.status !== '已注销' && onCancel ? (
                          <button
                            onClick={() => onCancel(subject)}
                            className="text-rose-400 hover:text-rose-300 underline font-semibold text-xs transition"
                          >
                            注销
                          </button>
                        ) : subject.status === '已注销' ? (
                          <button
                            onClick={() => setIsRestoring(true)}
                            className="text-emerald-400 hover:text-emerald-300 underline font-semibold text-xs transition flex items-center gap-1"
                          >
                            <span>恢复</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 Headers: 主体照片 | 地图预览 */}
                  <tr>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-bold text-xs" colSpan={3}>
                      主体照片
                    </td>
                    <td className="bg-[#09101f] text-slate-300 border border-cyan-500/20 p-3 text-center font-bold text-xs" colSpan={3}>
                      地图预览
                    </td>
                  </tr>

                  {/* Row 6 Content: Photo Preview & Map Preview */}
                  <tr>
                    <td className="bg-[#0d1629] border border-cyan-500/20 p-4 text-center" colSpan={3}>
                      <div
                        onClick={() => setSelectedPhoto(subject.imageUrl)}
                        className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group cursor-pointer h-56 flex items-center justify-center"
                      >
                        <img
                          src={subject.imageUrl}
                          alt={subject.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Eye className="w-8 h-8 text-cyan-300" />
                        </div>
                      </div>
                    </td>

                    <td className="bg-[#0d1629] border border-cyan-500/20 p-4 text-center" colSpan={3}>
                      {/* Map Location Digital Twin Vector Preview matching Screenshot */}
                      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-[#09101e] h-56 flex flex-col justify-between p-3">
                        {/* Map Grid Graphic Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
                        
                        {/* Simulated Map Visual Vector Tiles */}
                        <div className="relative z-10 flex items-center justify-between bg-[#0e172a]/90 px-3 py-1.5 rounded border border-cyan-500/30 text-[11px]">
                          <span className="text-cyan-300 font-mono flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            GPS: 108.366, 22.817
                          </span>
                          <span className="text-slate-400">南宁良庆片区网格</span>
                        </div>

                        {/* Store Location Map Pin Marker */}
                        <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-1">
                          <div className="relative flex items-center justify-center">
                            <span className="absolute w-12 h-12 rounded-full bg-cyan-500/20 animate-ping" />
                            <div className="w-9 h-9 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                              <MapPin className="w-5 h-5 text-cyan-300" />
                            </div>
                          </div>
                          <div className="px-2.5 py-1 rounded bg-[#0b1324] border border-cyan-400 text-cyan-200 text-[11px] font-bold shadow-md">
                            {subject.name}
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 bg-[#080e1a]/80 px-2 py-1 rounded border border-slate-800">
                          <span>云星钱隆首府12栋212</span>
                          <span className="text-emerald-400">电子地图已准确定位</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT PANEL: Related Alert Events Table (col-span-5) Matching Screenshot */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#09101f] border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white tracking-wide">关联预警事件记录</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
                  共 {relatedEvents.length} 条记录
                </span>
              </div>

              {/* Table Matching User Screenshot Columns */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#09101f] text-slate-300 border-b border-cyan-500/20">
                    <tr>
                      <th className="p-2.5 text-center">事件编号</th>
                      <th className="p-2.5 text-center">预警类型</th>
                      <th className="p-2.5 text-center">设备名称</th>
                      <th className="p-2.5 text-center">开始预警时间</th>
                      <th className="p-2.5 text-center">处置状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {relatedEvents.map((ev) => (
                      <tr
                        key={ev.id}
                        onClick={() => setActiveEventDetail(ev)}
                        className="hover:bg-cyan-950/40 transition cursor-pointer"
                      >
                        <td className="p-2.5 text-center font-mono text-cyan-400 hover:text-cyan-300 underline">
                          {ev.id}
                        </td>
                        <td className="p-2.5 text-center">{ev.type}</td>
                        <td className="p-2.5 text-center font-mono text-slate-300">{ev.deviceName}</td>
                        <td className="p-2.5 text-center font-mono text-slate-400 text-[11px]">
                          {ev.startTime}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-medium">
                            {ev.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO ENLARGE MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#0d1629] p-2 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedPhoto} alt="主体照片放大" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* EVENT QUICK DETAIL MODAL */}
      {activeEventDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-cyan-500/40 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">预警事件详情 #{activeEventDetail.id}</h3>
              </div>
              <button
                onClick={() => setActiveEventDetail(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-[#09101f] p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">事件编号:</span>
                <span className="text-cyan-300 font-mono font-bold">{activeEventDetail.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">预警类型:</span>
                <span className="text-white font-semibold">{activeEventDetail.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">捕获设备:</span>
                <span className="text-slate-200 font-mono">{activeEventDetail.deviceName} (高清枪机)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">开始预警时间:</span>
                <span className="text-slate-300 font-mono">{activeEventDetail.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">处置状态:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                  {activeEventDetail.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEventDetail(null)}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
