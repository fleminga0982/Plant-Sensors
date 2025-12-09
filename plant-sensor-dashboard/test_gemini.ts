import { config } from 'dotenv';
config();
import { identifyPlant } from './lib/geminiVision';

async function test() {
    console.log('Testing Gemini API...');
    const key = process.env.GEMINI_API_KEY;
    console.log('API Key loaded:', !!key);
    if (key) console.log('Key start:', key.substring(0, 5));

    try {
        // Small white pixel base64
        const dummyImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjQ1NTY3ODk6R0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqgoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwH7/wA//9k=';

        const result = await identifyPlant(dummyImage);
        console.log('Success:', JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.log('FAILED!');
        console.log('Error Name:', error.name);
        console.log('Error Message:', error.message);
        if (error.response) {
            console.log('Error Response:', JSON.stringify(error.response, null, 2));
        }
    }
}

test();
