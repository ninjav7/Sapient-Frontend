import axiosInstance from '../../../services/axiosInstance';
import { getSpaceTypes, createSpaceType, deleteSpaceType, updateSpaceType } from '../../../services/Network';

export function getSpaceTypesList(params) {
    return axiosInstance.get(`${getSpaceTypes}${params}`).then((res) => res);
}

export function saveSpaceTypeData(payload) {
    return axiosInstance.post(`${createSpaceType}`, payload).then((res) => res);
}

export function updateSpaceTypeData(params, payload) {
    return axiosInstance.patch(`${updateSpaceType}${params}`, payload).then((res) => res);
}

export function deleteSpaceTypeData(params) {
    return axiosInstance.delete(`${deleteSpaceType}${params}`).then((res) => res);
}
