import { Plant, SensorReading, PlantHealthAnalysis } from './types';

// Mock Gemini AI analysis
function analyzePlantHealth(reading: SensorReading, species: string): PlantHealthAnalysis {
    const { temperature, humidity, light, soilMoisture } = reading;

    const recommendations: string[] = [];
    let status: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
    let needsWater = false;
    let needsLight = false;

    // Soil moisture analysis
    if (soilMoisture < 20) {
        status = 'critical';
        needsWater = true;
        recommendations.push('🚨 Critical: Water immediately! Soil is very dry.');
    } else if (soilMoisture < 35) {
        status = status === 'excellent' ? 'warning' : status;
        needsWater = true;
        recommendations.push('💧 Water your plant soon. Soil moisture is getting low.');
    } else if (soilMoisture > 75) {
        status = status === 'excellent' ? 'warning' : status;
        recommendations.push('⚠️ Soil is too wet. Reduce watering to prevent root rot.');
    }

    // Light analysis
    if (light < 500) {
        status = status === 'excellent' ? 'warning' : status;
        needsLight = true;
        recommendations.push('☀️ Move to a brighter location. Light levels are too low.');
    } else if (light > 10000) {
        status = status === 'excellent' ? 'warning' : status;
        recommendations.push('🌤️ Too much direct sunlight. Consider partial shade.');
    }

    // Temperature analysis
    if (temperature < 15) {
        status = status === 'excellent' ? 'warning' : status;
        recommendations.push('🌡️ Temperature is too cold. Move to a warmer spot.');
    } else if (temperature > 28) {
        status = status === 'excellent' ? 'warning' : status;
        recommendations.push('🔥 Temperature is too warm. Provide cooling or shade.');
    }

    // Humidity analysis
    if (humidity < 40) {
        status = status === 'excellent' ? 'good' : status;
        recommendations.push('💨 Consider misting or using a humidifier for better growth.');
    }

    if (status === 'excellent') {
        recommendations.push('✨ Perfect conditions! Your plant is thriving.');
    }

    // Mock Gemini analysis text
    const geminiAnalysis = `Based on current sensor data for your ${species}, environmental conditions are ${status}. ${needsWater
        ? 'The soil moisture level indicates your plant needs watering. '
        : 'Soil moisture is adequate. '
        }${needsLight
            ? 'Light exposure should be increased for optimal photosynthesis. '
            : 'Light levels are appropriate. '
        }Temperature (${temperature}°C) and humidity (${humidity}%) are ${temperature >= 18 && temperature <= 26 && humidity >= 40
            ? 'within ideal range'
            : 'outside optimal range'
        }. Continue monitoring daily for best results.`;

    return {
        status,
        needsWater,
        needsLight,
        recommendations,
        geminiAnalysis
    };
}

// Generate random sensor reading
function generateReading(): SensorReading {
    return {
        temperature: Math.round((Math.random() * 15 + 15) * 10) / 10, // 15-30°C
        humidity: Math.round(Math.random() * 40 + 30), // 30-70%
        light: Math.round(Math.random() * 8000 + 1000), // 1000-9000 lux
        soilMoisture: Math.round(Math.random() * 60 + 20), // 20-80%
        timestamp: new Date()
    };
}

// Generate historical readings (last 7 days)
function generateHistoricalReadings(count: number = 7): SensorReading[] {
    const readings: SensorReading[] = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        readings.push({
            temperature: Math.round((Math.random() * 10 + 18) * 10) / 10,
            humidity: Math.round(Math.random() * 30 + 40),
            light: Math.round(Math.random() * 5000 + 2000),
            soilMoisture: Math.round(Math.random() * 40 + 30 - i * 3), // Gradually decreasing
            timestamp: date
        });
    }

    return readings;
}

// Mock plant data
export const mockPlants: Plant[] = [
    {
        id: '1',
        name: 'Monstera Deliciosa',
        species: 'Monstera deliciosa',
        location: 'Living Room',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis, // Will be filled below
        historicalReadings: generateHistoricalReadings()
    },
    {
        id: '2',
        name: 'Snake Plant',
        species: 'Sansevieria trifasciata',
        location: 'Bedroom',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis,
        historicalReadings: generateHistoricalReadings()
    },
    {
        id: '3',
        name: 'Fiddle Leaf Fig',
        species: 'Ficus lyrata',
        location: 'Office',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis,
        historicalReadings: generateHistoricalReadings()
    },
    {
        id: '4',
        name: 'Peace Lily',
        species: 'Spathiphyllum',
        location: 'Kitchen',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis,
        historicalReadings: generateHistoricalReadings()
    },
    {
        id: '5',
        name: 'Pothos',
        species: 'Epipremnum aureum',
        location: 'Bathroom',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis,
        historicalReadings: generateHistoricalReadings()
    },
    {
        id: '6',
        name: 'Spider Plant',
        species: 'Chlorophytum comosum',
        location: 'Hallway',
        imageData: null,
        lastReading: generateReading(),
        healthAnalysis: {} as PlantHealthAnalysis,
        historicalReadings: generateHistoricalReadings()
    }
];

// Fill in health analysis for each plant
mockPlants.forEach(plant => {
    plant.healthAnalysis = analyzePlantHealth(plant.lastReading, plant.species);
});

// Get all plants
export function getAllPlants(): Plant[] {
    return mockPlants;
}

// Get single plant by ID
export function getPlantById(id: string): Plant | undefined {
    return mockPlants.find(plant => plant.id === id);
}

// Refresh reading for a plant (simulating real-time updates)
export function refreshPlantReading(plantId: string): Plant | undefined {
    const plant = mockPlants.find(p => p.id === plantId);
    if (!plant) return undefined;

    const newReading = generateReading();
    plant.lastReading = newReading;
    plant.historicalReadings.push(newReading);
    plant.healthAnalysis = analyzePlantHealth(newReading, plant.species);

    // Keep only last 30 readings
    if (plant.historicalReadings.length > 30) {
        plant.historicalReadings = plant.historicalReadings.slice(-30);
    }

    return plant;
}
