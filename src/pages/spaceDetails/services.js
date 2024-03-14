import axiosInstance from '../../services/axiosInstance';
import { getEnergyConsumptionBySpaceV2, getSpaceMetadataV2 } from '../../services/Network';

export const fetchEnergyConsumptionBySpace = async (query) => {
    const { spaceId = '', bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern', equipment = false } = query;

    const params = `?space_ids=${spaceId}&building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}&include_equipment=${equipment}`;

    return axiosInstance.get(`${getEnergyConsumptionBySpaceV2}/${params}`).then((res) => res?.data);
};

export const fetchSpaceMetadata = async (query, spaceId) => {
    const { bldgId = '', dateFrom = '', dateTo = '', tzInfo = 'US/Eastern' } = query;

    const params = `?building_id=${bldgId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${tzInfo}`;

    return axiosInstance.get(`${getSpaceMetadataV2}/${spaceId}${params}`).then((res) => res?.data);
};
