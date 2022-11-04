import axiosInstance from '../../services/axiosInstance';
import { endUses, endUsesChart } from '../../services/Network';

export function fetchEndUses(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${endUses}${params}`, payload).then((res) => res);
}

export function fetchEndUsesChart(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${endUsesChart}${params}`, payload).then((res) => res);
}