import axios from "axios";
import { useRouter } from 'vue-router';
import { router } from '@/router';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            router.push({
                name: "login"
            });

            return Promise.reject(error.response.data);
        } else if (error.request) {
            return Promise.reject({ message: 'Can not connect to server.' });
        } else {
            return Promise.reject({ message: error.message });
        }
    }
);

const get = (url, config = {}) => {
    return instance.get(url, { ...config });
};

const post = (url, data = {}, config = {}) => {
    return instance.post(url, data, { ...config });
};

const put = (url, data = {}, config = {}) => {
    return instance.put(url, data, { ...config });
};

const _delete = (url, config = {}) => {
    return instance.delete(url, { ...config });
};

export {
    instance, // để ai muốn dùng raw axios vẫn dùng được
    get,
    post,
    put,
    _delete as delete
};