import { getAccessToken } from './auth';

const BASE_URL = process.env.EXPO_PUBLIC_FT_API_URL || 'https://api.intra.42.fr';

export async function fetchUserProfile(login) {
  const token = await getAccessToken();
  const trimmed = login.trim().toLowerCase();

  const response = await fetch(`${BASE_URL}/v2/users/${encodeURIComponent(trimmed)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    throw new Error(`User "${trimmed}" not found`);
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
