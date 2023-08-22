export const accountRoutes = [
    '/settings/account',
    '/settings/buildings',
    '/settings/users',
    '/settings/roles',
    '/settings/equipment-types',
];

export const accountChildRoutes = ['/users/user-profile/single'];

export const configRoutes = [
    '/settings/general',
    '/settings/layout',
    '/settings/equipment',
    '/settings/panels',
    '/settings/smart-plugs',
    '/settings/smart-meters',
    '/settings/utility-monitors',
];

export const configChildRoutes = [
    '/settings/panels/edit-panel',
    '/settings/smart-plugs/single/',
    '/settings/smart-meters/single/',
    '/settings/utility-monitors/single/',
    '/settings/smart-plugs/provision',
];

export const isPathInSettingsRoutes = (path, routes) => {
    return routes.some((route) => path.includes(route));
};

export const portfolioRoutes = ['/energy/portfolio/overview', '/energy/compare-buildings'];

export const buildingRoutes = ['/energy/building/overview', '/energy/end-uses', '/energy/time-of-day'];
