import { BuildingStore } from '../store/BuildingStore';
import { timeZone } from '../utils/helper';

export const updateBuildingStore = (bldgId, bldgName, bldgTimeZone, isPlugOnly) => {
    localStorage.setItem('buildingId', bldgId);
    localStorage.setItem('buildingName', bldgName);
    localStorage.setItem('buildingTimeZone', bldgTimeZone === '' ? timeZone : bldgTimeZone);
    localStorage.setItem('isPlugOnly', isPlugOnly);

    BuildingStore.update((s) => {
        s.BldgId = bldgId;
        s.BldgName = bldgName;
        s.BldgTimeZone = bldgTimeZone === '' ? timeZone : bldgTimeZone;
        s.isPlugOnly = isPlugOnly;
    });
};
