import axios from 'axios';
import config from '../config';
// 对所有 axios 请求做处理
axios.defaults.withCredentials = true;

const instance = axios.create({ baseURL: config.BASE_URL });

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        return res.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
