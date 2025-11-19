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

        // Convert imageData Buffer to base64 string for response
        const plantsWithImages = plants.map(plant => ({
            ...plant,
            imageData: plant.imageData ? `data:image/jpeg;base64,${plant.imageData.toString('base64')}` : null,
            lastReading: plant.sensorReadings[0] || null
        }));

        return NextResponse.json(plantsWithImages);
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
