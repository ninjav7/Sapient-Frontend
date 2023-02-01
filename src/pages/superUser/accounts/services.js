import axiosInstance from '../../../services/axiosInstance';
import { customerList, selectCustomer, getCustomer } from '../../../services/Network';

export function fetchCustomerList() {
    return axiosInstance.get(`${customerList}`).then((res) => res);
}

export function fetchSelectedCustomer(params) {
    return axiosInstance.post(`${selectCustomer}${params}`).then((res) => res);
}

export function createCustomer(payload) {
    return axiosInstance.post(`${getCustomer}`, payload).then((res) => res);
}
