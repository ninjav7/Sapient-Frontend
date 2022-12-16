import axiosInstance from '../../../services/axiosInstance';
import { addEquipmentType, getEndUseId, equipmentType } from '../../../services/Network';

export function saveEquipTypeData(payload) {
    return axiosInstance.post(`${addEquipmentType}`, payload).then((res) => res);
}

export function getEndUseData() {
    return axiosInstance.get(`${getEndUseId}`).then((res) => res);
}

export function getEquipTypeData(params) {
    let endPoint = `${equipmentType}`;
    if (params) {
        endPoint = endPoint.concat(`${params}`);
    }
    return axiosInstance.get(endPoint).then((res) => res);
}
