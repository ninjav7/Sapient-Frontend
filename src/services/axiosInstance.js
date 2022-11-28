import axios from 'axios';
import {BaseUrl} from './Network';
import { Cookies } from 'react-cookie';
let cookies = new Cookies();
let userdata = cookies.get('user');
const defaultOptions = {
  baseURL: BaseUrl,
  Authorization: `Bearer ${userdata?.token}`,
  headers: {
    "Content-Type": 'application/json',
    "accept": 'application/json',
    "Authorization": `Bearer ${userdata?.token}`,
  }
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use((config) => {
  let cookies = new Cookies();
  let userdata = cookies.get('user');
  config.headers.Authorization = `Bearer ${userdata?.token}`;


  return config;
});

export default axiosInstance;
