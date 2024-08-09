import axios from 'axios'

const axiosConfig = axios.create({
    baseURL: 'http://localhost:3000/',
    headers:{
        Accept:'application/json'
    }
    
})
export default axiosConfig