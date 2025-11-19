import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { identifyPlant } from '@/lib/geminiVision';

// GET /api/plants/:id - Get plant details with readings
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const plant = await prisma.plant.findUnique({
            where: { id },
            include: {
                sensorReadings: {
                    orderBy: { timestamp: 'desc' },
                    take: 10
                }
            }
        });

        if (!plant) {
            return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...plant,
            imageData: plant.imageData ? `data:image/jpeg;base64,${plant.imageData.toString('base64')}` : null
        });
    } catch (error) {
        console.error('Error fetching plant:', error);
        return NextResponse.json({ error: 'Failed to fetch plant' }, { status: 500 });
    }
}

// PUT /api/plants/:id - Update plant (including photo)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, location, imageData } = body;

        const updateData: any = {};

        if (name) updateData.name = name;
        if (location) updateData.location = location;

        // If new image provided, re-identify plant
        if (imageData) {
            const identification = await identifyPlant(imageData);
            const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');

            updateData.imageData = imageBuffer;
            updateData.identifiedSpecies = identification.commonName;
            updateData.identificationConfidence = identification.confidence;
            updateData.species = identification.scientificName;
        }

        const plant = await prisma.plant.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            ...plant,
            imageData: imageData || (plant.imageData ? `data:image/jpeg;base64,${plant.imageData.toString('base64')}` : null)
        });
    } catch (error) {
        console.error('Error updating plant:', error);
        return NextResponse.json({ error: 'Failed to update plant' }, { status: 500 });
    }
}

// DELETE /api/plants/:id - Remove plant
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.plant.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plant:', error);
        return NextResponse.json({ error: 'Failed to delete plant' }, { status: 500 });
    }
}
