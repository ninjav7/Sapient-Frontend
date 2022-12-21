import axiosInstance from '../../../services/axiosInstance';
import { generalActiveDevices, getLocation, createDevice, searchDevices } from '../../../services/Network';

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function getActiveDeviceData(params) {
    return axiosInstance.get(`${generalActiveDevices}${params}`).then((res) => res);
}
