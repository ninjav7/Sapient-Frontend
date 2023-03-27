import axiosInstance from './axiosInstance';
import { getWeather } from './Network';

export function getWeatherData(obj) {
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&timezone=${obj?.tz_info}`;
    return axiosInstance.get(`${getWeather}${params}`).then((res) => res);
}
