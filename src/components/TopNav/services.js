import axiosInstance from '../../services/axiosInstance';
import { getBuildings, singleUserPermissionDetail } from '../../services/Network';

export function fetchBuildingsList(state) {
    let params = `?config=${state}`;
    return axiosInstance.get(`${getBuildings}${params}`).then((res) => res);
}

export function fetchPermissions() {
    return axiosInstance.get(`${singleUserPermissionDetail}`).then((res) => res);
}
