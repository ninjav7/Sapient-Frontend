import axiosInstance from '../../services/axiosInstance';
import {
    builidingEquipments,
    builidingHourly,
    getEnergyConsumption,
    energyEndUseInfo,
    portfolioOverall,
    buildingEnergyConsumption,
} from '../../services/Network';

export function fetchOverallBldgData(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${portfolioOverall}${params}`, payload).then((res) => res);
}

export function fetchEndUseByBuilding(params, payload) {
    return axiosInstance.post(`${energyEndUseInfo}${params}`, payload).then((res) => res);
}

export function fetchBuildingEquipments(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${builidingEquipments}${params}`, payload).then((res) => res);
}

export function fetchBuilidingHourly(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${builidingHourly}${params}`, payload).then((res) => res);
}

export function fetchEnergyConsumption(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${getEnergyConsumption}${params}`, payload).then((res) => res);
}

export function getEnergyConsumptionByType(obj) {
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&timezone=${obj?.tz_info}`;
    return axiosInstance.get(`${buildingEnergyConsumption}${params}`).then((res) => res);
}
