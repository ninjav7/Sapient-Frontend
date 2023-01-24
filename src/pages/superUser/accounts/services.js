import axiosInstance from '../../../services/axiosInstance';
import { sessionValidator, customerList, selectCustomer, getCustomer, updateUsers } from '../../../services/Network';

export function fetchCustomerList() {
    return axiosInstance.get(`${customerList}`).then((res) => res);
}

export function fetchSelectedCustomer(params, payload) {
    return axiosInstance.post(`${selectCustomer}${params}`, payload).then((res) => res);
}

export function createCustomer(params, payload) {
    return axiosInstance.post(`${getCustomer}${params}`, payload).then((res) => res);
}
