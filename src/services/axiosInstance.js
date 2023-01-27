import axios from 'axios';
import { BaseUrl } from './Network';
import { Cookies } from 'react-cookie';
import { UserStore } from '../store/UserStore';

const cookies = new Cookies();
const userdata = cookies.get('user');
const defaultOptions = {
    baseURL: BaseUrl,
    Authorization: `Bearer ${userdata?.token}`,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userdata?.token}`,
    },
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use((config) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    config.headers.Authorization = `Bearer ${userdata?.token}`;

    return config;
});

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error?.response?.status === 403) {
            localStorage.clear();
            cookies.remove('user', { path: '/' });
            window.location.reload();
            UserStore.update((s) => {
                s.showNotification = true;
                s.notificationMessage = 'Token expired / invalid. Please login again!';
                s.notificationType = 'error';
            });
            return;
        }
        return error?.response;
    }
);

export default axiosInstance;
