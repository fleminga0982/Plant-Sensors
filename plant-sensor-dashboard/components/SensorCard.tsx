import React from 'react';
import { Thermometer, Droplets, Sun, Sprout } from 'lucide-react';

interface SensorCardProps {
    type: 'temperature' | 'humidity' | 'light' | 'moisture';
    value: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
}

const sensorConfig = {
    temperature: {
        icon: Thermometer,
        label: 'Temperature',
        unit: '°C',
        gradient: 'from-orange-500 to-red-500',
        shadow: 'shadow-orange-500/20'
    },
    humidity: {
        icon: Droplets,
        label: 'Humidity',
        unit: '%',
        gradient: 'from-blue-400 to-cyan-500',
        shadow: 'shadow-blue-500/20'
    },
    light: {
        icon: Sun,
        label: 'Light',
        unit: ' lux',
        gradient: 'from-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-500/20'
    },
    moisture: {
        icon: Sprout,
        label: 'Soil Moisture',
        unit: '%',
        gradient: 'from-emerald-500 to-green-600',
        shadow: 'shadow-emerald-500/20'
    }
};

const statusColors = {
    excellent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    good: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
};

export default function SensorCard({ type, value, status }: SensorCardProps) {
    const config = sensorConfig[type];
    const Icon = config.icon;

    return (
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            {/* Background Gradient Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg ${config.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[status]}`}>
                    {status}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-sm text-gray-400 font-medium mb-1">{config.label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white tracking-tight">
                        {type === 'light' ? Math.round(value).toLocaleString() : value}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{config.unit}</span>
                </div>
            </div>
        </div>
    );
}
