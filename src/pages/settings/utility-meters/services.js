import axiosInstance from '../../../services/axiosInstance';
import { createUtilityMeter, getUtilityMeters } from '../../../services/Network';

export function createUtilityMeterServices(payload) {
    return axiosInstance.post(`${createUtilityMeter}`, payload).then((res) => res);
}

export function getAllUtilityMetersServices(params) {
    return axiosInstance.get(`${getUtilityMeters}${params}`).then((res) => res);
}
