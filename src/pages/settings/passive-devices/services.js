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

export function getPassiveDeviceData(params) {
    return axiosInstance.get(`${generalPassiveDevices}${params}`).then((res) => res);
}

export function updatePassiveDeviceData(params, payload) {
    return axiosInstance.post(`${updateDevice}${params}`, payload).then((res) => res);
}

export function deletePassiveDeviceData(params) {
    return axiosInstance.delete(`${deletePassiveDevice}${params}`).then((res) => res);
}

export function fetchPassiveFilter(args) {
    const macAddressArr = args?.deviceMacAddress;
    const macAddressQuery = macAddressArr ? macAddressArr.join('+') : null;

    return axiosInstance
        .get(`${getFiltersForEquipment}`, {
            params: _.pickBy(
                {
                    query_collection: 'devices',
                    device_type: 'passive',
                    building_id: args.bldgId,
                    mac_address: macAddressQuery,
                    device_model: args.deviceModelString,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}
