import axiosInstance from '../../services/axiosInstance';
import _ from 'lodash';
import {
    getExploreBuildingList,
    getExploreBuildingChart, 
    getExploreEquipmentList,
    getExploreEquipmentChart,
    getExploreFilter
} from '../../services/Network';


//Explore By Building
export function fetchExploreBuildingList(dateTimeData,search,order_by, sort_by, consumptionObj, squareFtObj, buildingTypeArray,changeObj) {
    let params = `?consumption=energy&search_by_name=${search}&ordered_by=${order_by}&sort_by=${sort_by}`;
    const result = _.pickBy(
        {
            consumption_range: consumptionObj,
            sq_ft_range: squareFtObj,
            building_type: buildingTypeArray,
            change: changeObj,
            ...dateTimeData,
        },
        _.identity
    )

    return axiosInstance.post(`${getExploreBuildingList}${params}`, result).then((res) => {
        return res;
    });
}

export function fetchExploreBuildingChart(currentData, selectedBuildingId) {
let params = `?consumption=energy&building_id=${selectedBuildingId}&divisible_by=1000`;
return axiosInstance.post(`${getExploreBuildingChart}${params}`, currentData).then((res) => {
    return res;
});
}

//Explore By Equipment
export function fetchExploreEquipmentList(startDate,endDate,timeZone,bldgId,search,order_by, sort_by,pageSize,pageNo,minConValue,maxConValue, minPerValue, maxPerValue, selectedLocation, selectedEndUse, selectedEquipType, selectedSpaceType) {
    let params = `?consumption=energy&building_id=${bldgId}&page_size=${pageSize}&page_no=${pageNo}`;
    let payload={}
    payload["date_from"]= startDate;
    payload["date_to"] = endDate;
    payload["tz_info"] = timeZone;
    if(minConValue!==0 || maxConValue!==0)
        payload["consumption_range"] = {
            gte:minConValue*1000,
            lte:maxConValue*1000
        }
    if(minPerValue!==0 || maxPerValue!==0)
        payload["change"] ={
            gte:minPerValue,
            lte:maxPerValue
        }
    if(selectedLocation.length!==0)
        payload["location"] = selectedLocation;
    if(selectedEquipType.length!==0)
        payload["equipment_types"] = selectedEquipType;
    if(selectedSpaceType.length!==0)
        payload["space_type"] = selectedSpaceType;
    if(selectedEndUse.length!==0)
        payload["end_use"] = selectedEndUse;
    return axiosInstance.post(`${getExploreEquipmentList}${params}`, payload).then((res) => {
        return res;
    });
}

export function fetchExploreEquipmentChart(payload, params) {
return axiosInstance.post(`${getExploreEquipmentChart}${params}`, payload).then((res) => {
    return res;
    });
}

export function fetchExploreFilter(bldgId, startDate, endDate, timeZone,  selectedLocation, selectedEquipType, selectedSpaceType) {
    let params=`?building_id=${bldgId}&consumption=energy`;
    let payload={}
    payload["date_from"]= startDate;
    payload["date_to"] = endDate;
    payload["tz_info"] = timeZone;
    if(selectedLocation.length!==0)
    {
        payload["location"] = selectedLocation;
    }
    if(selectedEquipType.length!==0)
    {
        payload["equipment_types"] = selectedEquipType;
    }
    if(selectedSpaceType.length!==0)
    {
        payload["space_type"] = selectedSpaceType;
    }
    return axiosInstance.post(`${getExploreFilter}${params}`, payload).then((res) => {
        return res;
    });
}
