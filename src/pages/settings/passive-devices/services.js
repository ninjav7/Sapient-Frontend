import _ from 'lodash';
import axiosInstance from '../../../services/axiosInstance';
import {
    createDevice,
    getLocation,
    generalPassiveDevices,
    updateDevice,
    deletePassiveDevice,
    getFiltersForEquipment,
    sensorGraphData,
    updateActivePassiveDevice,
    listSensor,
    listCts,
    updateSensorV2,
    getRawDeviceData,
} from '../../../services/Network';

export function savePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${createDevice}${params}`, payload).then((res) => res);
}

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function updatePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${updateDevice}${params}`, payload).then((res) => res);
}

export function deletePassiveDeviceData(params) {
    return axiosInstance.delete(`${deletePassiveDevice}${params}`).then((res) => res);
}

export function getPassiveDeviceData(
    pageNo,
    pageSize,
    bldgId,
    search,
    deviceStatus,
    getParams,
    macAddressFilterString,
    deviceModelString,
    sensorString,
    floorString,
    spaceString
) {
    const searchData = encodeURIComponent(search);
    let params = `?building_id=${bldgId}&device_search=${searchData}&page_size=${pageSize}&page_no=${pageNo}`;
    if (deviceStatus !== 0) params = params.concat(`&stat=${deviceStatus === 1 ? 'true' : 'false'}`);
    if (getParams.order_by && getParams.sort_by) {
        params += `&ordered_by=${getParams.order_by}&sort_by=${getParams.sort_by}`;
    }
    if (macAddressFilterString.length) {
        params += `&identifier=${macAddressFilterString}`;
    }
    if (deviceModelString.length) {
        params += `&model=${deviceModelString}`;
    }
    if (sensorString.length) {
        params += `&sensor_number=${sensorString}`;
    }
    if (floorString.length) {
        params += `&floor_id=${floorString}`;
    }
    if (spaceString.length) {
        params += `&location_id=${spaceString}`;
    }
    return axiosInstance.get(`${generalPassiveDevices}${params}`).then((res) => res);
}

export function fetchPassiveFilter(args) {
    return axiosInstance
        .get(`${getFiltersForEquipment}`, {
            params: _.pickBy(
                {
                    query_collection: 'devices',
                    device_type: 'passive',
                    building_id: args.bldgId,
                    mac_address: args.macAddressSelected,
                    device_model: args.deviceModelSelected,
                    floor_id: args.floorSelected,
                    space_id: args.spaceSelected,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}

export function getSinglePassiveDevice(params) {
    return axiosInstance.get(`${generalPassiveDevices}${params}`).then((res) => res);
}

export function getSensorGraphData(params, payload) {
    return axiosInstance.post(`${sensorGraphData}${params}`, payload).then((res) => res);
}

export function updatePassiveDevice(params, payload) {
    return axiosInstance.post(`${updateActivePassiveDevice}${params}`, payload).then((res) => res);
}

export function getPassiveDeviceSensors(params) {
    return axiosInstance.get(`${listSensor}${params}`).then((res) => res);
}

export function getSensorsCts() {
    return axiosInstance.get(`${listCts}`).then((res) => res);
}

export function updateSensorData(params, payload) {
    return axiosInstance.post(`${updateSensorV2}${params}`, payload).then((res) => res);
}

export function getDeviceRawData(params) {
    return axiosInstance.get(`${getRawDeviceData}${params}`).then((res) => res);
}
