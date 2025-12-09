import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.SPRING_BOOT_API_URL || 'http://localhost:8081';

// POST /api/plants - Create new plant
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, species, location, imageData } = body;

        // Backend handles identification now.
        // We just pass what we have.

        let identifiedName = name;
        let identifiedSpecies = species;


        // Backend expects:
        // {
        //   "name": "string",
        //   "species": "string",
        //   "imageUrl": "string",
        //   "groupId": number,
        //   ...
        // }

        // We can't easily send the base64 image to the 'imageUrl' field effectively without an upload service.
        // For now, we'll send the metadata.

        const formData = new FormData();
        formData.append('name', identifiedName || 'Unknown Plant');
        // formData.append('species', identifiedSpecies || 'Unknown Species'); // Backend doesn't use species in create param yet based on the user's snippet, only name and image.
        // The user provided snippet: createPlant(@RequestParam("name") String name, @RequestParam(value = "image", required = false) MultipartFile image)
        // It ignores species, location, etc for now. I should stick to what the backend takes.

        if (imageData) {
            // imageData is likely "data:image/jpeg;base64,/9j/..."
            // We need to convert base64 to a Blob/File
            try {
                // Initial simple check for base64 data URI
                const base64Data = imageData.split(';base64,').pop();
                const buffer = Buffer.from(base64Data, 'base64');
                const blob = new Blob([buffer], { type: 'image/jpeg' });
                formData.append('image', blob, 'plant_image.jpg');
            } catch (e) {
                console.error("Error processing image data for upload", e);
            }
        }

        const response = await fetch(`${API_URL}/plant-manager/create`, {
            method: 'POST',
            // headers: { 'Content-Type': 'multipart/form-data' }, // FETCH automatically sets boundary if we omit Content-Type when body is FormData
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const newPlantId = await response.json();

        // Return a constructed plant object for the frontend to update state immediately
        return NextResponse.json({
            id: newPlantId.toString(),
            name: identifiedName,
            species: identifiedSpecies,
            location,
            imageData,
            lastReading: null,
            healthAnalysis: { status: 'good' },
            historicalReadings: []
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating plant:', error);
        return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 });
    }
}
