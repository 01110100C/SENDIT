// Finds climbing gyms near a US zip code.
//
// Gym data comes from Google Places when EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is set
// (see README), otherwise from OpenStreetMap, which is free but less complete.

export type Gym = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  website?: string;
  phone?: string;
  rating?: number;
  ratingCount?: number;
};

export type Place = {
  label: string; // e.g. "Boulder, CO"
  latitude: number;
  longitude: number;
};

export const SEARCH_RADIUS_MILES = 25;
const METERS_PER_MILE = 1609.34;
const REQUEST_TIMEOUT_MS = 20000;

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export const gymDataSource = GOOGLE_PLACES_API_KEY ? 'Google' : 'OpenStreetMap';

export class GymSearchError extends Error {}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Looks up the center of a 5-digit US zip code. */
export async function geocodeZip(zip: string): Promise<Place> {
  if (!/^\d{5}$/.test(zip)) {
    throw new GymSearchError('Enter a 5-digit US zip code.');
  }

  let res: Response;
  try {
    res = await fetchWithTimeout(`https://api.zippopotam.us/us/${zip}`);
  } catch {
    throw new GymSearchError('Could not reach the location service. Check your connection.');
  }
  if (res.status === 404) throw new GymSearchError(`Zip code ${zip} wasn't found.`);
  if (!res.ok) throw new GymSearchError('Could not look up that zip code. Try again.');

  const data = await res.json();
  const place = data.places?.[0];
  if (!place) throw new GymSearchError(`Zip code ${zip} wasn't found.`);

  return {
    label: `${place['place name']}, ${place['state abbreviation']}`,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
  };
}

/** Climbing gyms within SEARCH_RADIUS_MILES of a point, nearest first. */
export async function findClimbingGyms(center: Place): Promise<Gym[]> {
  const gyms = GOOGLE_PLACES_API_KEY
    ? await searchGooglePlaces(center, GOOGLE_PLACES_API_KEY)
    : await searchOpenStreetMap(center);

  return gyms
    .filter((g) => g.distanceMiles <= SEARCH_RADIUS_MILES)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

// ---------- Google Places (Text Search, Places API (New)) ----------

async function searchGooglePlaces(center: Place, apiKey: string): Promise<Gym[]> {
  let res: Response;
  try {
    res = await fetchWithTimeout('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.location',
          'places.websiteUri',
          'places.nationalPhoneNumber',
          'places.rating',
          'places.userRatingCount',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery: 'climbing gym',
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: { latitude: center.latitude, longitude: center.longitude },
            // Google caps the bias radius at 50 km; results are filtered by distance afterwards.
            radius: Math.min(SEARCH_RADIUS_MILES * METERS_PER_MILE, 50000),
          },
        },
      }),
    });
  } catch {
    throw new GymSearchError('Could not reach Google Places. Check your connection.');
  }
  if (!res.ok) {
    throw new GymSearchError('Google Places search failed. Check the API key setup.');
  }

  const data = await res.json();
  return (data.places ?? []).map((p: any): Gym => ({
    id: p.id,
    name: p.displayName?.text ?? 'Climbing gym',
    address: p.formattedAddress ?? '',
    latitude: p.location.latitude,
    longitude: p.location.longitude,
    distanceMiles: distanceMiles(center, p.location.latitude, p.location.longitude),
    website: p.websiteUri,
    phone: p.nationalPhoneNumber,
    rating: p.rating,
    ratingCount: p.userRatingCount,
  }));
}

// ---------- OpenStreetMap (Overpass API) ----------

// Public Overpass servers are often busy, so try each in turn.
const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

// OSM tags anything climbing-related with sport=climbing, including outdoor crags.
// These tags mark the indoor gyms.
const GYM_LEISURE_TAGS = new Set(['sports_centre', 'fitness_centre', 'sports_hall']);

async function searchOpenStreetMap(center: Place): Promise<Gym[]> {
  const radiusMeters = Math.round(SEARCH_RADIUS_MILES * METERS_PER_MILE);
  const query =
    `[out:json][timeout:25];` +
    `nwr["sport"~"climbing"]["name"](around:${radiusMeters},${center.latitude},${center.longitude});` +
    `out center tags;`;

  for (const server of OVERPASS_SERVERS) {
    try {
      const res = await fetchWithTimeout(server, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) continue;
      const data = await res.json();
      return (data.elements ?? []).filter(isOsmGym).map((e: any) => osmToGym(e, center));
    } catch {
      // Busy or unreachable; try the next server.
    }
  }
  throw new GymSearchError('The gym search service is busy right now. Try again in a minute.');
}

function isOsmGym(element: any) {
  const tags = element.tags ?? {};
  return (
    GYM_LEISURE_TAGS.has(tags.leisure) ||
    tags.indoor === 'yes' ||
    tags['climbing:indoor'] === 'yes'
  );
}

function osmToGym(element: any, center: Place): Gym {
  const tags = element.tags;
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const cityLine = [tags['addr:city'], tags['addr:state']].filter(Boolean).join(', ');

  return {
    id: `${element.type}/${element.id}`,
    name: tags.name,
    address: [street, cityLine].filter(Boolean).join(', '),
    latitude,
    longitude,
    distanceMiles: distanceMiles(center, latitude, longitude),
    website: tags.website ?? tags['contact:website'],
    phone: tags.phone ?? tags['contact:phone'],
  };
}

// ---------- Helpers ----------

/** Straight-line distance in miles (haversine). */
function distanceMiles(from: Place, latitude: number, longitude: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(latitude - from.latitude);
  const dLon = toRad(longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) * Math.cos(toRad(latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}
