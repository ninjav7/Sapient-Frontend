import axiosInstance from '../../services/axiosInstance';
import { portfolioBuilidings, energyEndUseInfo, portfolioKPIsV2, getEnergyConsumption } from '../../services/Network';

export function fetchPortfolioBuilidings(payload) {
    return axiosInstance.post(`${portfolioBuilidings}`, payload).then((res) => res);
}

export function fetchPortfolioOverall(payload) {
    let params = `?date_from=${payload?.date_from}&date_to=${payload?.date_to}&tz_info=${payload?.tz_info}&metric=${payload?.metric}`;
    if (payload?.bldg_id) params += `&building_id=${payload?.bldg_id}`;
    return axiosInstance.get(`${portfolioKPIsV2}${params}`).then((res) => res);
}

export function fetchPortfolioEndUse(params, payload) {
    return axiosInstance.post(`${energyEndUseInfo}${params}`, payload).then((res) => res);
}

export function fetchPortfolioEnergyConsumption(payload) {
    return axiosInstance.post(`${getEnergyConsumption}`, payload).then((res) => res);
}
