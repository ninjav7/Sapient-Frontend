export const configRoutes = [
    '/settings/general',
    '/settings/layout',
    '/settings/equipment',
    '/settings/panels',
    '/settings/active-devices',
    '/settings/smart-meters',
    '/settings/utility-meters',
];

export const configChildRoutes = [
    '/settings/panels/edit-panel',
    '/settings/active-devices/single/',
    '/settings/smart-meters/single/',
    '/settings/utility-meters/single/',
    '/settings/active-devices/provision',
];

export const portfolioRoutes = ['/energy/portfolio/overview', '/energy/compare-buildings'];

export const accountRoutes = [
    '/settings/account',
    '/settings/buildings',
    '/settings/users',
    '/settings/roles',
    '/settings/equipment-types',
    '/settings/preference',
];

export const accountChildRoutes = ['/users/user-profile/single'];

export const buildingRoutes = ['/energy/building/overview', '/energy/end-uses', '/energy/time-of-day'];
