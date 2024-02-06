import axiosInstance from '../../services/axiosInstance';
import { getAllSpaces } from '../../services/Network';
// import mockData from './mock.json';

export const fetchAllSpacesV2 = async (query) => {
    // return new Promise((res) => {
    //     setTimeout(() => res(mockData), 1000);
    // });

    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getAllSpaces}${params}`).then((res) => res?.data);
};
