import axiosInstance from '../../../services/axiosInstance';
import { createFloors, getFloors, getSpaces } from '../../../services/Network';

export function getAllFloorsList(params) {
    return axiosInstance.get(`${getFloors}${params}`).then((res) => res);
}

export function getAllSpacesList(params) {
    return axiosInstance.get(`${getSpaces}${params}`).then((res) => res);
}

export function addFloor(params, payload) {
    return axiosInstance.post(`${createFloors}${params}`, payload).then((res) => res);
}
