import axiosInstance from '../../../services/axiosInstance';
import { generalBuildingDetail, getBuildingTypes } from '../../../services/Network';

export function updateGeneralBuildingChange(payload = {}, params) {
    return axiosInstance.patch(`${generalBuildingDetail}${params}`, payload).then((res) => res);
}

export function updateBuildingTypes() {
    return axiosInstance.get(`${getBuildingTypes}`).then((res) => res);
}
