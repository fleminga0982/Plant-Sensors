import React from 'react';
import Link from 'next/link';
import { Plant } from '@/lib/types';
import { MapPin, TrendingUp, TrendingDown, Minus, Droplets, Sun, Thermometer, Sprout } from 'lucide-react';

interface PlantCardProps {
    plant: Plant;
}

const statusConfig = {
    excellent: {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        icon: TrendingUp,
        label: 'Thriving',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
    },
    good: {
        color: 'text-teal-400',
        bg: 'bg-teal-500/20',
        border: 'border-teal-500/30',
        icon: Minus,
        label: 'Healthy',
        glow: 'shadow-[0_0_15px_rgba(45,212,191,0.3)]'
    },
    warning: {
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        icon: TrendingDown,
        label: 'Attention',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
    },
    critical: {
        color: 'text-rose-400',
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/30',
        icon: TrendingDown,
        label: 'Critical',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
    }
};

export default function PlantCard({ plant }: PlantCardProps) {
    const status = statusConfig[plant.healthAnalysis.status];
    const StatusIcon = status.icon;

    return (
        <Link href={`/plants/${plant.id}`}>
            <div className="glass-panel rounded-3xl overflow-hidden h-full flex flex-col group relative transition-all duration-500 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 z-10" />

                    {plant.imageData ? (
                        <img
                            src={plant.imageData}
                            alt={plant.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <span className="text-6xl filter drop-shadow-lg animate-float">🌿</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full ${status.bg} ${status.border} border backdrop-blur-md flex items-center gap-2 ${status.glow} transition-all duration-300`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${status.color}`}>{status.label}</span>
                    </div>

                    {/* Floating Location Badge */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                        <MapPin className="w-3 h-3 text-gray-300" />
                        <span className="text-xs text-gray-200 font-medium">{plant.location}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col relative">
                    {/* Decorative Glow */}
                    <div className="absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/80 z-0 pointer-events-none" />

                    <div className="relative z-10 mb-6">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300">
                            {plant.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-medium tracking-wide">{plant.species}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Temp</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-200">{plant.lastReading?.temperature ?? '--'}°</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Humid</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-200">{plant.lastReading?.humidity ?? '--'}%</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Light</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-200">{plant.lastReading?.light ? Math.round(plant.lastReading.light / 1000) + 'k' : '--'}</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Soil</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-200">{plant.lastReading?.soilMoisture ?? '--'}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
