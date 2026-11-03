import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  UserX, 
  Store, 
  Truck, 
  Bike, 
  Car, 
  Tv, 
  Package, 
  Layers, 
  Wind, 
  Waves, 
  Hammer, 
  UserCheck, 
  Search, 
  RotateCcw, 
  Download, 
  List, 
  LayoutGrid, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  Calendar, 
  CheckCircle, 
  Eye, 
  Send, 
  X,
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  ShieldAlert,
  Volume2,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  FileSpreadsheet,
  Video
} from 'lucide-react';
import { AppTheme } from '../types';
import { AlertDetailPage } from './AlertDetailPage';

export interface AlertItem {
  id: string;
  type: string;
  category: string;
  cameraName: string;
  cameraCode: string;
  location: string;
  district: string;
  street: string;
  time: string;
  status: '未核实' | '已核实' | '处置中' | '已办结' | '已忽略';
  level: '特急' | '紧急' | '一般';
  confidence: number;
  plate?: string;
  entityName?: string;
  imageType: 
    | 'car_street' 
    | 'white_car' 
    | 'vendor' 
    | 'store_outside' 
    | 'bike_clutter' 
    | 'dump_truck' 
    | 'ad_violation' 
    | 'clutter_materials' 
    | 'construction_dust' 
    | 'water_log' 
    | 'fence_damage' 
    | 'staff_duty';
  dispatchOfficer?: string;
  contactPhone?: string;
  description: string;
}

interface RealtimeAlertsPageProps {
  onBackToHome: () => void;
  onNavigateToMapTarget?: (cameraCode: string) => void;
  onNavigateToSurveillance?: () => void;
  onNavigateToPatrol?: () => void;
  theme?: AppTheme;
}

// 20 Initial Real-time Alerts with Recent Date (2026-10-19) across diverse categories and districts
const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-NN-20261019-01',
    type: '机动车乱停放',
    category: '机动车乱停放',
    cameraName: '宜佳超市门口抓拍枪机',
    cameraCode: 'CAM-NN-001',
    location: '良庆区金龙路8号云星钱隆首府西侧主路',
    district: '良庆区',
    street: '蟠龙街道',
    time: '2026-10-19 10:48:22',
    status: '未核实',
    level: '紧急',
    confidence: 0.988,
    plate: '桂A·883K9',
    entityName: '黑色大众轿车',
    imageType: 'car_street',
    dispatchOfficer: '韦警官 (网格04)',
    contactPhone: '138-7711-2091',
    description: '机动车违规停放在主干道非机动车道与盲道交界处，造成早高峰交通拥堵阻断盲道。'
  },
  {
    id: 'ALT-NN-20261019-02',
    type: '占道经营',
    category: '占道经营',
    cameraName: '衡阳西路农贸市场西侧高清枪机',
    cameraCode: 'CAM-NN-002',
    location: '西乡塘区衡阳西路175号农贸市场北门人行道',
    district: '西乡塘区',
    street: '衡阳街道',
    time: '2026-10-19 10:45:19',
    status: '未核实',
    level: '紧急',
    confidence: 0.976,
    entityName: '时令水果临时地摊',
    imageType: 'vendor',
    dispatchOfficer: '黄队长 (网格02)',
    contactPhone: '139-7881-4432',
    description: '商贩使用三轮改装推车占用人行盲道售卖沃柑及甘蔗，严重阻碍行人及轮椅通行。'
  },
  {
    id: 'ALT-NN-20261019-03',
    type: '出店经营',
    category: '出店经营',
    cameraName: '鲁班路商业街1号AI巡视机',
    cameraCode: 'CAM-NN-003',
    location: '西乡塘区鲁班路商业步行街58号商铺门前',
    district: '西乡塘区',
    street: '新阳街道',
    time: '2026-10-19 10:41:05',
    status: '未核实',
    level: '一般',
    confidence: 0.982,
    entityName: '鲜果时光生鲜店',
    imageType: 'store_outside',
    dispatchOfficer: '陆队员 (网格01)',
    contactPhone: '137-0781-9921',
    description: '商户将货架、塑料周转筐及遮阳伞延伸占道经营超过门前三包责任红线2.4米。'
  },
  {
    id: 'ALT-NN-20261019-04',
    type: '无照经营游商',
    category: '无照经营游商',
    cameraName: '朝阳广场地铁C口北侧AI智能枪机',
    cameraCode: 'CAM-NN-004',
    location: '兴宁区朝阳路民生广场地铁C口疏散通道',
    district: '兴宁区',
    street: '朝阳街道',
    time: '2026-10-19 10:36:42',
    status: '已核实',
    level: '紧急',
    confidence: 0.991,
    entityName: '流动熟食风味小吃车',
    imageType: 'vendor',
    dispatchOfficer: '蒙警官 (网格06)',
    contactPhone: '136-1771-3388',
    description: '无证推车在地铁客流密集通道前摆摊烧烤油炸，产生浓烟且存在燃气罐安全隐患。'
  },
  {
    id: 'ALT-NN-20261019-05',
    type: '非机动车乱停放',
    category: '非机动车乱停放',
    cameraName: '西大南门人行道AI监控仪',
    cameraCode: 'CAM-NN-005',
    location: '西乡塘区大学东路100号广西大学南门东侧步道',
    district: '西乡塘区',
    street: '上尧街道',
    time: '2026-10-19 10:32:18',
    status: '未核实',
    level: '一般',
    confidence: 0.965,
    entityName: '美团/青桔共享单车堆叠',
    imageType: 'bike_clutter',
    dispatchOfficer: '周调度员 (网格03)',
    contactPhone: '135-9781-2210',
    description: '大量共享单车超量堆积倒伏于人行道与绿化带衔接段，阻断学生进出通道。'
  },
  {
    id: 'ALT-NN-20261019-06',
    type: '渣土车检测 (抛洒、未加盖等)',
    category: '渣土车检测 (抛洒、未加盖等)',
    cameraName: '巡检03号车载全景移动侦测仪',
    cameraCode: 'CAM-CAR-003',
    location: '良庆区平乐大道与玉洞大道交汇辅道',
    district: '良庆区',
    street: '蟠龙街道',
    time: '2026-10-19 10:28:55',
    status: '处置中',
    level: '特急',
    confidence: 0.994,
    plate: '桂A·D6912',
    entityName: '重型自卸工程车',
    imageType: 'dump_truck',
    dispatchOfficer: '陈执法长 (机动中队)',
    contactPhone: '189-7711-6655',
    description: '工程运输车顶盖未完全封闭密闭，行驶中沿路遗撒泥土碎石，造成扬尘路损污染。'
  },
  {
    id: 'ALT-NN-20261019-07',
    type: '乱堆物料',
    category: '乱堆物料',
    cameraName: '长湖路中段智慧路灯抓拍球机',
    cameraCode: 'CAM-NN-006',
    location: '青秀区长湖路52号维多利亚小区外围辅路',
    district: '青秀区',
    street: '新竹街道',
    time: '2026-10-19 10:24:30',
    status: '未核实',
    level: '一般',
    confidence: 0.978,
    entityName: '装修建筑废料与砂石袋',
    imageType: 'clutter_materials',
    dispatchOfficer: '刘巡检员 (网格05)',
    contactPhone: '133-7719-8802',
    description: '沿街商铺内部装修私自将废旧水泥袋、破损砖石倾倒堆积在公共停车线与绿化带。'
  },
  {
    id: 'ALT-NN-20261019-08',
    type: '违规户外广告',
    category: '违规户外广告',
    cameraName: '白沙大道跨线桥东向监控枪机',
    cameraCode: 'CAM-NN-007',
    location: '江南区白沙大道38号商业综合楼东侧立面',
    district: '江南区',
    street: '江南街道',
    time: '2026-10-19 10:19:14',
    status: '未核实',
    level: '一般',
    confidence: 0.985,
    entityName: '未经审批大型促销条幅',
    imageType: 'ad_violation',
    dispatchOfficer: '苏队员 (网格02)',
    contactPhone: '138-0781-6677',
    description: '沿街建筑高空私自悬挂长达15米的大型庆典促销布幔，存在大风坠落伤人隐患。'
  },
  {
    id: 'ALT-NN-20261019-09',
    type: '机动车乱停放',
    category: '机动车乱停放',
    cameraName: '金龙路西侧高位球机',
    cameraCode: 'CAM-NN-008',
    location: '良庆区金龙路西侧辅道消防通道口',
    district: '良庆区',
    street: '蟠龙街道',
    time: '2026-10-19 10:15:08',
    status: '未核实',
    level: '特急',
    confidence: 0.995,
    plate: '桂A·E1N29',
    entityName: '白色丰田SUV',
    imageType: 'white_car',
    dispatchOfficer: '韦警官 (网格04)',
    contactPhone: '138-7711-2091',
    description: '车辆紧贴消防救援通道黄格禁停区违规驻停，车内无人，已触发超时警报（超15分钟）。'
  },
  {
    id: 'ALT-NN-20261019-10',
    type: '工地扬尘',
    category: '工地扬尘',
    cameraName: '明秀东路建工工地出入口全景球机',
    cameraCode: 'CAM-NN-009',
    location: '西乡塘区明秀东路城市更新二期工程南大门',
    district: '西乡塘区',
    street: '北湖街道',
    time: '2026-10-19 10:09:44',
    status: '处置中',
    level: '紧急',
    confidence: 0.968,
    entityName: '中建八局明秀项目部',
    imageType: 'construction_dust',
    dispatchOfficer: '潘监督员 (环境监管组)',
    contactPhone: '139-7710-5511',
    description: '施工车辆出场未经车辆高压冲洗槽清洗直接上路，扬尘传感器PM10突增至215ug/m³。'
  },
  {
    id: 'ALT-NN-20261019-11',
    type: '道路积水',
    category: '道路积水',
    cameraName: '壮锦大道跨线桥下智能监控',
    cameraCode: 'CAM-NN-010',
    location: '江南区壮锦大道下穿铁路涵洞低洼路面',
    district: '江南区',
    street: '江西街道',
    time: '2026-10-19 10:03:26',
    status: '未核实',
    level: '紧急',
    confidence: 0.972,
    entityName: '市政下穿桥涵洞',
    imageType: 'water_log',
    dispatchOfficer: '梁工程师 (防汛排涝抢险队)',
    contactPhone: '135-0781-8890',
    description: '桥下积水深度视觉检测标尺显示积水深度已达18cm，接近小型轿车涉水警界线。'
  },
  {
    id: 'ALT-NN-20261019-12',
    type: '围挡施工规范',
    category: '围挡施工规范',
    cameraName: '双拥路智能巡检枪机',
    cameraCode: 'CAM-NN-011',
    location: '青秀区双拥路与青山路交汇市政管网抢修段',
    district: '青秀区',
    street: '双拥街道',
    time: '2026-10-19 09:55:12',
    status: '未核实',
    level: '一般',
    confidence: 0.981,
    entityName: '南宁中燃管网工程',
    imageType: 'fence_damage',
    dispatchOfficer: '莫网格员 (网格08)',
    contactPhone: '137-7712-4411',
    description: '施工围挡蓝色铁皮基座破损向盲道倾斜约25度，警示警示反光条脱落未设防撞桶。'
  },
  {
    id: 'ALT-NN-20261019-13',
    type: '执法人员工作规范 (着装、玩手机)',
    category: '执法人员工作规范 (着装、玩手机)',
    cameraName: '步行街中心全景高清球机',
    cameraCode: 'CAM-NN-012',
    location: '兴宁区民生路步行街中段移动执法执勤岗亭',
    district: '兴宁区',
    street: '朝阳街道',
    time: '2026-10-19 09:47:33',
    status: '已办结',
    level: '一般',
    confidence: 0.962,
    entityName: '第三执法网格巡查组',
    imageType: 'staff_duty',
    dispatchOfficer: '督查科张主任',
    contactPhone: '139-0771-1200',
    description: 'AI自动比对发现网格员执勤反光背心佩戴不规范，督查组已发出实时语音提醒并整改完毕。'
  },
  {
    id: 'ALT-NN-20261019-14',
    type: '机动车乱停放',
    category: '机动车乱停放',
    cameraName: '金湖广场南侧辅道违停抓拍云台',
    cameraCode: 'CAM-NN-013',
    location: '青秀区金湖路59号地王大厦北侧写字楼通道',
    district: '青秀区',
    street: '金湖街道',
    time: '2026-10-19 09:42:01',
    status: '已核实',
    level: '紧急',
    confidence: 0.992,
    plate: '桂A·319V8',
    entityName: '灰色奔驰商务车',
    imageType: 'car_street',
    dispatchOfficer: '刘巡检员 (网格05)',
    contactPhone: '133-7719-8802',
    description: '车辆违法停靠在人行过街斑马线上，且遮挡右转视线，已发送车主挪车告知短信。'
  },
  {
    id: 'ALT-NN-20261019-15',
    type: '出店经营',
    category: '出店经营',
    cameraName: '航洋城南广场AI高位球机',
    cameraCode: 'CAM-NN-014',
    location: '青秀区民族大道131号航洋国际沿街风情商铺',
    district: '青秀区',
    street: '凤岭街道',
    time: '2026-10-19 09:35:18',
    status: '处置中',
    level: '一般',
    confidence: 0.975,
    entityName: 'COCO奶茶与轻食沙拉吧',
    imageType: 'store_outside',
    dispatchOfficer: '王队长 (网格09)',
    contactPhone: '138-7718-9900',
    description: '店外擅自摆放户外休闲遮阳桌椅6套、立式广告水牌4块，已通知商户限时撤回。'
  },
  {
    id: 'ALT-NN-20261019-16',
    type: '占道经营',
    category: '占道经营',
    cameraName: '东葛路万达广场北侧枪机',
    cameraCode: 'CAM-NN-015',
    location: '青秀区东葛路延长线青秀万达金街2号口外沿',
    district: '青秀区',
    street: '东葛街道',
    time: '2026-10-19 09:28:44',
    status: '未核实',
    level: '紧急',
    confidence: 0.989,
    entityName: '手机贴膜与饰品移动摊点',
    imageType: 'vendor',
    dispatchOfficer: '赵队员 (网格07)',
    contactPhone: '136-0781-4321',
    description: '多名游商在商场人流主通道摆布折叠桌拉客贴膜，并聚集围观人群。'
  },
  {
    id: 'ALT-NN-20261019-17',
    type: '非机动车乱停放',
    category: '非机动车乱停放',
    cameraName: '五象航洋城东侧监控枪机',
    cameraCode: 'CAM-NN-016',
    location: '良庆区五象大道五象航洋城地铁站D口外人行道',
    district: '良庆区',
    street: '蟠龙街道',
    time: '2026-10-19 09:14:02',
    status: '处置中',
    level: '一般',
    confidence: 0.971,
    entityName: '哈啰/美团电单车',
    imageType: 'bike_clutter',
    dispatchOfficer: '韦警官 (网格04)',
    contactPhone: '138-7711-2091',
    description: '地铁早高峰外溢电单车占用盲道停放，已调度共享单车运维企业派车清运减量。'
  },
  {
    id: 'ALT-NN-20261019-18',
    type: '渣土车检测 (抛洒、未加盖等)',
    category: '渣土车检测 (抛洒、未加盖等)',
    cameraName: '巡检01号车载全景移动侦测仪',
    cameraCode: 'CAM-CAR-001',
    location: '江南区那洪大道与壮锦大道路口卡口',
    district: '江南区',
    street: '那洪街道',
    time: '2026-10-19 08:52:16',
    status: '已办结',
    level: '特急',
    confidence: 0.996,
    plate: '桂A·89115',
    entityName: '绿源渣土清运有限公司',
    imageType: 'dump_truck',
    dispatchOfficer: '陈执法长 (机动中队)',
    contactPhone: '189-7711-6655',
    description: '过境重型卡车右侧后轮泥块甩落污染路面，已被车载执法仪锁定并现场截停责令冲洗。'
  },
  {
    id: 'ALT-NN-20261019-19',
    type: '乱堆物料',
    category: '乱堆物料',
    cameraName: '昆仑大道卡口高清监控',
    cameraCode: 'CAM-NN-017',
    location: '兴宁区昆仑大道58号装饰建材大市场外侧辅道',
    district: '兴宁区',
    street: '三塘街道',
    time: '2026-10-19 08:35:50',
    status: '未核实',
    level: '一般',
    confidence: 0.983,
    entityName: '石材加工厂外堆放点',
    imageType: 'clutter_materials',
    dispatchOfficer: '林队员 (网格03)',
    contactPhone: '139-7718-2233',
    description: '大理石板材及木制托盘占道堆码至辅道慢车道，存在坍塌倾倒险情。'
  },
  {
    id: 'ALT-NN-20261019-20',
    type: '机动车乱停放',
    category: '机动车乱停放',
    cameraName: '北湖北路与清厢快速路匝道抓拍机',
    cameraCode: 'CAM-NN-018',
    location: '西乡塘区北湖北路大唐天城商圈西侧辅道',
    district: '西乡塘区',
    street: '北湖街道',
    time: '2026-10-19 08:20:11',
    status: '已核实',
    level: '紧急',
    confidence: 0.993,
    plate: '桂A·561A2',
    entityName: '银色日产小轿车',
    imageType: 'car_street',
    dispatchOfficer: '黄队长 (网格02)',
    contactPhone: '139-7881-4432',
    description: '车头逆向停放在快速路匝道入口处导流线内，属于严重妨碍行车安全违法行为。'
  }
];

export const RealtimeAlertsPage: React.FC<RealtimeAlertsPageProps> = ({ 
  onBackToHome,
  onNavigateToMapTarget,
  onNavigateToSurveillance,
  onNavigateToPatrol,
  theme = 'tactical-dark'
}) => {
  // Page Style: allows quick switch between Tactical Dark (大屏联动暗黑) and Gov Clean Light (政务浅色看板)
  const [pageStyle, setPageStyle] = useState<'dark' | 'light'>(theme === 'clean-light' ? 'light' : 'dark');

  // Category filter matching the 13 metrics
  const [selectedCategory, setSelectedCategory] = useState<string>('全部预警');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search Form State
  const [filterType, setFilterType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');
  const [dateRange, setDateRange] = useState('2026-10-19 ~ 2026-10-19');
  const [alertStatus, setAlertStatus] = useState('');

  // Selected Card Checkboxes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal detail
  const [activeModalItem, setActiveModalItem] = useState<AlertItem | null>(null);
  // Full detail page state (matching user screenshot)
  const [selectedDetailAlert, setSelectedDetailAlert] = useState<AlertItem | null>(null);

  // Audio broadcasting status simulation
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  // Dynamic alert list state
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 13 Category Definitions with Icons and dynamic computation
  const categoriesDef = [
    { label: '全部预警', icon: Bell, defaultCount: 238 },
    { label: '无照经营游商', icon: UserX, defaultCount: 12 },
    { label: '出店经营', icon: Store, defaultCount: 31 },
    { label: '占道经营', icon: Truck, defaultCount: 64 },
    { label: '非机动车乱停放', icon: Bike, defaultCount: 29 },
    { label: '机动车乱停放', icon: Car, defaultCount: 43 },
    { label: '违规户外广告', icon: Tv, defaultCount: 5 },
    { label: '乱堆物料', icon: Package, defaultCount: 26 },
    { label: '渣土车检测 (抛洒、未加盖等)', icon: Layers, defaultCount: 9 },
    { label: '工地扬尘', icon: Wind, defaultCount: 6 },
    { label: '道路积水', icon: Waves, defaultCount: 5 },
    { label: '围挡施工规范', icon: Hammer, defaultCount: 6 },
    { label: '执法人员工作规范 (着装、玩手机)', icon: UserCheck, defaultCount: 2 },
  ];

  // Dynamic computed category counts based on current alerts
  const categories = useMemo(() => {
    return categoriesDef.map((cat) => {
      if (cat.label === '全部预警') {
        return { ...cat, count: alerts.length > 20 ? alerts.length + 218 : cat.defaultCount };
      }
      const matchingCount = alerts.filter(
        (a) => a.category.includes(cat.label.replace(' (抛洒、未加盖等)', '').replace(' (着装、玩手机)', '')) ||
               cat.label.includes(a.category)
      ).length;
      return { 
        ...cat, 
        count: matchingCount > 0 ? cat.defaultCount + (matchingCount - 1) : cat.defaultCount 
      };
    });
  }, [alerts]);

  // Filtered Alerts List based on categories and form inputs
  const filteredAlerts = useMemo(() => {
    return alerts.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== '全部预警') {
        const cleanCat = selectedCategory.split(' ')[0];
        if (!item.category.includes(cleanCat) && !cleanCat.includes(item.category)) {
          return false;
        }
      }

      // 2. Filter Type
      if (filterType && item.type !== filterType) {
        return false;
      }

      // 3. Device Name / Keyword
      if (deviceName) {
        const query = deviceName.trim().toLowerCase();
        const matchesName = item.cameraName.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCode = item.cameraCode.toLowerCase().includes(query);
        const matchesPlate = item.plate ? item.plate.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesLoc && !matchesCode && !matchesPlate) {
          return false;
        }
      }

      // 4. Verification Status
      if (verifyStatus) {
        if (verifyStatus === '未核实' && item.status !== '未核实') return false;
        if (verifyStatus === '已核实' && item.status !== '已核实') return false;
        if (verifyStatus === '误报' && item.status !== '已忽略') return false;
      }

      // 5. Alert Status
      if (alertStatus) {
        if (alertStatus === '未处置' && item.status !== '未核实') return false;
        if (alertStatus === '处置中' && item.status !== '处置中') return false;
        if (alertStatus === '已办结' && item.status !== '已办结') return false;
      }

      return true;
    });
  }, [alerts, selectedCategory, filterType, deviceName, verifyStatus, alertStatus]);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAlerts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAlerts.map((a) => a.id)));
    }
  };

  const handleReset = () => {
    setFilterType('');
    setDeviceName('');
    setVerifyStatus('');
    setAlertStatus('');
    setSelectedCategory('全部预警');
    showToast('搜索条件已重置');
  };

  // Batch actions
  const handleBatchVerify = () => {
    if (selectedIds.size === 0) {
      showToast('请先勾选需要批量操作的预警项');
      return;
    }
    setAlerts((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: '已核实' } : a))
    );
    showToast(`已批量核实 ${selectedIds.size} 项预警`);
    setSelectedIds(new Set());
  };

  const handleBatchDispatch = () => {
    if (selectedIds.size === 0) {
      showToast('请先勾选需要批量派单的预警项');
      return;
    }
    setAlerts((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: '处置中' } : a))
    );
    showToast(`已成功向责任网格指派 ${selectedIds.size} 张处置工单`);
    setSelectedIds(new Set());
  };

  // Simulate new incoming alert
  const handleSimulateNewAlert = () => {
    const randomTypes: Array<{
      type: string;
      category: string;
      loc: string;
      imageType: AlertItem['imageType'];
      desc: string;
    }> = [
      {
        type: '占道经营',
        category: '占道经营',
        loc: '青秀区民族大道131号会展中心B口辅路',
        imageType: 'vendor',
        desc: '便携摊贩占用人行道出入口摆卖鲜花饰品'
      },
      {
        type: '机动车乱停放',
        category: '机动车乱停放',
        loc: '良庆区宋厢路万象汇北门落客区',
        imageType: 'white_car',
        desc: '黑色越野车在禁停标线内超时等待'
      },
      {
        type: '非机动车乱停放',
        category: '非机动车乱停放',
        loc: '西乡塘区明秀西路财院地铁站出口',
        imageType: 'bike_clutter',
        desc: '多辆共享电单车侧倒在盲道砖面'
      }
    ];

    const pick = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    const now = new Date();
    const timeStr = `2026-10-19 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newId = `ALT-NN-20261019-${String(alerts.length + 1).padStart(2, '0')}`;

    const newAlert: AlertItem = {
      id: newId,
      type: pick.type,
      category: pick.category,
      cameraName: '动态接入·AI移动巡视哨点',
      cameraCode: `CAM-NEW-${alerts.length + 1}`,
      location: pick.loc,
      district: '青秀区',
      street: '主干道巡控段',
      time: timeStr,
      status: '未核实',
      level: '紧急',
      confidence: 0.985,
      plate: pick.type.includes('机动车') ? '桂A·' + Math.floor(10000 + Math.random() * 90000) : undefined,
      entityName: '现场违规主体',
      imageType: pick.imageType,
      dispatchOfficer: '值班民警',
      contactPhone: '138-0000-8888',
      description: pick.desc
    };

    setAlerts([newAlert, ...alerts]);
    showToast(`⚡ 接收到最新预警：${pick.type} - ${pick.loc}`);
  };

  // Remote audio broadcast simulation
  const handleTriggerBroadcast = (text: string) => {
    setIsBroadcasting(true);
    setBroadcastFeedback(`正在向现场设备推送AI语音广播: "南宁市城市管理提示您：该区域禁止${text}，请立即自行纠正..."`);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastFeedback('语音警告广播播报完成，现场目标已出现移动迹象');
    }, 2800);
  };

  // Render SVG snapshot based on realistic urban governance scenes
  const renderSurveillanceSVG = (item: AlertItem) => {
    switch (item.imageType) {
      case 'white_car':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Background Road & Curb */}
            <rect width="320" height="200" fill="#1e293b" />
            <rect x="0" y="0" width="320" height="70" fill="#0f172a" />
            <line x1="0" y1="70" x2="320" y2="70" stroke="#475569" strokeWidth="2" />
            {/* Yellow No-Parking Curb Mark */}
            <line x1="0" y1="80" x2="320" y2="80" stroke="#eab308" strokeWidth="4" strokeDasharray="16,8" />
            {/* Road Lane Marking */}
            <line x1="0" y1="165" x2="320" y2="165" stroke="#94a3b8" strokeWidth="2" strokeDasharray="12,8" />
            
            {/* Realistic White SUV */}
            <g transform="translate(75, 25)">
              {/* Car Body */}
              <path d="M 25 135 L 35 55 C 45 36, 125 36, 135 55 L 145 135 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              {/* Roof Rails */}
              <line x1="45" y1="38" x2="125" y2="38" stroke="#64748b" strokeWidth="3" />
              {/* Rear Window */}
              <path d="M 40 65 L 48 48 C 55 42, 115 42, 122 48 L 130 65 Z" fill="#0f172a" />
              {/* Tail Lights */}
              <rect x="30" y="82" width="16" height="8" rx="2" fill="#ef4444" />
              <rect x="124" y="82" width="16" height="8" rx="2" fill="#ef4444" />
              {/* License Plate */}
              <rect x="66" y="102" width="38" height="15" rx="2" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1" />
              <text x="85" y="113" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">桂A·E1N29</text>
              {/* Bumper */}
              <rect x="35" y="125" width="100" height="12" rx="3" fill="#334155" />
              {/* Wheels */}
              <ellipse cx="32" cy="136" rx="9" ry="14" fill="#020617" />
              <ellipse cx="138" cy="136" rx="9" ry="14" fill="#020617" />
            </g>

            {/* AI Target Detection Bounding Box */}
            <rect x="90" y="55" width="140" height="115" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="90" y="38" width="85" height="17" fill="#ef4444" rx="2" />
            <text x="95" y="50" fill="#ffffff" fontSize="9" fontWeight="bold">违规停放 99.5%</text>
          </svg>
        );

      case 'vendor':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Sidewalk pavement tiles */}
            <rect width="320" height="200" fill="#334155" />
            <line x1="0" y1="50" x2="320" y2="50" stroke="#64748b" strokeWidth="2" />
            {/* Brick pattern lines */}
            <line x1="0" y1="90" x2="320" y2="90" stroke="#475569" strokeWidth="1" strokeDasharray="20,10" />
            <line x1="0" y1="130" x2="320" y2="130" stroke="#475569" strokeWidth="1" strokeDasharray="15,15" />
            <line x1="0" y1="170" x2="320" y2="170" stroke="#475569" strokeWidth="1" strokeDasharray="25,8" />
            {/* Blind tactile paving yellow line */}
            <line x1="0" y1="110" x2="320" y2="110" stroke="#eab308" strokeWidth="6" strokeDasharray="6,4" />

            {/* Vendor Tricycle with Umbrella */}
            <g transform="translate(60, 30)">
              {/* Big Beach Umbrella */}
              <path d="M 50 45 C 50 15, 150 15, 150 45 Z" fill="#2563eb" />
              <path d="M 75 45 C 75 22, 125 22, 125 45 Z" fill="#ef4444" />
              <line x1="100" y1="45" x2="100" y2="115" stroke="#94a3b8" strokeWidth="3" />
              {/* Cart Body */}
              <rect x="55" y="85" width="90" height="35" rx="3" fill="#0891b2" stroke="#164e63" strokeWidth="2" />
              {/* Fruit Crates on cart */}
              <rect x="60" y="70" width="24" height="15" fill="#f97316" rx="1" />
              <rect x="88" y="70" width="24" height="15" fill="#eab308" rx="1" />
              <rect x="116" y="70" width="24" height="15" fill="#84cc16" rx="1" />
              {/* Wheels */}
              <circle cx="68" cy="125" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="132" cy="125" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              {/* Scale / Sign */}
              <rect x="120" y="55" width="18" height="12" fill="#ffffff" />
              <text x="129" y="64" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">水果</text>
            </g>

            {/* AI Bounding Box for Vendor */}
            <rect x="95" y="40" width="125" height="125" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
            <rect x="95" y="24" width="88" height="16" fill="#f59e0b" rx="2" />
            <text x="100" y="35" fill="#ffffff" fontSize="8.5" fontWeight="bold">占道游商 98.6%</text>
          </svg>
        );

      case 'store_outside':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Storefront Façade */}
            <rect width="320" height="200" fill="#475569" />
            <rect x="0" y="0" width="320" height="75" fill="#1e293b" />
            {/* Awning */}
            <polygon points="0,55 320,55 320,80 0,80" fill="#dc2626" />
            <polygon points="0,80 320,80 300,92 20,92" fill="#b91c1c" />
            {/* Shop Sign */}
            <rect x="60" y="15" width="200" height="32" rx="4" fill="#047857" />
            <text x="160" y="36" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold">鲜果时光连锁超市</text>
            {/* Glass Doors */}
            <rect x="40" y="80" width="110" height="100" fill="#0ea5e9" opacity="0.3" stroke="#94a3b8" />
            <rect x="170" y="80" width="110" height="100" fill="#0ea5e9" opacity="0.3" stroke="#94a3b8" />

            {/* Sidewalk Spilling Out (Illegal items on pavement) */}
            <g transform="translate(70, 105)">
              {/* Stacked Crates on Sidewalk */}
              <rect x="15" y="15" width="35" height="25" fill="#f97316" rx="2" />
              <rect x="15" y="42" width="35" height="25" fill="#f97316" rx="2" />
              <rect x="55" y="25" width="45" height="42" fill="#3b82f6" rx="2" />
              {/* Clothing/Shoe Rack Outside */}
              <line x1="110" y1="10" x2="160" y2="10" stroke="#ffffff" strokeWidth="3" />
              <line x1="115" y1="10" x2="115" y2="70" stroke="#ffffff" strokeWidth="2" />
              <line x1="155" y1="10" x2="155" y2="70" stroke="#ffffff" strokeWidth="2" />
              <rect x="120" y="15" width="12" height="28" fill="#ec4899" />
              <rect x="135" y="15" width="12" height="28" fill="#eab308" />
            </g>

            {/* Red Curb Violation Line */}
            <line x1="20" y1="110" x2="300" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
            <text x="25" y="106" fill="#ef4444" fontSize="8" fontWeight="bold">门前三包红线</text>

            {/* AI Bounding Box for Store Extension */}
            <rect x="75" y="112" width="175" height="75" fill="rgba(249, 115, 22, 0.18)" stroke="#f97316" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="75" y="96" width="90" height="16" fill="#f97316" rx="2" />
            <text x="80" y="107" fill="#ffffff" fontSize="8.5" fontWeight="bold">出店超门摆放 98.2%</text>
          </svg>
        );

      case 'bike_clutter':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Metro Entrance / Street */}
            <rect width="320" height="200" fill="#334155" />
            <rect x="0" y="0" width="320" height="60" fill="#1e293b" />
            <rect x="20" y="15" width="120" height="30" rx="3" fill="#0284c7" />
            <text x="80" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">地铁站 C出入口</text>
            {/* Tactile Blind Paving Path */}
            <line x1="40" y1="60" x2="40" y2="200" stroke="#eab308" strokeWidth="12" strokeDasharray="8,4" />

            {/* Clustered Bikes Over Blind Path */}
            <g transform="translate(60, 65)">
              {/* Yellow Meituan Bike 1 */}
              <circle cx="50" cy="80" r="18" fill="none" stroke="#0f172a" strokeWidth="3" />
              <circle cx="100" cy="80" r="18" fill="none" stroke="#0f172a" strokeWidth="3" />
              <polygon points="50,80 75,55 100,80 75,80" fill="none" stroke="#facc15" strokeWidth="4" />
              <line x1="75" y1="55" x2="68" y2="40" stroke="#facc15" strokeWidth="3" />

              {/* Blue Qingju Bike Fallen */}
              <g transform="rotate(-35, 120, 80)">
                <circle cx="110" cy="80" r="16" fill="none" stroke="#0f172a" strokeWidth="3" />
                <circle cx="150" cy="80" r="16" fill="none" stroke="#0f172a" strokeWidth="3" />
                <polygon points="110,80 130,55 150,80 130,80" fill="none" stroke="#06b6d4" strokeWidth="4" />
              </g>

              {/* Toppled Bike 3 */}
              <line x1="30" y1="100" x2="90" y2="115" stroke="#ef4444" strokeWidth="3" />
            </g>

            {/* AI Warning Box */}
            <rect x="65" y="70" width="190" height="95" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="65" y="54" width="98" height="16" fill="#06b6d4" rx="2" />
            <text x="70" y="65" fill="#ffffff" fontSize="8.5" fontWeight="bold">非机动车堆积倒伏 97.1%</text>
          </svg>
        );

      case 'dump_truck':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Asphalt Highway */}
            <rect width="320" height="200" fill="#1e293b" />
            <line x1="0" y1="150" x2="320" y2="150" stroke="#f8fafc" strokeWidth="4" strokeDasharray="25,15" />
            {/* Highway Barrier */}
            <rect x="0" y="30" width="320" height="15" fill="#64748b" />
            <line x1="0" y1="37" x2="320" y2="37" stroke="#38bdf8" strokeWidth="2" />

            {/* Green Dump Truck (Muck Truck) */}
            <g transform="translate(60, 45)">
              {/* Truck Cab */}
              <polygon points="160,95 195,95 200,60 175,45 160,45" fill="#15803d" stroke="#166534" strokeWidth="2" />
              {/* Cab Window */}
              <polygon points="175,50 195,62 175,62" fill="#0284c7" />
              {/* Dump Bed (Uncovered Soil Heap) */}
              <rect x="35" y="45" width="120" height="50" rx="3" fill="#166534" stroke="#14532d" strokeWidth="2" />
              {/* Muck Soil Plume protruding above bed without tarp */}
              <path d="M 40 45 Q 95 15 150 45 Z" fill="#78350f" />
              {/* Dust / Dirt particles falling behind */}
              <circle cx="20" cy="85" r="3" fill="#92400e" opacity="0.8" />
              <circle cx="10" cy="95" r="4" fill="#92400e" opacity="0.7" />
              <circle cx="28" cy="98" r="2.5" fill="#92400e" opacity="0.6" />
              {/* Wheels */}
              <circle cx="65" cy="105" r="16" fill="#020617" stroke="#64748b" strokeWidth="3" />
              <circle cx="105" cy="105" r="16" fill="#020617" stroke="#64748b" strokeWidth="3" />
              <circle cx="178" cy="105" r="16" fill="#020617" stroke="#64748b" strokeWidth="3" />
              {/* License Plate on Truck */}
              <rect x="180" y="88" width="22" height="10" fill="#eab308" rx="1" />
              <text x="191" y="95" textAnchor="middle" fill="#000" fontSize="5" fontWeight="bold">桂A·D6912</text>
            </g>

            {/* AI Warning Box for Dump Truck Spillage */}
            <rect x="75" y="45" width="185" height="110" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="75" y="28" width="110" height="17" fill="#f59e0b" rx="2" />
            <text x="80" y="40" fill="#ffffff" fontSize="8.5" fontWeight="bold">渣土车未密闭遗撒 99.4%</text>
          </svg>
        );

      case 'ad_violation':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Commercial Building Facade */}
            <rect width="320" height="200" fill="#334155" />
            {/* Windows Grid */}
            <g fill="#0284c7" opacity="0.6">
              <rect x="30" y="20" width="40" height="30" />
              <rect x="85" y="20" width="40" height="30" />
              <rect x="140" y="20" width="40" height="30" />
              <rect x="195" y="20" width="40" height="30" />
              <rect x="250" y="20" width="40" height="30" />
              <rect x="30" y="70" width="40" height="30" />
              <rect x="85" y="70" width="40" height="30" />
              <rect x="140" y="70" width="40" height="30" />
              <rect x="195" y="70" width="40" height="30" />
              <rect x="250" y="70" width="40" height="30" />
            </g>

            {/* Huge Illegal Red Banner Across Facade */}
            <polygon points="50,75 270,80 270,135 50,130" fill="#dc2626" stroke="#fef08a" strokeWidth="2" />
            <text x="160" y="105" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold">年终巨惠 狂欢大促 全场3折起</text>
            <text x="160" y="122" textAnchor="middle" fill="#ffffff" fontSize="9">抢购热线: 0771-8888888</text>

            {/* AI Warning Box */}
            <rect x="40" y="65" width="240" height="80" fill="rgba(168, 85, 247, 0.18)" stroke="#a855f7" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="40" y="48" width="112" height="17" fill="#a855f7" rx="2" />
            <text x="45" y="60" fill="#ffffff" fontSize="8.5" fontWeight="bold">违规巨型条幅广告 98.5%</text>
          </svg>
        );

      case 'clutter_materials':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Street & Curb */}
            <rect width="320" height="200" fill="#475569" />
            <rect x="0" y="0" width="320" height="80" fill="#1e293b" />
            {/* Yellow Curb */}
            <line x1="0" y1="80" x2="320" y2="80" stroke="#eab308" strokeWidth="4" />
            {/* White parking bay line occupied */}
            <rect x="60" y="85" width="200" height="90" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10,6" />

            {/* Scattered Sandbags & Construction Waste */}
            <g transform="translate(80, 85)">
              {/* Stacked White / Grey Sandbags */}
              <ellipse cx="40" cy="50" rx="25" ry="12" fill="#cbd5e1" stroke="#94a3b8" />
              <ellipse cx="80" cy="50" rx="28" ry="14" fill="#94a3b8" stroke="#64748b" />
              <ellipse cx="60" cy="38" rx="24" ry="12" fill="#cbd5e1" stroke="#94a3b8" />
              {/* Wooden Pallets */}
              <rect x="110" y="30" width="45" height="10" fill="#b45309" />
              <rect x="110" y="42" width="45" height="10" fill="#b45309" />
              {/* Loose Bricks & Rubble */}
              <rect x="25" y="60" width="12" height="8" fill="#dc2626" />
              <rect x="42" y="62" width="14" height="7" fill="#dc2626" />
              <rect x="65" y="60" width="10" height="9" fill="#dc2626" />
            </g>

            {/* AI Warning Box */}
            <rect x="90" y="90" width="150" height="80" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="90" y="74" width="95" height="16" fill="#f43f5e" rx="2" />
            <text x="95" y="85" fill="#ffffff" fontSize="8.5" fontWeight="bold">乱堆建筑砂石垃圾 97.8%</text>
          </svg>
        );

      case 'construction_dust':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Construction Gate Background */}
            <rect width="320" height="200" fill="#334155" />
            <rect x="0" y="0" width="320" height="60" fill="#0f172a" />
            {/* Construction Blue Enclosure */}
            <rect x="10" y="60" width="300" height="80" fill="#1e3a8a" />
            <text x="160" y="95" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">安全生产 预防为主</text>

            {/* Dust Cloud Animation Representation */}
            <ellipse cx="140" cy="130" rx="90" ry="40" fill="#d97706" opacity="0.35" />
            <ellipse cx="180" cy="120" rx="60" ry="30" fill="#d97706" opacity="0.45" />
            <ellipse cx="110" cy="140" rx="45" ry="25" fill="#d97706" opacity="0.4" />

            {/* PM10 Environmental Sensor Tag */}
            <g transform="translate(180, 20)">
              <rect width="110" height="28" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
              <text x="10" y="14" fill="#fca5a5" fontSize="8">PM10扬尘浓度</text>
              <text x="10" y="24" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">215 ug/m³ (严重超标)</text>
            </g>

            {/* AI Warning Box */}
            <rect x="80" y="85" width="160" height="85" fill="rgba(217, 119, 6, 0.15)" stroke="#d97706" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="80" y="69" width="85" height="16" fill="#d97706" rx="2" />
            <text x="85" y="80" fill="#ffffff" fontSize="8.5" fontWeight="bold">工地扬尘超标 96.8%</text>
          </svg>
        );

      case 'water_log':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Underpass Road Bridge */}
            <rect width="320" height="200" fill="#1e293b" />
            {/* Overhead Bridge Beam */}
            <rect x="0" y="0" width="320" height="45" fill="#0f172a" />
            <text x="160" y="28" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">铁路下穿立交 (限高 4.2M)</text>

            {/* Water Pool on Road Surface */}
            <ellipse cx="160" cy="135" rx="120" ry="45" fill="#0284c7" opacity="0.6" stroke="#38bdf8" strokeWidth="2" />
            {/* Water ripples */}
            <ellipse cx="140" cy="130" rx="60" ry="20" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
            <ellipse cx="170" cy="140" rx="35" ry="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

            {/* Water Gauge Ruler */}
            <g transform="translate(230, 70)">
              <rect width="16" height="80" fill="#ffffff" stroke="#000000" strokeWidth="1" />
              <rect x="0" y="0" width="16" height="20" fill="#ef4444" />
              <rect x="0" y="20" width="16" height="30" fill="#eab308" />
              <rect x="0" y="50" width="16" height="30" fill="#22c55e" />
              <text x="22" y="45" fill="#ef4444" fontSize="10" fontWeight="bold">18cm</text>
            </g>

            {/* AI Warning Box */}
            <rect x="60" y="80" width="200" height="95" fill="rgba(2, 132, 199, 0.15)" stroke="#0284c7" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="60" y="64" width="90" height="16" fill="#0284c7" rx="2" />
            <text x="65" y="75" fill="#ffffff" fontSize="8.5" fontWeight="bold">路面积水预警 97.2%</text>
          </svg>
        );

      case 'fence_damage':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Construction Road */}
            <rect width="320" height="200" fill="#334155" />
            {/* Normal Enclosure on left */}
            <rect x="20" y="40" width="80" height="110" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
            {/* Tilted / Collapsed Enclosure in center */}
            <polygon points="100,40 180,65 170,165 95,150" fill="#2563eb" stroke="#ef4444" strokeWidth="3" />
            {/* Exposed Construction Trench */}
            <polygon points="120,130 200,140 190,180 110,170" fill="#78350f" />

            {/* AI Warning Box */}
            <rect x="90" y="45" width="120" height="125" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="90" y="29" width="95" height="16" fill="#ef4444" rx="2" />
            <text x="95" y="40" fill="#ffffff" fontSize="8.5" fontWeight="bold">围挡倾斜破损 98.1%</text>
          </svg>
        );

      case 'staff_duty':
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Pedestrian Street Scene */}
            <rect width="320" height="200" fill="#475569" />
            {/* Sentry Box / Kiosk */}
            <rect x="50" y="30" width="90" height="130" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <rect x="60" y="45" width="70" height="40" fill="#0284c7" opacity="0.4" />
            <text x="95" y="115" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">便民执勤岗</text>

            {/* Officer Figure */}
            <g transform="translate(160, 45)">
              <circle cx="40" cy="25" r="14" fill="#fde047" stroke="#1e293b" />
              {/* Cap */}
              <ellipse cx="40" cy="15" rx="14" ry="5" fill="#1e3a8a" />
              {/* Torso & Uniform */}
              <path d="M 20 40 L 60 40 L 55 95 L 25 95 Z" fill="#1e3a8a" />
              {/* Reflective Fluorescent Vest */}
              <rect x="25" y="48" width="30" height="35" fill="#84cc16" />
              <line x1="25" y1="62" x2="55" y2="62" stroke="#ffffff" strokeWidth="3" />
            </g>

            {/* AI Verification Tag */}
            <rect x="170" y="25" width="95" height="110" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" strokeWidth="2" strokeDasharray="6,3" />
            <rect x="170" y="9" width="90" height="16" fill="#22c55e" rx="2" />
            <text x="175" y="20" fill="#ffffff" fontSize="8.5" fontWeight="bold">勤务着装督查 96.2%</text>
          </svg>
        );

      default: // 'car_street'
        return (
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Road & Pavement */}
            <rect width="320" height="200" fill="#334155" />
            {/* Shopfronts background */}
            <rect x="0" y="0" width="320" height="65" fill="#1e293b" />
            <rect x="10" y="15" width="85" height="35" fill="#b91c1c" opacity="0.9" rx="2" />
            <text x="52" y="36" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">万家福便利店</text>
            <rect x="105" y="15" width="95" height="35" fill="#0369a1" opacity="0.9" rx="2" />
            <text x="152" y="36" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">中国电信营业厅</text>
            <rect x="210" y="15" width="100" height="35" fill="#b45309" opacity="0.9" rx="2" />
            <text x="260" y="36" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">老友粉传统小吃</text>

            {/* Sidewalk & Zebra Crossing */}
            <line x1="0" y1="80" x2="320" y2="80" stroke="#94a3b8" strokeWidth="3" />
            <g stroke="#ffffff" strokeWidth="5" strokeDasharray="16,10">
              <line x1="15" y1="120" x2="160" y2="120" />
              <line x1="15" y1="140" x2="160" y2="140" />
              <line x1="15" y1="160" x2="160" y2="160" />
            </g>

            {/* Parked Sedan */}
            <rect x="175" y="95" width="95" height="48" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <rect x="185" y="102" width="75" height="22" rx="3" fill="#1e293b" />
            <rect x="200" y="125" width="35" height="12" rx="2" fill="#1e3a8a" />
            <text x="217" y="134" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">{item.plate || '桂A·883K9'}</text>
            <circle cx="190" cy="144" r="8" fill="#020617" />
            <circle cx="255" cy="144" r="8" fill="#020617" />

            {/* AI Bounding Box */}
            <rect x="165" y="85" width="115" height="70" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,2" />
            <rect x="165" y="69" width="88" height="16" fill="#f43f5e" rx="2" />
            <text x="170" y="80" fill="#ffffff" fontSize="8.5" fontWeight="bold">斑马线违停 98.8%</text>
          </svg>
        );
    }
  };

  const isDark = pageStyle === 'dark';

  // If user opened detail page, render AlertDetailPage matching screenshot
  if (selectedDetailAlert) {
    const currentIndex = filteredAlerts.findIndex((a) => a.id === selectedDetailAlert.id);
    const prevAlert = currentIndex > 0 ? filteredAlerts[currentIndex - 1] : undefined;
    const nextAlert = currentIndex >= 0 && currentIndex < filteredAlerts.length - 1 ? filteredAlerts[currentIndex + 1] : undefined;

    return (
      <AlertDetailPage
        alert={selectedDetailAlert}
        onBack={() => setSelectedDetailAlert(null)}
        onPrev={prevAlert ? () => setSelectedDetailAlert(prevAlert) : undefined}
        onNext={nextAlert ? () => setSelectedDetailAlert(nextAlert) : undefined}
      />
    );
  }

  return (
    <div className={`w-full h-full flex flex-col overflow-y-auto select-none transition-colors duration-200 ${
      isDark ? 'bg-[#060a14] text-slate-100' : 'bg-[#f0f3f7] text-slate-800'
    }`}>
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 px-4 py-2.5 rounded-lg bg-cyan-600/95 text-white text-xs font-semibold shadow-2xl border border-cyan-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub Bar with Tabs matching screenshot & theme switch */}
      <div className={`border-b px-5 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs ${
        isDark ? 'bg-[#0b1220] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2">
          {/* Breadcrumb Tab 1: 首页 */}
          <button
            onClick={onBackToHome}
            className={`px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>返回大屏态势看板</span>
          </button>

          {/* Breadcrumb Tab 2: ● 实时预警 × */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2563eb] text-white text-xs font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>实时预警研判中心</span>
          </div>

          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            | 研判周期: 2026年10月 (近期动态秒级流)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-emerald-500 font-medium flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            AI流在线已连接
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-w-[1720px] mx-auto w-full flex-1">
        {/* 1. Top 13 Green Category Metric Cards (2 rows responsive grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;

            return (
              <div
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`cursor-pointer rounded-lg p-2.5 flex items-center justify-between border transition-all duration-150 ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg border-emerald-400 scale-[1.02]'
                      : 'bg-[#10b981] text-white shadow-md border-[#059669] scale-[1.02]'
                    : isDark
                      ? 'bg-[#0d1527] hover:bg-slate-800 text-slate-300 border-slate-800 shadow-xs'
                      : 'bg-white hover:bg-emerald-50/70 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-500/15 text-emerald-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-[11px] font-medium leading-tight truncate max-w-[85px] ${
                        isSelected 
                          ? 'text-white' 
                          : isDark 
                            ? 'text-slate-300' 
                            : 'text-slate-600'
                      }`}
                      title={cat.label}
                    >
                      {cat.label}
                    </div>
                    <div
                      className={`text-lg font-bold font-mono tabular-nums leading-none mt-1 ${
                        isSelected 
                          ? 'text-white' 
                          : isDark 
                            ? 'text-white' 
                            : 'text-slate-800'
                      }`}
                    >
                      {cat.count}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Filter Search Form Bar */}
        <div className={`rounded-lg p-3.5 border shadow-xs text-xs space-y-3 ${
          isDark ? 'bg-[#0d1527] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
            {/* 预警类型 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">预警类型</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full border rounded px-2.5 py-1.5 focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'
                }`}
              >
                <option value="">全部预警类型</option>
                <option value="机动车乱停放">机动车乱停放</option>
                <option value="出店经营">出店经营</option>
                <option value="占道经营">占道经营</option>
                <option value="非机动车乱停放">非机动车乱停放</option>
                <option value="无照经营游商">无照经营游商</option>
                <option value="违规户外广告">违规户外广告</option>
                <option value="乱堆物料">乱堆物料</option>
                <option value="渣土车检测 (抛洒、未加盖等)">渣土车检测</option>
                <option value="工地扬尘">工地扬尘</option>
                <option value="道路积水">道路积水</option>
                <option value="围挡施工规范">围挡施工规范</option>
              </select>
            </div>

            {/* 设备名称 / 地点 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">设备/地点</span>
              <input
                type="text"
                placeholder="搜索设备、路段或车牌"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className={`w-full border rounded px-2.5 py-1.5 focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* 核实情况 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">核实情况</span>
              <select
                value={verifyStatus}
                onChange={(e) => setVerifyStatus(e.target.value)}
                className={`w-full border rounded px-2.5 py-1.5 focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'
                }`}
              >
                <option value="">全部核实状态</option>
                <option value="未核实">未核实</option>
                <option value="已核实">已核实</option>
                <option value="误报">误报 (已忽略)</option>
              </select>
            </div>

            {/* 预警时间 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">预警时间</span>
              <div className="relative w-full">
                <input
                  type="text"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`w-full border rounded pl-2.5 pr-7 py-1.5 font-mono text-[11px] focus:outline-hidden ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'
                  }`}
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 预警处置状态 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium">处置状态</span>
              <select
                value={alertStatus}
                onChange={(e) => setAlertStatus(e.target.value)}
                className={`w-full border rounded px-2.5 py-1.5 focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500'
                }`}
              >
                <option value="">全部处置状态</option>
                <option value="未处置">未处置 (待派单)</option>
                <option value="处置中">处置中 (责任网格)</option>
                <option value="已办结">已办结 (闭环存档)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-700/30">
            <div className="text-xs text-slate-400">
              当前展示条件: <span className="text-cyan-400 font-medium">{selectedCategory}</span> · 共筛选出 <b className="text-white font-mono">{filteredAlerts.length}</b> 条近期预警
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => showToast(`已完成查询，匹配 ${filteredAlerts.length} 条记录`)}
                className="px-4 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded font-medium flex items-center gap-1.5 shadow-xs transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>
              <button
                onClick={handleReset}
                className={`px-4 py-1.5 border rounded font-medium flex items-center gap-1.5 transition ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>重置</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Action Bar: 批量处置、导出 & 列表/视图切换 */}
        <div className={`rounded-lg p-3 border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-[#0d1527] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export */}
            <button 
              onClick={() => showToast(`已导出 ${filteredAlerts.length} 条预警研判明细 (CSV/Excel格式已生成)`)}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-1 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出清单</span>
            </button>

            {/* Select All */}
            <button
              onClick={toggleSelectAll}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {selectedIds.size === filteredAlerts.length && filteredAlerts.length > 0 ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>全选 ({selectedIds.size}/{filteredAlerts.length})</span>
            </button>

            {/* Batch Verify */}
            <button
              onClick={handleBatchVerify}
              disabled={selectedIds.size === 0}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>批量核实</span>
            </button>

            {/* Batch Dispatch */}
            <button
              onClick={handleBatchDispatch}
              disabled={selectedIds.size === 0}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>批量派单处置</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className={`flex items-center border rounded overflow-hidden ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 flex items-center gap-1 font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-[#2563eb] text-white'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>视图</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 flex items-center gap-1 font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-[#2563eb] text-white'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>列表</span>
              </button>
            </div>

            <button
              onClick={() => {
                setAlerts([...alerts].reverse());
                showToast('已刷新预警研判实时队列');
              }}
              title="刷新数据"
              className={`p-1.5 border rounded transition ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Main Cards Grid / List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredAlerts.map((item) => {
              const isChecked = selectedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetailAlert(item)}
                  className={`rounded-lg border shadow-xs overflow-hidden flex flex-col group transition duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-[#0d1527] border-slate-800 hover:border-cyan-500/80 hover:shadow-cyan-950/50'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {/* Snapshot Media Area with SVG surveillance scene */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    {/* SVG Graphic Scene */}
                    {renderSurveillanceSVG(item)}

                    {/* Top Left Selection Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.id);
                      }}
                      className="absolute top-2 left-2 z-10 w-5 h-5 rounded bg-black/60 backdrop-blur-xs border border-white/40 flex items-center justify-center cursor-pointer shadow-xs hover:border-cyan-400"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-white/50" />
                      )}
                    </div>

                    {/* Top Right Quick Settings / Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailAlert(item);
                      }}
                      title="打开预警详情页"
                      className="absolute top-2 right-2 z-10 w-6 h-6 rounded bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-xs transition"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    {/* Bottom Left Camera Name Banner */}
                    <div className="absolute bottom-1.5 left-2 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium truncate max-w-[190px]">
                      {item.cameraName}
                    </div>

                    {/* AI Confidence Tag */}
                    <div className="absolute bottom-1.5 right-2 bg-rose-600/90 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                      AI {(item.confidence * 100).toFixed(1)}%
                    </div>

                    {/* Level Badge in Media */}
                    <div className={`absolute top-2 left-9 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      item.level === '特急' 
                        ? 'bg-rose-500 text-white' 
                        : item.level === '紧急'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                    }`}>
                      {item.level}
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className={`p-3 space-y-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm tracking-tight">{item.type}</span>
                        {item.plate && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 font-mono text-[10px] font-semibold border border-blue-500/30">
                            {item.plate}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        item.status === '未核实' 
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : item.status === '已核实'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : item.status === '处置中'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p
                      className="text-[11px] text-slate-400 truncate flex items-center gap-1"
                      title={item.location}
                    >
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/20 font-mono">
                      <span>{item.street}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List Mode Table View */
          <div className={`rounded-lg border shadow-xs overflow-x-auto text-xs ${
            isDark ? 'bg-[#0d1527] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <table className="w-full text-left">
              <thead className={`border-b font-semibold ${
                isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredAlerts.length && filteredAlerts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="py-2.5 px-3">预警编号</th>
                  <th className="py-2.5 px-3">预警类型</th>
                  <th className="py-2.5 px-3">研判等级</th>
                  <th className="py-2.5 px-3">抓拍设备/来源</th>
                  <th className="py-2.5 px-3">发生位置</th>
                  <th className="py-2.5 px-3">预警时间</th>
                  <th className="py-2.5 px-3">AI置信度</th>
                  <th className="py-2.5 px-3">当前状态</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-700'}`}>
                {filteredAlerts.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`transition cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedDetailAlert(item)}
                  >
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">{item.id}</td>
                    <td className="py-2.5 px-3 font-bold">{item.type}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.level === '特急' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : item.level === '紧急'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{item.cameraName}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-300" title={item.location}>
                      {item.location}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.time}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.status === '未核实' 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : item.status === '已核实'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDetailAlert(item)}
                        className="text-blue-500 hover:text-blue-400 font-semibold"
                      >
                        详情 / 核实 →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Bar matching screenshot */}
        <div className={`rounded-lg p-3 border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-[#0d1527] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-3">
            <span>共 <b className="font-mono text-cyan-400">{filteredAlerts.length}</b> 条记录</span>
            <select className={`border rounded px-2 py-1 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <option>8条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button className={`w-7 h-7 rounded border flex items-center justify-center transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded bg-[#2563eb] text-white font-bold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className={`w-7 h-7 rounded border flex items-center justify-center transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              2
            </button>
            <button className={`w-7 h-7 rounded border flex items-center justify-center transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              3
            </button>
            <span className="px-1 text-slate-500">...</span>
            <button className={`w-7 h-7 rounded border flex items-center justify-center transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="ml-2 text-slate-500">前往</span>
            <input
              type="text"
              defaultValue="1"
              className={`w-9 h-7 border rounded text-center font-mono ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'
              }`}
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* Detail / Verification Modal Dialog */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border ${
            isDark ? 'bg-[#0b1324] border-cyan-500/40 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            {/* Modal Header */}
            <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-bold text-sm tracking-wide">
                  预警工单处置与核实 - <span className="font-mono text-cyan-400">{activeModalItem.id}</span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  setBroadcastFeedback(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Media Snapshot Scene */}
              <div className="relative aspect-[16/8] bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                {renderSurveillanceSVG(activeModalItem)}
                
                {/* OSD Watermark */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-emerald-400">
                  {activeModalItem.cameraCode} · {activeModalItem.time} · 25FPS
                </div>

                {activeModalItem.plate && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-600 text-[11px] font-mono font-bold text-white shadow-md">
                    车牌识别: {activeModalItem.plate}
                  </div>
                )}
              </div>

              {/* Data Properties Grid */}
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg border ${
                isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-slate-400">预警类型:</span>{' '}
                  <b className="font-semibold">{activeModalItem.type}</b>
                </div>
                <div>
                  <span className="text-slate-400">研判等级:</span>{' '}
                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                    activeModalItem.level === '特急' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {activeModalItem.level}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">AI识别置信度:</span>{' '}
                  <b className="text-emerald-400 font-mono">{(activeModalItem.confidence * 100).toFixed(1)}%</b>
                </div>
                <div>
                  <span className="text-slate-400">抓拍设备:</span>{' '}
                  <span className="font-medium">{activeModalItem.cameraName}</span>
                </div>
                <div>
                  <span className="text-slate-400">抓拍时间:</span>{' '}
                  <span className="font-mono">{activeModalItem.time}</span>
                </div>
                <div>
                  <span className="text-slate-400">责任网格员:</span>{' '}
                  <span className="font-medium text-cyan-400">{activeModalItem.dispatchOfficer}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400">发生地点:</span>{' '}
                  <span className="font-medium">{activeModalItem.location}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-700/30">
                  <span className="text-slate-400">事件描述:</span>{' '}
                  <span>{activeModalItem.description}</span>
                </div>
              </div>

              {/* Voice Broadcast Simulation Banner */}
              {broadcastFeedback && (
                <div className="p-2.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{broadcastFeedback}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-700/40">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerBroadcast(activeModalItem.type)}
                    disabled={isBroadcasting}
                    className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium flex items-center gap-1.5 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>远程智能喊话</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToMapTarget) {
                        onNavigateToMapTarget(activeModalItem.cameraCode);
                      } else {
                        onBackToHome();
                      }
                      setActiveModalItem(null);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium flex items-center gap-1 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>态势地图定位</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAlerts((prev) =>
                        prev.map((a) => (a.id === activeModalItem.id ? { ...a, status: '已忽略' } : a))
                      );
                      showToast(`工单 ${activeModalItem.id} 已标记为误报忽略`);
                      setActiveModalItem(null);
                    }}
                    className={`px-3 py-1.5 rounded font-medium transition ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    标记误报 / 忽略
                  </button>

                  <button
                    onClick={() => {
                      setAlerts((prev) =>
                        prev.map((a) => (a.id === activeModalItem.id ? { ...a, status: '已核实' } : a))
                      );
                      showToast(`工单 ${activeModalItem.id} 已核实确认`);
                      setActiveModalItem(null);
                    }}
                    className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>核实确认</span>
                  </button>

                  <button
                    onClick={() => {
                      setAlerts((prev) =>
                        prev.map((a) => (a.id === activeModalItem.id ? { ...a, status: '处置中' } : a))
                      );
                      showToast(`已成功指派网格员现场处置工单 ${activeModalItem.id}`);
                      setActiveModalItem(null);
                    }}
                    className="px-4 py-1.5 rounded bg-[#2563eb] hover:bg-blue-600 text-white font-medium flex items-center gap-1 shadow-md transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>指派网格员处置</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
