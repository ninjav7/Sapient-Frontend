import axiosInstance from '../../../services/axiosInstance';
import {
    createUtilityMeter,
    deleteUtilityMeters,
    getUtilityMeters,
    getUtilityMeterSensor,
    updateSensorV2,
    updateUtilityMeters,
} from '../../../services/Network';

export function createUtilityMeterServices(payload) {
    return axiosInstance.post(`${createUtilityMeter}`, payload).then((res) => res);
}

export function updateUtilityMeterServices(params, payload) {
    return axiosInstance.patch(`${updateUtilityMeters}${params}`, payload).then((res) => res);
}

export function getAllUtilityMetersServices(bldgId, search, pageNo, pageSize, deviceStatus, getParams) {
    const searchData = encodeURIComponent(search);
    let params = `?building_id=${bldgId}&panel_search=${searchData}&page_size=${pageSize}&page_no=${pageNo}`;

    if (deviceStatus !== 0) params = params.concat(`&stat=${deviceStatus === 1 ? 'true' : 'false'}`);

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

export function getUtilitySensorsList(bldgId, deviceId) {
    const params = `?building_id=${bldgId}&device_id=${deviceId}`;
    return axiosInstance.get(`${getUtilityMeterSensor}${params}`).then((res) => res);
}

export function updateUtilitySensorServices(params, payload) {
    return axiosInstance.post(`${updateSensorV2}${params}`, payload).then((res) => res);
}
