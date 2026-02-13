import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        Accept:'application/json'
    }
})

axiosConfig.interceptors.response.use( response => response, async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post("/refresh-token", {}, { withCredentials: true })

                return axiosConfig(originalRequest);
            } catch (err) {
                window.location.href = "/signin";
            }
        }

        return Promise.reject(error);
    }
)

export default axiosConfig;
