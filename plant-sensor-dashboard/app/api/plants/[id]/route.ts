import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.SPRING_BOOT_API_URL || 'http://localhost:8081';

// GET /api/plants/:id - Get plant details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`${API_URL}/plant-manager/${id}`);
        if (response.status === 404) {
            return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
        }
        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const plant = await response.json();

        // Backend Plant entity doesn't have readings, so we mock the last reading for now
        const lastReading = null;

        const transformedPlant = {
            id: plant.id.toString(),
            name: plant.name,
            species: plant.species,
            location: plant.groupId ? `Group ${plant.groupId}` : 'Unknown',
            imageData: plant.imageUrl || null,
            lastReading,
            healthAnalysis: {
                status: 'good',
                needsWater: false,
                needsLight: false,
                recommendations: [],
                geminiAnalysis: "AI analysis not yet available."
            },
            historicalReadings: []
        };

        return NextResponse.json(transformedPlant);
    } catch (error) {
        console.error('Error fetching plant:', error);
        return NextResponse.json({ error: 'Failed to fetch plant' }, { status: 500 });
    }
}

// PUT /api/plants/:id - Update plant
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return NextResponse.json({ error: 'Not Implemented' }, { status: 501 });
}

// DELETE /api/plants/:id - Remove plant
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return NextResponse.json({ error: 'Not Implemented' }, { status: 501 });
}
