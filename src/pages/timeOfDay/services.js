import axiosInstance from '../../services/axiosInstance';
import { builidingHourlyV2, avgDailyUsageByHour, energyEndUseInfo } from '../../services/Network';

export function fetchBuilidingHourly(payload) {
    const params = `?building_id=${payload?.bldg_id}&date_from=${payload?.date_from}&date_to=${payload?.date_to}&tz_info=${payload?.tz_info}`;
    return axiosInstance.get(`${builidingHourlyV2}${params}`).then((res) => res);
}

export function fetchAvgDailyUsageByHour(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${avgDailyUsageByHour}${params}`, payload).then((res) => res);
}

export function fetchBuildingAfterHours(params, payload) {
    return axiosInstance.post(`${energyEndUseInfo}${params}`, payload).then((res) => res);
}
