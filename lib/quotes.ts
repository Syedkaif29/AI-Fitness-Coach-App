// Cache for storing today's quote in localStorage
const QUOTE_CACHE_KEY = 'daily_quote_cache';

interface CachedQuote {
    quote: string;
    author: string;
    date: string;
    source: string;
}

export async function getDailyQuote(): Promise<{ quote: string; author: string }> {
    const today = new Date().toDateString();
    
    // Check localStorage cache first
    if (typeof window !== 'undefined') {
        try {
            const cached = localStorage.getItem(QUOTE_CACHE_KEY);
            if (cached) {
                const cachedQuote: CachedQuote = JSON.parse(cached);
                if (cachedQuote.date === today) {
                    console.log('📋 Using cached quote for today');
                    return { quote: cachedQuote.quote, author: cachedQuote.author };
                }
            }
        } catch (error) {
            console.log('Failed to read quote cache:', error);
        }
    }

    try {
        // Fetch from our API route
        const response = await fetch('/api/daily-quote', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            
            // Cache the quote in localStorage
            if (typeof window !== 'undefined') {
                try {
                    const cacheData: CachedQuote = {
                        quote: data.quote,
                        author: data.author,
                        date: today,
                        source: data.source || 'api'
                    };
                    localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cacheData));
                } catch (error) {
                    console.log('Failed to cache quote:', error);
                }
            }
            
            console.log(`✅ Fetched quote from ${data.source} source:`, data.quote.substring(0, 50) + '...');
            return { quote: data.quote, author: data.author };
        } else {
            throw new Error(`API responded with status: ${response.status}`);
        }
    } catch (error) {
        console.log('⚠️ Failed to fetch quote, using emergency fallback:', error);
        
        // Emergency fallback
        return {
            quote: 'The only bad workout is the one that didn\'t happen.',
            author: 'Unknown'
        };
    }
}
