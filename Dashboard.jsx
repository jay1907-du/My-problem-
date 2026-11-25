import { AlertOctagon, RotateCcw, Radio } from 'lucide-react';
import Header from '../components/Header';
import StatCards from '../components/StatCards';
import FloodMap from '../components/FloodMap';
import WaterChart from '../components/WaterChart';
import AlertsTable from '../components/AlertsTable';
import EmergencyInfo from '../components/EmergencyInfo';
import AlertPopup from '../components/AlertPopup';
import { useFloodData } from '../hooks/useFloodData';

export default function Dashboard() {
  const {
    stats,
    zones,
    hourlyData,
    sensors,
    emergency,
    selectedZone,
    setSelectedZoneId,
    isSimulating,
    isRefreshing,
    lastUpdated,
    refreshData,
    simulateFlood,
    resetSimulation,
  } = useFloodData();

  const handleEmergencyScroll = () => {
    const el = document.getElementById('emergency-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
        onEmergencyClick={handleEmergencyScroll}
        isSimulating={isSimulating}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Simulation & Telemetry Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 px-5 py-3.5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
              <Radio className="w-4 h-4 text-sky-600" aria-hidden="true" />
              {sensors.length} Telemetry Stations Online
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums text-xs text-slate-500">
              Last synced: {lastUpdated.toLocaleTimeString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isSimulating ? (
              <button
                type="button"
                onClick={resetSimulation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset Simulation</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={simulateFlood}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <AlertOctagon className="w-4 h-4" aria-hidden="true" />
                <span>Simulate Flood</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metric Stat Cards */}
        <StatCards stats={stats} />

        {/* 2-Column Map + Water Level Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <FloodMap
            zones={zones}
            selectedZoneId={selectedZone?.id || null}
            onSelectZone={setSelectedZoneId}
          />
          <WaterChart hourlyData={hourlyData} />
        </div>

        {/* Zone Alerts Table */}
        <AlertsTable zones={zones} onSelectZone={setSelectedZoneId} />

        {/* Emergency Helpline & Shelters */}
        <EmergencyInfo emergency={emergency} />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>FloodGuard - Madhya Pradesh · Bargi &amp; Narmada Hydrological Monitoring System</span>
          <span>Data sourced from CWC Bargi Reservoir &amp; MP / NCA Rainfall Records</span>
        </div>
      </footer>

      <AlertPopup zone={selectedZone} onClose={() => setSelectedZoneId(null)} />
    </div>
  );
}