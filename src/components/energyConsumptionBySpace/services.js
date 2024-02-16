import { handleAPIRequestParams } from '../../helpers/helpers';
import axiosInstance from '../../services/axiosInstance';
import { getTopEnergyConsumptionBySpaceV2 } from '../../services/Network';
import mockData from './mock.json';

export function fetchTopEnergyConsumptionBySpaceV2(query) {
    return new Promise((res) => res(mockData));

    const {
        spaceId = [],
        bldgId = '',
        dateFrom = '',
        dateTo = '',
        startTime = '',
        endTime = '',
        tzInfo = 'US/Eastern',
    } = query;

    let params = '?';

    if (Array.isArray(spaceId) && spaceId.length > 0) {
        const stringSpaceId = spaceId.join('+');

        params += stringSpaceId + '&';
    }

    const { dateFrom: date_from, dateTo: date_to } = handleAPIRequestParams(dateFrom, dateTo, startTime, endTime);

    params += `building_id=${bldgId}&date_from=${date_from}&date_to=${date_to}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getTopEnergyConsumptionBySpaceV2}${params}`).then((res) => res.data);
}
