import { NextResponse } from 'next/server';

// Fallback motivational fitness quotes
const fallbackQuotes = [
    { quote: 'The only bad workout is the one that didn\'t happen.', author: 'Unknown' },
    { quote: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
    { quote: 'Your body can stand almost anything. It\'s your mind you have to convince.', author: 'Unknown' },
    { quote: 'The pain you feel today will be the strength you feel tomorrow.', author: 'Unknown' },
    { quote: 'Don\'t wish for it, work for it.', author: 'Unknown' },
    { quote: 'Fitness is not about being better than someone else. It\'s about being better than you used to be.', author: 'Khloe Kardashian' },
    { quote: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn' },
    { quote: 'The difference between try and triumph is a little umph.', author: 'Unknown' },
    { quote: 'Sweat is fat crying.', author: 'Unknown' },
    { quote: 'You don\'t have to be extreme, just consistent.', author: 'Unknown' },
    { quote: 'A healthy outside starts from the inside.', author: 'Robert Urich' },
    { quote: 'Exercise is a celebration of what your body can do, not a punishment for what you ate.', author: 'Unknown' },
    { quote: 'The groundwork for all happiness is good health.', author: 'Leigh Hunt' },
    { quote: 'Strength doesn\'t come from what you can do. It comes from overcoming the things you once thought you couldn\'t.', author: 'Rikki Rogers' },
    { quote: 'If you want something you\'ve never had, you must be willing to do something you\'ve never done.', author: 'Thomas Jefferson' }
];

export async function GET() {
    try {
        // Try multiple quote APIs for better reliability
        const apis = [
            'https://api.quotable.io/random?tags=motivational|inspirational|success|wisdom&minLength=30&maxLength=200',
            'https://zenquotes.io/api/random',
            'https://api.quotable.io/random?minLength=30&maxLength=150'
        ];

        for (const apiUrl of apis) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'FitnessCoachApp/1.0'
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    let quote, author;
                    
                    // Handle different API response formats
                    if (apiUrl.includes('quotable.io')) {
                        quote = data.content;
                        author = data.author;
                    } else if (apiUrl.includes('zenquotes.io')) {
                        const quoteData = Array.isArray(data) ? data[0] : data;
                        quote = quoteData.q;
                        author = quoteData.a;
                    }

                    if (quote && author) {
                        console.log('✅ Fetched fresh quote from external API');
                        return NextResponse.json({ 
                            quote, 
                            author,
                            source: 'external'
                        });
                    }
                }
            } catch (apiError) {
                console.log(`Failed to fetch from ${apiUrl}:`, apiError);
                continue;
            }
        }

        // If all external APIs fail, use fallback quotes
        throw new Error('All external APIs failed');

    } catch (error) {
        console.log('⚠️ Using fallback quotes due to API failure:', error);
        
        // Use date-based selection for consistent daily quotes
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % fallbackQuotes.length;
        
        return NextResponse.json({
            quote: fallbackQuotes[index].quote,
            author: fallbackQuotes[index].author,
            source: 'fallback'
        });
    }
}