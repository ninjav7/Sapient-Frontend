import axiosInstance from '../../../services/axiosInstance';
import { createBuilding, generalBuilding } from '../../../services/Network';

export function saveBuildingData(payload) {
    return axiosInstance.post(`${createBuilding}`, payload).then((res) => res);
}

export function fetchBuildingList(search, sort_by, order_by) {
    let params = `?building_search=${search}&ordered_by=${order_by}&sort_by=${sort_by}`;
    return axiosInstance.get(`${generalBuilding}${params}`).then((res) => res);
}
