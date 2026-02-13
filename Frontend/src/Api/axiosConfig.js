import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // withCredentials: true,
    headers:{
        Accept:'application/json'
    }
})

axiosConfig.interceptors.response.use( response => response, async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("refresh-token")) {
            originalRequest._retry = true;

            try {
                await axiosConfig.post("/refresh-token", {}, { withCredentials: true })

                return axiosConfig(originalRequest);
            } catch (err) {
                const isAdminRoute = window.location.pathname.startsWith("/admin")

                if (isAdminRoute) {
                  window.location.href = "/admin/signin"
                } else {
                  window.location.href = "/signin"
                }
            }
        }

        return Promise.reject(error);
    }
)

export default axiosConfig;
