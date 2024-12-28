import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true, // for sendiing cookies in every single request
    headers: {
        "Content-Type": "application/json",
    },
});


