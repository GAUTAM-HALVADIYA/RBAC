import { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export function setupInterceptors(api: AxiosInstance) {
    // Request Interceptor
    api.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        },
    );

    // Response Interceptor
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                console.log("Unauthorized");

                // Later:
                // Call Refresh Token API
                // Retry Original Request
                // Logout if refresh fails
            }

            return Promise.reject(error);
        },  
    );
}