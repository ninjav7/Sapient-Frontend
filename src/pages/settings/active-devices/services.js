import axiosInstance from '../../../services/axiosInstance';
import _ from 'lodash';
import {
    generalActiveDevices,
    getLocation,
    getFiltersForEquipment,
    updateActivePassiveDevice,
    linkActiveSensorToEquip,
    listSensor,
    sensorGraphData,
    equipmentType,
} from '../../../services/Network';

//Smart Plugs Page
export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function getActiveDeviceData(
    pageNo,
    pageSize,
    bldgId,
    search,
    deviceStatus,
    getParams,
    macAddressFilterString,
    deviceModelString,
    sensorString,
    firmWareString,
    hardWareString,
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
    if (firmWareString.length) {
        params += `&firmware_version=${firmWareString}`;
    }
    if (hardWareString.length) {
        params += `&hardware_version=${hardWareString}`;
    }
    if (floorString.length) {
        params += `&floor_id=${floorString}`;
    }
    if (spaceString.length) {
        params += `&location_id=${spaceString}`;
    }
    return axiosInstance.get(`${generalActiveDevices}${params}`).then((res) => res);
}

export function fetchActiveFilter(args) {
    return axiosInstance
        .get(`${getFiltersForEquipment}`, {
            params: _.pickBy(
                {
                    query_collection: 'devices',
                    device_type: 'active',
                    building_id: args.bldgId,
                    mac_address: args.macAddressSelected,
                    device_model: args.deviceModelSelected,
                    sensor_number: args.sensorSelected,
                    firmware_version: args.firmwareSelected,
                    hardware_version: args.hardWareSelected,
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

export function getSingleActiveDevice(params) {
    return axiosInstance.get(`${generalActiveDevices}${params}`).then((res) => res);
}

export function getActiveDeviceSensors(params) {
    return axiosInstance.get(`${listSensor}${params}`).then((res) => res);
}

export function getEquipmentTypes(params) {
    return axiosInstance.get(`${equipmentType}${params}`).then((res) => res);
}

export function updateActiveDeviceService(params, payload) {
    return axiosInstance.post(`${updateActivePassiveDevice}${params}`, payload).then((res) => res);
}

export function getSensorEquipmentLinked(params, payload = {}) {
    return axiosInstance.post(`${linkActiveSensorToEquip}${params}`, payload).then((res) => res);
}

export function getSensorData(params, payload) {
    return axiosInstance.post(`${sensorGraphData}${params}`, payload).then((res) => res);
}
