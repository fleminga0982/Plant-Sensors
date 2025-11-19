'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPlantById, refreshPlantReading } from '@/lib/mockData';
import SensorCard from '@/components/SensorCard';
import { ArrowLeft, MapPin, RefreshCw, Sparkles, TrendingUp, Calendar, Activity } from 'lucide-react';

export default function PlantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [plant, setPlant] = useState(() => getPlantById(params.id as string));

    if (!plant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Plant not found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            const updatedPlant = refreshPlantReading(plant.id);
            if (updatedPlant) {
                setPlant(updatedPlant);
            }
            setIsRefreshing(false);
        }, 1000);
    };

    const statusColors = {
        excellent: 'from-green-500 to-emerald-600',
        good: 'from-green-400 to-green-500',
        warning: 'from-amber-500 to-orange-600',
        critical: 'from-red-500 to-rose-600'
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="glass rounded-3xl p-6 sm:p-8 mb-6 border border-white/10 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-green-600/30 flex items-center justify-center text-5xl">
                                🌿
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                                    {plant.name}
                                </h1>
                                <p className="text-gray-400 italic mb-2">{plant.species}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="text-gray-300">{plant.location}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="glass px-6 py-3 rounded-xl border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center gap-2 group"
                        >
                            <RefreshCw className={`w-5 h-5 text-emerald-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                            <span className="text-white font-medium">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`glass rounded-3xl p-6 mb-6 border-2 ${plant.healthAnalysis.status === 'excellent' ? 'border-green-500/50 bg-green-500/5' :
                    plant.healthAnalysis.status === 'good' ? 'border-green-400/50 bg-green-400/5' :
                        plant.healthAnalysis.status === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                            'border-red-500/50 bg-red-500/5'
                    } animate-fade-in`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${statusColors[plant.healthAnalysis.status]} flex-shrink-0`}>
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                                Overall Status: <span className="capitalize">{plant.healthAnalysis.status}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {plant.healthAnalysis.needsWater && (
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                                        💧 Needs Water
                                    </span>
                                )}
                                {plant.healthAnalysis.needsLight && (
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium">
                                        ☀️ Needs Light
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensor Readings */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-emerald-400" />
                        Current Readings
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SensorCard
                            type="temperature"
                            value={plant.lastReading.temperature}
                            status={
                                plant.lastReading.temperature >= 18 && plant.lastReading.temperature <= 26
                                    ? 'excellent'
                                    : plant.lastReading.temperature >= 15 && plant.lastReading.temperature <= 28
                                        ? 'good'
                                        : 'warning'
                            }
                        />
                        <SensorCard
                            type="humidity"
                            value={plant.lastReading.humidity}
                            status={
                                plant.lastReading.humidity >= 50
                                    ? 'excellent'
                                    : plant.lastReading.humidity >= 40
                                        ? 'good'
                                        : 'warning'
                            }
                        />
                        <SensorCard
                            type="light"
                            value={plant.lastReading.light}
                            status={
                                plant.lastReading.light >= 2000 && plant.lastReading.light <= 8000
                                    ? 'excellent'
                                    : plant.lastReading.light >= 1000 && plant.lastReading.light <= 10000
                                        ? 'good'
                                        : plant.lastReading.light < 500
                                            ? 'critical'
                                            : 'warning'
                            }
                        />
                        <SensorCard
                            type="moisture"
                            value={plant.lastReading.soilMoisture}
                            status={
                                plant.lastReading.soilMoisture >= 40 && plant.lastReading.soilMoisture <= 70
                                    ? 'excellent'
                                    : plant.lastReading.soilMoisture >= 30 && plant.lastReading.soilMoisture <= 75
                                        ? 'good'
                                        : plant.lastReading.soilMoisture < 20
                                            ? 'critical'
                                            : 'warning'
                            }
                        />
                    </div>
                </div>

                {/* AI Analysis */}
                <div className="glass rounded-3xl p-6 sm:p-8 border border-purple-500/30 bg-purple-500/5 mb-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Gemini AI Analysis
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        {plant.healthAnalysis.geminiAnalysis}
                    </p>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white mb-3">Recommendations:</h3>
                        {plant.healthAnalysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                                <p className="text-gray-300">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historical Data Preview */}
                <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-emerald-400" />
                        Recent History
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-400">Date</th>
                                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-400">Temp (°C)</th>
                                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-400">Humidity (%)</th>
                                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-400">Light (lux)</th>
                                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-400">Moisture (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plant.historicalReadings.slice(-5).reverse().map((reading, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-2 text-sm text-gray-300">
                                            {reading.timestamp.toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-white text-right font-medium">
                                            {reading.temperature}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-white text-right font-medium">
                                            {reading.humidity}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-white text-right font-medium">
                                            {Math.round(reading.light).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-white text-right font-medium">
                                            {reading.soilMoisture}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
