import axiosInstance from '../../../services/axiosInstance';
import { customerList, selectCustomer, getCustomer, offlineDevices } from '../../../services/Network';

export function fetchCustomerList(params) {
    return axiosInstance.get(`${customerList}${params}`).then((res) => res);
}

export function fetchSelectedCustomer(params) {
    return axiosInstance.post(`${selectCustomer}${params}`).then((res) => res);
}

export function createCustomer(payload) {
    return axiosInstance.post(`${getCustomer}`, payload).then((res) => res);
}

export function fetchOfflineDevices() {
    return axiosInstance.get(`${offlineDevices}`).then((res) => res);
}
