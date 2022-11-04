import axiosInstance from '../../services/axiosInstance';
import { builidingHourly, avgDailyUsageByHour, buildingAfterHours } from '../../services/Network';

export function fetchBuilidingHourly(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${builidingHourly}${params}`, payload).then((res) => res);
}

export function fetchAvgDailyUsageByHour(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${avgDailyUsageByHour}${params}`, payload).then((res) => res);
}

export function fetchBuildingAfterHours(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${buildingAfterHours}${params}`, payload).then((res) => res);
}