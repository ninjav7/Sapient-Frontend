import axiosInstance from '../../../services/axiosInstance';
import { generalBuildingDetailV2, getBuildingTypes } from '../../../services/Network';

export function updateGeneralBuildingChange(payload = {}, params) {
    return axiosInstance.patch(`${generalBuildingDetailV2}${params}`, payload).then((res) => res);
}

export function updateBuildingTypes() {
    return axiosInstance.get(`${getBuildingTypes}`).then((res) => res);
}
