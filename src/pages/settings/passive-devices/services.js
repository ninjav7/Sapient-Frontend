import axiosInstance from '../../../services/axiosInstance';
import { createDevice, getLocation } from '../../../services/Network';

export function savePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${createDevice}${params}`, payload).then((res) => res);
}

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}
