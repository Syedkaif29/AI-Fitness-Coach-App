export async function textToSpeech(text: string): Promise<Blob> {
  try {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate speech');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}
