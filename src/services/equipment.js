import _ from 'lodash';
import axiosInstance from './axiosInstance';
import {
    generalEquipments,
    deleteEquipment,
} from './Network';

export function getEqupmentWithSearch(bldgId, equipSearch, pageSize, pageNo) {
    let params = `?building_id=${bldgId}&equipment_search=${equipSearch}&sort_by=ace&page_size=${pageSize}&page_no=${pageNo}`;

    return axiosInstance.post(`${generalEquipments}${params}`,{}).then((res) => {
        return res;
    });
}

export function deleteEquipmentRequest(bldgId,equipmentIdData){
    let params = `?equipment_id=${equipmentIdData}&building_id=${bldgId}`;
    return  axiosInstance.delete(`${deleteEquipment}${params}`).then((res) => {
      return res
    });
}