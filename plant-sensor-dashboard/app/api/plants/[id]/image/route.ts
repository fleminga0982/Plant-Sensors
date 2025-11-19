import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/plants/:id/image - Serve plant image
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const plant = await prisma.plant.findUnique({
            where: { id },
            select: { imageData: true }
        });

        if (!plant || !plant.imageData) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Return image as JPEG
        return new NextResponse(plant.imageData, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
