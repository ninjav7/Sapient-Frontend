import axiosInstance from '../../../services/axiosInstance';
import {
    createUtilityMeter,
    deleteUtilityMeters,
    getUtilityMeters,
    updateUtilityMeters,
} from '../../../services/Network';

export function createUtilityMeterServices(payload) {
    return axiosInstance.post(`${createUtilityMeter}`, payload).then((res) => res);
}

export function updateUtilityMeterServices(params, payload) {
    return axiosInstance.patch(`${updateUtilityMeters}${params}`, payload).then((res) => res);
}

export function getAllUtilityMetersServices(bldgId, search, pageNo, pageSize, getParams) {
    const searchData = encodeURIComponent(search);
    let params = `?building_id=${bldgId}&panel_search=${searchData}&page_size=${pageSize}&page_no=${pageNo}`;

    if (getParams.order_by && getParams.sort_by) {
        params += `&ordered_by=${getParams.order_by}&sort_by=${getParams.sort_by}`;
    }

    return axiosInstance.get(`${getUtilityMeters}${params}`).then((res) => res);
}

export function getSingleUtilityMeter(bldgId, deviceId) {
    const params = `?building_id=${bldgId}&device_id=${deviceId}`;
    return axiosInstance.get(`${getUtilityMeters}${params}`).then((res) => res);
}

export function deleteUtilityMeterData(params) {
    return axiosInstance.delete(`${deleteUtilityMeters}${params}`).then((res) => res);
}
