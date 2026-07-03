/**
 * API client for the FinPulse FastAPI backend.
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8001";

/**
 * Generic fetch wrapper with error handling and JWT support.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, val);
      }
    });
  }

  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle FormData
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {}
    
    // Quick redirect on unauthorized for protected routes
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/pdf")) {
    return response.blob();
  }
  
  // Return null on 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

