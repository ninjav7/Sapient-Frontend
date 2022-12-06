import axiosInstance from '../services/axiosInstance';
import { getBuildings } from '../services/Network';

export function fetchBuildingsList(state) {
    let params = `?config=${state}`;
    return axiosInstance.get(`${getBuildings}${params}`).then((res) => res);
}
