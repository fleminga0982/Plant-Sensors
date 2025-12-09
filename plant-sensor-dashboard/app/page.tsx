'use client';

import React, { useEffect, useState } from 'react';
import PlantCard from '@/components/PlantCard';
import PlantIdentificationModal from '@/components/PlantIdentificationModal';
import { Leaf, Activity, CheckCircle, AlertTriangle, Plus, Wind, Droplets } from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  imageData: string | null;
  lastReading: any;
  healthAnalysis: any;
  historicalReadings: any[];
}

export default function DashboardPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      if (!response.ok) throw new Error('Failed to fetch plants');
      const data = await response.json();

      // Transform API data to match component expectations
      const transformedPlants = data.map((plant: any) => ({
        ...plant,
        historicalReadings: [],
        healthAnalysis: {
          status: 'good' as const,
          needsWater: false,
          needsLight: false,
          recommendations: [],
          geminiAnalysis: ''
        }
      }));

      setPlants(transformedPlants);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handlePlantAdded = () => {
    setShowAddModal(false);
    fetchPlants(); // Refresh the list
  };

  // Calculate overall stats
  const stats = {
    total: plants.length,
    excellent: plants.filter((p: any) => p.healthAnalysis?.status === 'excellent').length,
    warning: plants.filter((p: any) => p.healthAnalysis?.status === 'warning').length,
    critical: plants.filter((p: any) => p.healthAnalysis?.status === 'critical').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse-glow" />
          <Activity className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6 relative z-10" />
          <p className="text-gray-400 text-lg font-medium tracking-wide animate-pulse">Syncing Ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 sm:px-12 lg:px-24 py-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase">Plant Sensor Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Indoor Jungle</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Real-time monitoring and AI-powered insights for your botanical collection.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-8 md:mt-0 group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Add New Plant
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Total Plants */}
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Plants</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          </div>

          {/* Thriving */}
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Thriving</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{stats.excellent}</p>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  {stats.total > 0 ? Math.round((stats.excellent / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Needs Attention</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{stats.warning}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stats.warning > 0 ? 'text-amber-400 bg-amber-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                  {stats.warning} Alerts
                </span>
              </div>
            </div>
          </div>

          {/* Avg Humidity */}
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Droplets className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Humidity</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">45%</p>
                <span className="text-xs text-blue-400 font-medium bg-blue-400/10 px-2 py-0.5 rounded-full">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
              <Leaf className="w-16 h-16 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Your sanctuary is empty</h3>
            <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">
              Start building your digital garden by adding your first plant sensor.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30"
            >
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {plants.map((plant, index) => (
              <div key={plant.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-32 text-center border-t border-white/5 pt-12 pb-12">
          <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Wind className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-gray-500">
              Powered by Gemini AI • Real-time Eco-Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Add Plant Modal */}
      <PlantIdentificationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPlantAdded={handlePlantAdded}
      />
    </div>
  );
}