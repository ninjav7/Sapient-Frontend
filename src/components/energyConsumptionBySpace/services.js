import axiosInstance from '../../services/axiosInstance';
import { getTopEnergyConsumptionBySpaceV2 } from '../../services/Network';

export function fetchTopEnergyConsumptionBySpaceV2(query) {
    const { spaceId = [], bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern', yearly = false } = query;

    let params = '?';

    if (Array.isArray(spaceId) && spaceId.length > 0) {
        const stringSpaceId = spaceId.join('+');

        params += stringSpaceId + '&';
    }

    params += `building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}&by_year=${yearly}`;

    return axiosInstance.get(`${getTopEnergyConsumptionBySpaceV2}${params}`).then((res) => res.data);
}
