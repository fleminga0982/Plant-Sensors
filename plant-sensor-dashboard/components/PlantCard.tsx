import React from 'react';
import Link from 'next/link';
import { Plant } from '@/lib/types';
import { MapPin, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';

interface PlantCardProps {
    plant: Plant;
}

const statusConfig = {
    excellent: {
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500/50',
        icon: TrendingUp,
        label: 'Thriving'
    },
    good: {
        color: 'text-green-300',
        bg: 'bg-green-400/20',
        border: 'border-green-400/50',
        icon: Minus,
        label: 'Healthy'
    },
    warning: {
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/50',
        icon: TrendingDown,
        label: 'Needs Attention'
    },
    critical: {
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/50',
        icon: TrendingDown,
        label: 'Critical'
    }
};

export default function PlantCard({ plant }: PlantCardProps) {
    const status = statusConfig[plant.healthAnalysis.status];
    const StatusIcon = status.icon;

    return (
        <Link href={`/plants/${plant.id}`}>
            <div className={`glass rounded-3xl overflow-hidden border-2 ${status.border} hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-fade-in`}>
                {/* Plant Image */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-900/40 to-blue-900/40 overflow-hidden">
                    {plant.imageData ? (
                        <img
                            src={plant.imageData}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-600/30 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                                🌿
                            </div>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full ${status.bg} backdrop-blur-sm border ${status.border} flex items-center gap-2`}>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </div>
                </div>

                {/* Plant Info */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                {plant.name}
                            </h3>
                            <p className="text-sm text-gray-400 italic">{plant.species}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-gray-300">{plant.location}</span>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Temp</p>
                            <p className="text-sm font-semibold text-white">{plant.lastReading?.temperature ?? 0}°</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Humid</p>
                            <p className="text-sm font-semibold text-white">{plant.lastReading?.humidity ?? 0}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Light</p>
                            <p className="text-sm font-semibold text-white">{Math.round((plant.lastReading?.light ?? 0) / 1000)}k</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Soil</p>
                            <p className="text-sm font-semibold text-white">{plant.lastReading?.soilMoisture ?? 0}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
