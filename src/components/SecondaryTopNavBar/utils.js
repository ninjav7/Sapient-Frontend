import { BuildingStore } from '../../store/BuildingStore';

export const configRoutes = [
    '/settings/general',
    '/settings/layout',
    '/settings/equipment',
    '/settings/panels',
    '/settings/active-devices',
    '/settings/passive-devices',
    '/settings/active-devices/provision',
];

export const configChildRoutes = [
    '/settings/panels/edit-panel',
    '/settings/active-devices/single/',
    '/settings/passive-devices/single/',
    '/settings/active-devices/provision',
];

export const portfolioRoutes = ['/energy/portfolio/overview', '/energy/compare-buildings'];

export const accountRoutes = [
    '/settings/account',
    '/settings/buildings',
    '/settings/users',
    '/settings/roles',
    '/settings/equipment-types',
];

export const accountChildRoutes = ['/users/user-profile/single'];

export const buildingRoutes = ['/energy/building/overview', '/energy/end-uses', '/energy/time-of-day'];

export const updateBuildingStore = (bldgId, bldgName, bldgTimeZone) => {
    localStorage.setItem('buildingId', bldgId);
    localStorage.setItem('buildingName', bldgName);
    localStorage.setItem('buildingTimeZone', bldgTimeZone === '' ? 'US/Eastern' : bldgTimeZone);

    BuildingStore.update((s) => {
        s.BldgId = bldgId;
        s.BldgName = bldgName;
        s.BldgTimeZone = bldgTimeZone === '' ? 'US/Eastern' : bldgTimeZone;
    });
};
