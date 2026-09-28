import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health & Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'Trippack',
  });
});

// Gemini Travel Advice Endpoint
app.post('/api/gemini/travel-advice', async (req, res) => {
  const { from, to, days, purpose, temperature, clothesGender } = req.body;

  if (!ai) {
    // Provide realistic smart recommendation fallback
    return res.json({
      success: true,
      mode: 'curated',
      overview: `For your ${days || 4}-day journey from ${from || 'Hyderabad'} to ${to || 'Bangalore'} for "${purpose || 'General Travel'}", prepare for average temperatures around ${temperature || '26°C - 32°C'}.`,
      packingTips: [
        `Bring breathable cotton fabrics and comfortable footwear for daytime.`,
        `Carry a light jacket or stole for cooler evenings and air-conditioned transit.`,
        `Keep digital and physical copies of your travel IDs and bookings handy.`,
        `Carry essential medicines including rehydration salts and basic analgesics.`
      ],
      destinationTips: [
        `Check local transit options or app-based cabs for seamless transit in ${to || 'your destination'}.`,
        `Peak traffic usually occurs between 9:00 AM - 11:00 AM and 5:30 PM - 8:30 PM.`,
        `Popular local foods and cafes around the city center are worth trying during downtime.`
      ]
    });
  }

  try {
    const prompt = `You are Trippack's AI Travel Assistant. Provide concise, smart travel tips and luggage packing advice for this trip:
Origin: ${from || 'Origin'}
Destination: ${to || 'Destination'}
Duration: ${days || 3} days
Travel Purpose: ${purpose || 'General Travel'}
Forecast Temperature: ${temperature || 'Moderate'}
Gender preference: ${clothesGender || 'Any'}

Format response strictly in valid JSON matching this schema:
{
  "overview": "Short 1-2 sentence trip overview and weather expectations",
  "packingTips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "destinationTips": ["destination tip 1", "destination tip 2", "destination tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      mode: 'gemini',
      ...parsed,
    });
  } catch (err: any) {
    console.warn('Gemini API call failed, falling back to curated intelligence:', err.message);
    return res.json({
      success: true,
      mode: 'curated-fallback',
      overview: `For your ${days || 4}-day journey from ${from || 'Hyderabad'} to ${to || 'Bangalore'} for "${purpose || 'General Travel'}", prepare for comfortable transit with expected temperatures around ${temperature || '26°C - 32°C'}.`,
      packingTips: [
        `Bring breathable cotton fabrics and comfortable footwear for daytime exploration.`,
        `Carry a light jacket, hoodie or stole for cooler air-conditioned flights and evening breeze.`,
        `Keep digital and physical copies of your travel IDs and bookings handy.`,
        `Pack an emergency medicine kit (rehydration salts, analgesics, band-aids).`
      ],
      destinationTips: [
        `Book app-based cabs or metro cards ahead of rush hour in ${to || 'your destination'}.`,
        `Check local weather in the morning for localized showers or temperature swings.`,
        `Explore iconic local breakfast and street food spots near your stay.`
      ]
    });
  }
});

// Gemini Smart Packing Generator Endpoint
app.post('/api/gemini/packing-suggest', async (req, res) => {
  const { from, to, days, purpose, gender, healthStatus } = req.body;

  if (!ai) {
    const countMultiplier = Math.max(1, Math.min(Number(days) || 3, 14));
    return res.json({
      success: true,
      mode: 'curated',
      suggestedItems: {
        clothes: [
          { name: 'T-Shirts / Tops', count: countMultiplier, icon: 'shirt' },
          { name: 'Jeans / Pants', count: Math.ceil(countMultiplier / 2), icon: 'pants' },
          { name: purpose === 'Event' || purpose === 'Business' ? 'Formal Shirt / Blazer' : 'Casual Shirts', count: 2, icon: 'suit' },
          { name: 'Comfortable Shorts / Loungewear', count: 2, icon: 'shorts' },
          { name: 'Light Jacket / Cardigan', count: 1, icon: 'jacket' }
        ],
        documents: ['ID Proof (Aadhar / Passport)', 'Tickets / Boarding Passes', 'Hotel Reservation Confirmation'],
        medicines: healthStatus === 'unhealthy' 
          ? ['Prescription Medicines', 'Paracetamol', 'Allergy Relief', 'Electrolytes / ORS', 'Bandages']
          : ['Paracetamol / Pain Relief', 'First Aid Basics', 'Band-aids'],
        accessories: ['Smartphone & Laptop Chargers', 'Power Bank (10000mAh+)', 'Toiletries Kit', 'Sunglasses & Sunscreen', 'Travel Adapter']
      }
    });
  }

  try {
    const prompt = `Generate a recommended packing list for a ${days || 3}-day trip from ${from} to ${to} for "${purpose}".
Gender: ${gender}
Health condition: ${healthStatus}

Return strictly a valid JSON object matching:
{
  "clothes": [
    {"name": "string", "count": number, "icon": "string"}
  ],
  "documents": ["doc1", "doc2"],
  "medicines": ["med1", "med2"],
  "accessories": ["acc1", "acc2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      mode: 'gemini',
      suggestedItems: parsed,
    });
  } catch (err: any) {
    console.warn('Gemini packing error, using curated packing generator:', err.message);
    const countMultiplier = Math.max(1, Math.min(Number(days) || 3, 14));
    return res.json({
      success: true,
      mode: 'curated-fallback',
      suggestedItems: {
        clothes: [
          { name: 'T-Shirts / Tops', count: countMultiplier, icon: 'shirt' },
          { name: 'Jeans / Pants', count: Math.ceil(countMultiplier / 2), icon: 'pants' },
          { name: purpose === 'Event' || purpose === 'Business' ? 'Formal Shirt / Blazer' : 'Casual Shirts', count: 2, icon: 'suit' },
          { name: 'Comfortable Shorts / Loungewear', count: 2, icon: 'shorts' },
          { name: 'Light Jacket / Cardigan', count: 1, icon: 'jacket' }
        ],
        documents: ['ID Proof (Aadhar / Passport)', 'Tickets / Boarding Passes', 'Hotel Reservation Confirmation'],
        medicines: healthStatus === 'unhealthy' 
          ? ['Prescription Medicines', 'Paracetamol', 'Allergy Relief', 'Electrolytes / ORS', 'Bandages']
          : ['Paracetamol / Pain Relief', 'First Aid Basics', 'Band-aids'],
        accessories: ['Smartphone & Laptop Chargers', 'Power Bank (10000mAh+)', 'Toiletries Kit', 'Sunglasses & Sunscreen', 'Travel Adapter']
      }
    });
  }
});

// Vite Middleware for Dev / Static file serving for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Trippack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
