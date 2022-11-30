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
export function fetchExploreBuildingList(dateTimeData,search,order_by, sort_by, minConValue, maxConValue, minPerValue, maxPerValue, minSqftValue, maxSqftValue, selectedBuildingType, conAPIFlag, perAPIFlag, sqftAPIFlag) {
    let params = `?consumption=energy&search_by_name=${search}&ordered_by=${order_by}&sort_by=${sort_by}`;
    let obj={...dateTimeData};
    if((minConValue!==0 || maxConValue!==0) && conAPIFlag!=='')
        obj["consumption_range"] = {
        gte:(minConValue-1)*1000,
        lte:(maxConValue+1)*1000
        }
    if((minPerValue!==0 || maxPerValue!==0) && perAPIFlag!=='')
        obj["change"] ={
            gte:minPerValue,
            lte:maxPerValue+1
        }
    if((minSqftValue!==0 || maxSqftValue!==0) && sqftAPIFlag!=='')
        obj["sq_ft_range"] ={
            gte:minSqftValue,
            lte:maxSqftValue
        }
    if(selectedBuildingType.length!==0)
        obj["building_type"] = selectedBuildingType;
    return axiosInstance.post(`${getExploreBuildingList}${params}`, obj).then((res) => {
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
export function fetchExploreEquipmentList(startDate,endDate,timeZone,bldgId,search,order_by, sort_by,pageSize,pageNo,minConValue,maxConValue, minPerValue, maxPerValue, selectedLocation, selectedEndUse, selectedEquipType, selectedSpaceType, conAPIFlag, perAPIFlag) {
    let params = `?consumption=energy&building_id=${bldgId}&page_size=${pageSize}&page_no=${pageNo}&ordered_by=${order_by}&sort_by=${sort_by}&search_by_name=${search}`;
    let payload={}
    payload["date_from"]= startDate;
    payload["date_to"] = endDate;
    payload["tz_info"] = timeZone;
    if((minConValue!==0 || maxConValue!==0) && conAPIFlag!=="")
        payload["consumption_range"] = {
            gte:(minConValue-1)*1000,
            lte:(maxConValue+1)*1000
        }
    if((minPerValue!==0 || maxPerValue!==0) && perAPIFlag!=="")
        payload["change"] ={
            gte:(minPerValue-1),
            lte:(maxPerValue+1)
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

export function fetchExploreFilter(bldgId, startDate, endDate, timeZone,  selectedLocation, selectedEquipType,selectedEndUse, selectedSpaceType, minConValue, maxConValue, conAPIFlag) {
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
    if(selectedEndUse.length!==0)
    {
        payload["end_use"] = selectedEndUse;
    }
    if(conAPIFlag!==''){
        payload["consumption_range"] = {
            gte:(minConValue-1)*1000,
            lte:(maxConValue+1)*1000
        }
    }
    return axiosInstance.post(`${getExploreFilter}${params}`, payload).then((res) => {
        return res;
    });
}
