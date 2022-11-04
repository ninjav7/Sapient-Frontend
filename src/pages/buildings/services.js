import axiosInstance from '../../services/axiosInstance';
import {
    builidingEquipments,
    builidingHourly,
    getEnergyConsumption,
    portfolioEndUser,
    portfolioOverall,
} from '../../services/Network';

export function fetchOverallBldgData(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${portfolioOverall}${params}`, payload).then((res) => res);
}

export function fetchOverallEndUse(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${portfolioEndUser}${params}`, payload).then((res) => res);
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