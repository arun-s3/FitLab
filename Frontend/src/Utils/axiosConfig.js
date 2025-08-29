import axios from 'axios'

const baseApiUrl = import.meta.env.VITE_API_BASE_URL


const axiosConfig = axios.create({
    baseURL: baseApiUrl,
    headers:{
        Accept:'application/json'
    }
    
})
export default axiosConfig