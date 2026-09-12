import listingsData from '../data/listings.json';
import rentalsData from '../data/rentals.json';
import projectsData from '../data/projects.json';

export const BASE_URL = 'https://solve.ivy.homes';
export const API_KEY = 'IVY26-965B599A653B';

export interface User {
  email: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: User | null;
}

export interface Listing {
  listing_id: string;
  listing_url: string;
  website: string;
  city_id: number;
  apartment_name: string;
  locality: string;
  property_type: string;
  bedroom: number;
  bathroom: number;
  balcony: number;
  floor: number;
  total_floors: number;
  furnishing: string;
  facing_direction: string;
  covered_parking: number;
  price: number;
  carpet_area: number;
  super_built_up_area?: number;
  latitude: number;
  longitude: number;
  posted_by: string;
  posted_by_name: string;
  posted_by_contact: string;
  project_id: string | null;
  is_verified: boolean;
  description: string;
  posted_at: string;
  is_live: boolean;
}

export interface Rental {
  listing_id: string;
  listing_url: string;
  website: string;
  city_id: number;
  title: string;
  apartment_name: string;
  locality: string;
  property_type: string;
  bedroom: number;
  bathroom: number;
  floor: number;
  total_floors: number;
  furnishing: string;
  facing_direction: string;
  price: number;
  deposit: number;
  maintenance?: number;
  carpet_area: number;
  super_builtup_area?: number;
  latitude: number;
  longitude: number;
  posted_by: string;
  posted_by_name: string;
  posted_by_contact: string;
  description: string;
  posted_at: string;
}

export interface Project {
  project_id: string;
  project_url: string;
  city_id: number;
  apartment_name: string;
  developer_name: string;
  locality: string;
  project_status: string;
  total_units: number;
  total_towers: number;
  total_floors: number;
  launch_date: string;
  possession_date: string;
  rera_number: string;
  min_area_sqft: number;
  max_area_sqft: number;
  amenities: string[];
  latitude: number;
  longitude: number;
  total_listings: number;
  price_min: number;
  price_max: number;
}

const STORAGE_KEY = 'ivy_auth_session';

export function getStoredSession(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session: AuthState = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function loginApi(email: string, password: string): Promise<AuthState> {
  const resp = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(err.detail || 'Login failed');
  }

  const data = await resp.json();
  const expiresAt = Date.now() + (data.expires_in || 900) * 1000;
  const authState: AuthState = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt,
    user: data.user || { email },
  };

  saveSession(authState);
  return authState;
}

export async function refreshTokenApi(refreshTokenStr: string): Promise<AuthState> {
  const resp = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ refresh_token: refreshTokenStr }),
  });

  if (!resp.ok) {
    clearSession();
    throw new Error('Refresh token invalid');
  }

  const data = await resp.json();
  const current = getStoredSession();
  const authState: AuthState = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshTokenStr,
    expiresAt: Date.now() + (data.expires_in || 900) * 1000,
    user: data.user || current?.user || { email: 'demo1@ivy.homes' },
  };

  saveSession(authState);
  return authState;
}

export function fetchListingsLocal(): Listing[] {
  return listingsData as Listing[];
}

export function fetchRentalsLocal(): Rental[] {
  return rentalsData as Rental[];
}

export function fetchProjectsLocal(): Project[] {
  return projectsData as Project[];
}
