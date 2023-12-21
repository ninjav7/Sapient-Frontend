import { BuildingStore } from '../store/BuildingStore';
import { timeZone } from '../utils/helper';

export const updateBuildingStore = (bldgId, bldgName, bldgTimeZone, isPlugOnly = '') => {
    const buildingIsPlugOnly = isPlugOnly.toString();
    const buildingTimeZone = bldgTimeZone === '' ? timeZone : bldgTimeZone;

    localStorage.setItem('buildingId', bldgId);
    localStorage.setItem('buildingName', bldgName);
    localStorage.setItem('buildingTimeZone', buildingTimeZone);
    localStorage.setItem('isPlugOnly', buildingIsPlugOnly);

    BuildingStore.update((s) => {
        s.BldgId = bldgId;
        s.BldgName = bldgName;
        s.BldgTimeZone = buildingTimeZone;
        s.isPlugOnly = buildingIsPlugOnly;
    });
};
