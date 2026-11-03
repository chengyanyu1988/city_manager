import { CameraDevice, PatrolVehicle, GovernanceAlert, EventTypeRankingItem, HourlyStatItem, StreetStatItem } from '../types';

export const AI_CAMERAS: CameraDevice[] = [
  {
    id: 'CAM-NN-001',
    name: '清厢快速路与北湖南路交叉口',
    code: 'IPC-GX-NN-0421',
    x: 35.8,
    y: 36.2,
    status: 'alert',
    type: 'AI高清枪机',
    street: '北湖街道',
    road: '北湖南路',
    directionDeg: 45,
    resolution: '3840×2160 (4K)',
    fps: 30,
    onlineDuration: '142天 08小时',
    detections: [
      {
        label: '机动车乱停放 (占用非机动车道)',
        confidence: 0.984,
        box: [28, 32, 38, 42],
        time: '刚刚 (2分钟前)'
      }
    ]
  },
  {
    id: 'CAM-NN-002',
    name: '虎邱南路南侧立杆',
    code: 'IPC-GX-NN-0428',
    x: 41.2,
    y: 29.5,
    status: 'normal',
    type: '智能球机',
    street: '衡阳街道',
    road: '虎邱路',
    directionDeg: 120,
    resolution: '2560×1440 (2K)',
    fps: 25,
    onlineDuration: '89天 14小时',
    detections: []
  },
  {
    id: 'CAM-NN-003',
    name: '云星广东商城西门入口',
    code: 'IPC-GX-NN-0512',
    x: 36.5,
    y: 22.8,
    status: 'alert',
    type: '全景云台',
    street: '北湖街道',
    road: '北湖北路',
    directionDeg: 80,
    resolution: '3840×2160 (4K)',
    fps: 30,
    onlineDuration: '210天 19小时',
    detections: [
      {
        label: '沿街商户出店违规经营',
        confidence: 0.962,
        box: [45, 18, 30, 35],
        time: '5分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-004',
    name: '望州路与邕武路交汇处',
    code: 'IPC-GX-NN-0619',
    x: 45.3,
    y: 22.1,
    status: 'normal',
    type: 'AI高清枪机',
    street: '兴宁街道',
    road: '邕武路',
    directionDeg: 15,
    resolution: '1920×1080',
    fps: 25,
    onlineDuration: '65天 02小时',
    detections: []
  },
  {
    id: 'CAM-NN-005',
    name: '万里国际汽配城北侧',
    code: 'IPC-GX-NN-0701',
    x: 43.1,
    y: 41.6,
    status: 'alert',
    type: '智能球机',
    street: '衡阳街道',
    road: '万里路',
    directionDeg: 210,
    resolution: '2560×1440',
    fps: 25,
    onlineDuration: '33天 11小时',
    detections: [
      {
        label: '重型渣土车未密闭遮盖',
        confidence: 0.941,
        box: [20, 40, 44, 45],
        time: '8分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-006',
    name: '长堽路东侧三岔口',
    code: 'IPC-GX-NN-0803',
    x: 53.8,
    y: 33.4,
    status: 'normal',
    type: 'AI高清枪机',
    street: '长堽街道',
    road: '长堽路',
    directionDeg: 135,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '180天 04小时',
    detections: []
  },
  {
    id: 'CAM-NN-007',
    name: '南宁市人民公园北门',
    code: 'IPC-GX-NN-0912',
    x: 44.5,
    y: 58.6,
    status: 'alert',
    type: '全景云台',
    street: '华强街道',
    road: '公园北路',
    directionDeg: 90,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '312天 16小时',
    detections: [
      {
        label: '非机动车堆放堵塞通道',
        confidence: 0.955,
        box: [35, 25, 40, 50],
        time: '12分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-008',
    name: '民族广场地铁站出口',
    code: 'IPC-GX-NN-1044',
    x: 48.6,
    y: 87.2,
    status: 'normal',
    type: 'AI高清枪机',
    street: '新阳街道',
    road: '民族大道',
    directionDeg: 30,
    resolution: '2560×1440',
    fps: 30,
    onlineDuration: '99天 01小时',
    detections: []
  },
  {
    id: 'CAM-NN-009',
    name: '南城百货东侧主道',
    code: 'IPC-GX-NN-1102',
    x: 47.2,
    y: 48.4,
    status: 'normal',
    type: 'AI高清枪机',
    street: '衡阳街道',
    road: '衡阳东路',
    directionDeg: 75,
    resolution: '1920×1080',
    fps: 25,
    onlineDuration: '154天 06小时',
    detections: []
  },
  {
    id: 'CAM-NN-010',
    name: '金花茶公园西侧路段',
    code: 'IPC-GX-NN-1230',
    x: 55.4,
    y: 78.5,
    status: 'normal',
    type: '智能球机',
    street: '安吉街道',
    road: '茶花南路',
    directionDeg: 190,
    resolution: '2560×1440',
    fps: 25,
    onlineDuration: '72天 18小时',
    detections: []
  },
  {
    id: 'CAM-NN-011',
    name: '官塘商业街中段',
    code: 'IPC-GX-NN-1311',
    x: 45.6,
    y: 67.2,
    status: 'alert',
    type: '智能球机',
    street: '华强街道',
    road: '官塘路',
    directionDeg: 160,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '44天 22小时',
    detections: [
      {
        label: '违规悬挂高空横幅广告',
        confidence: 0.973,
        box: [15, 20, 50, 25],
        time: '15分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-012',
    name: '朝阳印象城旁路口',
    code: 'IPC-GX-NN-1405',
    x: 33.6,
    y: 89.4,
    status: 'alert',
    type: 'AI高清枪机',
    street: '新阳街道',
    road: '朝阳路',
    directionDeg: 60,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '128天 07小时',
    detections: [
      {
        label: '机动车逆向违规停靠',
        confidence: 0.989,
        box: [30, 35, 35, 40],
        time: '4分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-013',
    name: '清厢快速路中段跨线桥',
    code: 'IPC-GX-NN-1502',
    x: 56.2,
    y: 61.8,
    status: 'normal',
    type: 'AI高清枪机',
    street: '衡阳街道',
    road: '清厢快速路',
    directionDeg: 300,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '240天 12小时',
    detections: []
  },
  {
    id: 'CAM-NN-014',
    name: '长堽路立交桥下辅道',
    code: 'IPC-GX-NN-1620',
    x: 61.5,
    y: 42.0,
    status: 'normal',
    type: '智能球机',
    street: '长堽街道',
    road: '长堽辅道',
    directionDeg: 110,
    resolution: '1920×1080',
    fps: 25,
    onlineDuration: '91天 05小时',
    detections: []
  },
  {
    id: 'CAM-NN-015',
    name: '东葛路与长湖路交汇口',
    code: 'IPC-GX-NN-1708',
    x: 64.8,
    y: 57.6,
    status: 'alert',
    type: 'AI高清枪机',
    street: '上尧街道',
    road: '东葛路',
    directionDeg: 45,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '62天 20小时',
    detections: [
      {
        label: '路面施工作业物料无遮挡堆放',
        confidence: 0.938,
        box: [40, 22, 36, 48],
        time: '18分钟前'
      }
    ]
  },
  {
    id: 'CAM-NN-016',
    name: '金湖广场南侧环岛',
    code: 'IPC-GX-NN-1815',
    x: 69.2,
    y: 88.5,
    status: 'normal',
    type: '全景云台',
    street: '上尧街道',
    road: '金湖路',
    directionDeg: 270,
    resolution: '3840×2160',
    fps: 30,
    onlineDuration: '365天 00小时',
    detections: []
  },
  {
    id: 'CAM-NN-017',
    name: '恒大新城东门主路',
    code: 'IPC-GX-NN-1901',
    x: 28.5,
    y: 20.4,
    status: 'normal',
    type: '智能球机',
    street: '安吉街道',
    road: '秀厢大道',
    directionDeg: 140,
    resolution: '2560×1440',
    fps: 25,
    onlineDuration: '105天 13小时',
    detections: []
  },
  {
    id: 'CAM-NN-018',
    name: '北湖商业广场人行通道',
    code: 'IPC-GX-NN-2009',
    x: 29.8,
    y: 42.1,
    status: 'normal',
    type: 'AI高清枪机',
    street: '北湖街道',
    road: '北湖路',
    directionDeg: 20,
    resolution: '1920×1080',
    fps: 25,
    onlineDuration: '150天 08小时',
    detections: []
  }
];

export const PATROL_VEHICLES: PatrolVehicle[] = [
  {
    id: 'VEH-01',
    plate: '桂A·883K9',
    name: '城管网格巡查01号车 (北湖网格)',
    driver: '黄建新 (巡检员)',
    phone: '138****7291',
    x: 34.2,
    y: 25.1,
    speed: 28,
    battery: 88,
    status: 'patrolling',
    street: '北湖街道',
    inspectionsToday: 42,
    anomaliesFound: 6
  },
  {
    id: 'VEH-02',
    plate: '桂A·561A2',
    name: '综合执法移动车载AI 03号车',
    driver: '韦志明 (执法长)',
    phone: '139****4021',
    x: 44.8,
    y: 35.8,
    speed: 35,
    battery: 74,
    status: 'patrolling',
    street: '衡阳街道',
    inspectionsToday: 58,
    anomaliesFound: 9
  },
  {
    id: 'VEH-03',
    plate: '桂A·319V8',
    name: '环境卫生移动监测05号车',
    driver: '陆俊华 (核查专员)',
    phone: '137****6110',
    x: 62.4,
    y: 93.2,
    speed: 20,
    battery: 92,
    status: 'handling',
    street: '上尧街道',
    inspectionsToday: 36,
    anomaliesFound: 4
  }
];

export const GOVERNANCE_ALERTS: GovernanceAlert[] = [
  {
    id: 'ALT-20261019-001',
    type: '机动车乱停放',
    level: '紧急',
    location: '北湖南路清厢快速路辅道交叉口',
    street: '北湖街道',
    time: '2026-10-19 14:42:15',
    status: '未处置',
    source: 'AI摄像头',
    deviceId: 'IPC-GX-NN-0421',
    confidence: 0.984,
    description: '机动车桂A·7E298违规停放于非机动车道，严重阻碍早晚高峰通行。',
    handler: '待指派网格员'
  },
  {
    id: 'ALT-20261019-002',
    type: '沿街出店经营' as any,
    level: '重要',
    location: '云星广东商城西门沿街店铺',
    street: '北湖街道',
    time: '2026-10-19 14:39:02',
    status: '未处置',
    source: 'AI摄像头',
    deviceId: 'IPC-GX-NN-0512',
    confidence: 0.962,
    description: '生鲜水果摊位跨出门槛经营，货架占用公共人行砖道宽达1.8米。',
    handler: '北湖第三网格工作组'
  },
  {
    id: 'ALT-20261019-003',
    type: '渣土车检测',
    level: '紧急',
    location: '万里国际汽配城北侧过境路段',
    street: '衡阳街道',
    time: '2026-10-19 14:36:44',
    status: '未处置',
    source: '车载AI巡检',
    deviceId: 'VEH-02 (车载AI 03)',
    confidence: 0.941,
    description: '绿色重型自卸货车未安装密闭装置，伴有路面扬尘带泥抛洒隐患。',
    handler: '交警与综合行政执法联勤组'
  },
  {
    id: 'ALT-20261019-004',
    type: '物料堆放',
    level: '一般',
    location: '东葛路与长湖路交汇口东南角',
    street: '上尧街道',
    time: '2026-10-19 14:30:18',
    status: '待复核',
    source: 'AI摄像头',
    deviceId: 'IPC-GX-NN-1708',
    confidence: 0.938,
    description: '道路管网改造遗留砖石砂浆沙袋堆积在绿化带边缘未清理。',
    handler: '市政路政工程保障大队'
  },
  {
    id: 'ALT-20261019-005',
    type: '违规户外广告',
    level: '重要',
    location: '官塘商业街中段32号二楼外立面',
    street: '华强街道',
    time: '2026-10-19 14:25:50',
    status: '待复核',
    source: 'AI摄像头',
    deviceId: 'IPC-GX-NN-1311',
    confidence: 0.973,
    description: '未经报批私自设立超宽发光字及悬挂高空条幅，存在防汛防风安全风险。',
    handler: '华强街道城建市容办公室'
  },
  {
    id: 'ALT-20261019-006',
    type: '机动车乱停放',
    level: '一般',
    location: '朝阳印象城南门消防通道口',
    street: '新阳街道',
    time: '2026-10-19 14:18:22',
    status: '已处置',
    source: '网格员上报',
    deviceId: 'GRID-NN-XY-08',
    confidence: 0.991,
    description: '白色轿车逆向停放压黄实线，巡检人员已劝离并下发违停温馨告知单。',
    handler: '网格员李明霞 (已结案)'
  }
];

export const EVENT_TYPE_RANKING: EventTypeRankingItem[] = [
  { rank: 1, name: '机动车乱停放', count: 78, percentage: 78 },
  { rank: 2, name: '违规户外广告', count: 65, percentage: 65 },
  { rank: 3, name: '出店经营', count: 40, percentage: 40 },
  { rank: 4, name: '物料堆放', count: 29, percentage: 29 },
  { rank: 5, name: '渣土车检测', count: 23, percentage: 23 }
];

export const HOURLY_STATS: HourlyStatItem[] = [
  { hour: '3:00', count: 12 },
  { hour: '6:00', count: 28 },
  { hour: '9:00', count: 124 },
  { hour: '12:00', count: 168 },
  { hour: '15:00', count: 155 },
  { hour: '18:00', count: 132 },
  { hour: '21:00', count: 75 },
  { hour: '00:00', count: 34 }
];

export const STREET_STATS: StreetStatItem[] = [
  { name: '新阳街道', count: 185, percentage: 92.5, color: '#3b82f6' },
  { name: '北湖街道', count: 92, percentage: 46.0, color: '#60a5fa' },
  { name: '衡阳街道', count: 168, percentage: 84.0, color: '#3b82f6' },
  { name: '安吉街道', count: 158, percentage: 79.0, color: '#60a5fa' },
  { name: '华强街道', count: 58, percentage: 29.0, color: '#93c5fd' },
  { name: '上尧街道', count: 132, percentage: 66.0, color: '#3b82f6' }
];

export const OVERVIEW_STATS = {
  unhandled: 67, // 未处置
  reviewing: 42, // 待复核
  archived: 15,  // 已存档
  total: 124
};

export const KPIS = {
  aiCameras: 235,
  mobileVehicles: 32,
  warningEvents: 235,
  violationEvents: 53,
  handledEvents: 22,
  activeAlertsCount: 35
};
