import axiosInstance from '../../../../services/axiosInstance';
import {
    get_kasa_devices,
    get_kasa_account,
    kasaLinkAccount,
    kasaUnLinkAccount,
    insert_kasa_devices,
    addToSystem,
} from '../../../../services/Network';

export function fetchKasaDevices(params, payload) {
    return axiosInstance.post(`${get_kasa_devices}${params}`, payload).then((res) => res);
}

export function fetchKasaAccounts(params) {
    return axiosInstance.get(`${get_kasa_account}${params}`).then((res) => res);
}

export function getKasaLinkAccounts(payload) {
    return axiosInstance.post(`${kasaLinkAccount}`, payload).then((res) => res);
}

export function getKasaUnLinkAccounts(payload) {
    return axiosInstance.post(`${kasaUnLinkAccount}`, payload).then((res) => res);
}

export function getInsertKasaDevices(payload) {
    return axiosInstance.post(`${insert_kasa_devices}`, payload).then((res) => res);
}

export function insertToSystem(payload) {
    return axiosInstance.post(`${addToSystem}`, payload).then((res) => res);
}
