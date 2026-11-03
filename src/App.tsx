/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapGIS } from './components/MapGIS';
import { AICoverageCard } from './components/AICoverageCard';
import { EventTypeRankingCard } from './components/EventTypeRankingCard';
import { PeakHourChartCard } from './components/PeakHourChartCard';
import { EventHandlingCard } from './components/EventHandlingCard';
import { StreetStatsCard } from './components/StreetStatsCard';
import { EventOverviewDonutCard } from './components/EventOverviewDonutCard';
import { CameraStreamModal } from './components/CameraStreamModal';
import { PatrolVehicleModal } from './components/PatrolVehicleModal';
import { AlertDrawer } from './components/AlertDrawer';
import { SearchModal } from './components/SearchModal';
import { OtherTabsView } from './components/OtherTabsView';
import { RealtimeAlertsPage } from './components/RealtimeAlertsPage';
import { VideoSurveillancePage } from './components/VideoSurveillancePage';
import { PatrolManagementPage } from './components/PatrolManagementPage';
import { EventManagementPage } from './components/EventManagementPage';
import { SubjectManagementPage } from './components/SubjectManagementPage';
import { StatisticalReportsPage } from './components/StatisticalReportsPage';
import { SystemManagementPage } from './components/SystemManagementPage';
import { LoginPage } from './components/LoginPage';
import { LeftSidebar } from './components/LeftSidebar';
import { 
  AI_CAMERAS, 
  PATROL_VEHICLES, 
  GOVERNANCE_ALERTS, 
  EVENT_TYPE_RANKING, 
  HOURLY_STATS, 
  STREET_STATS, 
  OVERVIEW_STATS, 
  KPIS 
} from './data/mockData';
import { CameraDevice, PatrolVehicle, GovernanceAlert, AppTheme, MapDisplayMode } from './types';
import { 
  Radio, 
  Send, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [theme, setTheme] = useState<AppTheme>('tactical-dark');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('tactical');

  // Sidebar toggle state for clean viewport flexibility
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<PatrolVehicle | null>(null);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [alertsList, setAlertsList] = useState<GovernanceAlert[]>(GOVERNANCE_ALERTS);

  const handleSelectCamera = (camera: CameraDevice) => {
    setSelectedCamera(camera);
  };

  const handleSelectVehicle = (vehicle: PatrolVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSelectAlertLocation = (alert: GovernanceAlert) => {
    const matchedCam = AI_CAMERAS.find((c) => c.code === alert.deviceId || c.name.includes(alert.street));
    if (matchedCam) {
      setSelectedCamera(matchedCam);
    }
    setIsAlertDrawerOpen(false);
  };

  const handleDispatchAlert = (alertIdOrCam: string | CameraDevice) => {
    if (typeof alertIdOrCam === 'string') {
      setAlertsList((prev) =>
        prev.map((a) => (a.id === alertIdOrCam ? { ...a, status: '待复核' as const } : a))
      );
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden select-none ${
      theme === 'clean-light' ? 'theme-light bg-slate-100 text-slate-800' : 'bg-[#060911] text-slate-100'
    }`}>
      {/* 1. Primary Left Navigation Menu */}
      <LeftSidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        alertCount={KPIS.activeAlertsCount}
        onToggleAlertDrawer={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mission Control Top Header Bar */}
        <Header
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleAlertDrawer={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
          alertCount={KPIS.activeAlertsCount}
          theme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          mapMode={mapMode}
          onMapModeChange={(mode) => setMapMode(mode)}
          onLogout={() => setIsLoggedIn(false)}
        />

        {/* Dynamic Viewports */}
        {currentTab === 'home' ? (
          <div className="relative flex-1 w-full h-full overflow-hidden">
            {/* A. Dark Tactical Digital Twin Vector GIS Map */}
            <MapGIS
              cameras={AI_CAMERAS}
              vehicles={PATROL_VEHICLES}
              activeAlertCount={KPIS.activeAlertsCount}
              onSelectCamera={handleSelectCamera}
              onSelectVehicle={handleSelectVehicle}
              onToggleAlertDrawer={() => setIsAlertDrawerOpen(true)}
              mapMode={mapMode}
              theme={theme}
            />

            {/* B. Floating Left Panels Container */}
            <div className="absolute top-3 bottom-3 left-3 z-20 pointer-events-auto flex items-stretch gap-1.5">
              {showLeftPanel ? (
                <div className="w-[300px] xl:w-[335px] h-full flex flex-col justify-between gap-3 overflow-y-auto overflow-x-hidden pr-0.5">
                  {/* 1. AI物联感知全景 */}
                  <AICoverageCard
                    camerasCount={KPIS.aiCameras}
                    vehiclesCount={KPIS.mobileVehicles}
                    onFilterType={(type) => {
                      if (type === 'camera') setSelectedCamera(AI_CAMERAS[0]);
                      if (type === 'vehicle') setSelectedVehicle(PATROL_VEHICLES[0]);
                    }}
                  />

                  {/* 2. 事件类型高频排行 */}
                  <EventTypeRankingCard
                    items={EVENT_TYPE_RANKING}
                    onSelectItem={(name) => {
                      const target = AI_CAMERAS.find((c) => 
                        c.detections.some((d) => d.label.includes(name))
                      ) || AI_CAMERAS[0];
                      setSelectedCamera(target);
                    }}
                  />

                  {/* 3. 高发时段潮汐研判 */}
                  <PeakHourChartCard data={HOURLY_STATS} />
                </div>
              ) : null}

              {/* Left Panel Toggle Button */}
              <button
                onClick={() => setShowLeftPanel(!showLeftPanel)}
                title={showLeftPanel ? '收起左侧面板' : '展开左侧面板'}
                className="self-start mt-2 p-1 rounded-r-md bg-[#0b1324]/90 border border-l-0 border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-950 transition shadow-lg"
              >
                {showLeftPanel ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* C. Floating Right Panels Container */}
            <div className="absolute top-3 bottom-3 right-3 z-20 pointer-events-auto flex items-stretch gap-1.5">
              {/* Right Panel Toggle Button */}
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? '收起右侧面板' : '展开右侧面板'}
                className="self-start mt-2 p-1 rounded-l-md bg-[#0b1324]/90 border border-r-0 border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-950 transition shadow-lg"
              >
                {showRightPanel ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>

              {showRightPanel ? (
                <div className="w-[300px] xl:w-[335px] h-full flex flex-col justify-between gap-3 overflow-y-auto overflow-x-hidden pr-0.5">
                  {/* 1. 处置闭环实效研判 */}
                  <EventHandlingCard
                    warningCount={KPIS.warningEvents}
                    violationCount={KPIS.violationEvents}
                    handledCount={KPIS.handledEvents}
                    onFilterStatus={() => setIsAlertDrawerOpen(true)}
                  />

                  {/* 2. 各街道事件负荷统计 */}
                  <StreetStatsCard
                    data={STREET_STATS}
                    onSelectStreet={(street) => {
                      const camInStreet = AI_CAMERAS.find((c) => c.street.includes(street)) || AI_CAMERAS[0];
                      setSelectedCamera(camInStreet);
                    }}
                  />

                  {/* 3. 事件概况状态分析 */}
                  <EventOverviewDonutCard
                    stats={OVERVIEW_STATS}
                    onFilterStatus={() => setIsAlertDrawerOpen(true)}
                  />
                </div>
              ) : null}
            </div>

            {/* D. Floating Tactical Fast-Action Command Strip */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 bg-[#080e1c]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-2xl">
              <button
                onClick={() => setIsAlertDrawerOpen(true)}
                className="px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-500/30 transition active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>处置待办 ({KPIS.activeAlertsCount})</span>
              </button>

              <span className="text-slate-700">|</span>

              <button
                onClick={() => setSelectedCamera(AI_CAMERAS[0])}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>重点监控</span>
              </button>

              <button
                onClick={() => setSelectedVehicle(PATROL_VEHICLES[0])}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>派单巡防</span>
              </button>
            </div>
          </div>
        ) : currentTab === 'surveillance' ? (
          <VideoSurveillancePage
            onBackToHome={() => setCurrentTab('home')}
            onOpenAlerts={() => setCurrentTab('alerts')}
            onNavigateToPatrol={() => setCurrentTab('patrol')}
            theme={theme}
          />
        ) : currentTab === 'patrol' ? (
          <PatrolManagementPage
            onBackToHome={() => setCurrentTab('home')}
            onNavigateToSurveillance={() => setCurrentTab('surveillance')}
            onNavigateToAlerts={() => setCurrentTab('alerts')}
            theme={theme}
          />
        ) : currentTab === 'alerts' ? (
          <RealtimeAlertsPage
            onBackToHome={() => setCurrentTab('home')}
            onNavigateToSurveillance={() => setCurrentTab('surveillance')}
            onNavigateToPatrol={() => setCurrentTab('patrol')}
            onNavigateToMapTarget={(cameraCode) => {
              const cam = AI_CAMERAS.find((c) => c.code === cameraCode);
              if (cam) {
                setSelectedCamera(cam);
              }
              setCurrentTab('home');
            }}
            theme={theme}
          />
        ) : currentTab === 'events' || currentTab.startsWith('events') ? (
          <EventManagementPage
            onBackToHome={() => setCurrentTab('home')}
            onNavigateToAlerts={() => setCurrentTab('alerts')}
            onNavigateToSurveillance={() => setCurrentTab('surveillance')}
            onNavigateToPatrol={() => setCurrentTab('patrol')}
            theme={theme}
            currentSubTab={
              currentTab === 'events_unhandled' ? 'unhandled' :
              currentTab === 'events_reviewing' ? 'reviewing' :
              currentTab === 'events_archive' ? 'archive' :
              currentTab === 'events_overdue' ? 'overdue' :
              currentTab === 'events_false_alarm' ? 'false_alarm' :
              'unhandled'
            }
            onSubTabChange={(sub) => {
              setCurrentTab(`events_${sub}`);
            }}
          />
        ) : currentTab === 'entities' || currentTab.startsWith('subjects_') ? (
          <SubjectManagementPage
            onBackToHome={() => setCurrentTab('home')}
            currentSubTab={currentTab === 'subjects_cancelled' ? 'cancelled' : 'enterprise'}
            onSubTabChange={(sub) => {
              setCurrentTab(`subjects_${sub}`);
            }}
            theme={theme}
          />
        ) : currentTab === 'reports' ? (
          <StatisticalReportsPage
            onBackToHome={() => setCurrentTab('home')}
            theme={theme}
          />
        ) : currentTab === 'system' || currentTab.startsWith('system') ? (
          <SystemManagementPage
            onBackToHome={() => setCurrentTab('home')}
            currentSubTab={
              currentTab === 'system_personnel' ? 'personnel' :
              currentTab === 'system_roles' ? 'roles' :
              currentTab === 'system_positions' ? 'positions' :
              currentTab === 'system_menus' ? 'menus' :
              currentTab === 'system_dict' ? 'dict' :
              currentTab === 'system_params' ? 'params' :
              currentTab === 'system_op_logs' ? 'op_logs' :
              currentTab === 'system_login_logs' ? 'login_logs' :
              currentTab === 'system_settings' ? 'settings' :
              'agency'
            }
            onSubTabChange={(sub) => {
              setCurrentTab(`system_${sub}`);
            }}
            theme={theme}
          />
        ) : (
          <OtherTabsView
            currentTab={currentTab}
            onBackToHome={() => setCurrentTab('home')}
            alerts={alertsList}
          />
        )}
      </div>

      {/* 3. Modals & Overlays */}
      <CameraStreamModal
        camera={selectedCamera}
        onClose={() => setSelectedCamera(null)}
        onDispatchAlert={handleDispatchAlert}
      />

      <PatrolVehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      <AlertDrawer
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
        alerts={alertsList}
        onSelectAlertLocation={handleSelectAlertLocation}
        onDispatchAlert={(id) => handleDispatchAlert(id)}
        onOpenFullAlertsPage={() => setCurrentTab('alerts')}
        onOpenSurveillancePage={() => setCurrentTab('surveillance')}
        onOpenPatrolPage={() => setCurrentTab('patrol')}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cameras={AI_CAMERAS}
        vehicles={PATROL_VEHICLES}
        alerts={alertsList}
        onSelectCamera={handleSelectCamera}
        onSelectVehicle={handleSelectVehicle}
        onSelectAlert={handleSelectAlertLocation}
      />
    </div>
  );
}
