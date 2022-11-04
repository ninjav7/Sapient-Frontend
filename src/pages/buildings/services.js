import axiosInstance from '../../services/axiosInstance';
import {
    BaseUrl,
    builidingAlerts,
    builidingEquipments,
    builidingHourly,
    getEnergyConsumption,
    builidingPeak,
    portfolioEndUser,
    portfolioOverall,
} from '../../services/Network';

export function fetchOverallBldgData(bldgId, payload) {
    let params = `?building_id=${bldgId}`;
    return axiosInstance.post(`${portfolioOverall}${params}, ${payload}`).then((res) => res);
}
