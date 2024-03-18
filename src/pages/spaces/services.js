import axiosInstance from '../../services/axiosInstance';
import { getSpaceListV2, getSpacesKPIV2 } from '../../services/Network';
// import mockData from './mock.json';

export const fetchSpaceListV2 = async (query) => {
    // return new Promise((res) => {
    //     setTimeout(() => res(mockData), 1000);
    // });

    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getSpaceListV2}${params}`).then((res) => res?.data);
};

export const fetchKPISpaceV2 = async (query) => {
    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getSpacesKPIV2}${params}`).then((res) => res?.data);
};
