import axiosInstance from '../../../services/axiosInstance';
import { addEquipmentType, getEndUseId } from '../../../services/Network';

export function saveEquipTypeData(payload) {
    return axiosInstance.post(`${addEquipmentType}`, payload).then((res) => res);
}

export function getEndUseData() {
    return axiosInstance.get(`${getEndUseId}`).then((res) => res);
}
