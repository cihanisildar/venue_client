import Cookies from 'js-cookie';

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.exp < Math.floor(Date.now() / 1000);
}

export async function refreshAuthToken(): Promise<boolean> {
  const refreshToken = Cookies.get('vn_refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken, newRefreshToken } = await response.json();
      Cookies.set('vn_auth_token', accessToken, { expires: 1 });
      Cookies.set('vn_refresh_token', newRefreshToken, { expires: 7 });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    return false;
  }
}