import axiosInstance from '../../../services/axiosInstance';
import {
    createDevice,
    getLocation,
    generalPassiveDevices,
    updateDevice,
    deletePassiveDevice,
} from '../../../services/Network';

export function savePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${createDevice}${params}`, payload).then((res) => res);
}

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function getPassiveDeviceData(params) {
    return axiosInstance.get(`${generalPassiveDevices}${params}`).then((res) => res);
}

export function updatePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${updateDevice}${params}`, payload).then((res) => res);
}

export function deletePassiveDeviceData(params) {
    return axiosInstance.delete(`${deletePassiveDevice}${params}`).then((res) => res);
}
