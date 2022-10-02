import axiosInstance from './axiosInstance';
import {
    listPlugRules,
    updatePlugRule,
    createPlugRule,
    deletePlugRule,
    plugRuleDetails,
    graphData,
    getListSensorsForBuildings,
    linkSocket,
    listLinkSocketRules,
    unLinkSocket,
} from './Network';

export function fetchPlugRules(activeBuildingId) {
    return axiosInstance.get(`${listPlugRules}?building_id=${activeBuildingId}`).then((res) => {
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

export function getGraphDataRequest(activeBuildingId, sensorsIdNow) {
    let params = `?building_id=${activeBuildingId}&sensors=${sensorsIdNow}`;
    return axiosInstance.get(`${graphData}${params}`).then((res) => {
        return res;
    });
}

export function getListSensorsForBuildingsRequest(totalSocket, pageNo, ruleId, activeBuildingId) {
    let params = `?page_size=${totalSocket}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}`;

    return axiosInstance.get(`${getListSensorsForBuildings}${params}`).then((res) => {
        return res;
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
    sensorTypeFilterString
) {
    let params = `?page_size=${pageSize}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}&equipment_types=${equpimentTypeFilterString}&mac_address=${macTypeFilterString}&location=${locationTypeFilterString}&sensor_number=${sensorTypeFilterString}`;

    return axiosInstance.get(`${getListSensorsForBuildings}${params}`).then((res) => {
        return res;
    });
}

export function linkSocketRequest(rulesToLink) {
    return axiosInstance.post(`${linkSocket}`, rulesToLink).then((res) => {
        return res;
    });
}
export function listLinkSocketRulesRequest(ruleId, activeBuildingId) {
    let params = `?rule_id=${ruleId}&building_id=${activeBuildingId}`;

    return axiosInstance.get(`${listLinkSocketRules}${params}`).then((res) => {
        return res;
    });
}

export function unlinkSocketRequest(rulesToUnLink) {
    return axiosInstance.post(`${unLinkSocket}`, rulesToUnLink).then((res) => {
        return res;
    });
}
