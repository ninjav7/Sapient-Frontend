import axiosInstance from '../../services/axiosInstance';
import singularityAxiosInstance from '../../services/singularityAxiosInstance';
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
    metricsForCarbonBuildingPage,
    metricsKpiForCarbonBuildingPage,
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

export function fetchMetricsBuildingPage(bldg_id, params) {
    return axiosInstance.get(`${metricsForCarbonBuildingPage}/${bldg_id}`, { params }).then((res) => res);
}

export function fetchMetricsKpiBuildingPage(bldg_id, params) {
    return axiosInstance.get(`${metricsKpiForCarbonBuildingPage}/${bldg_id}`, { params }).then((res) => res.data);
}
export function fetchcurrentFuelMix(params) {
    const payload = '?region=ISONE&source=EIA';
    return singularityAxiosInstance.get(`/generated/fuel-mix/latest${payload}`).then((res) => res);
}

export function fetchcurrentFuelTrend(params) {
    const payload = '?region=ISONE&source=EIA&start=2022-01-02T00%3A00%3A00Z&end=2022-01-03T00%3A00%3A00Z&per_page=300';
    return singularityAxiosInstance.get(`/generated/fuel-mix${payload}`).then((res) => res);
}
