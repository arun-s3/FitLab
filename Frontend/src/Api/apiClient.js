import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 50000,
    headers:{
        Accept:'application/json'
    }
})

apiClient.interceptors.response.use( response => response, async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("refresh-token")) {
            originalRequest._retry = true;

            try {
                await apiClient.post("/refresh-token")

                return apiClient(originalRequest);
            } catch {
                if (error.response?.status === 401 && error.response.data?.guest) {
                //   return { success: false, guest: true };
                    throw error
                }
                throw error
            }
    }
    return Promise.reject(error);
})

export default apiClient;
