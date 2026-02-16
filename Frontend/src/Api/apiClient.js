import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        Accept:'application/json'
    }
})

apiClient.interceptors.response.use( response => response, async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("refresh-token")) {
            originalRequest._retry = true;

            try {
                await apiClient.post("/refresh-token", {}, { withCredentials: true })

                return apiClient(originalRequest);
            } catch {
                const currentPath = window.location.pathname;
                const isAdminRoute = currentPath.startsWith("/admin");

                if (!currentPath.includes("signin")) {
                  window.location.replace(  isAdminRoute ? "/admin/signin" : "/signin" );
                }
            }

        return Promise.reject(error);
    }
})

export default apiClient;
