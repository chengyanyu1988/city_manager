import React, { useState, useMemo } from 'react';
import {
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  RotateCcw,
  Download,
  LayoutGrid,
  List,
  Eye,
  Send,
  ArrowRightLeft,
  XCircle,
  MapPin,
  Camera,
  Truck,
  UserCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Check,
  Radio,
  Car,
  Store,
  Trash2,
  Construction,
  Waves,
  Megaphone,
  Flame,
  PhoneCall,
  User,
  CheckSquare,
  Square,
  AlertCircle,
  Archive
} from 'lucide-react';
import { AppTheme } from '../types';
import { UnhandledEventDetailPage } from './UnhandledEventDetailPage';
import { EventReviewPage } from './EventReviewPage';
import { EventArchivePage } from './EventArchivePage';
import { EventOverduePage } from './EventOverduePage';
import { EventFalseAlarmPage } from './EventFalseAlarmPage';

export interface UnhandledEvent {
  id: string;
  title: string;
  category: string;
  subType: string;
  level: '特急' | '紧急' | '一般';
  status: '未处置' | '处置中' | '待复核' | '已结案';
  source: string;
  sourceDevice: string;
  reportTime: string;
  district: string;
  street: string;
  gridCode: string;
  address: string;
  deadlineMinutes: number;
  elapsedMinutes: number;
  reporter: string;
  description: string;
  aiConfidence: number;
  imageType: 
    | 'car_violation' 
    | 'street_vendor' 
    | 'store_front' 
    | 'fence_broken' 
    | 'dump_dirt' 
    | 'bike_mess' 
    | 'illegal_ad' 
    | 'manhole_cover' 
    | 'smoke_pollution' 
    | 'cable_drop' 
    | 'trash_exposed' 
    | 'dust_site';
  targetLabel: string;
  suggestedAction: string;
  nearbyOfficer?: {
    name: string;
    phone: string;
    distance: string;
    status: '空闲' | '执勤中';
    vehicle: string;
  };
}

interface EventManagementPageProps {
  onBackToHome: () => void;
  onNavigateToAlerts?: () => void;
  onNavigateToSurveillance?: () => void;
  onNavigateToPatrol?: () => void;
  theme?: AppTheme;
  currentSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
}

// 18 Recent Unhandled Events dated October 18-19, 2026
const RECENT_UNHANDLED_EVENTS: UnhandledEvent[] = [
  {
    id: 'SJ-20261019-0012',
    title: '民族大道广西人民会堂东侧机动车占用盲道违停',
    category: '街面秩序',
    subType: '机动车违停',
    level: '特急',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-001 (民族大道高清球机)',
    reportTime: '2026-10-19 11:28:40',
    district: '青秀区',
    street: '民族街道',
    gridCode: '青秀第03网格',
    address: '青秀区民族大道108号广西人民会堂东侧非机动车辅道',
    deadlineMinutes: 60,
    elapsedMinutes: 18,
    reporter: 'AI视觉中枢边缘计算节点03',
    description: '桂A·883K9黑色大众轿车长时间占压盲道及消防救援回车通道，导致过往行人及婴儿推车被迫行至机动车道，现场已产生交通拥堵波及主干道。',
    aiConfidence: 0.992,
    imageType: 'car_violation',
    targetLabel: '违停机动车 (桂A·883K9)',
    suggestedAction: '立即调度青秀网格机动执勤人员韦警官到场劝离，若车主超时未挪车，通知交警二大队派清障拖车依法移走。',
    nearbyOfficer: {
      name: '韦警官 (青秀机动04组)',
      phone: '138-7711-2091',
      distance: '320米',
      status: '空闲',
      vehicle: '巡逻电单车 桂A·0428'
    }
  },
  {
    id: 'SJ-20261019-0018',
    title: '衡阳西路农贸市场北门无照流动水果摊点占道摆卖',
    category: '街面秩序',
    subType: '占道经营',
    level: '紧急',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-002 (衡阳西路全景枪机)',
    reportTime: '2026-10-19 11:15:22',
    district: '西乡塘区',
    street: '衡阳街道',
    gridCode: '西乡塘第01网格',
    address: '西乡塘区衡阳西路175号农贸市场北门人行道',
    deadlineMinutes: 90,
    elapsedMinutes: 32,
    reporter: 'AI全域视频研判中枢',
    description: '流动摊贩使用改装机动三轮车在菜市场早市出口占道兜售当季水果，私设电子秤和遮阳伞，阻断人行道通行，周边市民投诉较多。',
    aiConfidence: 0.985,
    imageType: 'street_vendor',
    targetLabel: '占道流动摊点 (水果机动车)',
    suggestedAction: '调度西乡塘衡阳中队执勤2组到场说服教育并引导其进入便民临时疏导点规范经营。',
    nearbyOfficer: {
      name: '黄队长 (衡阳执法中队)',
      phone: '139-7881-4432',
      distance: '580米',
      status: '执勤中',
      vehicle: '执法巡查车 桂A·8832警'
    }
  },
  {
    id: 'SJ-20261019-0025',
    title: '鲁班路商业街58号鲜果生鲜超出门前三包红线出店经营',
    category: '市容环境',
    subType: '出店经营',
    level: '一般',
    status: '未处置',
    source: '网格员巡查上报',
    sourceDevice: 'GRID-NN-014 (移动巡查终端PDA)',
    reportTime: '2026-10-19 10:52:16',
    district: '西乡塘区',
    street: '新阳街道',
    gridCode: '西乡塘第04网格',
    address: '西乡塘区鲁班路商业步行街58号商铺门前',
    deadlineMinutes: 120,
    elapsedMinutes: 55,
    reporter: '专职网格员 陆队员 (工号GX-0412)',
    description: '生鲜商户将双层货架、塑料周转筐及大型冰柜延展摆放到人行步道上，超出店铺卷闸门基准线2.5米，严重影响商业街市容风貌。',
    aiConfidence: 0.978,
    imageType: 'store_front',
    targetLabel: '出店经营货架与周转箱',
    suggestedAction: '下发商户门前三包电子督办通知，责令15分钟内自行收整入店，拍照上传销号。',
    nearbyOfficer: {
      name: '陆队员 (新阳网格巡检)',
      phone: '137-0781-9921',
      distance: '150米',
      status: '空闲',
      vehicle: '步巡'
    }
  },
  {
    id: 'SJ-20261019-0031',
    title: '金龙路与平乐大道交叉口施工围挡受强风影响倾斜坍塌',
    category: '突发隐患',
    subType: '围挡倒伏',
    level: '特急',
    status: '未处置',
    source: '移动巡检车载AI',
    sourceDevice: 'CAR-NN-002 (移动巡检车载云台AI)',
    reportTime: '2026-10-19 10:30:05',
    district: '良庆区',
    street: '蟠龙街道',
    gridCode: '良庆第02网格',
    address: '良庆区金龙路与平乐大道东北侧管网改造施工段',
    deadlineMinutes: 30,
    elapsedMinutes: 77,
    reporter: '车载AI巡视抓拍系统 (巡检车02)',
    description: '连续阵风导致长约12米的轻型铁皮施工围挡基底松动向快车道倾斜，部分铁皮已倒伏在最右侧机动车道上，存在刮碰行驶车辆严重安全隐患！',
    aiConfidence: 0.995,
    imageType: 'fence_broken',
    targetLabel: '倾斜倒伏施工围挡 (12米)',
    suggestedAction: '立即启动突发安全应急处置机制，指派周边快反铁骑设置警示反光锥并通知项目施工方到场加固扶正。',
    nearbyOfficer: {
      name: '蒙警官 (蟠龙铁骑应急组)',
      phone: '136-1771-3388',
      distance: '450米',
      status: '空闲',
      vehicle: '铁骑机车 桂A·9012'
    }
  },
  {
    id: 'SJ-20261019-0044',
    title: '白沙大道快车道大型重型泥头车未密闭沿途抛洒泥砂',
    category: '施工管理',
    subType: '渣土抛洒',
    level: '特急',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-008 (白沙大道高空瞭望枪机)',
    reportTime: '2026-10-19 09:48:33',
    district: '江南区',
    street: '江南街道',
    gridCode: '江南第03网格',
    address: '江南区白沙大道与星光大道立交桥辅道北行路段',
    deadlineMinutes: 60,
    elapsedMinutes: 118,
    reporter: 'AI交通重载车厢智能识别中枢',
    description: '车牌号为桂A·98721的大型重载自卸货车车厢篷布未拉齐密闭，行驶途中泥块与碎砂石大面积撒漏在主车道上约80米，路面极易造成车辆打滑。',
    aiConfidence: 0.989,
    imageType: 'dump_dirt',
    targetLabel: '未密闭泥头车及抛洒路面',
    suggestedAction: '联动交警卡口拦截涉案车辆，同步派遣环卫机械化清扫车开展应急高压冲洗作业。',
    nearbyOfficer: {
      name: '陈队长 (江南渣土执法大队)',
      phone: '138-7719-8800',
      distance: '1.2公里',
      status: '执勤中',
      vehicle: '执法巡查车 桂A·0819警'
    }
  },
  {
    id: 'SJ-20261019-0056',
    title: '朝阳广场地铁C口大量共享单车严重淤积挤占盲道通道',
    category: '街面秩序',
    subType: '单车淤积',
    level: '一般',
    status: '未处置',
    source: '12345便民热线转办',
    sourceDevice: 'HOTLINE-12345-20261019-082',
    reportTime: '2026-10-19 09:12:18',
    district: '兴宁区',
    street: '朝阳街道',
    gridCode: '兴宁第05网格',
    address: '兴宁区朝阳路民生广场地铁站C口出口集散广场',
    deadlineMinutes: 120,
    elapsedMinutes: 154,
    reporter: '市民热线投诉 (热线派单)',
    description: '早高峰潮汐客流骑行美团、哈啰、青桔等共享单车在地铁口随意停放，导致人行主干道通行宽度不足80厘米，轮椅与老人无法正常通行。',
    aiConfidence: 0.962,
    imageType: 'bike_mess',
    targetLabel: '淤积共享单车集群 (>60辆)',
    suggestedAction: '通过智慧单车监管平台一键派发三家单车运营企业在20分钟内调度转运厢车前来清运减量。',
    nearbyOfficer: {
      name: '张巡查员 (朝阳网格特勤)',
      phone: '135-0771-5561',
      distance: '210米',
      status: '空闲',
      vehicle: '步巡'
    }
  },
  {
    id: 'SJ-20261019-0062',
    title: '民族影城主立面未经规划审批违规悬挂大型发光横幅',
    category: '户外广告',
    subType: '违规广告',
    level: '一般',
    status: '未处置',
    source: '网格员巡查上报',
    sourceDevice: 'GRID-NN-028 (网格手持机)',
    reportTime: '2026-10-19 08:35:42',
    district: '青秀区',
    street: '新竹街道',
    gridCode: '青秀第06网格',
    address: '青秀区民族大道150号民族影城外立面裙楼3层',
    deadlineMinutes: 240,
    elapsedMinutes: 191,
    reporter: '专职网格员 莫队员 (工号GX-0219)',
    description: '商户未经市政市容规划审批，在外墙悬挂长20米、高3米的大型红色发光商业宣传条幅，钢丝拉索绑扎于老旧阳台栏杆，存在大风天气脱落隐患。',
    aiConfidence: 0.971,
    imageType: 'illegal_ad',
    targetLabel: '违规商业发光条幅广告',
    suggestedAction: '向该商户下发限期自行拆除整改通知书，若逾期未拆除，安排特勤高空作业吊车依法实施拆违。',
    nearbyOfficer: {
      name: '李警官 (新竹综合行政执法队)',
      phone: '139-0771-6632',
      distance: '850米',
      status: '执勤中',
      vehicle: '执法巡查车 桂A·3312'
    }
  },
  {
    id: 'SJ-20261019-0077',
    title: '大学东路主干道非机动车道雨水井盖缺失塌陷险情',
    category: '市政设施',
    subType: '井盖缺损',
    level: '特急',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-015 (大学东路路口球机)',
    reportTime: '2026-10-19 08:05:10',
    district: '西乡塘区',
    street: '上尧街道',
    gridCode: '西乡塘第07网格',
    address: '西乡塘区大学东路100号广西大学正门以东80米辅道',
    deadlineMinutes: 30,
    elapsedMinutes: 221,
    reporter: '路面病害AI视觉识别中枢',
    description: '暴雨冲刷后非机动车道上的重型雨水井盖出现移位掉入井底，形成深达1.8米的无防护孔洞，已有两名骑电动车的学生险些坠落。',
    aiConfidence: 0.998,
    imageType: 'manhole_cover',
    targetLabel: '缺失雨水井口 (深1.8m)',
    suggestedAction: '安排网格员立即在井口设置安全警示围挡及爆闪灯，同时指派市政设施抢修队伍携同型号球墨铸铁井盖现场更换。',
    nearbyOfficer: {
      name: '唐副队长 (上尧市政应急分队)',
      phone: '137-7711-4455',
      distance: '410米',
      status: '空闲',
      vehicle: '市政抢修工程车 桂A·5589'
    }
  },
  {
    id: 'SJ-20261019-0083',
    title: '新竹路老街区餐饮商户违规排烟管道漏油直排绿化带',
    category: '生态环境',
    subType: '餐饮油烟',
    level: '紧急',
    status: '未处置',
    source: '12345便民热线转办',
    sourceDevice: 'HOTLINE-12345-20261019-041',
    reportTime: '2026-10-19 07:40:15',
    district: '青秀区',
    street: '新竹街道',
    gridCode: '青秀第02网格',
    address: '青秀区新竹路南二里12号沿街烧烤小吃店后侧',
    deadlineMinutes: 180,
    elapsedMinutes: 246,
    reporter: '小区业主委员会联名投诉',
    description: '餐饮商户未规范安装油烟净化设备，私接排烟铝箔管道朝向居民楼公共绿化带排放浓烈油烟，地面油污泛滥导致多名行人滑倒。',
    aiConfidence: 0.966,
    imageType: 'smoke_pollution',
    targetLabel: '私拉油烟管道与油污地面',
    suggestedAction: '联合生态环境分局及市场监管局开展联合执法，对油烟净化率进行现场采样检测并责令限期整改。',
    nearbyOfficer: {
      name: '韦警官 (青秀机动04组)',
      phone: '138-7711-2091',
      distance: '620米',
      status: '空闲',
      vehicle: '巡逻电单车 桂A·0428'
    }
  },
  {
    id: 'SJ-20261019-0091',
    title: '东葛路老旧生活小区沿街外立面通信线缆大面积脱落',
    category: '突发隐患',
    subType: '线缆垂落',
    level: '紧急',
    status: '未处置',
    source: '网格员巡查上报',
    sourceDevice: 'GRID-NN-007 (网格终端)',
    reportTime: '2026-10-19 07:15:30',
    district: '青秀区',
    street: '建政街道',
    gridCode: '青秀第05网格',
    address: '青秀区东葛路29号荣和中央公园对面沿街居民楼',
    deadlineMinutes: 60,
    elapsedMinutes: 271,
    reporter: '专职网格员 梁队员',
    description: '过路大货车疑似刮断临街架空弱电线缆束，导致十多根黑色线缆横跨在人行道上空1.5米处，多辆非机动车被迫绕行机动车道。',
    aiConfidence: 0.975,
    imageType: 'cable_drop',
    targetLabel: '脱落垂挂通信线缆束',
    suggestedAction: '网格员先用绝缘警示扎带临时收束高挂，同步通知弱电联合整治专班（电信、移动、联通、广电）半小时内到达捆扎规整。',
    nearbyOfficer: {
      name: '梁队员 (建政街道网格)',
      phone: '138-7881-2290',
      distance: '180米',
      status: '空闲',
      vehicle: '步巡'
    }
  },
  {
    id: 'SJ-20261018-0089',
    title: '亭洪路江南万达旁空置地块夜间偷倒大量装修建筑垃圾',
    category: '市容环境',
    subType: '暴露垃圾',
    level: '紧急',
    status: '未处置',
    source: '无人机航测巡查组',
    sourceDevice: 'UAV-NN-02 (大疆行业级巡检无人机)',
    reportTime: '2026-10-18 21:40:15',
    district: '江南区',
    street: '江南街道',
    gridCode: '江南第06网格',
    address: '江南区亭洪路48号江南万达广场南侧待建空地',
    deadlineMinutes: 240,
    elapsedMinutes: 846,
    reporter: '空天一体执法无人机02组',
    description: '夜间航拍红外热成像巡查发现待建绿化空地出现约40立方米建筑装修渣土和破损石膏板，现场未设置围挡，属于恶意偷倒渣土行为。',
    aiConfidence: 0.991,
    imageType: 'trash_exposed',
    targetLabel: '非法倾倒建筑渣土堆 (~40m³)',
    suggestedAction: '调取周边治安天网卡口夜间过往中重型货车车牌记录锁定倾倒车辆，指派江南环卫专业清运车队进场清理。',
    nearbyOfficer: {
      name: '陈队长 (江南渣土执法大队)',
      phone: '138-7719-8800',
      distance: '1.4公里',
      status: '空闲',
      vehicle: '执法巡查车 桂A·0819警'
    }
  },
  {
    id: 'SJ-20261018-0102',
    title: '安吉大道旧城改建工地未开启雾炮喷淋致扬尘严重超标',
    category: '施工管理',
    subType: '工地扬尘',
    level: '一般',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-023 (安吉大道工地AI监测仪)',
    reportTime: '2026-10-18 19:22:38',
    district: '西乡塘区',
    street: '安吉街道',
    gridCode: '西乡塘第09网格',
    address: '西乡塘区安吉大道66号安吉万达西侧棚改土石方工程',
    deadlineMinutes: 180,
    elapsedMinutes: 984,
    reporter: 'AI环保颗粒物在线视觉监测系统',
    description: '大面积土石方开挖作业期间，工地内部雾炮机与环道喷淋设施全线关停，挖掘机挖土产生大片黄色粉尘外溢扩散至安吉大道主路。',
    aiConfidence: 0.982,
    imageType: 'dust_site',
    targetLabel: '土石方施工扬尘超标扩散',
    suggestedAction: '向该项目施工方负责人出具施工扬尘限期整改单，责令立即开启全场地湿法抑尘作业，否则暂停其土方夜间开工资格。',
    nearbyOfficer: {
      name: '黄队长 (衡阳执法中队)',
      phone: '139-7881-4432',
      distance: '1.8公里',
      status: '执勤中',
      vehicle: '执法巡查车 桂A·8832警'
    }
  },
  {
    id: 'SJ-20261018-0115',
    title: '五象大道总部基地人行绿化隔离带生活垃圾大面积抛掷',
    category: '市容环境',
    subType: '暴露垃圾',
    level: '一般',
    status: '未处置',
    source: '网格员巡查上报',
    sourceDevice: 'GRID-NN-033 (良庆网格机)',
    reportTime: '2026-10-18 16:50:00',
    district: '良庆区',
    street: '蟠龙街道',
    gridCode: '良庆第05网格',
    address: '良庆区五象大道401号南宁金融大厦南侧绿化人行带',
    deadlineMinutes: 120,
    elapsedMinutes: 1136,
    reporter: '专职网格员 郑队员',
    description: '绿化隔离草坪内散落大量快餐外卖打包盒、塑料袋及废弃纸箱，延绵约30米，严重破坏总部基地高品质市容环境。',
    aiConfidence: 0.969,
    imageType: 'trash_exposed',
    targetLabel: '绿化带散落外卖生活垃圾',
    suggestedAction: '派发良庆市政环卫保洁三标段15分钟内到场捡拾清扫并对周边商户进行宣传引导。',
    nearbyOfficer: {
      name: '蒙警官 (蟠龙铁骑应急组)',
      phone: '136-1771-3388',
      distance: '650米',
      status: '空闲',
      vehicle: '铁骑机车 桂A·9012'
    }
  },
  {
    id: 'SJ-20261018-0128',
    title: '金湖广场南侧写字楼入行道机动车私自占用装卸货车位',
    category: '街面秩序',
    subType: '机动车违停',
    level: '一般',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-004 (金湖广场球机)',
    reportTime: '2026-10-18 14:15:20',
    district: '青秀区',
    street: '民族街道',
    gridCode: '青秀第01网格',
    address: '青秀区金湖路59号地王国际商厦西门专用货运通道',
    deadlineMinutes: 60,
    elapsedMinutes: 1291,
    reporter: 'AI车位状态检测算法',
    description: '桂A·558H2私家车停放在商厦专用装卸货泊位上，且未按顺行方向停放，导致大型送货厢货车无法驶入阻碍通道运转。',
    aiConfidence: 0.977,
    imageType: 'car_violation',
    targetLabel: '违规占用装卸车位私家车',
    suggestedAction: '通过公安交管短信平台发送挪车短信，限车主10分钟内驶离。',
    nearbyOfficer: {
      name: '韦警官 (青秀机动04组)',
      phone: '138-7711-2091',
      distance: '480米',
      status: '空闲',
      vehicle: '巡逻电单车 桂A·0428'
    }
  },
  {
    id: 'SJ-20261018-0133',
    title: '民生路步行街入口无证流动爆米花及糖葫芦推车占道',
    category: '街面秩序',
    subType: '占道经营',
    level: '一般',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-012 (步行街入口抓拍机)',
    reportTime: '2026-10-18 11:50:40',
    district: '兴宁区',
    street: '朝阳街道',
    gridCode: '兴宁第02网格',
    address: '兴宁区民生路商业步行街西牌坊正下方人行要道',
    deadlineMinutes: 90,
    elapsedMinutes: 1436,
    reporter: 'AI人流密集区商贩检测',
    description: '两台手推车占用步行街迎宾大门正中央开展熟食售卖，使用液化气钢瓶进行现场加热，存在消防爆燃隐患且阻塞应急疏散通道。',
    aiConfidence: 0.984,
    imageType: 'street_vendor',
    targetLabel: '违规手推车及明火钢瓶',
    suggestedAction: '朝阳中队步行巡逻巡视组迅速到场依法依规查处，先行登记保存气瓶排查安全隐患。',
    nearbyOfficer: {
      name: '张巡查员 (朝阳网格特勤)',
      phone: '135-0771-5561',
      distance: '120米',
      status: '空闲',
      vehicle: '步巡'
    }
  },
  {
    id: 'SJ-20261018-0142',
    title: '壮锦大道辅道绿化管网维修后回填不实导致路面沉降',
    category: '市政设施',
    subType: '设施破损',
    level: '紧急',
    status: '未处置',
    source: '移动巡检车载AI',
    sourceDevice: 'CAR-NN-001 (移动巡检车载云台)',
    reportTime: '2026-10-18 10:20:10',
    district: '江南区',
    street: '江南街道',
    gridCode: '江南第04网格',
    address: '江南区壮锦大道28号八桂绿城南门前辅道',
    deadlineMinutes: 60,
    elapsedMinutes: 1526,
    reporter: '巡检车载激光雷达路面扫描',
    description: '辅道路面出现面积约4平方米、最大深度约15厘米的凹陷沉降，多辆电动车经过时险些失控侧翻。',
    aiConfidence: 0.988,
    imageType: 'fence_broken',
    targetLabel: '路面沉降凹坑 (深15cm)',
    suggestedAction: '指派市政路网养护中心先行铺设应急防滑钢板保障通行，并安排夜间铣刨沥青重新摊铺。',
    nearbyOfficer: {
      name: '陈队长 (江南渣土执法大队)',
      phone: '138-7719-8800',
      distance: '890米',
      status: '空闲',
      vehicle: '执法巡查车 桂A·0819警'
    }
  },
  {
    id: 'SJ-20261018-0155',
    title: '科园大道软件园三期门前人行道乱堆放大量装修木板木条',
    category: '市容环境',
    subType: '占道堆放',
    level: '一般',
    status: '未处置',
    source: '网格员巡查上报',
    sourceDevice: 'GRID-NN-019 (高新网格机)',
    reportTime: '2026-10-18 09:05:22',
    district: '西乡塘区',
    street: '安吉街道',
    gridCode: '高新第03网格',
    address: '西乡塘区科园大道33号南宁软件园三期B座大厦前坪',
    deadlineMinutes: 180,
    elapsedMinutes: 1601,
    reporter: '专职网格员 莫队员',
    description: '写字楼租户装修将大批废弃木龙骨、含有铁钉的废木板及阻燃棉堆置在公共人行道上，铁钉裸露极易扎伤路人。',
    aiConfidence: 0.972,
    imageType: 'trash_exposed',
    targetLabel: '露天堆放带钉废旧木料',
    suggestedAction: '联系大厦物业管理处限其在1小时内督促租户将装修废弃材料移入负二层专用建筑垃圾周转房。',
    nearbyOfficer: {
      name: '黄队长 (衡阳执法中队)',
      phone: '139-7881-4432',
      distance: '1.5公里',
      status: '执勤中',
      vehicle: '执法巡查车 桂A·8832警'
    }
  },
  {
    id: 'SJ-20261018-0160',
    title: '秀灵路夜市街商户营业结束后私自将泔水倾倒进雨水井',
    category: '生态环境',
    subType: '违规倾倒',
    level: '紧急',
    status: '未处置',
    source: 'AI视频智能抓拍',
    sourceDevice: 'CAM-NN-031 (秀灵路夜市高清AI枪机)',
    reportTime: '2026-10-18 02:40:18',
    district: '西乡塘区',
    street: '衡阳街道',
    gridCode: '西乡塘第05网格',
    address: '西乡塘区秀灵路72号西乡塘中医院南侧雨水箅子旁',
    deadlineMinutes: 120,
    elapsedMinutes: 1996,
    reporter: 'AI夜间异常排污行为分析',
    description: '沿街大排档从业人员使用塑料桶将餐饮油腻残渣泔水直接泼入市政雨水管网，导致管道严重附着凝固油脂并散发恶臭。',
    aiConfidence: 0.993,
    imageType: 'smoke_pollution',
    targetLabel: '违规倾倒餐饮泔水行为',
    suggestedAction: '调取完整违法视频存证，指派中队执法人员上门送达调查通知书并按相关水污染防治条例实施行政处罚。',
    nearbyOfficer: {
      name: '黄队长 (衡阳执法中队)',
      phone: '139-7881-4432',
      distance: '720米',
      status: '空闲',
      vehicle: '执法巡查车 桂A·8832警'
    }
  }
];

export const EventManagementPage: React.FC<EventManagementPageProps> = ({
  onBackToHome,
  onNavigateToAlerts: _onNavigateToAlerts,
  onNavigateToSurveillance: _onNavigateToSurveillance,
  onNavigateToPatrol: _onNavigateToPatrol,
  theme: _theme = 'tactical-dark',
  currentSubTab = 'unhandled',
  onSubTabChange
}) => {
  // Sub-tabs for Event Management matching left sidebar submenu (未处置 | 待复核 | 档案库 | 逾期事件 | 误报事件)
  const [activeSubTab, setActiveSubTab] = useState<'unhandled' | 'processing' | 'reviewing' | 'completed' | 'archive' | 'overdue' | 'false_alarm' | 'all'>(
    (currentSubTab as any) || 'unhandled'
  );

  // Sync state when props change from left sidebar
  React.useEffect(() => {
    if (currentSubTab) {
      setActiveSubTab(currentSubTab as any);
      setDetailEvent(null);
    }
  }, [currentSubTab]);

  const handleSelectSubTab = (tab: 'unhandled' | 'processing' | 'reviewing' | 'completed' | 'archive' | 'overdue' | 'false_alarm' | 'all') => {
    setActiveSubTab(tab);
    setDetailEvent(null);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // Filter & Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('recent'); // 'today' | 'recent' | 'all'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Selection state for batch operations
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  // Modals state
  const [detailEvent, setDetailEvent] = useState<UnhandledEvent | null>(null);
  const [dispatchingEvent, setDispatchingEvent] = useState<UnhandledEvent | null>(null);
  const [isBatchDispatchOpen, setIsBatchDispatchOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferringEvent, setTransferringEvent] = useState<UnhandledEvent | null>(null);
  const [previewImageEvent, setPreviewImageEvent] = useState<UnhandledEvent | null>(null);

  // Dispatch Form State
  const [dispatchDepartment, setDispatchDepartment] = useState('青秀区城市管理综合行政执法大队');
  const [dispatchTargetType, setDispatchTargetType] = useState<'officer' | 'car' | 'grid'>('officer');
  const [dispatchDeadline, setDispatchDeadline] = useState<'30m' | '1h' | '2h' | 'today'>('1h');
  const [dispatchInstructions, setDispatchInstructions] = useState('请携带执法记录仪立即赶赴现场进行核实劝导，依法取证规范处置并拍照回传系统。');
  const [sendSmsNotification, setSendSmsNotification] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Event Data list state (supports handling/removing items)
  const [eventsList, setEventsList] = useState<UnhandledEvent[]>(RECENT_UNHANDLED_EVENTS);

  // Show Toast helper
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      // Sub-tab filter matching left sidebar submenu items
      if (activeSubTab === 'unhandled' && ev.status !== '未处置') return false;
      if (activeSubTab === 'processing' && ev.status !== '处置中') return false;
      if (activeSubTab === 'reviewing' && ev.status !== '待复核') return false;
      if (activeSubTab === 'completed' && ev.status !== '已结案') return false;
      if (activeSubTab === 'archive' && ev.status !== '已结案' && ev.status !== '待复核') return false;
      if (activeSubTab === 'overdue' && !(ev.elapsedMinutes > ev.deadlineMinutes || ev.level === '特急')) return false;
      if (activeSubTab === 'false_alarm' && !(ev.description.includes('核实') || ev.title.includes('抢修') || ev.status === '已结案' || ev.id.endsWith('2') || ev.id.endsWith('7'))) return false;

      // Search keyword filter
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matches = 
          ev.id.toLowerCase().includes(kw) ||
          ev.title.toLowerCase().includes(kw) ||
          ev.address.toLowerCase().includes(kw) ||
          ev.subType.toLowerCase().includes(kw) ||
          ev.description.toLowerCase().includes(kw) ||
          ev.reporter.toLowerCase().includes(kw);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;

      // Level filter
      if (selectedLevel !== 'all' && ev.level !== selectedLevel) return false;

      // District filter
      if (selectedDistrict !== 'all' && ev.district !== selectedDistrict) return false;

      // Source filter
      if (selectedSource !== 'all' && !ev.source.includes(selectedSource)) return false;

      // Date Range filter
      if (dateRangeFilter === 'today') {
        if (!ev.reportTime.startsWith('2026-10-19')) return false;
      }

      return true;
    });
  }, [eventsList, activeSubTab, searchKeyword, selectedCategory, selectedLevel, selectedDistrict, selectedSource, dateRangeFilter]);

  // Counts for tabs & categories (matching left sidebar and screenshot)
  const unhandledCount = eventsList.filter(e => e.status === '未处置').length;
  const reviewingCount = 43;
  const archiveCount = 142;
  const overdueCount = eventsList.filter(e => e.elapsedMinutes > e.deadlineMinutes || e.level === '特急').length || 12;
  const falseAlarmCount = 8;
  const processingCount = eventsList.filter(e => e.status === '处置中').length || 35;
  const urgentCount = eventsList.filter(e => e.status === '未处置' && e.level === '特急').length;
  const timeoutCount = eventsList.filter(e => e.status === '未处置' && e.elapsedMinutes > e.deadlineMinutes).length;
  const todayNewCount = eventsList.filter(e => e.reportTime.startsWith('2026-10-19')).length;

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedEventIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEventIds.length === filteredEvents.length) {
      setSelectedEventIds([]);
    } else {
      setSelectedEventIds(filteredEvents.map(e => e.id));
    }
  };

  // Perform Dispatch
  const handleConfirmDispatch = (targetEvent: UnhandledEvent) => {
    setEventsList(prev => 
      prev.map(ev => ev.id === targetEvent.id ? { ...ev, status: '处置中' } : ev)
    );
    setDispatchingEvent(null);
    if (detailEvent?.id === targetEvent.id) {
      setDetailEvent(null);
    }
    showToast(`工单 ${targetEvent.id} 已成功下发指派至执勤力量，状态已流转为【处置中】！`);
  };

  // Batch Dispatch
  const handleConfirmBatchDispatch = () => {
    setEventsList(prev => 
      prev.map(ev => selectedEventIds.includes(ev.id) ? { ...ev, status: '处置中' } : ev)
    );
    const count = selectedEventIds.length;
    setSelectedEventIds([]);
    setIsBatchDispatchOpen(false);
    showToast(`已批量指派 ${count} 项待处置工单至指定网格执勤单位！`);
  };

  // Ignore / Discard
  const handleIgnoreEvent = (id: string) => {
    setEventsList(prev => prev.filter(e => e.id !== id));
    showToast(`工单 ${id} 已标记忽略并归档。`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedDistrict('all');
    setSelectedSource('all');
    setDateRangeFilter('recent');
    setSelectedEventIds([]);
  };

  // Render SVG snapshot based on event imageType
  const renderEventSnapshot = (item: UnhandledEvent) => {
    return (
      <div className="relative w-full h-36 bg-slate-900 rounded-lg overflow-hidden border border-slate-700/80 group/img">
        {/* Synthetic Tactical Visual Scene */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1426] via-[#111f38] to-[#080d1a]">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Dynamic illustration by type */}
          {item.imageType === 'car_violation' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="100" width="320" height="60" fill="#1e293b" />
              <line x1="0" y1="130" x2="320" y2="130" stroke="#facc15" strokeWidth="2" strokeDasharray="8 6" />
              {/* Sidewalk */}
              <rect x="0" y="80" width="320" height="20" fill="#334155" />
              <rect x="10" y="85" width="300" height="5" fill="#f59e0b" opacity="0.6" />
              {/* Car */}
              <rect x="90" y="70" width="140" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="110" y="55" width="90" height="25" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="115" cy="112" r="10" fill="#020617" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="205" cy="112" r="10" fill="#020617" stroke="#94a3b8" strokeWidth="2" />
              <rect x="145" y="98" width="45" height="12" fill="#0284c7" rx="2" />
              <text x="148" y="107" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">桂A·883K9</text>
            </svg>
          )}

          {item.imageType === 'street_vendor' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="90" width="320" height="70" fill="#1e293b" />
              {/* Stall Umbrella */}
              <path d="M 80 75 Q 160 30 240 75 Z" fill="#ef4444" opacity="0.9" />
              <line x1="160" y1="50" x2="160" y2="115" stroke="#94a3b8" strokeWidth="3" />
              {/* Cart */}
              <rect x="110" y="85" width="100" height="35" rx="4" fill="#d97706" />
              <circle cx="130" cy="125" r="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="190" cy="125" r="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="130" cy="80" r="5" fill="#22c55e" />
              <circle cx="145" cy="78" r="6" fill="#eab308" />
              <circle cx="160" cy="80" r="5" fill="#f97316" />
              <circle cx="175" cy="79" r="6" fill="#ef4444" />
            </svg>
          )}

          {item.imageType === 'fence_broken' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="100" width="320" height="60" fill="#0f172a" />
              <polygon points="40,50 180,95 180,120 40,120" fill="#3b82f6" opacity="0.8" />
              <line x1="40" y1="50" x2="180" y2="95" stroke="#60a5fa" strokeWidth="3" />
              <line x1="90" y1="65" x2="90" y2="120" stroke="#93c5fd" strokeWidth="2" />
              <line x1="140" y1="80" x2="140" y2="120" stroke="#93c5fd" strokeWidth="2" />
              {/* Construction warning stripes */}
              <rect x="190" y="70" width="80" height="30" fill="#eab308" />
              <line x1="200" y1="70" x2="215" y2="100" stroke="#000000" strokeWidth="5" />
              <line x1="225" y1="70" x2="240" y2="100" stroke="#000000" strokeWidth="5" />
              <line x1="250" y1="70" x2="265" y2="100" stroke="#000000" strokeWidth="5" />
            </svg>
          )}

          {item.imageType === 'dump_dirt' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="80" width="320" height="80" fill="#1e293b" />
              {/* Dump Truck */}
              <rect x="60" y="55" width="110" height="40" rx="4" fill="#059669" />
              <rect x="170" y="65" width="45" height="30" rx="3" fill="#10b981" />
              <circle cx="85" cy="100" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="145" cy="100" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="195" cy="100" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              {/* Spilled dirt */}
              <ellipse cx="70" cy="115" rx="35" ry="8" fill="#78350f" opacity="0.8" />
              <ellipse cx="120" cy="120" rx="25" ry="6" fill="#92400e" opacity="0.9" />
            </svg>
          )}

          {item.imageType === 'bike_mess' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="90" width="320" height="70" fill="#1e293b" />
              {/* Multiple shared bikes jumbled */}
              <circle cx="90" cy="115" r="14" fill="none" stroke="#eab308" strokeWidth="2" />
              <circle cx="130" cy="115" r="14" fill="none" stroke="#eab308" strokeWidth="2" />
              <line x1="90" y1="115" x2="110" y2="95" stroke="#eab308" strokeWidth="2" />
              <line x1="110" y1="95" x2="130" y2="115" stroke="#eab308" strokeWidth="2" />

              <circle cx="140" cy="120" r="14" fill="none" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="180" cy="120" r="14" fill="none" stroke="#06b6d4" strokeWidth="2" />
              <line x1="140" y1="120" x2="160" y2="100" stroke="#06b6d4" strokeWidth="2" />
              <line x1="160" y1="100" x2="180" y2="120" stroke="#06b6d4" strokeWidth="2" />

              <circle cx="185" cy="110" r="13" fill="none" stroke="#22c55e" strokeWidth="2" />
              <circle cx="220" cy="110" r="13" fill="none" stroke="#22c55e" strokeWidth="2" />
            </svg>
          )}

          {item.imageType === 'manhole_cover' && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="60" width="320" height="100" fill="#1e293b" />
              {/* Hole in road */}
              <ellipse cx="160" cy="105" rx="42" ry="18" fill="#020617" stroke="#ef4444" strokeWidth="3" />
              <ellipse cx="160" cy="110" rx="35" ry="12" fill="#000000" />
              {/* Displaced cover leaning */}
              <ellipse cx="215" cy="98" rx="36" ry="14" fill="#475569" stroke="#94a3b8" strokeWidth="2" transform="rotate(-15 215 98)" />
            </svg>
          )}

          {/* Fallback default background */}
          {!['car_violation', 'street_vendor', 'fence_broken', 'dump_dirt', 'bike_mess', 'manhole_cover'].includes(item.imageType) && (
            <svg className="w-full h-full" viewBox="0 0 320 160">
              <rect x="0" y="80" width="320" height="80" fill="#1e293b" />
              <rect x="40" y="40" width="80" height="60" fill="#334155" rx="3" />
              <rect x="140" y="30" width="120" height="70" fill="#475569" rx="3" />
              <rect x="180" y="90" width="60" height="25" fill="#f97316" rx="4" opacity="0.8" />
            </svg>
          )}
        </div>

        {/* AI Bounding Box Overlay */}
        <div className="absolute inset-x-8 inset-y-5 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded flex flex-col justify-between p-1.5 pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {item.targetLabel}
            </span>
            <span className="bg-black/80 text-cyan-300 font-mono text-[9px] px-1 rounded border border-cyan-500/40">
              置信度 {(item.aiConfidence * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-300 bg-black/60 px-1 rounded">
            <span>{item.sourceDevice.split(' ')[0]}</span>
            <span>{item.reportTime.split(' ')[1]}</span>
          </div>
        </div>

        {/* Hover overlay hint */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setPreviewImageEvent(item);
          }}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <span className="px-2.5 py-1 rounded bg-cyan-600/90 text-white text-[11px] font-medium flex items-center gap-1 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            点击查看高清原图
          </span>
        </div>

        {/* Level Tag on Image Top-Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-md ${
            item.level === '特急' ? 'bg-rose-600 text-white animate-pulse' :
            item.level === '紧急' ? 'bg-amber-600 text-white' :
            'bg-blue-600 text-white'
          }`}>
            {item.level}
          </span>
        </div>

        {/* Category Tag on Image Top-Right */}
        <div className="absolute top-2 right-2 z-10">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
            {item.subType}
          </span>
        </div>
      </div>
    );
  };

  // If a specific event is selected for viewing detail, display the dedicated UnhandledEventDetailPage
  if (detailEvent) {
    const currentIndex = eventsList.findIndex(e => e.id === detailEvent.id);
    const prevEvent = currentIndex > 0 ? eventsList[currentIndex - 1] : undefined;
    const nextEvent = currentIndex < eventsList.length - 1 ? eventsList[currentIndex + 1] : undefined;

    return (
      <UnhandledEventDetailPage
        event={detailEvent}
        onBack={() => setDetailEvent(null)}
        onPrev={prevEvent ? () => setDetailEvent(prevEvent) : undefined}
        onNext={nextEvent ? () => setDetailEvent(nextEvent) : undefined}
        currentIndex={currentIndex >= 0 ? currentIndex + 1 : 1}
        totalCount={eventsList.length}
        onDispatch={(ev) => {
          setEventsList(prev => 
            prev.map(item => item.id === ev.id ? { ...item, status: '处置中' } : item)
          );
          setDetailEvent(null);
          showToast(`工单 ${ev.id} 已成功下发指派，状态已流转为【处置中】！`);
        }}
        onTransferThirdParty={(ev, platform, notes) => {
          setEventsList(prev => 
            prev.map(item => item.id === ev.id ? { ...item, status: '处置中' } : item)
          );
          showToast(`工单 ${ev.id} 已成功推送至【${platform}】进行第三方协同处置！`);
        }}
        onMarkFalseAlarm={(id, reason) => {
          handleIgnoreEvent(id);
          setDetailEvent(null);
          showToast(`工单 ${id} 已标记误报并归档。`);
        }}
      />
    );
  }

  // If activeSubTab === 'reviewing', render the exact 待复核 page matching user screenshot
  if (activeSubTab === 'reviewing') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Harmonized sub-tab switcher bar */}
        <div className="h-10 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-semibold">事件管理:</span>
            <div className="flex items-center bg-[#0d1629] p-0.5 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => handleSelectSubTab('unhandled')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>未处置</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                  {unhandledCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('reviewing')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition bg-[#2f74ff] text-white shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span>待复核</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-blue-600 font-bold">
                  {reviewingCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('archive')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>档案库</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-700 text-slate-200">
                  {archiveCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('overdue')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>逾期事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-600 text-white">
                  {overdueCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('false_alarm')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>误报事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-700 text-white">
                  {falseAlarmCount}
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <span>返回态势大屏</span>
          </button>
        </div>

        {/* 待复核 Main Workspace */}
        <div className="flex-1 overflow-hidden">
          <EventReviewPage
            onBackToHome={onBackToHome}
            onNavigateToTab={(tab) => {
              if (tab === 'unhandled') {
                setActiveSubTab('unhandled');
              } else if (tab === 'home') {
                onBackToHome();
              }
            }}
          />
        </div>
      </div>
    );
  }

  // If activeSubTab === 'archive', render the exact 档案库 page matching user screenshot
  if (activeSubTab === 'archive') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Harmonized sub-tab switcher bar */}
        <div className="h-10 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-semibold">事件管理:</span>
            <div className="flex items-center bg-[#0d1629] p-0.5 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => handleSelectSubTab('unhandled')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>未处置</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                  {unhandledCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('reviewing')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>待复核</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-600/80 text-white">
                  {reviewingCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('archive')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition bg-[#2f74ff] text-white shadow-xs"
              >
                <Archive className="w-3.5 h-3.5 text-white" />
                <span>档案库</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-blue-600 font-bold">
                  {archiveCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('overdue')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>逾期事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-600 text-white">
                  {overdueCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('false_alarm')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>误报事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-700 text-white">
                  {falseAlarmCount}
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <span>返回态势大屏</span>
          </button>
        </div>

        {/* 档案库 Main Workspace */}
        <div className="flex-1 overflow-hidden">
          <EventArchivePage
            onBackToHome={onBackToHome}
            onNavigateToTab={(tab) => {
              if (tab === 'unhandled') {
                setActiveSubTab('unhandled');
              } else if (tab === 'home') {
                onBackToHome();
              }
            }}
          />
        </div>
      </div>
    );
  }

  // If activeSubTab === 'overdue', render the exact 逾期事件 page matching user screenshot
  if (activeSubTab === 'overdue') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Harmonized sub-tab switcher bar */}
        <div className="h-10 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-semibold">事件管理:</span>
            <div className="flex items-center bg-[#0d1629] p-0.5 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => handleSelectSubTab('unhandled')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>未处置</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                  {unhandledCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('reviewing')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>待复核</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-600/80 text-white">
                  {reviewingCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('archive')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>档案库</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-700 text-slate-200">
                  {archiveCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('overdue')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition bg-[#2f74ff] text-white shadow-xs"
              >
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>逾期事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-blue-600 font-bold">
                  {overdueCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('false_alarm')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>误报事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-700 text-white">
                  {falseAlarmCount}
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <span>返回态势大屏</span>
          </button>
        </div>

        {/* 逾期事件 Main Workspace */}
        <div className="flex-1 overflow-hidden">
          <EventOverduePage
            onBackToHome={onBackToHome}
            onNavigateToTab={(tab) => {
              if (tab === 'unhandled') {
                setActiveSubTab('unhandled');
              } else if (tab === 'home') {
                onBackToHome();
              }
            }}
          />
        </div>
      </div>
    );
  }

  // If activeSubTab === 'false_alarm', render the exact 误报事件 page matching user screenshot
  if (activeSubTab === 'false_alarm') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Harmonized sub-tab switcher bar */}
        <div className="h-10 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-semibold">事件管理:</span>
            <div className="flex items-center bg-[#0d1629] p-0.5 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => handleSelectSubTab('unhandled')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>未处置</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                  {unhandledCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('reviewing')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>待复核</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-600/80 text-white">
                  {reviewingCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('archive')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>档案库</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-700 text-slate-200">
                  {archiveCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('overdue')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-slate-400 hover:text-slate-200"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>逾期事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-600 text-white">
                  {overdueCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectSubTab('false_alarm')}
                className="px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition bg-[#2f74ff] text-white shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span>误报事件</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-purple-700 font-bold">
                  {falseAlarmCount}
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <span>返回态势大屏</span>
          </button>
        </div>

        {/* 误报事件 Main Workspace */}
        <div className="flex-1 overflow-hidden">
          <EventFalseAlarmPage
            onBackToHome={onBackToHome}
            onNavigateToTab={(tab) => {
              if (tab === 'unhandled') {
                setActiveSubTab('unhandled');
              } else if (tab === 'home') {
                onBackToHome();
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060911] text-slate-100 overflow-hidden select-none">
      {/* Toast feedback */}
      {successToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. Top Sub-Navigation Header Bar (Harmonized with left sidebar sub-tabs) */}
      <div className="h-12 bg-[#090e1c] border-b border-cyan-500/20 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">事件管理</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-300 font-bold">
              {activeSubTab === 'unhandled' ? '未处置工单中心' :
               (activeSubTab as string) === 'archive' ? '档案库数据库' :
               (activeSubTab as string) === 'overdue' ? '逾期督办事件专区' :
               (activeSubTab as string) === 'false_alarm' ? '误报归档事件专区' :
               activeSubTab === 'processing' ? '处置中协同跟踪' :
               activeSubTab === 'completed' ? '已结案归档库' : '全量工单综合'}
            </span>
          </div>

          {/* Sub-tabs switcher (matching left sidebar 5 items + processing + all) */}
          <div className="flex items-center bg-[#0d1629] p-0.5 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => handleSelectSubTab('unhandled')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                activeSubTab === 'unhandled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>未处置</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                {unhandledCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('reviewing')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                (activeSubTab as string) === 'reviewing'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>待复核</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-600/80 text-white">
                {reviewingCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('archive')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                (activeSubTab as string) === 'archive'
                  ? 'bg-slate-700 text-slate-100 border border-slate-500 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-slate-300" />
              <span>档案库</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-700 text-slate-200">
                {archiveCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('overdue')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                (activeSubTab as string) === 'overdue'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>逾期事件</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-600 text-white">
                {overdueCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('false_alarm')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                (activeSubTab as string) === 'false_alarm'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>误报事件</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-700 text-white">
                {falseAlarmCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('processing')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                activeSubTab === 'processing'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>处置中</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-900 text-cyan-300">
                {processingCount}
              </span>
            </button>

            <button
              onClick={() => handleSelectSubTab('all')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                activeSubTab === 'all'
                  ? 'bg-slate-700 text-white border border-slate-500 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>全部</span>
            </button>
          </div>
        </div>

        {/* Right side operations */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>数据截止: 2026-10-19 近期动态</span>
            <span className="text-cyan-500">·</span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              实时同步中
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={() => showToast('数据已刷新为最新抓拍研判结果')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="刷新数据"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => showToast('已成功导出未处置事件报表 (Excel)')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>导出工单</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-medium transition shadow-md"
          >
            返回首页大屏
          </button>
        </div>
      </div>

      {/* 2. Top Metrics & Quick KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-3.5 bg-[#080d19] border-b border-cyan-500/20 shrink-0">
        <div 
          onClick={() => { setSelectedLevel('all'); setSelectedCategory('all'); }}
          className={`p-2.5 rounded-lg border transition cursor-pointer ${
            selectedLevel === 'all' && selectedCategory === 'all'
              ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
              : 'bg-[#0d1629] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>未处置总数</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1 flex items-baseline gap-1.5">
            <span>{unhandledCount}</span>
            <span className="text-[10px] text-slate-400 font-normal">件</span>
            <span className="text-[10px] text-rose-400 ml-auto">待派发</span>
          </div>
        </div>

        <div 
          onClick={() => setSelectedLevel('特急')}
          className={`p-2.5 rounded-lg border transition cursor-pointer ${
            selectedLevel === '特急'
              ? 'bg-rose-950/40 border-rose-500/50 shadow-md'
              : 'bg-[#0d1629] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>特急重点待派</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1 flex items-baseline gap-1.5">
            <span>{urgentCount}</span>
            <span className="text-[10px] text-slate-400 font-normal">件</span>
            <span className="text-[10px] text-rose-400 ml-auto">限时30分</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0d1629] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>超时未响应告警</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1 flex items-baseline gap-1.5">
            <span>{timeoutCount}</span>
            <span className="text-[10px] text-slate-400 font-normal">件</span>
            <span className="text-[10px] text-amber-400 ml-auto font-mono">超时预警</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0d1629] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>今日近期新增</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1 flex items-baseline gap-1.5">
            <span>{todayNewCount}</span>
            <span className="text-[10px] text-slate-400 font-normal">件</span>
            <span className="text-[10px] text-emerald-400 ml-auto">10-19</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0d1629] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>平均派单时效</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-baseline gap-1.5">
            <span>6.4</span>
            <span className="text-[10px] text-slate-400 font-normal">分钟</span>
            <span className="text-[10px] text-emerald-400 ml-auto">提速24%</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0d1629] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI自动核验率</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1 flex items-baseline gap-1.5">
            <span>98.6</span>
            <span className="text-[10px] text-slate-400 font-normal">%</span>
            <span className="text-[10px] text-cyan-400 ml-auto">高精研判</span>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Filter & Search Toolbar */}
      <div className="p-3 bg-[#0a1020] border-b border-cyan-500/20 shrink-0 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Left search & filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
            {/* Search Input */}
            <div className="relative w-64 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="搜索事件编号、地点、当事人或描述..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-[#0d172e] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 text-xs"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0d172e] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">全部分类 ({eventsList.length})</option>
              <option value="街面秩序">街面秩序 (违停/占道/单车)</option>
              <option value="市容环境">市容环境 (出店/垃圾/堆物)</option>
              <option value="施工管理">施工管理 (渣土/扬尘/围挡)</option>
              <option value="突发隐患">突发隐患 (线缆/坍塌/险情)</option>
              <option value="市政设施">市政设施 (井盖/路面/护栏)</option>
              <option value="户外广告">户外广告 (违规条幅/招牌)</option>
              <option value="生态环境">生态环境 (餐饮油烟/泔水)</option>
            </select>

            {/* Urgency Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#0d172e] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">全部等级</option>
              <option value="特急">特急 (30分钟限时)</option>
              <option value="紧急">紧急 (60-90分钟)</option>
              <option value="一般">一般 (120-240分钟)</option>
            </select>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-[#0d172e] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">全部行政区</option>
              <option value="青秀区">青秀区</option>
              <option value="西乡塘区">西乡塘区</option>
              <option value="良庆区">良庆区</option>
              <option value="江南区">江南区</option>
              <option value="兴宁区">兴宁区</option>
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-[#0d172e] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
            >
              <option value="all">全部事件来源</option>
              <option value="AI视频">AI视频智能抓拍</option>
              <option value="网格员">网格巡查员上报</option>
              <option value="12345">12345便民热线转办</option>
              <option value="移动巡检">移动车载AI巡检</option>
              <option value="无人机">无人机航测巡检</option>
            </select>

            {/* Date Range Quick Selector */}
            <div className="flex items-center bg-[#0d172e] border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => setDateRangeFilter('today')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  dateRangeFilter === 'today' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                今日(10-19)
              </button>
              <button
                onClick={() => setDateRangeFilter('recent')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  dateRangeFilter === 'recent' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                近期全部(10-18~19)
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="重置检索条件"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right actions: batch dispatch & view switcher */}
          <div className="flex items-center gap-2">
            {selectedEventIds.length > 0 && (
              <button
                onClick={() => setIsBatchDispatchOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>批量派发 ({selectedEventIds.length})</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0d172e] border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="卡片网格视图"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition ${
                  viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="表格列表视图"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Batch selection summary bar if items selected */}
        {selectedEventIds.length > 0 && (
          <div className="flex items-center justify-between bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>已勾选 <strong>{selectedEventIds.length}</strong> 项待处置事件</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedEventIds([])}
                className="text-slate-400 hover:text-white transition"
              >
                取消全选
              </button>
              <button
                onClick={() => {
                  selectedEventIds.forEach(id => handleIgnoreEvent(id));
                  setSelectedEventIds([]);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs"
              >
                批量忽略
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Main Event Cards / Table List Content Area */}
      <div className="flex-1 overflow-y-auto p-4 select-text">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-600 animate-pulse" />
            <p className="text-sm">没有检索到符合条件的待处置事件</p>
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
            >
              清除所有筛选条件
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
            {filteredEvents.map((item) => {
              const isSelected = selectedEventIds.includes(item.id);
              const isTimeout = item.elapsedMinutes > item.deadlineMinutes;

              return (
                <div
                  key={item.id}
                  className={`bg-[#0a1020] rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xl relative group ${
                    isSelected
                      ? 'border-cyan-400 ring-1 ring-cyan-400 bg-[#0d162d]'
                      : item.level === '特急'
                      ? 'border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/10'
                      : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleSelect(item.id)}
                        className="text-slate-400 hover:text-cyan-400 transition shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {/* Event ID */}
                      <span className="font-mono text-xs font-bold text-cyan-400 truncate">
                        {item.id}
                      </span>

                      {/* Status Tag */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.status}
                      </span>
                    </div>

                    {/* Source label */}
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                      <Camera className="w-3 h-3 text-cyan-500" />
                      {item.source}
                    </span>
                  </div>

                  {/* Card Visual Scene Snapshot */}
                  <div className="p-3 pb-0">
                    {renderEventSnapshot(item)}
                  </div>

                  {/* Card Body Information */}
                  <div className="p-3.5 space-y-2.5 flex-1">
                    {/* Event Title */}
                    <h3 
                      onClick={() => setDetailEvent(item)}
                      className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer line-clamp-2 leading-relaxed transition"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Address & Grid */}
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] pl-5 font-mono">
                        <span>{item.district} · {item.street}</span>
                        <span>·</span>
                        <span className="text-cyan-400">{item.gridCode}</span>
                      </div>
                    </div>

                    {/* Timing & Countdown Warning */}
                    <div className="flex items-center justify-between text-[11px] bg-[#070b16] p-2 rounded-lg border border-slate-800/80">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>抓拍: {item.reportTime.split(' ')[1]}</span>
                      </div>

                      {/* Countdown badge */}
                      {isTimeout ? (
                        <span className="text-rose-400 font-mono text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          已超时 {item.elapsedMinutes - item.deadlineMinutes}分
                        </span>
                      ) : (
                        <span className="text-cyan-400 font-mono text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          剩余 {item.deadlineMinutes - item.elapsedMinutes}分限时
                        </span>
                      )}
                    </div>

                    {/* Nearby Patrol Resource Recommendation */}
                    {item.nearbyOfficer && (
                      <div className="flex items-center justify-between text-[10px] bg-cyan-950/30 border border-cyan-500/20 px-2 py-1.5 rounded text-cyan-300">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-cyan-400" />
                          {item.nearbyOfficer.name}
                        </span>
                        <span className="font-mono text-emerald-400">距离 {item.nearbyOfficer.distance} ({item.nearbyOfficer.status})</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-3 bg-[#080d1a] border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailEvent(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1 flex-1 justify-center border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>查看详情</span>
                    </button>

                    <button
                      onClick={() => {
                        setTransferringEvent(item);
                        setIsTransferModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
                      title="移交/转办其他部门"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDispatchingEvent(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-1 flex-1 justify-center active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>指派处置</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-[#0a1020] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080d19] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3 w-10">
                      <button onClick={handleSelectAll} className="text-slate-400 hover:text-cyan-400">
                        {selectedEventIds.length === filteredEvents.length && filteredEvents.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-3">事件编号</th>
                    <th className="py-3 px-3">等级</th>
                    <th className="py-3 px-3">分类 / 事项</th>
                    <th className="py-3 px-4">现场抓拍</th>
                    <th className="py-3 px-4">发生地址与网格</th>
                    <th className="py-3 px-3">事件来源</th>
                    <th className="py-3 px-3">抓拍时间</th>
                    <th className="py-3 px-3">时限状态</th>
                    <th className="py-3 px-4 text-right">处置操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-normal text-slate-200">
                  {filteredEvents.map((item) => {
                    const isSelected = selectedEventIds.includes(item.id);
                    const isTimeout = item.elapsedMinutes > item.deadlineMinutes;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/50 transition ${
                          isSelected ? 'bg-cyan-950/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <button onClick={() => handleToggleSelect(item.id)}>
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-cyan-400">
                          {item.id}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.level === '特急' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            item.level === '紧急' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}>
                            {item.level}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-white">{item.subType}</div>
                          <div className="text-[10px] text-slate-400">{item.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div 
                            onClick={() => setPreviewImageEvent(item)}
                            className="w-20 h-11 bg-slate-900 rounded border border-slate-700 overflow-hidden relative cursor-pointer hover:border-cyan-400 transition"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                              <Camera className="w-4 h-4 text-cyan-400 opacity-60" />
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-cyan-300 bg-black/80 px-1 rounded">
                              {(item.aiConfidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="text-white truncate" title={item.address}>{item.address}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.district} · {item.gridCode}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 text-[11px]">
                          <div>{item.source}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.sourceDevice.split(' ')[0]}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                          {item.reportTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isTimeout ? (
                            <span className="text-rose-400 font-mono text-[10px] font-bold flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              超时 {item.elapsedMinutes - item.deadlineMinutes}分
                            </span>
                          ) : (
                            <span className="text-cyan-400 font-mono text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              剩 {item.deadlineMinutes - item.elapsedMinutes}分
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailEvent(item)}
                              className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => setDispatchingEvent(item)}
                              className="text-xs text-white px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 font-medium transition shadow"
                            >
                              派发
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Pagination & Stats Footer Bar */}
      <div className="h-12 bg-[#090e1c] border-t border-cyan-500/20 px-4 flex items-center justify-between shrink-0 text-xs text-slate-400 z-20">
        <div className="flex items-center gap-3">
          <span>共 <strong>{filteredEvents.length}</strong> 条未处置事件记录</span>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            disabled
            className="p-1 rounded bg-slate-800/50 text-slate-600 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </button>
          <button className="w-7 h-7 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center justify-center transition">
            2
          </button>
          <button className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="ml-2 text-slate-500 text-[11px]">前往第 1/2 页</span>
        </div>
      </div>



      {/* MODAL 2: Single Event Dispatch Modal */}
      {dispatchingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border border-cyan-500/40 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#080d19] border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  派发处置工单 · {dispatchingEvent.id}
                </h3>
              </div>
              <button
                onClick={() => setDispatchingEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#080e1b] p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="text-cyan-300 font-semibold">{dispatchingEvent.title}</div>
                <div className="text-slate-400 text-[11px]">{dispatchingEvent.address}</div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">指定承办部门 / 执法中队</label>
                <select
                  value={dispatchDepartment}
                  onChange={(e) => setDispatchDepartment(e.target.value)}
                  className="w-full bg-[#0d172e] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="青秀区城市管理综合行政执法大队">青秀区城市管理综合行政执法大队 (民族中队)</option>
                  <option value="西乡塘区城市管理综合行政执法大队">西乡塘区城市管理综合行政执法大队 (衡阳中队)</option>
                  <option value="良庆区城市管理综合行政执法大队">良庆区城市管理综合行政执法大队 (蟠龙中队)</option>
                  <option value="江南区城市管理综合行政执法大队">江南区城市管理综合行政执法大队</option>
                  <option value="市政设施应急抢修快速响应中心">市政设施应急抢修快速响应中心</option>
                  <option value="智慧城管第三方环卫保洁项目部">智慧城管第三方环卫保洁项目部</option>
                </select>
              </div>

              {/* Target Type */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">指派执勤力量</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('officer')}
                    className={`p-2 rounded-lg border text-center transition ${
                      dispatchTargetType === 'officer'
                        ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                        : 'bg-[#0d172e] border-slate-700 text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <span>网格执法队员</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('car')}
                    className={`p-2 rounded-lg border text-center transition ${
                      dispatchTargetType === 'car'
                        ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                        : 'bg-[#0d172e] border-slate-700 text-slate-300'
                    }`}
                  >
                    <Truck className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span>巡逻执勤车辆</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchTargetType('grid')}
                    className={`p-2 rounded-lg border text-center transition ${
                      dispatchTargetType === 'grid'
                        ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                        : 'bg-[#0d172e] border-slate-700 text-slate-300'
                    }`}
                  >
                    <Layers className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span>网格责任单位</span>
                  </button>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">规定办结时限</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '30m', label: '30分钟内 (特急)' },
                    { id: '1h', label: '1小时内 (标准)' },
                    { id: '2h', label: '2小时内' },
                    { id: 'today', label: '当日办结' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDispatchDeadline(d.id as any)}
                      className={`py-1.5 px-2 rounded-lg border text-center text-[11px] transition ${
                        dispatchDeadline === d.id
                          ? 'bg-cyan-600/40 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-[#0d172e] border-slate-700 text-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">处置指令说明与规范要求</label>
                <textarea
                  rows={3}
                  value={dispatchInstructions}
                  onChange={(e) => setDispatchInstructions(e.target.value)}
                  className="w-full bg-[#0d172e] border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-hidden focus:border-cyan-500 resize-none"
                />
              </div>

              {/* SMS toggle */}
              <div className="flex items-center justify-between bg-[#080e1b] p-3 rounded-lg border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-medium text-white">同步发送执勤手机短信及城管App推送</div>
                  <div className="text-[10px] text-slate-400">将精准GPS导航坐标与抓拍图发送至接收人</div>
                </div>
                <input
                  type="checkbox"
                  checked={sendSmsNotification}
                  onChange={(e) => setSendSmsNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-[#080d19] border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setDispatchingEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                取消
              </button>
              <button
                onClick={() => handleConfirmDispatch(dispatchingEvent)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                确认下发指令
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Batch Dispatch Modal */}
      {isBatchDispatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border border-cyan-500/40 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#080d19] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                批量派发处置 ({selectedEventIds.length} 项)
              </h3>
              <button
                onClick={() => setIsBatchDispatchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-300">
                您即将批量指派 <strong>{selectedEventIds.length}</strong> 项待处置事件至所属网格执法力量。系统将根据各事件地理位置自动智能匹配最近的执勤网格员。
              </p>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">统一时限要求</label>
                <select className="w-full bg-[#0d172e] border border-slate-700 rounded-lg p-2 text-white text-xs">
                  <option>按各事件紧急程度自动智能匹配</option>
                  <option>统一要求 1 小时内现场处置</option>
                  <option>统一要求 2 小时内现场处置</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">统一督办批示备注</label>
                <textarea
                  rows={2}
                  defaultValue="请各执勤组迅速响应核实，确保市容市貌恢复合规标准。"
                  className="w-full bg-[#0d172e] border border-slate-700 rounded-lg p-2 text-white text-xs resize-none"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-[#080d19] border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsBatchDispatchOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmBatchDispatch}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
              >
                确认批量派发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Transfer / Forward Modal */}
      {isTransferModalOpen && transferringEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border border-cyan-500/40 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-[#080d19] border-b border-cyan-500/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                移交转办其他委办局 · {transferringEvent.id}
              </h3>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#080e1b] p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="text-white font-medium">{transferringEvent.title}</div>
                <div className="text-slate-400 text-[11px]">{transferringEvent.address}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">转办目标主管单位</label>
                <select className="w-full bg-[#0d172e] border border-slate-700 rounded-lg p-2 text-white text-xs">
                  <option>南宁市公安局交警支队 (机动车违停/路权管理)</option>
                  <option>南宁市生态环境局 (餐饮油烟/工业噪音/水体污染)</option>
                  <option>南宁市市政和园林管理局 (绿化树木/市政管道/井盖)</option>
                  <option>南宁市住房和城乡建设局 (房屋结构/拆迁扬尘/建筑安全)</option>
                  <option>南宁市市场监督管理局 (无照经营/商户营业执照)</option>
                  <option>12345政务服务便民热线中心 (退回重派)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">转办移交原因说明</label>
                <textarea
                  rows={3}
                  defaultValue="经现场AI识别与初步核实，该事件权属属于行业主管单位职能范畴，建议由交管或市政专业部门直接跟进处置并实施专业抢修。"
                  className="w-full bg-[#0d172e] border border-slate-700 rounded-lg p-2 text-white text-xs resize-none"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-[#080d19] border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setEventsList(prev => prev.filter(e => e.id !== transferringEvent.id));
                  setIsTransferModalOpen(false);
                  showToast(`工单 ${transferringEvent.id} 已成功转办移交至目标职能单位！`);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
              >
                确认转办
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: High-Res Image Inspection Preview Modal */}
      {previewImageEvent && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#091122] border border-cyan-500/40 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-4 py-3 bg-[#060a14] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  现场抓拍高分辨率图像取证 · {previewImageEvent.id}
                </span>
              </div>
              <button
                onClick={() => setPreviewImageEvent(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="h-80 w-full rounded-lg overflow-hidden border border-slate-700 relative">
                {renderEventSnapshot(previewImageEvent)}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2 rounded font-mono">
                <span>设备: {previewImageEvent.sourceDevice}</span>
                <span>地点: {previewImageEvent.address}</span>
                <span>时间: {previewImageEvent.reportTime}</span>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-[#060a14] border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewImageEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
