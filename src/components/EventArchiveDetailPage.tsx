import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  MapPin,
  Camera,
  User,
  Clock,
  CheckCircle2,
  FileText,
  Volume2,
  Video,
  Image as ImageIcon,
  Upload,
  Play,
  X,
  Eye,
  Download,
  Share2,
  ShieldCheck,
  Building2,
  Check,
  Plus
} from 'lucide-react';
import { ArchiveItem } from './EventArchivePage';

interface EventArchiveDetailPageProps {
  item: ArchiveItem;
  onBack: () => void;
}

export const EventArchiveDetailPage: React.FC<EventArchiveDetailPageProps> = ({ item, onBack }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio' | 'doc'>('image');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stateful attachments lists
  const [images, setImages] = useState([
    { id: 1, name: '2026101803112.jpg', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: '2026101803113.jpg', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: '2026101803114.jpg', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80' },
  ]);

  const [videos, setVideos] = useState([
    { id: 1, name: '2026101803112.mp4', duration: '00:15', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: '2026101803113.mp4', duration: '00:22', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: '2026101803114.mp4', duration: '00:18', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80' },
  ]);

  const [audios, setAudios] = useState([
    { id: 1, name: '2026101803112.mp3', duration: '00:45', size: '1.2 MB' },
    { id: 2, name: '2026101803113.mp3', duration: '01:12', size: '2.4 MB' },
    { id: 3, name: '2026101803114.mp3', duration: '00:38', size: '0.9 MB' },
  ]);

  const [docs, setDocs] = useState([
    { id: 1, name: '2026101803112.pdf', type: 'PDF', size: '3.4 MB' },
    { id: 2, name: '2026101803113.pdf', type: 'PDF', size: '2.1 MB' },
    { id: 3, name: '2026101803114.pdf', type: 'PDF', size: '1.8 MB' },
  ]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let uploadedCount = 0;
    let lastTab: 'image' | 'video' | 'audio' | 'doc' = 'image';

    Array.from(files).forEach((file) => {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const fileUrl = URL.createObjectURL(file);
      const newId = Date.now() + Math.floor(Math.random() * 1000);

      if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExt)) {
        setImages(prev => [
          { id: newId, name: file.name, url: fileUrl },
          ...prev
        ]);
        lastTab = 'image';
      } else if (file.type.startsWith('video/') || ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(fileExt)) {
        setVideos(prev => [
          { id: newId, name: file.name, duration: '00:30', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
          ...prev
        ]);
        lastTab = 'video';
      } else if (file.type.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(fileExt)) {
        setAudios(prev => [
          { id: newId, name: file.name, duration: '01:00', size: `${(file.size / 1024 / 1024).toFixed(1)} MB` },
          ...prev
        ]);
        lastTab = 'audio';
      } else {
        setDocs(prev => [
          { id: newId, name: file.name, type: fileExt.toUpperCase() || 'DOC', size: `${(file.size / 1024 / 1024).toFixed(1)} MB` },
          ...prev
        ]);
        lastTab = 'doc';
      }
      uploadedCount++;
    });

    setActiveTab(lastTab);
    showToast(`已成功上传 ${uploadedCount} 个附件，已自动添加到卷宗【${lastTab === 'image' ? '图片' : lastTab === 'video' ? '视频' : lastTab === 'audio' ? '语音' : '文档'}】列表中！`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#060911] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-cyan-600/90 text-white px-4 py-2 rounded-lg shadow-xl border border-cyan-300/40 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header / Breadcrumb Bar (Matching screenshot: ← 返回 | 已存档) */}
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
          <span className="text-xs font-bold text-slate-200 tracking-wide">已存档</span>
          <span className="text-xs text-cyan-400/80 font-mono pl-2">[{item.id}]</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`已生成档案 ${item.id} 的全套电子卷宗 PDF 导出包`)}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出归档卷宗</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body (Left Timeline Cards + Right Attachments Panel) */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        
        {/* LEFT COLUMN: Timeline Node Cards (70% - 75% width, scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          
          {/* Vertical Timeline Wrapper */}
          <div className="relative pl-10 space-y-4">
            
            {/* Timeline Vertical Bar */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500/60 via-blue-500/40 to-slate-700/30 pointer-events-none" />

            {/* NODE 1: AI自动报警信息 */}
            <div className="relative">
              {/* Step Circle Badge */}
              <div className="absolute -left-[40px] top-3 w-7 h-7 rounded-full bg-[#0d1629] border-2 border-cyan-400 text-cyan-300 font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20 z-10">
                1
              </div>

              {/* Card Container */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                  <h3 className="text-sm font-bold text-cyan-400">AI自动报警信息</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Info Text Grid */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-sans">
                    <div>
                      <span className="text-slate-400">预警摄像头：</span>
                      <span className="text-slate-200 font-medium">{item.cameraName || 'C204摄像头'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">持续时间：</span>
                      <span className="text-slate-200 font-medium font-mono">5秒</span>
                    </div>
                    <div>
                      <span className="text-slate-400">违规类型：</span>
                      <span className="text-cyan-300 font-bold">{item.type || '机动车乱停放'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">目标经度：</span>
                      <span className="text-slate-200 font-mono">108.376026</span>
                    </div>
                    <div>
                      <span className="text-slate-400">开始预警时间：</span>
                      <span className="text-slate-200 font-mono">2026-10-18 15:19:35</span>
                    </div>
                    <div>
                      <span className="text-slate-400">目标纬度：</span>
                      <span className="text-slate-200 font-mono">22.770844</span>
                    </div>
                    <div>
                      <span className="text-slate-400">最新预警时间：</span>
                      <span className="text-slate-200 font-mono">2026-10-18 15:19:40</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">位置信息：</span>
                      <span className="text-slate-200">{item.location || '广西壮族自治区南宁市良庆区金龙路8号云星钱隆首府13栋'}</span>
                    </div>
                  </div>

                  {/* Right GIS Map Graphic Preview */}
                  <div className="relative rounded overflow-hidden border border-cyan-500/30 bg-[#090e1c] h-36 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"
                      alt="GIS Map Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[1px]" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>良庆区电子地图</span>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                      GPS: 108.376, 22.770
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NODE 2: 预警核实信息 */}
            <div className="relative">
              {/* Step Circle Badge */}
              <div className="absolute -left-[40px] top-3 w-7 h-7 rounded-full bg-[#0d1629] border-2 border-cyan-400 text-cyan-300 font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20 z-10">
                2
              </div>

              {/* Card Container */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                  <h3 className="text-sm font-bold text-cyan-400">预警核实信息</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Info Text */}
                  <div className="md:col-span-2 space-y-2 text-xs font-sans">
                    <div>
                      <span className="text-slate-400">核实人：</span>
                      <span className="text-slate-200 font-medium">王明</span>
                    </div>
                    <div>
                      <span className="text-slate-400">核实时间：</span>
                      <span className="text-slate-200 font-mono">2026-10-18 14:38:21</span>
                    </div>
                    <div>
                      <span className="text-slate-400">核实用时：</span>
                      <span className="text-emerald-400 font-mono font-bold">20秒</span>
                    </div>
                    <div>
                      <span className="text-slate-400">备注：</span>
                      <span className="text-slate-200">此事件已严重影响到市容市貌，已确认并下发处置指令。</span>
                    </div>
                  </div>

                  {/* Camera Snapshot with Detection Box Overlay */}
                  <div className="relative rounded overflow-hidden border border-cyan-500/30 bg-[#090e1c] h-36">
                    <img
                      src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80"
                      alt="Camera Detection Box"
                      className="w-full h-full object-cover"
                    />
                    {/* Bounding Box Simulation */}
                    <div className="absolute top-1/4 left-1/3 w-28 h-16 border-2 border-rose-500 bg-rose-500/20 rounded-xs flex items-start justify-between p-1">
                      <span className="text-[9px] bg-rose-600 text-white px-1 py-0.2 rounded font-mono">机动车违停</span>
                    </div>
                    <div className="absolute bottom-1 left-2 text-[10px] text-white bg-black/70 px-1.5 py-0.5 rounded font-mono">
                      宜佳超市门口路口*
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NODE 3: 转发事件信息 */}
            <div className="relative">
              {/* Step Circle Badge */}
              <div className="absolute -left-[40px] top-3 w-7 h-7 rounded-full bg-[#0d1629] border-2 border-cyan-400 text-cyan-300 font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20 z-10">
                3
              </div>

              {/* Card Container */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                  <h3 className="text-sm font-bold text-cyan-400">转发事件信息</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400">转发人：</span>
                    <span className="text-slate-200 font-medium">张珊珊</span>
                  </div>
                  <div>
                    <span className="text-slate-400">转发时间：</span>
                    <span className="text-slate-200 font-mono">2026-10-18 15:19:35</span>
                  </div>
                  <div>
                    <span className="text-slate-400">转发平台：</span>
                    <span className="text-cyan-300 font-medium">{item.platform || '蓝麒麟指挥调度平台'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">用时：</span>
                    <span className="text-slate-200 font-mono">4分20秒</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">备注：</span>
                    <span className="text-slate-200">问题严重，请尽快处置离场。</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NODE 4: 处置事件信息 */}
            <div className="relative">
              {/* Step Circle Badge */}
              <div className="absolute -left-[40px] top-3 w-7 h-7 rounded-full bg-[#0d1629] border-2 border-cyan-400 text-cyan-300 font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20 z-10">
                4
              </div>

              {/* Card Container */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                  <h3 className="text-sm font-bold text-cyan-400">处置事件信息</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400">处置平台：</span>
                    <span className="text-slate-200 font-medium">{item.platform || '蓝麒麟指挥调度平台'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">处置人：</span>
                    <span className="text-slate-200 font-medium">{item.handler || '李亮'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">处置时间：</span>
                    <span className="text-slate-200 font-mono">2026-10-18 15:19:35</span>
                  </div>
                  <div>
                    <span className="text-slate-400">处置用时：</span>
                    <span className="text-slate-200 font-mono">40分20秒</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">备注：</span>
                    <span className="text-emerald-400 font-semibold">{item.result || '处置完毕，现场违规车辆已驶离，已恢复道路正常秩序。'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NODE 5: 复核事件信息 */}
            <div className="relative">
              {/* Step Circle Badge */}
              <div className="absolute -left-[40px] top-3 w-7 h-7 rounded-full bg-[#0d1629] border-2 border-cyan-400 text-cyan-300 font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/20 z-10">
                5
              </div>

              {/* Card Container */}
              <div className="bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
                  <h3 className="text-sm font-bold text-cyan-400">复核事件信息</h3>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400">复核人：</span>
                    <span className="text-slate-200 font-medium">王振</span>
                  </div>
                  <div>
                    <span className="text-slate-400">复核时间：</span>
                    <span className="text-slate-200 font-mono">2026-10-18 15:19:35</span>
                  </div>
                  <div>
                    <span className="text-slate-400">复核用时：</span>
                    <span className="text-emerald-400 font-mono">3分50秒</span>
                  </div>
                  <div>
                    <span className="text-slate-400">复核结论：</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>复核完毕 (通过)</span>
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">备注：</span>
                    <span className="text-slate-200">复核完毕，符合结案标准并正式归档。</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Media Attachments Sidebar (300px width - matching screenshot) */}
        <div className="w-80 shrink-0 bg-[#0d1629] rounded-md border border-cyan-500/20 shadow-lg flex flex-col overflow-hidden">
          
          {/* Tab Headers: 图片 | 视频 | 语音 | 文档 */}
          <div className="grid grid-cols-4 bg-[#090e1c] border-b border-cyan-500/20 text-xs">
            <button
              onClick={() => setActiveTab('image')}
              className={`py-2.5 font-bold transition flex items-center justify-center gap-1 border-b-2 ${
                activeTab === 'image'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>图片</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`py-2.5 font-bold transition flex items-center justify-center gap-1 border-b-2 ${
                activeTab === 'video'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>视频</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`py-2.5 font-bold transition flex items-center justify-center gap-1 border-b-2 ${
                activeTab === 'audio'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>语音</span>
            </button>

            <button
              onClick={() => setActiveTab('doc')}
              className={`py-2.5 font-bold transition flex items-center justify-center gap-1 border-b-2 ${
                activeTab === 'doc'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>文档</span>
            </button>
          </div>

          {/* Tab Content List Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            
            {/* TAB 1: 图片 (Images) */}
            {activeTab === 'image' && (
              <div className="space-y-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className="group bg-[#090e1c] rounded border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition cursor-pointer"
                  >
                    <div className="relative h-32 overflow-hidden bg-slate-900">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Red bounding box graphic simulation */}
                      <div className="absolute inset-x-8 inset-y-4 border-2 border-rose-500/90 rounded-xs bg-rose-500/10" />
                      <div className="absolute top-2 right-2 bg-black/70 p-1 rounded text-cyan-300 opacity-0 group-hover:opacity-100 transition">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="px-2.5 py-1.5 text-[11px] text-center font-mono text-slate-300 bg-[#0d1629] truncate" title={img.name}>
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: 视频 (Videos) */}
            {activeTab === 'video' && (
              <div className="space-y-3">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid.name)}
                    className="group bg-[#090e1c] rounded border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition cursor-pointer"
                  >
                    <div className="relative h-32 overflow-hidden bg-slate-900">
                      <img
                        src={vid.url}
                        alt={vid.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400 text-white flex items-center justify-center shadow-lg transition">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-2 bg-black/70 px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-300">
                        {vid.duration}
                      </div>
                    </div>
                    <div className="px-2.5 py-1.5 text-[11px] text-center font-mono text-slate-300 bg-[#0d1629] truncate" title={vid.name}>
                      {vid.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: 语音 (Audio) */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                {audios.map((aud) => (
                  <div
                    key={aud.id}
                    className="bg-[#090e1c] rounded border border-slate-800 p-3 hover:border-cyan-500/50 transition flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <div className="w-full h-24 bg-[#131f38] rounded flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mb-1">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                        MP3 AUDIO
                      </span>
                      <button
                        onClick={() => {
                          setIsPlayingAudio(isPlayingAudio === aud.id ? null : aud.id);
                          showToast(isPlayingAudio === aud.id ? '暂停播放录音' : `正在播放执法取证录音 ${aud.name}`);
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-xs text-white font-bold cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{isPlayingAudio === aud.id ? '暂停' : '试听录音'}</span>
                      </button>
                    </div>
                    <div className="w-full text-center">
                      <p className="text-[11px] font-mono text-slate-200 truncate" title={aud.name}>{aud.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{aud.duration} · {aud.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: 文档 (Docs) */}
            {activeTab === 'doc' && (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-[#090e1c] rounded border border-slate-800 p-3 hover:border-cyan-500/50 transition flex flex-col items-center justify-center text-center space-y-2"
                  >
                    <div className="w-full h-24 bg-[#131f38] rounded flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400/50 flex items-center justify-center text-rose-400 mb-1">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono">
                        {doc.type} DOCUMENT
                      </span>
                      <button
                        onClick={() => showToast(`已下载证据卷宗附件 ${doc.name}`)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-xs text-white font-bold cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>下载卷宗</span>
                      </button>
                    </div>
                    <div className="w-full text-center">
                      <p className="text-[11px] font-mono text-slate-200 truncate" title={doc.name}>{doc.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{doc.type} · {doc.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Hidden File Input for Real Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            multiple
          />

          {/* Bottom Upload Attachment Button (Matching screenshot: 附件上传) */}
          <div className="p-3 bg-[#090e1c] border-t border-cyan-500/20 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-4 rounded bg-[#1890ff] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>附件上传</span>
            </button>
          </div>

        </div>

      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-[#0d1629] border border-cyan-500/40 rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 py-2 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">取证照片大图查看</span>
              <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex-1 overflow-auto flex items-center justify-center">
              <img src={selectedImage} alt="Large preview" className="max-h-[75vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0d1629] border border-cyan-500/40 rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 py-2.5 bg-[#090e1c] border-b border-cyan-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 font-mono">视频录像调阅 · {selectedVideo}</span>
              <button onClick={() => setSelectedVideo(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex flex-col items-center justify-center bg-black/80 space-y-3">
              <div className="w-full h-64 bg-slate-900 rounded border border-slate-700 flex items-center justify-center relative">
                <Play className="w-12 h-12 text-cyan-400 fill-cyan-400/20 animate-pulse" />
                <span className="absolute bottom-3 left-3 text-xs text-cyan-300 font-mono bg-black/70 px-2 py-0.5 rounded">
                  [LIVE/REPLAY 1080P @ 30FPS]
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">2026-10-18 违停监控自动抓拍高清视频剪辑</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
