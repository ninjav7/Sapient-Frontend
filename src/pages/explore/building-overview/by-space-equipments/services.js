import axiosInstance from '../../../../services/axiosInstance';
import { getEnergyConsumptionBySpaceV2, getExploreEquipmentList } from '../../../../services/Network';

import { handleAPIRequestParams } from '../../../../helpers/helpers';

export function fetchExploreSpaceChart(params) {
    return axiosInstance.get(`${getEnergyConsumptionBySpaceV2}/${params}`).then((res) => res);
}

export function fetchExploreEquipmentsBySpace(
    startDate,
    endDate,
    startTime,
    endTime,
    timeZone,
    bldgId,
    selectedSpaceId
) {
    let params = `?consumption=energy&building_id=${bldgId}`;

    const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

    let payload = {
        date_from: dateFrom,
        date_to: dateTo,
        tz_info: timeZone,
    };

    if (selectedSpaceId) payload['location'] = [selectedSpaceId];

    return axiosInstance.post(`${getExploreEquipmentList}${params}`, payload).then((res) => {
        return res;
    });
}
