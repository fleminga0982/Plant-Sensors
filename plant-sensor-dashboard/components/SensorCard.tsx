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
        gradient: 'from-orange-500 to-red-500'
    },
    humidity: {
        icon: Droplets,
        label: 'Humidity',
        unit: '%',
        gradient: 'from-blue-400 to-cyan-500'
    },
    light: {
        icon: Sun,
        label: 'Light',
        unit: ' lux',
        gradient: 'from-yellow-400 to-amber-500'
    },
    moisture: {
        icon: Sprout,
        label: 'Soil Moisture',
        unit: '%',
        gradient: 'from-emerald-500 to-green-600'
    }
};

const statusColors = {
    excellent: 'border-green-500/50 bg-green-500/10',
    good: 'border-green-400/50 bg-green-400/10',
    warning: 'border-amber-500/50 bg-amber-500/10',
    critical: 'border-red-500/50 bg-red-500/10'
};

export default function SensorCard({ type, value, status }: SensorCardProps) {
    const config = sensorConfig[type];
    const Icon = config.icon;

    return (
        <div className={`glass rounded-2xl p-6 border-2 ${statusColors[status]} hover:scale-105 transition-transform duration-300 animate-fade-in`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${status === 'excellent' ? 'bg-green-500/20 text-green-300' :
                        status === 'good' ? 'bg-green-400/20 text-green-300' :
                            status === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                                'bg-red-500/20 text-red-300'
                    }`}>
                    {status}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium">{config.label}</p>
                <p className="text-3xl font-bold text-white">
                    {type === 'light' ? Math.round(value).toLocaleString() : value}
                    <span className="text-lg text-gray-400 ml-1">{config.unit}</span>
                </p>
            </div>
        </div>
    );
}
