import axiosInstance from '../../services/axiosInstance';
import { getSpaceListV2 } from '../../services/Network';
// import mockData from './mock.json';

export const fetchSpaceListV2 = async (query) => {
    // return new Promise((res) => {
    //     setTimeout(() => res(mockData), 1000);
    // });

    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern', search = '', orderedBy, sortedBy } = query;

    let params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    if (search) params += `&search=${search}`;

    if (orderedBy && sortedBy) {
        params += `&ordered_by=${orderedBy}&sort_by=${sortedBy}`;
    }

    return axiosInstance.get(`${getSpaceListV2}${params}`).then((res) => res?.data);
};
