import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:7777/api",
});

//axiosClient.interceptors.request.use

//axiosClient.interceptors.response.use

export default axiosClient;
