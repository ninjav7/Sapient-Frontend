import { BuildingStore } from '../../store/BuildingStore';

export const configRoutes = [
    '/settings/general',
    '/settings/layout',
    '/settings/equipment',
    '/settings/panels',
    '/settings/active-devices',
    '/settings/passive-devices',
];

export const portfolioRoutes = ['/energy/portfolio/overview', '/energy/compare-buildings'];

export const accountRoutes = [
    '/settings/account',
    '/settings/buildings',
    '/settings/users',
    '/settings/roles',
    '/settings/equipment-types',
];

export const buildingRoutes = ['/energy/building/overview', '/energy/end-uses', '/energy/time-of-day'];

export const updateBuildingStore = (bldg) => {
    localStorage.setItem('buildingId', bldg?.value);
    localStorage.setItem('buildingName', bldg?.label);
    localStorage.setItem('buildingTimeZone', bldg?.timezone === '' ? 'US/Eastern' : bldg?.timezone);

    BuildingStore.update((s) => {
        s.BldgId = bldg?.value;
        s.BldgName = bldg?.label;
        s.BldgTimeZone = bldg?.timezone === '' ? 'US/Eastern' : bldg?.timezone;
    });
};
