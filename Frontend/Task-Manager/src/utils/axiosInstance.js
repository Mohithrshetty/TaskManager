import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    });

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
         
        
        if (error.response.status === 401) {
           //redirect to login page
            window.location.href = "/login";
        }else if (error.response.status === 500) {
            console.log("Server error,please try again later");
          } 
          //redirect to forbidden page
         } else if (error.code === "ECONNABORTED") {
            console.log("Request timed out, please try again later");
           
    }
        return Promise.reject(error);
    }
);

export default axiosInstance;