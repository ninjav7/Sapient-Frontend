import axiosInstance from './axiosInstance';
import { compareBuildings } from './Network';

export function fetchCompareBuildings(params, payload) {
    return axiosInstance.post(`${compareBuildings}${params}`, payload).then((res) => res);
}