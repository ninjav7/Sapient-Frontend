import axiosInstance from '../../../services/axiosInstance';
import _ from 'lodash';
import { generalActiveDevices, getLocation, getFiltersForEquipment } from '../../../services/Network';

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
    hardWareString
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
                    firmware_version: args.firmwareSelected,
                    hardware_version: args.hardWareSelected,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}
