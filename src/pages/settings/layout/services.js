import axiosInstance from '../../../services/axiosInstance';
import {
    createFloors,
    createSpace,
    deleteFloor,
    deleteSpace,
    getFloors,
    getSpaces,
    getSpaceTypes,
    updateFloor,
    updateSpaceV2,
} from '../../../services/Network';

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

export function getAllSpaceTypes(params) {
    return axiosInstance.get(`${getSpaceTypes}${params}`).then((res) => res);
}

export function addSpaceService(params, payload) {
    return axiosInstance.post(`${createSpace}${params}`, payload).then((res) => res);
}

export function updateSpaceService(params, payload) {
    return axiosInstance.patch(`${updateSpaceV2}${params}`, payload).then((res) => res);
}

export function deleteSpaceService(params) {
    return axiosInstance.delete(`${deleteSpace}${params}`).then((res) => res);
}
