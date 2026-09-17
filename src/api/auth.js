const TOKEN_URL = process.env.EXPO_PUBLIC_FT_OAUTH_TOKEN_URL || 'https://api.intra.42.fr/oauth/token';

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getAccessToken() {
  const now = Date.now() / 1000;
  if (cachedToken && now < tokenExpiresAt - 60) {
    return cachedToken;
  }

  const clientId = process.env.EXPO_PUBLIC_FT_CLIENT_ID;
  const clientSecret = process.env.EXPO_PUBLIC_FT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing 42 API credentials in .env');
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Auth failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = (Date.now() / 1000) + data.expires_in;

  return cachedToken;
}
