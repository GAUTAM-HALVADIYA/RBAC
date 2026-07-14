import { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export function setupInterceptors(api: AxiosInstance) {
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

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                console.log("Unauthorized");

                
            }

            return Promise.reject(error);
        },  
    );
}