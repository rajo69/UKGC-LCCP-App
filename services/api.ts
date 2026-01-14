import { ApiResponse } from '../types';

const API_URL = 'https://ukgc-lccp-rag-api-bpkp.onrender.com/chat';

export const sendMessageToApi = async (question: string): Promise<ApiResponse> => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  const body = JSON.stringify({ question });

  const processResponse = async (res: Response) => {
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let details = res.statusText;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          // Handle FastAPI validation errors (array of errors) or generic detail string
          if (errorData.detail) {
            details = Array.isArray(errorData.detail) 
              ? errorData.detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ')
              : String(errorData.detail);
          }
        } else {
          const text = await res.text();
          if (text) details = text;
        }
      } catch (e) {
        // Failed to parse error details, stick with status text
      }
      
      throw new Error(`API Error (${res.status}): ${details}`);
    }
    return res.json();
  };

  try {
    // Attempt 1: Direct Fetch
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body,
    });
    return await processResponse(response);
  } catch (error: any) {
    // Check for network errors (CORS, offline, DNS) which typically manifest as "Failed to fetch" or TypeError
    const isNetworkError = error.message === 'Failed to fetch' || error.name === 'TypeError';

    if (isNetworkError) {
      console.warn('Direct connection failed. Attempting via CORS proxy...', error);
      try {
        // Attempt 2: Fallback via corsproxy.io
        // This bypasses browser CORS restrictions if the API server doesn't support them
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(API_URL)}`;
        const proxyResponse = await fetch(proxyUrl, {
          method: 'POST',
          headers,
          body,
        });
        return await processResponse(proxyResponse);
      } catch (proxyError: any) {
        console.error('CORS Proxy attempt failed:', proxyError);
        throw new Error(`Connection failed. Please check your internet connection. (Details: ${proxyError.message})`);
      }
    }
    
    // Re-throw if it wasn't a network error (e.g. logic error)
    throw error;
  }
};
