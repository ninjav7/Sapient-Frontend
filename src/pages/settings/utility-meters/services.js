import axiosInstance from '../../../services/axiosInstance';
import {
    createUtilityMeter,
    deleteUtilityMeters,
    getUtilityMeters,
    getUtilityMeterSensor,
    sensorUsageData,
    sensorUsageDataForUtilityMonitor,
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

export function getSensorGraphDataForUtilityMonitors(payload) {
    const params = `/${payload?.sensor_id}?building_id=${payload?.bldg_id}&date_from=${payload?.date_from}&date_to=${payload?.date_to}&timezone=${payload?.tz_info}&metric=${payload?.selected_metric}`;
    return axiosInstance.get(`${sensorUsageData}${params}`).then((res) => res);
}

export function getSensorMetricYtdData(payload) {
    const params = `?building_id=${payload?.bldg_id}&sensor_id=${payload?.sensor_id}&date_from=${payload?.date_from}&date_to=${payload?.date_to}&timezone=${payload?.tz_info}&metric=${payload?.metric}`;
    return axiosInstance.get(`${sensorUsageDataForUtilityMonitor}${params}`).then((res) => res);
}
