import axiosInstance from '../../../services/axiosInstance';
import {
    addEquipmentType,
    getEndUseId,
    equipmentType,
    updateEquipmentType,
    getMetadataFilter,
} from '../../../services/Network';
import _ from 'lodash';

export function saveEquipTypeData(payload) {
    return axiosInstance.post(`${addEquipmentType}`, payload).then((res) => res);
}

export function updateEquipTypeData(payload) {
    return axiosInstance.post(`${updateEquipmentType}`, payload).then((res) => res);
}

export function deleteEquipTypeData(payload) {
    return axiosInstance.post(`${updateEquipmentType}`, payload).then((res) => res);
}

export function getEndUseData() {
    return axiosInstance.get(`${getEndUseId}`).then((res) => res);
}

export function getEquipTypeData(params) {
    let endPoint = `${equipmentType}`;
    if (params) endPoint = endPoint.concat(`${params}`);
    return axiosInstance.get(endPoint).then((res) => res);
}

export function fetchEquipmentTypeFilter(args) {
    return axiosInstance
        .get(`${getMetadataFilter}`, {
            params: _.pickBy(
                {
                    query_collection: 'equipment_type',
                    end_use: args.EndUseSelected,
                },
                _.identity
            ),
        })
        .then((res) => {
            return res.data;
        });
}
