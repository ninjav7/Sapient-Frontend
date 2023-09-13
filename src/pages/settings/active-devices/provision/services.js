import axiosInstance from '../../../../services/axiosInstance';
import {
    get_kasa_devices,
    get_kasa_account,
    kasaLinkAccount,
    kasaUnLinkAccount,
    insert_kasa_devices,
    addToSystem,
} from '../../../../services/Network';

export function fetchKasaDevices(devicePageNo, devicePageSize, bldgId, devicesearch, getParams, payload, statusType) {
    const searchData = encodeURIComponent(devicesearch);
    let params = `?building_id=${bldgId}&device_search=${searchData}&page_size=${devicePageSize}&page_no=${devicePageNo}&status_type=${statusType}`;
    if (getParams.order_by && getParams.sort_by) {
        params += `&ordered_by=${getParams.order_by}&sort_by=${getParams.sort_by}`;
    }
    return axiosInstance.post(`${get_kasa_devices}${params}`, payload).then((res) => res);
}

export function fetchKasaAccounts(pageNo, pageSize, bldgId, search, getParams) {
    const searchData = encodeURIComponent(search);
    let params = `?building_id=${bldgId}&account_search=${searchData}&page_size=${pageSize}&page_no=${pageNo}`;
    if (getParams.order_by && getParams.sort_by) {
        params += `&ordered_by=${getParams.order_by}&sort_by=${getParams.sort_by}`;
    }
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
