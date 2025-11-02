# 💪 AI Fitness Coach App

An AI-powered fitness assistant built with **Next.js** that generates **personalized workout and diet plans** using Google Gemini AI.

## 🚀 Features

- **Personalized Plans**: AI-generated workout and diet plans based on user profile
- **Voice Features**: Text-to-speech using ElevenLabs API to read your plans
- **Image Generation**: Visual representations of exercises and meals
- **Daily Motivation**: Inspirational quotes from ZenQuotes API
- **PDF Export**: Download your fitness plan as a PDF
- **Dark/Light Mode**: Toggle between themes
- **Local Storage**: Save and retrieve your plans
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Text Generation**: Google Gemini API (gemini-1.5-flash)
- **Voice**: ElevenLabs API
- **Quotes**: ZenQuotes API
- **PDF Export**: jsPDF
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fitness-coach-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. Get your API keys:
   - **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **ElevenLabs API**: Visit [ElevenLabs](https://elevenlabs.io/)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

1. **Fill Your Profile**: Enter your personal details, fitness goals, and preferences
2. **Generate Plan**: Click "Generate My Fitness Plan" to create your personalized plan
3. **View Plans**: Switch between Workout and Diet tabs
4. **Listen**: Use the "Read My Plan" button to hear your plan
5. **Visualize**: Click on exercises or meals to generate images
6. **Export**: Download your plan as a PDF
7. **Regenerate**: Create a new plan anytime

## 📁 Project Structure

```
fitness-coach-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DailyQuote.tsx
│   ├── FitnessPlanDisplay.tsx
│   ├── ThemeToggle.tsx
│   └── UserForm.tsx
├── lib/
│   ├── elevenlabs.ts
│   ├── gemini.ts
│   ├── quotes.ts
│   └── storage.ts
├── types/
│   └── index.ts
├── .env.local
├── .env.example
└── package.json
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🔑 Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key
- `NEXT_PUBLIC_ELEVENLABS_API_KEY`: Your ElevenLabs API key

## 📝 Features Breakdown

### User Input
- Name, Age, Gender
- Height & Weight
- Fitness Goal (Weight Loss, Muscle Gain, Maintenance, Endurance)
- Fitness Level (Beginner, Intermediate, Advanced)
- Workout Location (Home, Gym, Outdoor)
- Dietary Preference (Vegetarian, Non-Vegetarian, Vegan, Keto)
- Medical History (Optional)
- Stress Level (Optional)

### AI-Generated Content
- 7-day workout plan with exercises, sets, reps, and rest times
- Daily diet plan with breakfast, lunch, dinner, and snacks
- Lifestyle and posture tips
- Motivational messages

### Additional Features
- Voice narration of plans
- Image generation for exercises and meals
- PDF export functionality
- Dark/Light theme toggle
- Local storage persistence
- Daily motivational quotes (rotating fitness quotes)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for the Full Stack Developer role assignment

## 🙏 Acknowledgments

- Google Gemini AI for text generation
- ElevenLabs for voice synthesis
- ZenQuotes for daily motivation
- Next.js team for the amazing framework
