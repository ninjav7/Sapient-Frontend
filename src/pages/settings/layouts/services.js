import axiosInstance from '../../../services/axiosInstance';
import { createFloors, deleteFloor, getFloors, getSpaces, updateFloor } from '../../../services/Network';

export function getAllFloorsList(params) {
    return axiosInstance.get(`${getFloors}${params}`).then((res) => res);
}

export function getAllSpacesList(params) {
    return axiosInstance.get(`${getSpaces}${params}`).then((res) => res);
}

export function addFloorService(params, payload) {
    return axiosInstance.post(`${createFloors}${params}`, payload).then((res) => res);
}

export function updateFloorService(params, payload) {
    return axiosInstance.patch(`${updateFloor}${params}`, payload).then((res) => res);
}

export function deleteFloorService(params) {
    return axiosInstance.delete(`${deleteFloor}${params}`).then((res) => res);
}
