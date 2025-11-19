// Type definitions for Plant Sensor Dashboard

export interface SensorReading {
    temperature: number; // Celsius
    humidity: number; // Percentage
    light: number; // Lux
    soilMoisture: number; // Percentage
    timestamp: Date;
}

export interface PlantHealthAnalysis {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    needsWater: boolean;
    needsLight: boolean;
    recommendations: string[];
    geminiAnalysis: string;
}

export interface Plant {
    id: string;
    name: string;
    species: string;
    location: string;
    imageData?: string | null; // Base64 encoded image or null
    lastReading: SensorReading;
    healthAnalysis: PlantHealthAnalysis;
    historicalReadings: SensorReading[];
}

export type SensorType = 'temperature' | 'humidity' | 'light' | 'moisture';

export interface SensorCardData {
    type: SensorType;
    value: number;
    unit: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    icon: string;
}
