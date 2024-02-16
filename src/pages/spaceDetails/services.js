import axiosInstance from '../../services/axiosInstance';
import { getEnergyConsumptionBySpaceV2, getSpaceMetadataV2 } from '../../services/Network';
import mockEnergyConsumptionBySpace from './mockEnergyConsumptionBySpace.json';
import mockSpaceMetadata from './mockSpaceMetadata.json';

export const fetchEnergyConsumptionBySpace = async (query) => {
    return new Promise((res) => {
        setTimeout(() => res(mockEnergyConsumptionBySpace), 1000);
    });

    const { spaceId = '', bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?space_ids=${spaceId}&building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getEnergyConsumptionBySpaceV2}${params}`).then((res) => res?.data);
};

export const fetchSpaceMetadata = async (query, spaceId) => {
    return new Promise((res) => {
        setTimeout(() => res(mockSpaceMetadata), 1000);
    });

    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getSpaceMetadataV2}/${spaceId}${params}`).then((res) => res?.data);
};
