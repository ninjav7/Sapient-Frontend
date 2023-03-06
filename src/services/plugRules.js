import _ from 'lodash';
import axiosInstance from './axiosInstance';
import {
    listPlugRules,
    listConditions,
    updatePlugRule,
    getEstimateSensorSavings,
    createPlugRule,
    deletePlugRule,
    plugRuleDetails,
    graphData,
    getListSensorsForBuildings,
    assignSensorsToRule,
    listLinkSocketRules,
    unLinkSocket,
    getFiltersForSensors,
    reassignSensorsToRule,
    getSensorLastUsed,
} from './Network';

export function fetchPlugRules(params, searchParams) {
    return axiosInstance.get(`${listPlugRules}${params}`, searchParams).then((res) => {
        return res;
    });
}
export function fetchPlugRuleDetails(ruleId) {
    return axiosInstance.get(`${plugRuleDetails}?rule_id=${ruleId}`).then((res) => {
        return res;
    });
}

export function getAllConditions() {
    return axiosInstance.get(`${listConditions}`).then((res) => {
        return res.data;
    });
}

export function updatePlugRuleRequest(currentData) {
    let params = `?rule_id=${currentData.id}`;

    return axiosInstance.patch(`${updatePlugRule}${params}`, currentData).then((res) => {
        return res;
    });
}

export function getEstimateSensorSavingsRequst(schedule, selectedIds, plugRuleId) {
    const sensors = selectedIds.join('%2B');
    let params = `?plug_rule_id=${plugRuleId}&timezone=US%2FEastern&sensor_id=${sensors}`;

    return axiosInstance.post(`${getEstimateSensorSavings}${params}`, schedule).then((res) => {
        return res.data;
    });
}

export function createPlugRuleRequest(currentData) {
    return axiosInstance.post(`${createPlugRule}`, currentData).then((res) => {
        return res.data;
    });
}

export function deletePlugRuleRequest(ruleId) {
    let params = `?rule_id=${ruleId}`;

    return axiosInstance.delete(`${deletePlugRule}${params}`).then((res) => {
        return res;
    });
}

export function getGraphDataRequest(selectedIds, plugRuleId) {
    let params = `?plug_rule_id=${plugRuleId}`;
    return axiosInstance
        .get(`${graphData}${params}`, {
            params: {
                //@TODO Hardcoded because it doesn't have default values on backend side, but we don't need them right now.
                tz_info: 'US/Eastern',
                num_of_days: 14,
                sensors: selectedIds.join('+'),
            },
        })
        .then((res) => {
            return res;
        });
}

export function getListSensorsForBuildingsRequest(page_size, pageNo, ruleId, activeBuildingId, getParams) {
    let params = `?page_size=${page_size}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}`;

    if (page_size === 0) {
        return;
    }

    return axiosInstance.get(`${getListSensorsForBuildings}${params}`, { params: getParams }).then((res) => {
        return res;
    });
}

/**
 * Request filters.
 * @param args = {sensor_search, equipment_types, mac_address, tags, floor_id, space_id, space_type_id, sensor_number};
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFiltersForSensorsRequest(args) {
    return axiosInstance
        .get(`${getFiltersForSensors}`, {
            params: _.pickBy(
                {
                    building_id: args.activeBuildingId,
                    mac_address: args.macTypeFilterString,
                    equipment_types: args.equpimentTypeFilterString,
                    sensor_number: args.sensorTypeFilterString,
                    floor_id: args.floorTypeFilterString,
                    space_id: args.spaceTypeFilterString,
                    space_type_id: args.spaceTypeTypeFilterString,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}

export function getUnlinkedSocketRules(
    pageSize,
    pageNo,
    ruleId,
    activeBuildingId,
    equpimentTypeFilterString,
    macTypeFilterString,
    locationTypeFilterString,
    sensorTypeFilterString,
    floorTypeFilterString,
    spaceTypeFilterString,
    spaceTypeTypeFilterString,
    assignedRuleFilterString,
    withPagination,
    getParams
) {
    let params = '';
    if (withPagination) {
        params = `?page_size=${pageSize}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}&equipment_types=${encodeURIComponent(
            equpimentTypeFilterString
        )}&location=${locationTypeFilterString}&sensor_number=${encodeURIComponent(sensorTypeFilterString)}`;
    } else {
        params = `?rule_id=${ruleId}&building_id=${activeBuildingId}&equipment_types=${encodeURIComponent(
            equpimentTypeFilterString
        )}&location=${locationTypeFilterString}&sensor_number=${encodeURIComponent(sensorTypeFilterString)}`;
    }

    if (pageSize === 0) {
        return;
    }

    return axiosInstance
        .get(`${getListSensorsForBuildings}${params}`, {
            params: _.pickBy(
                {
                    floor_id: floorTypeFilterString,
                    space_id: spaceTypeFilterString,
                    space_type_id: spaceTypeTypeFilterString,
                    assigned_rule: assignedRuleFilterString,
                    mac_address: macTypeFilterString,
                    ...getParams,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}

export function linkSensorsToRuleRequest(rulesToLink) {
    return axiosInstance.post(`${assignSensorsToRule}`, rulesToLink).then((res) => {
        return res;
    });
}

export function reassignSensorsToRuleRequest(rulesToLink) {
    return axiosInstance.post(`${reassignSensorsToRule}`, rulesToLink).then((res) => {
        return res;
    });
}
export function listLinkSocketRulesRequest(ruleId, activeBuildingId, sortBy) {
    let params = `?rule_id=${ruleId}&building_id=${activeBuildingId}`;

    if (sortBy?.method && sortBy?.name) {
        params += `&order_by=${sortBy.name}&sort_by=${sortBy.method}`;
    }

    return axiosInstance.get(`${listLinkSocketRules}${params}`).then((res) => {
        return res;
    });
}

export function unlinkSocketRequest(rulesToUnLink) {
    return axiosInstance.post(`${unLinkSocket}`, rulesToUnLink).then((res) => {
        return res;
    });
}
