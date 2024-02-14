import axiosInstance from '../../../services/axiosInstance';
import {
    updateEquipment,
    listSensor,
    equipmentDetails,
    getExploreEquipmentYTDUsage,
    getMetadata,
    getEquipmentKPIs,
} from '../../../services/Network';

export function updateListSensor(params) {
    return axiosInstance.get(`${listSensor}${params}`).then((res) => {
        return res;
    });
}

export function getEquipmentDetails(params) {
    return axiosInstance.get(`${equipmentDetails}${params}`).then((res) => res);
}

export function updateEquipmentDetails(params, payload) {
    return axiosInstance.post(`${updateEquipment}${params}`, payload).then((res) => {
        return res;
    });
}

export function updateExploreEquipmentYTDUsage(payload, params) {
    return axiosInstance.post(`${getExploreEquipmentYTDUsage}${params}`, payload).then((res) => {
        return res;
    });
}

export function getMetadataRequest(bldgId) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.get(`${getMetadata}${params}`).then((res) => {
        return res.data;
    });
}

export function fetchEquipmentKPIs(params, equipId) {
    return axiosInstance.get(`${getEquipmentKPIs}/${equipId}${params}`).then((res) => res);
}
