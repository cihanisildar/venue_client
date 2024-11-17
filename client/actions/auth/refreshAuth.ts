// src/actions/refreshAuth.ts

export async function refreshAuthToken() {
    // Here you would typically make a call to your backend to refresh the token
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if needed
    });
  
    if (!response.ok) {
      throw new Error('Failed to refresh auth token');
    }
  
    const data = await response.json();
    return data; // Return the response data (e.g., new auth token)
  }