import { FitnessPlan, UserProfile } from '@/types';

const STORAGE_KEY = 'fitness_plan';
const PROFILE_KEY = 'user_profile';

export function savePlan(plan: FitnessPlan): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }
}

export function loadPlan(): FitnessPlan | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function loadProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }
}
