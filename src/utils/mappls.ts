/**
 * Mappls Token Management Service
 * Handles OAuth2 token generation and storage for Mappls API requests.
 */

interface MapplsToken {
    access_token: string;
    expires_in: number;
    generated_at: number;
}

const STORAGE_KEY = 'mappls_token_data';

export const getMapplsToken = async (): Promise<string | null> => {
    const clientId = import.meta.env.VITE_MAPPLS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_MAPPLS_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId.includes('YOUR_')) {
        console.warn('Mappls check failed:', {
            hasId: !!clientId,
            hasSecret: !!clientSecret,
            isPlaceholder: clientId?.includes('YOUR_')
        });
        console.error('Mappls credentials not configured in .env');
        return null;
    }

    // Check storage for valid cached token
    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) {
        const token: MapplsToken = JSON.parse(cachedData);
        const now = Date.now();
        // Refresh 5 minutes before expiry
        if (now < token.generated_at + (token.expires_in - 300) * 1000) {
            return token.access_token;
        }
    }

    // Fetch new token
    try {
        const response = await fetch('/mappls-security/api/security/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!response.ok) throw new Error('Failed to fetch Mappls token');

        const data = await response.json();
        const tokenData: MapplsToken = {
            access_token: data.access_token,
            expires_in: data.expires_in,
            generated_at: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
        return tokenData.access_token;
    } catch (error) {
        console.error('Error getting Mappls access token:', error);
        return null;
    }
};
