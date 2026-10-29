import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up the Axios Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    // Log the full error for debugging
    console.error("Axios Error:", error); // Log the error object
    if (error.response) {
      console.error("Response Error:", error.response); // Log the response if it exists
    }

    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.removeItem("token");
          return Promise.reject(error); // If no refresh token, clear dead token & reject
        }

        // Request to refresh the token
        const refreshResponse = await axios.post(
          `${apiBaseUrl}/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem("token", accessToken);

        // Retry the original request with the new token
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.warn("Refresh token expired, clearing dead session:", refreshError);
        // Clear expired credentials immediately so app falls back to guest mode cleanly
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("Id");
        localStorage.removeItem("username");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject other types of errors
  }
);

export default axiosInstance;
