import axiosInstance from './axiosInstance';
import { getWeather } from './Network';
// import weatherMockDataHour from './weatherMockDataHour.json';
// import weatherMockDataDay from './weatherMockDataDay.json';

export function getWeatherData(obj) {
    // TODO: Delete if it works
    // const response = new Promise((res) => {
    //     res(obj?.range === 'day' ? weatherMockDataDay : weatherMockDataHour);
    // });

    // return response;
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&tz_info=${obj?.tz_info}&aggregate=${obj?.range}`;
    return axiosInstance.get(`${getWeather}${params}`).then((res) => res);
}
