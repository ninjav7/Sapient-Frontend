import axiosInstance from '../../services/axiosInstance';
import { energyConsumptionBySpaceV2 } from '../../services/Network';
import mockData from './mock.json';

export function fetchEnergyConsumptionBySpace(query) {
    return new Promise((res) => {
        setTimeout(() => res(mockData), 1000);
    });

    const { spaceId = [], bldgId = '', dateFrom = '', dateTo = '', tzInfo = '' } = query;

    const params = `?space_id=${spaceId}&building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${energyConsumptionBySpaceV2}${params}`).then((res) => res.data);
}
