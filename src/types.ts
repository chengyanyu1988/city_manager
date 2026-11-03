/**
 * Types definition for Smart City Integrated Governance Platform
 */

export interface CameraDevice {
  id: string;
  name: string;
  code: string;
  x: number; // percentage in GIS canvas
  y: number; // percentage in GIS canvas
  status: 'normal' | 'alert';
  type: 'AI高清枪机' | '智能球机' | '全景云台';
  street: string;
  road: string;
  directionDeg: number;
  detections: {
    label: string;
    confidence: number;
    box: [number, number, number, number]; // [top%, left%, width%, height%]
    time: string;
  }[];
  resolution: string;
  fps: number;
  onlineDuration: string;
}

export interface PatrolVehicle {
  id: string;
  plate: string;
  name: string;
  driver: string;
  phone: string;
  x: number;
  y: number;
  speed: number;
  battery: number;
  status: 'patrolling' | 'handling' | 'idle';
  street: string;
  inspectionsToday: number;
  anomaliesFound: number;
}

export interface GovernanceAlert {
  id: string;
  type: '机动车乱停放' | '违规户外广告' | '出店经营' | '物料堆放' | '渣土车检测' | '消防通道占用' | '非机动车乱放';
  level: '紧急' | '重要' | '一般';
  location: string;
  street: string;
  time: string;
  status: '未处置' | '待复核' | '已处置' | '已存档';
  source: 'AI摄像头' | '车载AI巡检' | '网格员上报' | '12345热线';
  deviceId: string;
  confidence: number;
  description: string;
  handler?: string;
}

export interface EventTypeRankingItem {
  rank: number;
  name: string;
  count: number;
  percentage: number;
}

export interface HourlyStatItem {
  hour: string;
  count: number;
}

export interface StreetStatItem {
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

export type AppTheme = 'tactical-dark' | 'digital-twin' | 'clean-light';
export type MapDisplayMode = 'tactical' | 'satellite' | 'heatmap' | 'twin';

