import _ from 'lodash';
import axiosInstance from '../../../services/axiosInstance';
import {
    createDevice,
    getLocation,
    generalPassiveDevices,
    updateDevice,
    deletePassiveDevice,
    getFiltersForEquipment,
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
    sensorString
) {
    const searchData = encodeURIComponent(search);
    let params = `?building_id=${bldgId}&device_search=${searchData}&page_size=${pageSize}&page_no=${pageNo}`;
    if (deviceStatus !== 0) params = params.concat(`&stat=${deviceStatus === 1 ? 'true' : 'false'}`);
    if (getParams.order_by && getParams.sort_by) {
        params += `&order_by=${getParams.order_by}&sort_by=${getParams.sort_by}`;
    }
    if (macAddressFilterString.length) {
        params += `&identifier=${macAddressFilterString}`;
    }
    if (deviceModelString.length) {
        params += `&model=${deviceModelString}`;
    }
    if (sensorString.length) {
        params += `&sensor_count=${sensorString}`;
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
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}
