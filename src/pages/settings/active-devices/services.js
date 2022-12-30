import axiosInstance from '../../../services/axiosInstance';
import _ from 'lodash';
import { generalActiveDevices, getLocation, getFiltersForEquipment } from '../../../services/Network';

export function getLocationData(params) {
    return axiosInstance.get(`${getLocation}${params}`).then((res) => res);
}

export function getActiveDeviceData(params) {
    return axiosInstance.get(`${generalActiveDevices}${params}`).then((res) => res);
}

export function fetchActiveFilter(args) {
    const macAddressArr = args?.mac_address;
    const macAddressQuery = macAddressArr ? macAddressArr.join('+') : null;

    return axiosInstance
        .get(`${getFiltersForEquipment}`, {
            params: _.pickBy(
                {
                    query_collection: 'devices',
                    device_type: 'active',
                    building_id: args.bldgId,
                    mac_address: args.mac_address,
                    device_model: args.deviceModelString,
                    firmware_version: args.firmWareString,
                    hardware_version: args.hardWareString,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}
