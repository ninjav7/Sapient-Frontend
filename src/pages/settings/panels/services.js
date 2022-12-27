import axiosInstance from '../../../services/axiosInstance';
import { generalPanels, createPanel, getLocation } from '../../../services/Network';

export function getPanelsData(params) {
    return axiosInstance.get(`${generalPanels}${params}`).then((res) => res);
}

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function addNewPanel(params, payload) {
    return axiosInstance.post(`${createPanel}${params}`, payload).then((res) => res);
}
