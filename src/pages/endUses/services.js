import axiosInstance from '../../services/axiosInstance';
import { endUses, endUsesChart, endUsesEquipmentUsage, endUsesUsageChart } from '../../services/Network';

export function fetchEndUses(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${endUses}${params}`, payload).then((res) => res);
}

export function fetchEndUsesChart(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${endUsesChart}${params}`, payload).then((res) => res);
}

export function fetchEndUsesType(bldgId,endUseTypeRequest,payload) {
    let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
    return axiosInstance.post(`${endUses}${params}`, payload).then((res) => res);
}

export function fetchEndUsesEquipmentUsage(bldgId,endUseTypeRequest,payload) {
    let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
    return axiosInstance.post(`${endUsesEquipmentUsage}${params}`, payload).then((res) => res);
}

export function fetchEndUsesUsageChart(bldgId,endUseTypeRequest,payload) {
    let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
    return axiosInstance.post(`${endUsesUsageChart}${params}`, payload).then((res) => res);
}