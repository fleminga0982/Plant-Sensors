'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SensorCard from '@/components/SensorCard';
import { ArrowLeft, MapPin, RefreshCw, Sparkles, TrendingUp, Calendar, Activity, Droplets, Sun, Thermometer, Trash2 } from 'lucide-react';

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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this plant? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/plants/${params.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete plant');
            }

            router.push('/');
        } catch (err) {
            console.error('Error deleting plant:', err);
            setError('Failed to delete plant');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse-glow" />
                    <Activity className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6 relative z-10" />
                    <p className="text-gray-400 text-lg font-medium tracking-wide animate-pulse">Analyzing Biosignals...</p>
                </div>
            </div>
        );
    }

    if (error || !plant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center glass-panel p-12 rounded-3xl">
                    <h1 className="text-2xl font-bold text-white mb-4">{error || 'Plant not found'}</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
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

    const statusConfig = {
        excellent: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-500' },
        good: { color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', gradient: 'from-teal-400 to-cyan-500' },
        warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', gradient: 'from-amber-400 to-orange-500' },
        critical: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', gradient: 'from-rose-500 to-red-600' }
    };

    const currentStatus = statusConfig[healthStatus];

    return (
        <div className="min-h-screen px-6 sm:px-12 lg:px-24 py-12 relative overflow-hidden bg-[#0a0a0a]">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Navigation */}
                {/* Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group bg-white/5 px-4 py-2 rounded-full w-fit hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors group bg-rose-500/10 px-4 py-2 rounded-full w-fit hover:bg-rose-500/20 border border-rose-500/20"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete Plant</span>
                    </button>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-slide-up">
                    {/* Plant Image Card */}
                    <div className="lg:col-span-1 h-[400px] lg:h-auto relative rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        {plant.imageData ? (
                            <img
                                src={plant.imageData}
                                alt={plant.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <span className="text-8xl filter drop-shadow-lg animate-float">🌿</span>
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border mb-4 ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}>
                                <Activity className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">{healthStatus}</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">{plant.name}</h1>
                            <p className="text-gray-300 text-lg font-medium mb-1">{plant.species}</p>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{plant.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats & AI Analysis */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* AI Insight Card */}
                        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Sparkles className="w-32 h-32 text-white" />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Gemini Analysis</h2>
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                Based on the current sensor readings, your {plant.name} appears to be <span className={currentStatus.color + " font-bold"}>{healthStatus}</span>.
                                {needsWater ? " It looks a bit thirsty." : ""}
                                {needsLight ? " It could use some more light." : ""}
                                {!needsWater && !needsLight ? " Keep up the good work!" : ""}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${needsWater ? 'border-blue-500/30 bg-blue-500/10' : ''}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplets className={`w-4 h-4 ${needsWater ? 'text-blue-400' : 'text-gray-500'}`} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${needsWater ? 'text-blue-300' : 'text-gray-500'}`}>Water</span>
                                    </div>
                                    <p className={`text-sm font-medium ${needsWater ? 'text-white' : 'text-gray-400'}`}>
                                        {needsWater ? 'Check soil moisture' : 'Levels optimal'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${needsLight ? 'border-yellow-500/30 bg-yellow-500/10' : ''}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sun className={`w-4 h-4 ${needsLight ? 'text-yellow-400' : 'text-gray-500'}`} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${needsLight ? 'text-yellow-300' : 'text-gray-500'}`}>Light</span>
                                    </div>
                                    <p className={`text-sm font-medium ${needsLight ? 'text-white' : 'text-gray-400'}`}>
                                        {needsLight ? 'Move to brighter spot' : 'Levels optimal'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Thermometer className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Temp</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Range optimal
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sensor Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                </div>

                {/* History Section */}
                <div className="glass-panel rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Recent History</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Temp</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Humidity</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Light</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Moisture</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plant.sensorReadings.slice(0, 5).map((reading, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-4 text-sm text-gray-300 font-medium">
                                            {new Date(reading.timestamp).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-white text-right font-medium group-hover:text-emerald-400 transition-colors">
                                            {reading.temperature}°C
                                        </td>
                                        <td className="py-4 px-4 text-sm text-white text-right font-medium group-hover:text-blue-400 transition-colors">
                                            {reading.humidity}%
                                        </td>
                                        <td className="py-4 px-4 text-sm text-white text-right font-medium group-hover:text-yellow-400 transition-colors">
                                            {Math.round(reading.light).toLocaleString()} lux
                                        </td>
                                        <td className="py-4 px-4 text-sm text-white text-right font-medium group-hover:text-emerald-400 transition-colors">
                                            {reading.soilMoisture}%
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
