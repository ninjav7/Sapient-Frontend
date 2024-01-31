import axiosInstance from '../../services/axiosInstance';
import { energyConsumptionBySpaceV2 } from '../../services/Network';
import mockData from './mock.json';

export function fetchEnergyConsumptionBySpace(query) {
    const { spaceId = [], bldgId = '', dateFrom = '', dateTo = '', tzInfo = '' } = query;

    let params = '?';

    if (Array.isArray(spaceId) && spaceId.length > 0) {
        const stringSpaceId = spaceId.join('+');

        params += stringSpaceId + '&';
    }

    params += `building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=US/Eastern`;

    return axiosInstance.get(`${energyConsumptionBySpaceV2}${params}`).then((res) => res.data);
}
