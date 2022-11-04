import axiosInstance from '../../services/axiosInstance';
import { compareBuildings } from '../../services/Network';

export function fetchCompareBuildings(params, payload) {
    return axiosInstance.post(`${compareBuildings}${params}`, payload).then((res) => res);
}