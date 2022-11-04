import axiosInstance from '../../services/axiosInstance';
import {
    getExploreBuildingList,
    getExploreBuildingChart, 
    getExploreEquipmentList,
    getExploreEquipmentChart,
    getFloors,
    equipmentType,
    getEndUseId,
    getSpaceTypes,
    getSpaces,
} from '../../services/Network';

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