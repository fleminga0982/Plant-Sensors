'use client';

import React, { useEffect, useState } from 'react';
import PlantCard from '@/components/PlantCard';
import PlantIdentificationModal from '@/components/PlantIdentificationModal';
import { Leaf, Activity, AlertCircle, CheckCircle, Plus } from 'lucide-react';

interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  imageData: string | null;
  lastReading: any;
  healthAnalysis: any;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                Plant Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Monitor your plants in real-time</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-gray-400">Total Plants</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-green-500/30 bg-green-500/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.excellent}</p>
                  <p className="text-xs text-gray-400">Thriving</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.warning}</p>
                  <p className="text-xs text-gray-400">Attention</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.critical}</p>
                  <p className="text-xs text-gray-400">Critical</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No plants yet</h3>
            <p className="text-gray-500 mb-6">Add your first plant to start monitoring</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 rounded-xl text-white font-medium hover:from-emerald-400 hover:to-green-500 transition-all"
            >
              Add Your First Plant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant, index) => (
              <div key={plant.id} style={{ animationDelay: `${index * 100}ms` }}>
                <PlantCard plant={plant} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by Gemini AI • Real-time monitoring
          </p>
        </div>
      </div>

      {/* Floating Add Button */}
      {plants.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all flex items-center justify-center group"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Add Plant Modal */}
      <PlantIdentificationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPlantAdded={handlePlantAdded}
      />
    </div>
  );
}
