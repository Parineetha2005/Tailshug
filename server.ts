import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

// Curated fallback directory explicitly labelled when Google Places API key is not configured
const DEMO_PLACES_DIRECTORY = [
  {
    placeId: 'demo-indiranagar-vet-1',
    name: 'Cessna Lifeline Veterinary Hospital — Indiranagar',
    category: 'Health',
    subcategory: 'Veterinary care',
    address: '148, 10th Cross Rd, Stage 1, Indiranagar, Bengaluru, Karnataka 560038',
    city: 'Bengaluru',
    area: 'Indiranagar',
    phone: '+91 80 4115 6200',
    website: 'https://www.cessnalifeline.com',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cessna+Lifeline+Veterinary+Hospital+Indiranagar+Bengaluru',
    rating: 4.6,
    userRatingCount: 1840,
    openNow: true,
    openingHoursText: ['Mon–Sun: Open 24 Hours (Emergency & OPD)'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.9784, lng: 77.6408 },
    summary: 'Multi-specialty veterinary hospital in Indiranagar offering diagnostics, vaccinations, surgery, and 24/7 emergency pet care.',
  },
  {
    placeId: 'demo-koramangala-groom-2',
    name: 'Fuzzy Wuzzy Pet Styling Studio & Spa',
    category: 'Grooming and Hygiene',
    subcategory: 'Grooming',
    address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    city: 'Bengaluru',
    area: 'Koramangala',
    phone: '+91 98450 22910',
    website: 'https://www.google.com/maps/search/?api=1&query=Fuzzy+Wuzzy+Koramangala+Bengaluru',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fuzzy+Wuzzy+Koramangala+Bengaluru',
    rating: 4.7,
    userRatingCount: 620,
    openNow: true,
    openingHoursText: ['Tue–Sun: 10:00 AM – 7:30 PM', 'Monday: Closed'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.9352, lng: 77.6245 },
    summary: 'Gentle dog and cat grooming, medicated baths, breed-standard haircuts, nail trimming, and dental hygiene in Koramangala.',
  },
  {
    placeId: 'demo-whitefield-boarding-3',
    name: 'Hosteller Pets — Cage-Free Boarding & Daycare',
    category: 'Boarding and Daycare',
    subcategory: 'Boarding',
    address: 'ECC Road, Pattandur Agrahara, Whitefield, Bengaluru, Karnataka 560066',
    city: 'Bengaluru',
    area: 'Whitefield',
    phone: '+91 99001 48230',
    website: 'https://www.google.com/maps/search/?api=1&query=Pet+Boarding+Whitefield+Bengaluru',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pet+Boarding+Whitefield+Bengaluru',
    rating: 4.8,
    userRatingCount: 412,
    openNow: true,
    openingHoursText: ['Mon–Sun: 7:30 AM – 8:30 PM'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.9698, lng: 77.7500 },
    summary: 'Spacious lawn play areas, supervised daycare, overnight boarding suites, and daily video updates for pet parents in Whitefield.',
  },
  {
    placeId: 'demo-hsr-training-4',
    name: 'Canine Behaviour & Obedience Academy',
    category: 'Training and Behaviour',
    subcategory: 'Obedience training',
    address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
    city: 'Bengaluru',
    area: 'HSR Layout',
    phone: '+91 97390 11450',
    website: 'https://www.google.com/maps/search/?api=1&query=Dog+Trainer+HSR+Layout+Bengaluru',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dog+Trainer+HSR+Layout+Bengaluru',
    rating: 4.9,
    userRatingCount: 285,
    openNow: true,
    openingHoursText: ['Mon–Sat: 8:00 AM – 6:30 PM'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.9121, lng: 77.6446 },
    summary: 'Positive-reinforcement puppy socialization, leash manners, separation anxiety counselling, and certified canine behaviour therapy.',
  },
  {
    placeId: 'demo-bengaluru-taxi-5',
    name: 'PawsOnWheels AC Pet Taxi & Outstation Relocation',
    category: 'Pet Transportation',
    subcategory: 'Pet taxis',
    address: 'Jayanagar 4th Block, Bengaluru, Karnataka 560011',
    city: 'Bengaluru',
    area: 'Jayanagar',
    phone: '+91 96112 88340',
    website: 'https://www.google.com/maps/search/?api=1&query=Pet+Taxi+Bengaluru',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pet+Taxi+Bengaluru',
    rating: 4.7,
    userRatingCount: 198,
    openNow: true,
    openingHoursText: ['Mon–Sun: 6:00 AM – 10:00 PM'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.9250, lng: 77.5938 },
    summary: 'Sanitized, climate-controlled pet taxis for vet visits, airport transfers, and inter-city outstation pet transport across South India.',
  },
  {
    placeId: 'demo-chennai-rescue-6',
    name: 'Blue Cross of India — Animal Rescue & Adoption',
    category: 'Pet Adoption',
    subcategory: 'Rescue organisations',
    address: '72, Velachery Rd, Guindy, Chennai, Tamil Nadu 600032',
    city: 'Chennai',
    area: 'Guindy',
    phone: '+91 44 2235 4959',
    website: 'https://bluecrossofindia.org',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Cross+of+India+Chennai',
    rating: 4.5,
    userRatingCount: 3420,
    openNow: true,
    openingHoursText: ['Mon–Sun: 9:00 AM – 5:30 PM'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 13.0067, lng: 80.2206 },
    summary: 'Animal welfare organization supporting indie dog and cat adoptions, foster care coordination, and rescue rehabilitation.',
  },
  {
    placeId: 'demo-mysuru-photo-7',
    name: 'WhiskerLens Pet Portraits & Fine Art Studio',
    category: 'Arts and Photography',
    subcategory: 'Pet photography',
    address: 'Gokulam Main Rd, Vani Vilas Mohalla, Mysuru, Karnataka 570002',
    city: 'Mysuru',
    area: 'Gokulam',
    phone: '+91 821 400 2219',
    website: 'https://www.google.com/maps/search/?api=1&query=Pet+Photography+Mysuru',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pet+Photography+Mysuru',
    rating: 4.8,
    userRatingCount: 94,
    openNow: false,
    openingHoursText: ['Wed–Sun: 10:30 AM – 6:00 PM'],
    businessStatus: 'OPERATIONAL',
    location: { lat: 12.3261, lng: 76.6285 },
    summary: 'Outdoor golden-hour pet photography, studio family portraits with pets, and custom archival canvas commissions in Mysuru.',
  },
];

const LOCATION_SUGGESTIONS = [
  'Bengaluru, Karnataka',
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Whitefield, Bengaluru',
  'HSR Layout, Bengaluru',
  'Jayanagar, Bengaluru',
  'Sadashivanagar, Bengaluru',
  'JP Nagar, Bengaluru',
  'Mysuru, Karnataka',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Delhi NCR',
];

function getPlacesApiKey() {
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';
  if (!key || key === 'MY_GOOGLE_PLACES_API_KEY' || key.trim() === '') {
    return '';
  }
  return key.trim();
}

// 1. Location Autocomplete Endpoint
app.get('/api/places/autocomplete', async (req, res) => {
  const input = String(req.query.input || '').trim();
  const apiKey = getPlacesApiKey();

  if (apiKey && input.length >= 2) {
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          input,
          includedRegionCodes: ['in'],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const suggestions = (data.suggestions || [])
          .map((s: { placePrediction?: { text?: { text?: string } } }) => s.placePrediction?.text?.text)
          .filter(Boolean);
        return res.json({ configured: true, suggestions });
      }
    } catch (err) {
      console.error('Autocomplete API error:', err);
    }
  }

  const filtered = input
    ? LOCATION_SUGGESTIONS.filter((loc) => loc.toLowerCase().includes(input.toLowerCase()))
    : LOCATION_SUGGESTIONS.slice(0, 7);

  return res.json({
    configured: Boolean(apiKey),
    suggestions: filtered.length > 0 ? filtered : LOCATION_SUGGESTIONS.slice(0, 5),
  });
});

// 2. Google Places (New) Text Search Endpoint
app.get('/api/places/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  const location = String(req.query.location || 'Bengaluru').trim();
  const category = String(req.query.category || '').trim();
  const apiKey = getPlacesApiKey();

  const textQuery = [query || category || 'pet care services', location].filter(Boolean).join(' in ');

  if (apiKey) {
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.rating,places.userRatingCount,places.regularOpeningHours,places.businessStatus,places.editorialSummary',
        },
        body: JSON.stringify({
          textQuery,
          regionCode: 'IN',
          maxResultCount: 15,
        }),
      });

      if (response.status === 429) {
        return res.status(429).json({
          error: 'RESOURCE_EXHAUSTED',
          message: 'Google Places API quota reached.',
        });
      }

      if (response.ok) {
        const data = await response.json();
        const places = (data.places || []).map((p: Record<string, any>) => ({
          placeId: p.id,
          name: p.displayName?.text || 'Pet Care Business',
          category: category || 'Pet Care Service',
          subcategory: query || 'Local Pet Business',
          address: p.formattedAddress || location,
          city: location.split(',')[0] || 'Bengaluru',
          area: location,
          phone: p.nationalPhoneNumber || p.internationalPhoneNumber || '',
          website: p.websiteUri || '',
          googleMapsUrl: p.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${p.id}`,
          rating: p.rating || 0,
          userRatingCount: p.userRatingCount || 0,
          openNow: p.regularOpeningHours?.openNow ?? null,
          openingHoursText: p.regularOpeningHours?.weekdayDescriptions || [],
          businessStatus: p.businessStatus || 'OPERATIONAL',
          location: p.location ? { lat: p.location.latitude, lng: p.location.longitude } : null,
          summary: p.editorialSummary?.text || '',
        }));

        return res.json({
          configured: true,
          demoMode: false,
          textQuery,
          places,
        });
      }
    } catch (err) {
      console.error('Google Places Text Search failed:', err);
    }
  }

  // Explicitly labelled Demo Preview Mode when GOOGLE_PLACES_API_KEY is not configured
  const qLower = query.toLowerCase();
  const locLower = location.toLowerCase();
  const catLower = category.toLowerCase();

  const matchedDemo = DEMO_PLACES_DIRECTORY.filter((item) => {
    const matchQuery =
      !qLower ||
      item.name.toLowerCase().includes(qLower) ||
      item.category.toLowerCase().includes(qLower) ||
      item.subcategory.toLowerCase().includes(qLower) ||
      item.summary.toLowerCase().includes(qLower);
    const matchCategory =
      !catLower ||
      item.category.toLowerCase().includes(catLower) ||
      item.subcategory.toLowerCase().includes(catLower);
    const matchLoc =
      !locLower ||
      locLower === 'india' ||
      locLower.includes('bengaluru') ||
      item.city.toLowerCase().includes(locLower) ||
      item.area.toLowerCase().includes(locLower) ||
      item.address.toLowerCase().includes(locLower);
    return matchQuery && matchCategory && matchLoc;
  });

  return res.json({
    configured: false,
    demoMode: true,
    notice:
      'Demo Preview Mode: Live Google Places API credentials are not configured yet. Add GOOGLE_PLACES_API_KEY in Settings > Secrets to fetch live Google Maps listings.',
    textQuery,
    places: matchedDemo.length > 0 ? matchedDemo : DEMO_PLACES_DIRECTORY,
  });
});

// 3. Google Place Details Endpoint
app.get('/api/places/:placeId', async (req, res) => {
  const { placeId } = req.params;
  const apiKey = getPlacesApiKey();

  const demoMatch = DEMO_PLACES_DIRECTORY.find((p) => p.placeId === placeId);
  if (demoMatch) {
    return res.json({
      configured: Boolean(apiKey),
      demoMode: true,
      place: demoMatch,
    });
  }

  if (!apiKey) {
    return res.status(404).json({
      configured: false,
      demoMode: true,
      error: 'Google Places API key is not configured and placeId was not found in demo listings.',
    });
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'id,displayName,formattedAddress,location,nationalPhoneNumber,internationalPhoneNumber,websiteUri,googleMapsUri,rating,userRatingCount,regularOpeningHours,businessStatus,editorialSummary,reviews',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch place details from Google Places API.' });
    }

    const p = await response.json();
    return res.json({
      configured: true,
      demoMode: false,
      place: {
        placeId: p.id,
        name: p.displayName?.text || 'Pet Care Business',
        category: 'External Google Maps Listing',
        subcategory: 'Pet Service',
        address: p.formattedAddress || '',
        city: 'India',
        area: '',
        phone: p.nationalPhoneNumber || p.internationalPhoneNumber || '',
        website: p.websiteUri || '',
        googleMapsUrl: p.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${p.id}`,
        rating: p.rating || 0,
        userRatingCount: p.userRatingCount || 0,
        openNow: p.regularOpeningHours?.openNow ?? null,
        openingHoursText: p.regularOpeningHours?.weekdayDescriptions || [],
        businessStatus: p.businessStatus || 'OPERATIONAL',
        location: p.location ? { lat: p.location.latitude, lng: p.location.longitude } : null,
        summary: p.editorialSummary?.text || '',
        reviews: (p.reviews || []).slice(0, 5).map((r: Record<string, any>) => ({
          authorName: r.authorAttribution?.displayName || 'Google User',
          rating: r.rating || 5,
          text: r.text?.text || '',
          relativeTime: r.relativePublishTimeDescription || '',
        })),
      },
    });
  } catch (err) {
    console.error('Place details error:', err);
    return res.status(500).json({ error: 'Internal server error fetching place details.' });
  }
});

// 4. Server-side Gemini Pet-Assistant Widget Endpoint
app.post('/api/assistant', async (req, res) => {
  const userMessage = String(req.body?.message || '').trim();
  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      reply:
        "Hi pet parent! You can explore all 11 pet-care categories under 'Find Services', search by Bengaluru neighbourhood or Indian city, book directly with verified TailsHug providers, or apply under 'Become a Provider'. For direct assistance, reach us at +91 93539 78831 or care@tailshug.com.",
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction:
          'You are Huggy & Bekky, the friendly TailsHug Marketplace Guide (https://www.tailshug.com/). ' +
          'Help visitors understand TailsHug service categories (Health, Grooming & Hygiene, Boarding & Daycare, Training & Behaviour, Pet Adoption, Pet Transportation, Recreation & Exercise, Pet Supplies & Products, Technology & Apps, Memorial Services, Arts & Photography), how bookings work, how to register as a provider, and how to contact TailsHug (+91 93539 78831, care@tailshug.com, Bengaluru, India). ' +
          'Never claim to execute a booking or verify a provider inside chat; guide users to the interactive pages (/search, /services, /become-a-provider, /contact). Keep answers warm, concise (2-4 sentences), and plain text.',
      },
    });

    return res.json({
      reply:
        response.text ||
        'Welcome to TailsHug! Use the search bar to explore pet care services near you or visit our Contact page at care@tailshug.com.',
    });
  } catch (err) {
    console.error('Gemini assistant error:', err);
    return res.json({
      reply:
        "I'm here to help you navigate TailsHug! Browse our 11 pet-care categories, search providers in Bengaluru and across India, or reach our team at +91 93539 78831 / care@tailshug.com.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TailsHug server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
