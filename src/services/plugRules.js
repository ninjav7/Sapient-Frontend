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
    getPlugRuleStatus,
} from './Network';

export function fetchPlugRules(params, searchParams) {
    return axiosInstance.get(`${listPlugRules}${params}`, searchParams).then((res) => {
        return res;
    });
}
export function fetchPlugRuleDetails(ruleId, tz_info) {
    return axiosInstance.get(`${plugRuleDetails}?rule_id=${ruleId}&tz_info=${tz_info}`).then((res) => {
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
            return res.data;
        });
}

export function getPlugRuleStatusRequest(plugRuleId) {
    let params = `?rule_id=${plugRuleId}`;
    return axiosInstance.get(`${getPlugRuleStatus}${params}`, {}).then((res) => {
        return res.data;
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
                    mac_address: args.macTypeFilterString
                        ? encodeURI(args.macTypeFilterString?.join('+'))
                        : args.macTypeFilterString,
                    equipment_types: args.equipmentTypeFilterString
                        ? encodeURI(args.equipmentTypeFilterString?.join('+'))
                        : args.equipmentTypeFilterString,
                    sensor_number: args.sensorTypeFilterString
                        ? encodeURI(args.sensorTypeFilterString?.join('+'))
                        : args.sensorTypeFilterString,
                    floor_id: args.sensorTypeFilterString
                        ? encodeURI(args.sensorTypeFilterString?.join('+'))
                        : args.sensorTypeFilterString,
                    space_id: args.spaceTypeFilterString
                        ? encodeURI(args.spaceTypeFilterString?.join('+'))
                        : args.spaceTypeFilterString,
                    space_type_id: args.spaceTypeTypeFilterString
                        ? encodeURI(args.spaceTypeTypeFilterString?.join('+'))
                        : args.spaceTypeTypeFilterString,
                    assigned_rule: args?.isGetOnlyLinked ? args?.plugRuleId : 'other',
                    plug_rule_id: !args?.isGetOnlyLinked ? args?.plugRuleId : null,
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
    activeBuildingId,
    equpimentTypeFilterString,
    macTypeFilterString,
    locationTypeFilterString,
    sensorTypeFilterString,
    floorTypeFilterString,
    spaceTypeFilterString,
    spaceTypeTypeFilterString,
    assignedRuleFilterString,
    tagsFilterString,
    withPagination,
    getParams,
    isGetOnlyLinked,
    plugRuleId,
    sensor_search
) {
    let params = '';
    if (withPagination) {
        params = `?building_id=${activeBuildingId}&page_size=${pageSize}&page_no=${pageNo}`;
    } else {
        params = `?building_id=${activeBuildingId}`;
    }

    if (pageSize === 0) {
        return;
    }

    const tags = tagsFilterString ? tagsFilterString?.join('+') : tagsFilterString;

    return axiosInstance
        .get(`${getListSensorsForBuildings}${params}`, {
            params: _.pickBy(
                {
                    sensor_search: encodeURI(sensor_search),
                    floor_id: floorTypeFilterString
                        ? encodeURI(floorTypeFilterString?.join('+'))
                        : floorTypeFilterString,
                    space_id: spaceTypeFilterString
                        ? encodeURI(spaceTypeFilterString?.join('+'))
                        : spaceTypeFilterString,
                    space_type_id: spaceTypeTypeFilterString
                        ? encodeURI(spaceTypeTypeFilterString?.join('+'))
                        : spaceTypeTypeFilterString,
                    assigned_rule: assignedRuleFilterString
                        ? encodeURI(assignedRuleFilterString?.join('+'))
                        : assignedRuleFilterString,
                    mac_address: macTypeFilterString ? encodeURI(macTypeFilterString?.join('+')) : macTypeFilterString,
                    location: locationTypeFilterString
                        ? encodeURI(locationTypeFilterString?.join('+'))
                        : locationTypeFilterString,
                    tags: tags,
                    equipment_types: equpimentTypeFilterString
                        ? encodeURI(equpimentTypeFilterString?.join('+'))
                        : equpimentTypeFilterString,
                    sensor_number: sensorTypeFilterString
                        ? encodeURI(sensorTypeFilterString?.join('+'))
                        : sensorTypeFilterString,
                    assigned_rule: isGetOnlyLinked ? plugRuleId : 'other',
                    plug_rule_id: !isGetOnlyLinked ? plugRuleId : null,
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
