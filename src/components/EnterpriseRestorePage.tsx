import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  FileText,
  Upload,
  Calendar,
  User,
  Phone,
  Building,
  Store,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  X,
  FileCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { EnterpriseSubject } from './SubjectManagementPage';

interface EnterpriseRestorePageProps {
  subject: EnterpriseSubject;
  onBack: () => void;
  onConfirmRestore: (restoredSubject: EnterpriseSubject) => void;
}

export const EnterpriseRestorePage: React.FC<EnterpriseRestorePageProps> = ({
  subject,
  onBack,
  onConfirmRestore,
}) => {
  // Form State
  const [restoreType, setRestoreType] = useState<'normal' | 'correction' | 'rectified'>('normal');
  const [approvalNo, setApprovalNo] = useState(`GS-${Date.now().toString().slice(-8)}`);
  const [effectiveDate, setEffectiveDate] = useState('2026-10-20');
  const [applicant, setApplicant] = useState(subject.manager || '李亮');
  const [contactPhone, setContactPhone] = useState(subject.phone || '13800138000');
  const [notes, setNotes] = useState('该经营主体已重新办理营业资质，经网格执法人员现场实地核查，防爆消防及卫生条件均符合经营规范，准予恢复正常经营。');
  const [attachments, setAttachments] = useState<string[]>([
    '好味道烫菜坊_现场实地核验报告.pdf',
    '新版营业执照正本扫描件.jpg',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachments((prev) => [...prev, fileName]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 600);
  };

  const handleFinalConfirm = () => {
    const restoredItem: EnterpriseSubject = {
      ...subject,
      status: '正常经营',
      registeredDate: `2026-10-20 (恢复时间)`,
      deregisteredDate: undefined,
      cancelReason: undefined,
    };
    onConfirmRestore(restoredItem);
  };

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
            主体管理
          </span>

          <span className="text-slate-600">/</span>

          <span className="text-xs text-slate-400">
            已注销主体
          </span>

          <span className="text-slate-600">/</span>

          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            主体恢复申请与复核办理
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">当前流程:</span>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            复业核准中
          </span>
        </div>
      </div>

      {/* 2. MAIN FORM CONTAINER */}
      <div className="p-5 flex-1 max-w-5xl mx-auto w-full space-y-5">
        {/* BANNER: TARGET SUBJECT INFO SUMMARY */}
        <div className="bg-[#0d1629] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
              <img src={subject.imageUrl} alt={subject.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{subject.name}</h2>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-xs font-semibold">
                  当前状态: 已注销
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  信用代码: {subject.creditCode}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  地址: {subject.address}
                </span>
              </div>

              {subject.cancelReason && (
                <div className="text-xs text-rose-300/80 flex items-center gap-1 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  注销原因: {subject.cancelReason} ({subject.deregisteredDate || '2026-10-02'})
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#09101f] border border-slate-800 rounded-xl px-4 py-2.5 text-xs space-y-1">
            <div className="text-slate-400">原负责人: <span className="text-white font-semibold">{subject.manager}</span></div>
            <div className="text-slate-400">联系电话: <span className="text-cyan-300 font-mono">{subject.phone}</span></div>
          </div>
        </div>

        {/* RESTORATION APPLICATION FORM CARD */}
        <form onSubmit={handleSubmit} className="bg-[#0d1629] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-cyan-500/20 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">主体复业恢复申请核查表</h3>
            </div>
            <span className="text-xs text-slate-400">请核对以下复业更正及复查材料</span>
          </div>

          <div className="space-y-5 text-xs">
            {/* ROW 1: 恢复类型 */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">1. 恢复开业类型 *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setRestoreType('normal')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    restoreType === 'normal'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#09101f] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="restoreType"
                    checked={restoreType === 'normal'}
                    onChange={() => setRestoreType('normal')}
                    className="accent-emerald-500"
                  />
                  <div>
                    <div className="text-xs">正常经营复业恢复</div>
                    <div className="text-[10px] text-slate-400 font-normal">重新取得合法资质资质复工</div>
                  </div>
                </label>

                <label
                  onClick={() => setRestoreType('rectified')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    restoreType === 'rectified'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#09101f] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="restoreType"
                    checked={restoreType === 'rectified'}
                    onChange={() => setRestoreType('rectified')}
                    className="accent-emerald-500"
                  />
                  <div>
                    <div className="text-xs">合规整改完成申请恢复</div>
                    <div className="text-[10px] text-slate-400 font-normal">已消除违规隐患现场复查合格</div>
                  </div>
                </label>

                <label
                  onClick={() => setRestoreType('correction')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                    restoreType === 'correction'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#09101f] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="restoreType"
                    checked={restoreType === 'correction'}
                    onChange={() => setRestoreType('correction')}
                    className="accent-emerald-500"
                  />
                  <div>
                    <div className="text-xs">数据更正误注销撤销</div>
                    <div className="text-[10px] text-slate-400 font-normal">系统误标或撤销注销决定</div>
                  </div>
                </label>
              </div>
            </div>

            {/* ROW 2: 审批编号与生效日期 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">2. 准予复业文号 / 审核编号 *</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={approvalNo}
                    onChange={(e) => setApprovalNo(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">3. 复业生效日期 *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* ROW 3: 经办人员与联系电话 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">4. 申办负责人 / 经办人 *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">5. 经办联系电话 *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#09101f] border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* ROW 4: 复核意见说明 */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">6. 现场核查结论与审核意见 *</label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="请输入详细的核查说明及批准理由..."
                className="w-full bg-[#09101f] border border-cyan-500/30 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* ROW 5: 现场核查及执照材料附件 */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">7. 证明附件材料 (执照复印件/现场核验报告)</label>
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-4 py-2 rounded-lg bg-[#131f37] hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold cursor-pointer transition flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>选择上传证明附件文件</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <span className="text-[11px] text-slate-400">支持 PDF、JPG、PNG 格式，最大 10MB</span>
                </div>

                {/* Attachments List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[#09101f] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-cyan-200 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* APPROVAL STAMP BANNER */}
            <div className="bg-[#09101f] border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-white font-bold">审核部门: 南宁市良庆区综合治理及网格指挥中心</div>
                  <div className="text-slate-400 text-[11px]">经办人: 张执法员 (网格代码: WG-7082) · 审批流状态: 准予复工恢复</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold font-mono">
                符合规范
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              取消并返回
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{isSubmitting ? '提交审核中...' : '确认恢复开业并归档到企业主体'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SUCCESS MODAL DIALOG */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0d1629] border border-emerald-500/50 rounded-2xl w-full max-w-md p-6 space-y-5 text-center shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">主体开业恢复办理成功！</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                已成功将经营主体 <span className="text-cyan-300 font-bold">【{subject.name}】</span> 从已注销档案库恢复为 <span className="text-emerald-400 font-bold">【正常经营】</span> 状态。
              </p>
            </div>

            <div className="bg-[#09101f] border border-slate-800 rounded-xl p-3.5 text-xs space-y-1 text-left">
              <div className="text-slate-400">更正文号: <span className="text-cyan-300 font-mono">{approvalNo}</span></div>
              <div className="text-slate-400">生效日期: <span className="text-white font-mono">{effectiveDate}</span></div>
              <div className="text-slate-400">已自动同步至: <span className="text-emerald-400 font-semibold">企业主体名录库</span></div>
            </div>

            <button
              onClick={handleFinalConfirm}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition"
            >
              返回企业主体列表
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
