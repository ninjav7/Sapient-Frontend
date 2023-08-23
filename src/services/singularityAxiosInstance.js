import axios from 'axios';
import { BaseUrl, SingularityBaseUrl } from './Network';
import { Cookies } from 'react-cookie';
import { UserStore } from '../store/UserStore';

const apiKey = '2a5154fe73f74442a36c2cd6267ab602';

const cookies = new Cookies();
const userdata = cookies.get('user');
const defaultOptions = {
    baseURL: SingularityBaseUrl,
    // Authorization: `Bearer ${userdata?.token}`,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'X-API-Key': apiKey,
        'x-api-key': '',
        Accept: 'application/json',
    },
};

const singularityAxiosInstance = axios.create(defaultOptions);

singularityAxiosInstance.interceptors.request.use((config) => {
    // let cookies = new Cookies();
    let userdata = cookies.get('user');
    // config.headers.Authorization = `Bearer ${userdata?.token}`;

    return config;
});

singularityAxiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error?.response?.status === 403) {
            localStorage.clear();
            cookies.remove('user', { path: '/account/login' });
            window.open('/', '_self');
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

export default singularityAxiosInstance;
