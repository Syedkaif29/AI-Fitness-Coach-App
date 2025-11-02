import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, FitnessPlan } from '@/types';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the Google Generative AI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Models to try in order of preference (updated for current API)
const GEMINI_MODELS = [
  'gemini-2.5-flash',           // Stable version, good balance of speed and quality
  'gemini-2.0-flash',           // Fast and versatile
  'gemini-flash-latest',        // Latest flash model
  'gemini-2.5-pro',             // High quality for complex tasks
  'gemini-pro-latest',          // Latest pro model
];

export async function generateFitnessPlan(profile: UserProfile): Promise<FitnessPlan> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Please configure your Gemini API key in .env.local file');
  }

  if (!genAI) {
    throw new Error('Failed to initialize Google Generative AI client');
  }

  const prompt = `
You are an expert fitness coach and nutritionist. Generate a comprehensive, personalized fitness plan based on the following user profile:

Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Fitness Goal: ${profile.fitnessGoal}
Fitness Level: ${profile.fitnessLevel}
Workout Location: ${profile.workoutLocation}
Dietary Preference: ${profile.dietaryPreference}
${profile.medicalHistory ? `Medical History: ${profile.medicalHistory}` : ''}
${profile.stressLevel ? `Stress Level: ${profile.stressLevel}` : ''}

Please provide a detailed response in the following JSON format:
{
  "workoutPlan": [
    {
      "day": "Day 1",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "10-12",
          "restTime": "60 seconds",
          "description": "Brief description"
        }
      ]
    }
  ],
  "dietPlan": {
    "meals": [
      {
        "mealType": "Breakfast",
        "items": ["item1", "item2"],
        "calories": "400-500 kcal"
      }
    ]
  },
  "tips": ["tip1", "tip2", "tip3"],
  "motivation": "Motivational message"
}

Generate a 7-day workout plan with appropriate exercises for their fitness level and location. Include a complete daily diet plan with breakfast, lunch, dinner, and snacks. Provide 5 lifestyle and posture tips. End with an inspiring motivational message.
`;

  // Try multiple models until one works
  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log('Trying Gemini model:', modelName);

      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log('✅ Successfully used model:', modelName);

      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;

      return JSON.parse(jsonText);

    } catch (error) {
      console.log('❌ Failed with model:', modelName, error);
      lastError = error as Error;

      // If it's a model not found error, try the next model
      if (error instanceof Error && (
        error.message.includes('not found') ||
        error.message.includes('404') ||
        error.message.includes('does not exist')
      )) {
        continue;
      }

      // For other errors (like rate limits, auth issues), throw immediately
      throw error;
    }
  }

  // All models failed
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}. ` +
    `Please check:\n` +
    `1. Your API key is valid\n` +
    `2. The Generative Language API is enabled in Google Cloud Console\n` +
    `3. Visit https://ai.google.dev/docs for the latest API information`
  );
}

export async function generateImage(prompt: string): Promise<string> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Please configure your Gemini API key in .env.local file');
  }

  if (!genAI) {
    throw new Error('Failed to initialize Google Generative AI client');
  }

  try {
    console.log('Generating image with Gemini for:', prompt);

    // Use the Gemini image generation model with legacy responseModalities
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-preview-image-generation'
    });

    const enhancedPrompt = `Generate a high-quality, realistic image of: ${prompt}. Make it clear, well-lit, and suitable for a fitness app. Style: photographic, professional, clean background. Return both a description and generate an image.`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: enhancedPrompt
        }]
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      } as any
    });

    const response = result.response;
    const text = response.text();

    try {
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.image) {
        console.log('✅ Successfully generated image with Gemini');
        return jsonResponse.image;
      }
    } catch (parseError) {
      console.log('Could not parse JSON response, checking for image data...');
    }

    // Check if the response contains image data in parts
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];

      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            // Convert base64 to blob URL
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const imageUrl = URL.createObjectURL(blob);

            console.log('✅ Successfully generated image with Gemini');
            return imageUrl;
          }
        }
      }
    }

    // If no image was generated, fall back to local placeholder
    console.log('⚠️ No image generated, using local placeholder');
    return createLocalPlaceholder(prompt);

  } catch (error) {
    console.error('❌ Failed to generate image with Gemini:', error);

    // Fall back to local placeholder on error
    return createLocalPlaceholder(prompt);
  }
}

// Create a local placeholder image using canvas
function createLocalPlaceholder(text: string): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // If canvas is not available, return a data URL
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f0f0f0"/>
        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
          ${text}
        </text>
      </svg>
    `);
  }

  canvas.width = 400;
  canvas.height = 300;

  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 400, 300);

  // Text
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap text if too long
  const maxWidth = 360;
  const words = text.split(' ');
  let line = '';
  let y = 150;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, 200, y);
      line = words[n] + ' ';
      y += 20;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 200, y);

  return canvas.toDataURL();
}
