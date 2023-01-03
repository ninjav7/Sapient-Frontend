import axiosInstance from '../../../services/axiosInstance';
import {
    generalPanels,
    createPanel,
    updatePanel,
    deletePanel,
    resetBreakers,
    getBreakers,
    getLocation,
    generalEquipments,
    generalPassiveDevices,
    updateLinkBreakers,
    deleteBreaker,
} from '../../../services/Network';

export function getPanelsData(params) {
    return axiosInstance.get(`${generalPanels}${params}`).then((res) => res);
}

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function addNewPanel(params, payload) {
    return axiosInstance.post(`${createPanel}${params}`, payload).then((res) => res);
}

export function deleteCurrentPanel(params) {
    return axiosInstance.delete(`${deletePanel}${params}`).then((res) => res);
}

export function getBreakerDeleted(params) {
    return axiosInstance.delete(`${deleteBreaker}${params}`).then((res) => res);
}

export function resetAllBreakers(params, payload) {
    return axiosInstance.post(`${resetBreakers}${params}`, payload).then((res) => res);
}

export function updatePanelDetails(params, payload) {
    return axiosInstance.patch(`${updatePanel}${params}`, payload).then((res) => res);
}

export function getBreakersList(params) {
    return axiosInstance.get(`${getBreakers}${params}`).then((res) => res);
}

export function getEquipmentsList(params, payload = {}) {
    return axiosInstance.post(`${generalEquipments}${params}`, payload).then((res) => res);
}

export function getPassiveDeviceList(params) {
    return axiosInstance.get(`${generalPassiveDevices}${params}`).then((res) => res);
}

export function updateBreakersLink(params, payload) {
    return axiosInstance.post(`${updateLinkBreakers}${params}`, payload).then((res) => res);
}
