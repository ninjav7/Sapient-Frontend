import axiosInstance from './axiosInstance';
import { compareBuildings } from './Network';

export function fetchCompareBuildings(params, payload) {
    return axiosInstance.post(`${compareBuildings}${params}`, payload).then((res) => res);
}

export function getCarbonBuildingChartData(activeBuildingId) {
    console.log("TRIGGEREDHREĘ")
    return axiosInstance.get(`/api/V2/metrics/portfolio/kpi/${activeBuildingId}`).then((res) => {
        return res;
    });
}
