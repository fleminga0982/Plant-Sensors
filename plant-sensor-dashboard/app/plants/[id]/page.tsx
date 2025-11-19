'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SensorCard from '@/components/SensorCard';
import { ArrowLeft, MapPin, RefreshCw, Sparkles, TrendingUp, Calendar, Activity } from 'lucide-react';

interface Plant {
    id: string;
    name: string;
    species: string;
    location: string;
    imageData: string | null;
    identifiedSpecies: string | null;
    identificationConfidence: number | null;
    sensorReadings: SensorReading[];
}

interface SensorReading {
    id: string;
    temperature: number;
    humidity: number;
    light: number;
    soilMoisture: number;
    timestamp: string;
}

export default function PlantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlant = async () => {
        try {
            const response = await fetch(`/api/plants/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('Plant not found');
                } else {
                    throw new Error('Failed to fetch plant');
                }
                return;
            }
            const data = await response.json();
            setPlant(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching plant:', err);
            setError('Failed to load plant data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, [params.id]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchPlant();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Activity className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading plant details...</p>
                </div>
            </div>
        );
    }

    if (error || !plant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">{error || 'Plant not found'}</h1>
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

    const lastReading = plant.sensorReadings[0] || {
        temperature: 0,
        humidity: 0,
        light: 0,
        soilMoisture: 0
    };

    // Calculate health status based on sensor readings
    const getHealthStatus = () => {
        if (!plant.sensorReadings.length) return 'good';

        const temp = lastReading.temperature;
        const humidity = lastReading.humidity;
        const light = lastReading.light;
        const moisture = lastReading.soilMoisture;

        const tempOk = temp >= 15 && temp <= 28;
        const humidityOk = humidity >= 40;
        const lightOk = light >= 1000;
        const moistureOk = moisture >= 30;

        const criticalCount = [tempOk, humidityOk, lightOk, moistureOk].filter(x => !x).length;

        if (criticalCount >= 3) return 'critical';
        if (criticalCount >= 2) return 'warning';
        if (criticalCount === 1) return 'good';
        return 'excellent';
    };

    const healthStatus = getHealthStatus();
    const needsWater = lastReading.soilMoisture < 30;
    const needsLight = lastReading.light < 1000;

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
                <div className={`glass rounded-3xl p-6 mb-6 border-2 ${healthStatus === 'excellent' ? 'border-green-500/50 bg-green-500/5' :
                    healthStatus === 'good' ? 'border-green-400/50 bg-green-400/5' :
                        healthStatus === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                            'border-red-500/50 bg-red-500/5'
                    } animate-fade-in`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${statusColors[healthStatus]} flex-shrink-0`}>
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                                Overall Status: <span className="capitalize">{healthStatus}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {needsWater && (
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                                        💧 Needs Water
                                    </span>
                                )}
                                {needsLight && (
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium">
                                        ☀️ Needs Light
                                    </span>
                                )}
                                {!needsWater && !needsLight && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium">
                                        ✨ Doing Great
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
                            value={lastReading.temperature}
                            status={
                                lastReading.temperature >= 18 && lastReading.temperature <= 26
                                    ? 'excellent'
                                    : lastReading.temperature >= 15 && lastReading.temperature <= 28
                                        ? 'good'
                                        : 'warning'
                            }
                        />
                        <SensorCard
                            type="humidity"
                            value={lastReading.humidity}
                            status={
                                lastReading.humidity >= 50
                                    ? 'excellent'
                                    : lastReading.humidity >= 40
                                        ? 'good'
                                        : 'warning'
                            }
                        />
                        <SensorCard
                            type="light"
                            value={lastReading.light}
                            status={
                                lastReading.light >= 2000 && lastReading.light <= 8000
                                    ? 'excellent'
                                    : lastReading.light >= 1000 && lastReading.light <= 10000
                                        ? 'good'
                                        : lastReading.light < 500
                                            ? 'critical'
                                            : 'warning'
                            }
                        />
                        <SensorCard
                            type="moisture"
                            value={lastReading.soilMoisture}
                            status={
                                lastReading.soilMoisture >= 40 && lastReading.soilMoisture <= 70
                                    ? 'excellent'
                                    : lastReading.soilMoisture >= 30 && lastReading.soilMoisture <= 75
                                        ? 'good'
                                        : lastReading.soilMoisture < 20
                                            ? 'critical'
                                            : 'warning'
                            }
                        />
                    </div>
                </div>

                {/* AI Analysis - Placeholder for now as backend doesn't store this yet */}
                <div className="glass rounded-3xl p-6 sm:p-8 border border-purple-500/30 bg-purple-500/5 mb-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Gemini AI Analysis
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Based on the current sensor readings, your {plant.name} appears to be {healthStatus}.
                        {needsWater ? " It looks a bit thirsty." : ""}
                        {needsLight ? " It could use some more light." : ""}
                        {!needsWater && !needsLight ? " Keep up the good work!" : ""}
                    </p>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white mb-3">Recommendations:</h3>
                        {needsWater && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                                <p className="text-gray-300">Check soil moisture and water if dry.</p>
                            </div>
                        )}
                        {needsLight && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                                <p className="text-gray-300">Move to a brighter location.</p>
                            </div>
                        )}
                        {!needsWater && !needsLight && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                                <p className="text-gray-300">Continue current care routine.</p>
                            </div>
                        )}
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
                                {plant.sensorReadings.slice(0, 5).map((reading, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-2 text-sm text-gray-300">
                                            {new Date(reading.timestamp).toLocaleDateString()}
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
