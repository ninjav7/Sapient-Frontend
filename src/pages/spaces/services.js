import axiosInstance from '../../services/axiosInstance';
import { getAllSpaces } from '../../services/Network';
import mockData from './mock.json';

export const fetchAllSpacesV2 = async ({ bldgId, dateFrom, dateTo, tzInfo }) => {
    return new Promise((res) => {
        setTimeout(() => res(mockData), 1000);
    });

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getAllSpaces}${params}`).then((res) => res?.data);
};
