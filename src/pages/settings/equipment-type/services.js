import axiosInstance from '../../../services/axiosInstance';
import { addEquipmentType } from '../../../services/Network';

export function saveEquipTypeData(payload) {
    return axiosInstance.post(`${addEquipmentType}`, payload).then((res) => res);
}
