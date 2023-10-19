import axiosInstance from '../../../services/axiosInstance';
import { createBuilding, generalBuilding, getFiltersForBuildings, getBuildingTypes } from '../../../services/Network';

export function saveBuildingData(payload) {
    return axiosInstance.post(`${createBuilding}`, payload).then((res) => res);
}

export function fetchBuildingList(
    search = '',
    sort_by = 'ace',
    order_by = 'building_name',
    sqftAPIFlag,
    building_type,
    minVal,
    maxVal
) {
    let params = `?building_search=${encodeURIComponent(search)}&ordered_by=${order_by}&sort_by=${sort_by}`;
    if (building_type) {
        let paramsToAppend = `&building_type=${building_type}`;
        params = params.concat(paramsToAppend);
    }

    if (sqftAPIFlag && sqftAPIFlag !== '') {
        let paramsToAppend = `&building_size_min=${minVal}&building_size_max=${maxVal}`;
        params = params.concat(paramsToAppend);
    }
    return axiosInstance.get(`${generalBuilding}${params}`).then((res) => res);
}

export function getFiltersForBuildingsRequest(args) {
    return axiosInstance.get(`${getFiltersForBuildings}`).then((res) => {
        return res.data;
    });
}

export function updateBuildingTypes() {
    return axiosInstance.get(`${getBuildingTypes}`).then((res) => res);
}
