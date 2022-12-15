import axiosInstance from '../../../services/axiosInstance';
import { generalBuildingDetail } from '../../../services/Network';

export function updateGeneralBuildingChange(payload = {}, params) {
    return axiosInstance.patch(`${generalBuildingDetail}${params}`, payload).then((res) => res);
}
