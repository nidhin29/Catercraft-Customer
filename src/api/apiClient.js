const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // For credentials (cookies) to be sent/received
  config.credentials = "include";

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized by attempting a silent refresh
    if (response.status === 401 && endpoint !== "/api/v1/user/auth/refresh-token") {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        if (refreshResponse.ok) {
          // Retry the original request
          return apiClient(endpoint, options);
        }
      } catch (e) {
        console.error("Silent refresh failed:", e);
      }
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Call Error:", error.message);
    throw error;
  }
};

export default apiClient;
