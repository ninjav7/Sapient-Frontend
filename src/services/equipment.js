import _ from 'lodash';
import axiosInstance from './axiosInstance';
import { generalEquipments, deleteEquipment, createEquipment, getFiltersForEquipment, getEndUseId } from './Network';

export function getEqupmentDataRequest(
    pageSize,
    pageNo,
    bldgId,
    search,
    equipmentTypeFilterString,
    macTypeFilterString,
    locationTypeFilterString,
    floorTypeFilterString,
    spaceTypeFilterString,
    spaceTypeTypeFilterString,
    getParams
) {
    let params = `?building_id=${bldgId}&equipment_search=${search}&page_size=${pageSize}&page_no=${pageNo}`;
    const filteredData = {
        floor_id: floorTypeFilterString,
        space_id: spaceTypeFilterString,
        space_type_id: spaceTypeTypeFilterString,
        mac_address: macTypeFilterString,
        ...getParams,
    };
    if (equipmentTypeFilterString.length) {
        filteredData['equipment_types'] = equipmentTypeFilterString;
    }

    return axiosInstance
        .post(`${generalEquipments}${params}`, {
            ...filteredData,
        })
        .then((res) => {
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
    sensorTypeFilterString,
    floorTypeFilterString,
    spaceTypeFilterString,
    spaceTypeTypeFilterString,
    getParams
) {
    let params = `?page_size=${pageSize}&page_no=${pageNo}&rule_id=${ruleId}&building_id=${activeBuildingId}&equipment_types=${encodeURIComponent(
        equpimentTypeFilterString
    )}&sensor_number=${encodeURIComponent(sensorTypeFilterString)}`;

    if (pageSize === 0) {
        return;
    }

    return axiosInstance
        .get(`${generalEquipments}${params}`, {
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

export function deleteEquipmentRequest(bldgId, equipmentIdData) {
    let params = `?equipment_id=${equipmentIdData}&building_id=${bldgId}`;
    return axiosInstance.delete(`${deleteEquipment}${params}`).then((res) => {
        return res;
    });
}
export function addNewEquipment(bldgId, createEqipmentData) {
    let params = Object.assign({}, createEqipmentData);
    params['building_id'] = bldgId;

    return axiosInstance.post(`${createEquipment}`, params).then((res) => {
        return res;
    });
}

// export function getFiltersForEquipmentRequest(){
//     /api/config/configuration-filter
// }

/**
 * Request filters.
 * @param args = {sensor_search, equipment_types, mac_address, tags, floor_id, space_id, space_type_id, sensor_number};
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getFiltersForEquipmentRequest(args) {
    return axiosInstance
        .get(`${getFiltersForEquipment}`, {
            params: _.pickBy(
                {
                    query_collection: 'equipment',
                    building_id: args.bldgId,
                    mac_address: args.macTypeFilterString,
                    equipment_types: args.equpimentTypeFilterString,
                    floor_id: args.floorTypeFilterString,
                    space_id: args.spaceTypeFilterString,
                    space_type_id: args.spaceTypeTypeFilterString,
                    tags: args.tags,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}

export function getEndUseDataRequest() {
    return axiosInstance.get(`${getEndUseId}`).then((res) => {
        return res.data;
    });
}