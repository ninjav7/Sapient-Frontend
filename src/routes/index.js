import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

//User Auth
import { isUserAuthenticated, isSuperUserAuthenticated } from '../helpers/authUtils';

// settings
import General from '../pages/settings/general-settings';
import UtilityBills from '../pages/settings/utilityBills';
import Layout from '../pages/settings/layout';
import Equipment from '../pages/settings/equipment/Equipment';
import EquipmentTypes from '../pages/settings/equipment-type';
import Panels from '../pages/settings/panels';
import EditBreakerPanel from '../pages/settings/panels/EditBreakerPanel';
import ActiveDevices from '../pages/settings/active-devices';
import Provision from '../pages/settings/active-devices/provision';
import PassiveDevices from '../pages/settings/passive-devices';
import IndividualPassiveDevice from '../pages/settings/passive-devices/IndividualPassiveDevice';
import IndividualActiveDevice from '../pages/settings/active-devices/IndividualActiveDevice';
import Gateways from '../pages/settings/gateways';
import AccountSettings from '../pages/settings/account-settings';
import Buildings from '../pages/settings/buildings';
import Users from '../pages/settings/users';
import UserProfile from '../pages/settings/users/UserProfile';
import Roles from '../pages/settings/roles';
import SingleRole from '../pages/settings/roles/SingleRole';
import SingleRoleNew from '../pages/settings/roles/SingleRoleNew';

// controls
const PlugRule = React.lazy(() => import('../pages/controls/PlugRule'));
const PlugRules = React.lazy(() => import('../pages/controls/PlugRules'));
// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const UpdatePassword = React.lazy(() => import('../pages/auth/UpdatePassword'));
const VerifyAccount = React.lazy(() => import('../pages/auth/VerifyAccount'));
// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'));

// pages
const Error404 = React.lazy(() => import('../pages/other/Error404'));
const Error500 = React.lazy(() => import('../pages/other/Error500'));

// charts
const Charts = React.lazy(() => import('../pages/charts'));

// energy
const Portfolio = React.lazy(() => import('../pages/portfolio'));

// building
const Building = React.lazy(() => import('../pages/buildings'));

// peakDemand
const PeakDemand = React.lazy(() => import('../pages/peakDemand'));

// endUses
const EndUses = React.lazy(() => import('../pages/endUses'));
const EndUseType = React.lazy(() => import('../pages/endUses/EndUseType'));

// timeOfDay
const TimeOfDay = React.lazy(() => import('../pages/timeOfDay'));

// compareBuildings
const CompareBuildings = React.lazy(() => import('../pages/compareBuildings'));
const ExploreBuildingPeak = React.lazy(() => import('../pages/peakDemand/ExploreBuildingPeak'));

// explore
const ExploreByEquipment = React.lazy(() => import('../pages/explore/ExploreByEquipment'));
const ExploreByBuildings = React.lazy(() => import('../pages/explore/ExploreByBuildings'));

//superUser
const Accounts = React.lazy(() => import('../pages/superUser/accounts'));
const UpdateAuth = React.lazy(() => import('../pages/auth/updateAuth'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        exact
        {...rest}
        render={(props) => {
            // if (!isSuperUserAuthenticated()) {
            //     return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            // }
            if (isSuperUserAuthenticated()) {
                return <Component {...props} />;
            } else if (!isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }
            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () =>
        isSuperUserAuthenticated() ? (
            <Redirect to="/super-user/accounts" />
        ) : (
            <Redirect to="/energy/portfolio/overview" />
        ),
    route: PrivateRoute,
    visibility: true,
};

// pages
const pagesRoutes = {
    path: '/pages',
    name: 'Pages',
    header: 'Custom',
    icon: FeatherIcon.FileText,
    children: [
        {
            path: '/pages/error-404',
            name: 'Error 404',
            component: Error404,
            route: Route,
        },
        {
            path: '/pages/error-500',
            name: 'Error 500',
            component: Error500,
            route: Route,
        },
    ],
};

// charts
const chartRoutes = {
    path: '/charts',
    name: 'Charts',
    component: Charts,
    icon: FeatherIcon.PieChart,
    roles: ['Admin'],
    route: PrivateRoute,
    visibility: false,
};

// portfolio
const portfolioRoutes = {
    path: '/energy/portfolio/overview',
    name: 'Energy',
    component: Portfolio,
    visibility: true,
    children: [
        {
            path: '/energy/portfolio/overview',
            name: 'Portfolio Overview',
            component: Portfolio,
            route: PrivateRoute,
            visibility: true,
            parent: 'portfolio',
        },
        {
            path: '/energy/compare-buildings',
            name: 'Compare Buildings',
            component: CompareBuildings,
            route: PrivateRoute,
            visibility: true,
            parent: 'portfolio',
        },
        {
            path: '/energy/building/overview/:bldgId',
            name: 'Building Overview',
            component: Building,
            route: PrivateRoute,
            visibility: true,
            parent: 'buildings',
        },
        {
            path: '/energy/end-uses/:endUseType/:bldgId',
            name: 'EndUseType',
            component: EndUseType,
            route: PrivateRoute,
            visibility: false,
        },
        // PLT-339: Peak Demand routing disbaled.
        // {
        //     path: '/energy/peak-demand/:bldgId',
        //     name: 'Peak Demand',
        //     component: PeakDemand,
        //     route: PrivateRoute,
        //     visibility: true,
        //     parent: 'buildings',
        // },
        {
            path: '/energy/end-uses/:bldgId',
            name: 'End Uses',
            component: EndUses,
            route: PrivateRoute,
            visibility: true,
            parent: 'buildings',
        },
        {
            path: '/energy/time-of-day/:bldgId',
            name: 'Time Of Day',
            component: TimeOfDay,
            route: PrivateRoute,
            visibility: true,
            parent: 'buildings',
        },
        {
            path: '/energy/building-peak-explore/:bldgId',
            name: 'BuildingPeak Explore',
            component: ExploreBuildingPeak,
            route: PrivateRoute,
            visibility: false,
        },
    ],
    icon: FeatherIcon.PieChart,
    roles: ['Admin'],
};

// settings
const settingsRoutes = {
    path: '/settings',
    name: 'Settings',
    visibility: false,
    children: [
        {
            path: '/settings/general',
            name: 'General',
            component: General,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        {
            path: '/settings/layout',
            name: 'Layout',
            component: Layout,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        {
            path: '/settings/equipment',
            name: 'Equipment',
            component: Equipment,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        // {
        //     path: '/settings/utility-bills',
        //     name: 'Utility Bills',
        //     component: UtilityBills,
        //     route: PrivateRoute,
        //     visibility: true,
        //     parent: 'building-settings',
        // },
        {
            path: '/settings/panels/edit-panel/:panelId',
            name: 'Edit Breaker-Panel',
            component: EditBreakerPanel,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/panels',
            name: 'Panels',
            component: Panels,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        {
            path: '/settings/active-devices/single/:deviceId',
            name: 'Single Active Devices',
            component: IndividualActiveDevice,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/active-devices/provision',
            name: 'Provision Devices',
            component: Provision,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/active-devices',
            name: 'Active Devices',
            component: ActiveDevices,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        {
            path: '/settings/active-devices/provision',
            name: 'Provision Devices',
            component: Provision,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/smart-meters/single/:deviceId',
            name: 'Single Smart Meter',
            component: IndividualPassiveDevice,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/smart-meters',
            name: 'Smart Meters',
            component: PassiveDevices,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
        // PLT-492: Hide Role Page
        // {
        //     path: '/settings/gateways',
        //     name: 'Gateways',
        //     component: Gateways,
        //     route: PrivateRoute,
        //     visibility: true,
        //     parent: 'building-settings',
        // },
        {
            path: '/settings/account',
            name: 'General',
            component: AccountSettings,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },
        {
            path: '/settings/buildings',
            name: 'Buildings',
            component: Buildings,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },
        {
            path: '/settings/users/user-profile/single/:userId/',
            name: 'Users Profile',
            component: UserProfile,
            route: PrivateRoute,
            visibility: false,
            parent: 'account',
        },

        {
            path: '/settings/users',
            name: 'Users',
            component: Users,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },

        {
            path: '/settings/roles/config',
            name: 'Create Role',
            component: SingleRole,
            route: PrivateRoute,
            visibility: false,
            parent: 'account',
        },
        {
            path: '/settings/roles/:roleId',
            name: 'Single Role New',
            component: SingleRoleNew,
            route: PrivateRoute,
            visibility: false,
            parent: 'account',
        },

        // {
        //     path: '/settings/roles',
        //     name: 'Roles',
        //     component: Roles,
        //     route: PrivateRoute,
        //     visibility: true,
        //     parent: 'account',
        // },
        {
            path: '/settings/equipment-types',
            name: 'Equipment Types',
            component: EquipmentTypes,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },
    ],
    icon: FeatherIcon.PieChart,
    roles: ['Admin'],
};

const exploreRoutes = {
    path: '/explore-page/by-buildings',
    name: 'Explore',
    visibility: true,
    children: [
        {
            path: '/explore-page/by-buildings',
            name: 'Explore by Building',
            component: ExploreByBuildings,
            route: PrivateRoute,
            parent: 'explore',
            visibility: true,
        },
        {
            path: '/explore-page/by-equipment/:bldgId',
            name: 'Explore by Equipment',
            component: ExploreByEquipment,
            route: PrivateRoute,
            parent: 'explore',
            visibility: true,
        },
    ],
    icon: FeatherIcon.PieChart,
    roles: ['Admin'],
};

const controlRoutes = {
    path: '/control/plug-rules',
    name: 'Control',
    visibility: true,
    children: [
        {
            path: '/control/plug-rules/:ruleId',
            name: 'Plug Rule',
            component: PlugRule,
            route: PrivateRoute,
            parent: 'control',
            visibility: false,
        },
        {
            path: '/control/plug-rules/create-plug-rule',
            name: 'Create Plug Rule',
            component: PlugRule,
            route: PrivateRoute,
            parent: 'control',
            visibility: false,
        },
        {
            path: '/control/plug-rules',
            name: 'Plug Rules',
            component: PlugRules,
            route: PrivateRoute,
            parent: 'control',
            visibility: true,
        },
    ],
    icon: FeatherIcon.ToggleRight,
    roles: ['Admin'],
};

// auth
const authRoutes = {
    path: '/account',
    name: 'Auth',
    visibility: true,
    children: [
        {
            path: '/account/login/:user_found/:link_type/:account_linked/:is_active/:is_verified/:session_id',
            name: 'Login',
            component: Login,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/login/:user_found',
            name: 'Login',
            component: Login,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: Route,
            visibility: true,
        },

        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/update-password/:id/:token',
            name: 'Update Password',
            component: UpdatePassword,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/verify-account/:id/:token',
            name: 'Verify Account',
            component: VerifyAccount,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/update-auth',
            name: 'Update Auth',
            component: UpdateAuth,
            route: Route,
            visibility: true,
        },
        {
            path: '/*',
            name: 'Error 404',
            component: Error404,
            route: Route,
        },
    ],
};

// admin
const adminRoutes = {
    path: '/super-user',
    name: 'Admin',
    visibility: true,
    children: [
        {
            path: '/super-user/accounts',
            name: 'Accounts',
            component: Accounts,
            route: PrivateRoute,
            visibility: true,
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = (routes) => {
    let flatRoutes = [];
    routes = routes || [];
    routes.forEach((item) => {
        flatRoutes.push(item);
        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const allRoutes = [
    rootRoute,
    chartRoutes,
    portfolioRoutes,
    settingsRoutes,
    controlRoutes,
    exploreRoutes,
    adminRoutes,
    authRoutes,
];

const authProtectedRoutes = [portfolioRoutes, settingsRoutes, controlRoutes, exploreRoutes, chartRoutes];

const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
