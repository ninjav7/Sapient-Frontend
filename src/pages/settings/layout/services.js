import axiosInstance from '../../../services/axiosInstance';
import {
    createFloors,
    getFloors,
    getLayouts,
    getSpaces,
    getSpaceTypes,
    createSpace,
    updateSpace,
    deleteSpace,
    deleteFloor,
} from '../../../services/Network';

export function addFloors(params, payload) {
    return axiosInstance.post(`${createFloors}${params}`, payload).then((res) => res);
}

export function fetchFloors(params) {
    return axiosInstance.get(`${getFloors}${params}`).then((res) => res);
}

export function fetchSpaces(params) {
    return axiosInstance.get(`${getSpaces}${params}`).then((res) => res);
}

export function fetchSpaceTypes(params) {
    return axiosInstance.get(`${getSpaceTypes}${params}`).then((res) => res);
}

export function fetchLayouts(params) {
    return axiosInstance.get(`${getLayouts}${params}`).then((res) => res);
}

export function addSpace(params, payload) {
    return axiosInstance.post(`${createSpace}${params}`, payload).then((res) => res);
}

export function updateSpaces(params, payload) {
    return axiosInstance.patch(`${updateSpace}${params}`, payload).then((res) => res);
}

export function removeSpace(params) {
    return axiosInstance.delete(`${deleteSpace}${params}`).then((res) => res);
}

export function removeFloor(params) {
    return axiosInstance.delete(`${deleteFloor}${params}`).then((res) => res);
}
