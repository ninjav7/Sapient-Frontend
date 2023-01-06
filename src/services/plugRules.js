import _ from 'lodash';
import axiosInstance from './axiosInstance';
import {
    listPlugRules,
    updatePlugRule,
    createPlugRule,
    deletePlugRule,
    plugRuleDetails,
    graphData,
    getListSensorsForBuildings,
    assignSensorsToRule,
    listLinkSocketRules,
    unLinkSocket,
    getFiltersForSensors,
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

export function updatePlugRuleRequest(currentData) {
    let params = `?rule_id=${currentData.id}`;

    return axiosInstance.patch(`${updatePlugRule}${params}`, currentData).then((res) => {
        return res;
    });
}

export function createPlugRuleRequest(currentData) {
    return axiosInstance.post(`${createPlugRule}`, currentData).then((res) => {
        return res;
    });
}

export function deletePlugRuleRequest(ruleId) {
    let params = `?rule_id=${ruleId}`;

    return axiosInstance.delete(`${deletePlugRule}${params}`).then((res) => {
        return res;
    });
}

export function getGraphDataRequest(activeBuildingId, sensorsIdNow, plugRuleId) {
    let params = `?building_id=${activeBuildingId}&sensors=${sensorsIdNow}`;
    return axiosInstance
        .get(`${graphData}${params}`, {
            params: {
                //@TODO Hardcoded because it doesn't have default values on backend side, but we don't need them right now.
                tz_info: 'US/Eastern',
                num_of_days: 50,
                plug_rule_id: plugRuleId,
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
    getParams
) {
    let params = `?page_size=${pageSize}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}&equipment_types=${encodeURIComponent(
        equpimentTypeFilterString
    )}&location=${locationTypeFilterString}&sensor_number=${encodeURIComponent(sensorTypeFilterString)}`;

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
                    mac_address: macTypeFilterString,
                    ...getParams,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res;
        });
}

export function linkSensorsToRuleRequest(rulesToLink) {
    return axiosInstance.post(`${assignSensorsToRule}`, rulesToLink).then((res) => {
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
