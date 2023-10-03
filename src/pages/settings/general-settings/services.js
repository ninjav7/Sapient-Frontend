import axiosInstance from '../../../services/axiosInstance';
import { generalBuildingDetailV2, getBuildingTypes } from '../../../services/Network';

export function updateGeneralBuildingChange(params, payload = {}) {
    return axiosInstance.patch(`${generalBuildingDetailV2}${params}`, payload).then((res) => res);
}

export function getAllBuildingTypes() {
    return axiosInstance.get(`${getBuildingTypes}`).then((res) => res);
}
