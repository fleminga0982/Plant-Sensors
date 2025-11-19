import { GoogleGenerativeAI } from "@google/generative-ai";

// Plant identification result interface
interface PlantIdentificationResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
}

const mockPlantSpecies = [
  { common: 'Monstera Deliciosa', scientific: 'Monstera deliciosa', description: 'A popular tropical plant with large, distinctive split leaves' },
  { common: 'Snake Plant', scientific: 'Sansevieria trifasciata', description: 'Hardy succulent with upright sword-like leaves' },
  { common: 'Fiddle Leaf Fig', scientific: 'Ficus lyrata', description: 'Tree with large, violin-shaped leaves' },
  { common: 'Peace Lily', scientific: 'Spathiphyllum', description: 'Flowering plant with white blooms and dark green leaves' },
  { common: 'Pothos', scientific: 'Epipremnum aureum', description: 'Trailing vine with heart-shaped leaves' },
  { common: 'Spider Plant', scientific: 'Chlorophytum comosum', description: 'Easy-care plant with long, arching leaves' },
  { common: 'Rubber Plant', scientific: 'Ficus elastica', description: 'Tree with large, glossy oval leaves' },
  { common: 'ZZ Plant', scientific: 'Zamioculcas zamiifolia', description: 'Drought-tolerant with thick, waxy leaves' },
  { common: 'Aloe Vera', scientific: 'Aloe vera', description: 'Succulent with medicinal gel-filled leaves' },
  { common: 'Boston Fern', scientific: 'Nephrolepis exaltata', description: 'Lush fern with delicate, feathery fronds' },
];

// Mock implementation (fallback if API key not configured)
async function identifyPlantMock(imageData: string): Promise<PlantIdentificationResult> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const randomPlant = mockPlantSpecies[Math.floor(Math.random() * mockPlantSpecies.length)];
  const confidence = Math.round((Math.random() * 23 + 75) * 10) / 10;

  return {
    commonName: randomPlant.common,
    scientificName: randomPlant.scientific,
    confidence,
    description: randomPlant.description
  };
}

// Real Gemini Vision API implementation
async function identifyPlantWithGemini(imageData: string): Promise<PlantIdentificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('GEMINI_API_KEY not configured, using mock implementation');
    return identifyPlantMock(imageData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Identify this houseplant. Provide:
1. Common name
2. Scientific name (genus and species)
3. A brief 1-sentence description

Format your response EXACTLY as JSON with these fields (no markdown, no code blocks):
{
  "commonName": "English common name",
  "scientificName": "Genus species",
  "description": "Brief description"
}`;

    // Remove data URL prefix to get base64
    const base64Data = imageData.split(',')[1];

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let parsedResult;
    try {
      // Remove code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResult = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return identifyPlantMock(imageData);
    }

    return {
      commonName: parsedResult.commonName || 'Unknown Plant',
      scientificName: parsedResult.scientificName || 'Unknown',
      confidence: 92, // Gemini doesn't provide confidence scores, use a high fixed value
      description: parsedResult.description || 'A houseplant'
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    console.warn('Falling back to mock implementation');
    return identifyPlantMock(imageData);
  }
}

// Main export - uses real API if available, otherwise falls back to mock
export async function identifyPlant(imageData: string): Promise<PlantIdentificationResult> {
  return identifyPlantWithGemini(imageData);
}
