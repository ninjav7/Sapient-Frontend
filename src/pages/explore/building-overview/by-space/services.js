import axiosInstance from '../../../../services/axiosInstance';
import { getEnergyConsumptionBySpaceV2 } from '../../../../services/Network';

export function fetchExploreSpaceChart(params) {
    return axiosInstance.get(`${getEnergyConsumptionBySpaceV2}/${params}`).then((res) => res);
}
