import axiosInstance from '../../services/axiosInstance';
import {
    getExploreBuildingList,
    getExploreBuildingChart, 
    getExploreEquipmentList,
    getExploreEquipmentChart,
    getExploreFilter
} from '../../services/Network';


//Explore By Building
export function fetchExploreBuildingList(currentData,buildingSearchTxt) {
    let params = `?consumption=energy&search_by_name=${buildingSearchTxt}`;
    return axiosInstance.post(`${getExploreBuildingList}${params}`, currentData).then((res) => {
        return res;
    });
}

export function fetchExploreBuildingChart(currentData, selectedBuildingId) {
let params = `?consumption=energy&building_id=${selectedBuildingId}&divisible_by=1000`;
return axiosInstance.post(`${getExploreBuildingChart}${params}`, currentData).then((res) => {
    return res;
});
}

//Explore By Equipment
export function fetchExploreEquipmentList(payload,params) {
    return axiosInstance.post(`${getExploreEquipmentList}${params}`, payload).then((res) => {
        return res;
    });
}

export function fetchExploreEquipmentChart(payload, params) {
return axiosInstance.post(`${getExploreEquipmentChart}${params}`, payload).then((res) => {
    return res;
    });
}

export function fetchExploreFilter(payload, params) {
    return axiosInstance.post(`${getExploreFilter}${params}`, payload).then((res) => {
        return res;
    });
}

