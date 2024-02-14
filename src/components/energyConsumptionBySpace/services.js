import axiosInstance from '../../services/axiosInstance';
import { getTopEnergyConsumptionBySpaceV2 } from '../../services/Network';
// import mockData from './mock.json';

export function fetchTopEnergyConsumptionBySpace(query) {
    // return new Promise((res) => res(mockData));

    const { spaceId = [], bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    let params = '?';

    if (Array.isArray(spaceId) && spaceId.length > 0) {
        const stringSpaceId = spaceId.join('+');

        params += stringSpaceId + '&';
    }

    params += `building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getTopEnergyConsumptionBySpaceV2}${params}`).then((res) => res.data);
}
