import axiosInstance from '../../services/axiosInstance';
import _ from 'lodash';
import {
    getExploreEquipmentList,
    getExploreEquipmentChart,
    getExploreFilter,
    getWeather,
    compareBuildingsV2,
    getEnergyConsumptionV2,
} from '../../services/Network';

export function fetchExploreByBuildingListV2(params) {
    return axiosInstance.get(`${compareBuildingsV2}${params}`).then((res) => {
        return res;
    });
}

export function fetchExploreBuildingChart(params, bldgId) {
    return axiosInstance.get(`${getEnergyConsumptionV2}/${bldgId}${params}`).then((res) => {
        return res;
    });
}

//Explore By Equipment
export function fetchExploreEquipmentList(
    startDate,
    endDate,
    timeZone,
    bldgId,
    ordered_by,
    sort_by,
    pageSize,
    pageNo,
    search,
    selectedEquipType,
    selectedEndUse,
    selectedSpaceType,
    selectedTags,
    selectedPanels,
    selectedBreakers,
    selectedNotes,
    conAPIFlag,
    minConValue,
    maxConValue,
    perAPIFlag,
    minPerValue,
    maxPerValue
) {
    let params = `?consumption=energy&building_id=${bldgId}`;

    if (ordered_by && sort_by) params = params.concat(`&ordered_by=${ordered_by}&sort_by=${sort_by}`);
    if (search) params = params.concat(`&search_by_name=${encodeURIComponent(search)}`);
    if (pageSize && pageNo) params = params.concat(`&page_size=${pageSize}&page_no=${pageNo}`);

    let payload = {
        date_from: startDate,
        date_to: endDate,
        tz_info: timeZone,
    };

    if (conAPIFlag !== '')
        payload['consumption_range'] = {
            gte: (Number(minConValue) - 1) * 1000,
            lte: (Number(maxConValue) + 1) * 1000,
        };

    if (perAPIFlag !== '')
        payload['change'] = {
            gte: Number(minPerValue) - 0.5,
            lte: Number(maxPerValue) + 0.5,
        };

    if (selectedEquipType && selectedEquipType.length !== 0) payload['equipment_types'] = selectedEquipType;
    if (selectedEndUse && selectedEndUse.length !== 0) payload['end_use'] = selectedEndUse;
    if (selectedSpaceType && selectedSpaceType.length !== 0) payload['space_type'] = selectedSpaceType;
    if (selectedTags && selectedTags.length !== 0) payload['tags'] = selectedTags;
    if (selectedPanels && selectedPanels.length !== 0) payload['panel'] = selectedPanels;
    if (selectedBreakers && selectedBreakers.length !== 0) payload['breaker_number'] = selectedBreakers;
    if (selectedNotes && selectedNotes.length === 1) payload['has_note'] = selectedNotes[0];

    return axiosInstance.post(`${getExploreEquipmentList}${params}`, payload).then((res) => {
        return res;
    });
}

export function fetchExploreEquipmentChart(payload, params) {
    return axiosInstance.post(`${getExploreEquipmentChart}${params}`, payload).then((res) => {
        return res;
    });
}

export function fetchExploreFilter(
    startDate,
    endDate,
    timeZone,
    bldgId,
    selectedEquipType,
    selectedEndUse,
    selectedSpaceType,
    selectedTags,
    selectedPanels,
    selectedBreakers,
    selectedNotes,
    conAPIFlag,
    minConValue,
    maxConValue,
    perAPIFlag,
    minPerValue,
    maxPerValue
) {
    const params = `?building_id=${bldgId}&consumption=energy`;

    let payload = {
        date_from: startDate,
        date_to: endDate,
        tz_info: timeZone,
    };

    if (conAPIFlag !== '')
        payload['consumption_range'] = {
            gte: (Number(minConValue) - 1) * 1000,
            lte: (Number(maxConValue) + 1) * 1000,
        };

    if (perAPIFlag !== '')
        payload['change'] = {
            gte: Number(minPerValue) - 0.5,
            lte: Number(maxPerValue) + 0.5,
        };

    if (selectedEquipType && selectedEquipType.length !== 0) payload['equipment_types'] = selectedEquipType;
    if (selectedEndUse && selectedEndUse.length !== 0) payload['end_use'] = selectedEndUse;
    if (selectedSpaceType && selectedSpaceType.length !== 0) payload['space_type'] = selectedSpaceType;
    if (selectedTags && selectedTags.length !== 0) payload['tags'] = selectedTags;
    if (selectedPanels && selectedPanels.length !== 0) payload['panel'] = selectedPanels;
    if (selectedBreakers && selectedBreakers.length !== 0) payload['breaker_number'] = selectedBreakers;
    if (selectedNotes && selectedNotes.length === 1) payload['has_note'] = selectedNotes[0];

    return axiosInstance.post(`${getExploreFilter}${params}`, payload).then((res) => {
        return res;
    });
}

export function fetchWeatherData(params) {
    return axiosInstance.get(`${getWeather}${params}`).then((res) => {
        return res;
    });
}
