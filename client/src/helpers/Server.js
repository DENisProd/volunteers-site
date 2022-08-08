import axios from "axios";
import URL from "../utils/Config";

const server = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
});
server.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
server.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        const message = {
            message: err.response.data.message,
            status: err.response.status
        }
        console.log(originalConfig.url)
        if (originalConfig.url === 'auth/login')
            alert(message.message)

        console.log(err)
        if (err.status===401) {
            window.location.href='/login'
        }
        // if (originalConfig.url !== "/auth/signin" && err.response) {
        //     if (err.response.status === 401 && !originalConfig._retry) {
        //     }
        // }
        return Promise.reject(err);
    }
)



export default server;