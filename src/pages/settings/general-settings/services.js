import axiosInstance from '../../../services/axiosInstance';
import {
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
} from '../../../services/Network';

export function updateGeneralBuildingChange(payload = {}, params) {
    return axiosInstance.patch(`${generalBuildingDetail}${params}`, payload).then((res) => res);
}

export function updateBuildingAddressChange(payload = {}, params) {
    return axiosInstance.patch(`${generalBuildingAddress}${params}`, payload).then((res) => res);
}

export function updateBuildingDateTimeChange(payload = {}, params) {
    return axiosInstance.patch(`${generalDateTime}${params}`, payload).then((res) => res);
}

export function updateOperatingHourChange(payload = {}, params) {
    return axiosInstance.patch(`${generalOperatingHours}${params}`, payload).then((res) => res);
}
