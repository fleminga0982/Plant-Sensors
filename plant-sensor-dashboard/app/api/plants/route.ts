import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { identifyPlant } from '@/lib/geminiVision';

// GET /api/plants - List all plants
export async function GET() {
    try {
        const plants = await prisma.plant.findMany({
            include: {
                sensorReadings: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        });

        // Transform data to match frontend expectations
        const plantsWithDetails = plants.map(plant => {
            const lastReading = plant.sensorReadings[0] || null;

            // Calculate health status
            let status = 'good';
            let needsWater = false;
            let needsLight = false;
            const recommendations = [];

            if (lastReading) {
                const { temperature, humidity, light, soilMoisture } = lastReading;

                if (soilMoisture < 30) {
                    needsWater = true;
                    recommendations.push('Water the plant');
                }
                if (light < 1000) {
                    needsLight = true;
                    recommendations.push('Move to brighter location');
                }

                const criticalCount = [
                    temperature >= 15 && temperature <= 28,
                    humidity >= 40,
                    light >= 1000,
                    soilMoisture >= 30
                ].filter(x => !x).length;

                if (criticalCount >= 3) status = 'critical';
                else if (criticalCount >= 2) status = 'warning';
                else if (criticalCount === 1) status = 'good';
                else status = 'excellent';
            }

            return {
                ...plant,
                imageData: plant.imageData ? `data:image/jpeg;base64,${Buffer.from(plant.imageData).toString('base64')}` : null,
                lastReading,
                healthAnalysis: {
                    status,
                    needsWater,
                    needsLight,
                    recommendations,
                    geminiAnalysis: "AI analysis not yet available."
                }
            };
        });

        return NextResponse.json(plantsWithDetails);
    } catch (error) {
        console.error('Error fetching plants:', error);
        return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 });
    }
}

// POST /api/plants - Create new plant with photo
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, location, imageData } = body;

        if (!imageData) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        // Identify plant using mock Gemini Vision API
        const identification = await identifyPlant(imageData);

        // Convert base64 image to Buffer for database storage
        const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');

        // Create plant in database
        const plant = await prisma.plant.create({
            data: {
                name: name || identification.commonName,
                species: identification.scientificName,
                location: location || 'Unknown',
                imageData: imageBuffer,
                identifiedSpecies: identification.commonName,
                identificationConfidence: identification.confidence
            }
        });

        // Create initial sensor reading (mock data)
        await prisma.sensorReading.create({
            data: {
                plantId: plant.id,
                temperature: Math.round((Math.random() * 15 + 15) * 10) / 10,
                humidity: Math.round(Math.random() * 40 + 30),
                light: Math.round(Math.random() * 8000 + 1000),
                soilMoisture: Math.round(Math.random() * 60 + 20)
            }
        });

        return NextResponse.json({
            ...plant,
            imageData: imageData,
            identification
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating plant:', error);
        return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 });
    }
}
