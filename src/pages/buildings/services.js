import axiosInstance from '../../services/axiosInstance';
import {
    builidingEquipments,
    builidingHourly,
    getEnergyConsumption,
    energyEndUseInfo,
    portfolioOverall,
    energyConsumptionByEquipmentType,
    energyConsumptionBySpaceType,
    energyConsumptionByFloor,
    energyCarbonByBuilding,
    getEnergyConsumptionV2,
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
    const params = `building_id=${bldgId}`;
    return axiosInstance.post(`${getEnergyConsumption}${params}`, payload).then((res) => res);
}

export function fetchEnergyConsumptionV2(payload,metric) {
    let params = `?date_from=${payload?.date_from}&date_to=${payload?.date_to}&timezone=${payload?.tz_info}`;
    if(metric){
        params+=`&metric=${metric}`
    }
    return axiosInstance.get(`${getEnergyConsumptionV2}/${payload?.bldg_id}${params}`).then((res) => res);
}

export function fetchEnergyConsumptionByEquipType(obj) {
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&timezone=${obj?.tz_info}`;
    return axiosInstance.get(`${energyConsumptionByEquipmentType}${params}`).then((res) => res);
}

export function fetchEnergyConsumptionBySpaceType(obj) {
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&timezone=${obj?.tz_info}`;
    return axiosInstance.get(`${energyConsumptionBySpaceType}${params}`).then((res) => res);
}

export function fetchEnergyConsumptionByFloor(obj) {
    const params = `?building_id=${obj?.bldg_id}&date_from=${obj?.date_from}&date_to=${obj?.date_to}&timezone=${obj?.tz_info}`;
    return axiosInstance.get(`${energyConsumptionByFloor}${params}`).then((res) => res);
}
