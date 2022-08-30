import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// settings
import General from '../pages/settings/General';
import UtilityBills from '../pages/settings/UtilityBills';
import Layout from '../pages/settings/Layout';
import Equipment from '../pages/settings/Equipment';
import EquipmentTypes from '../pages/settings/EquipmentTypes';
import Panels from '../pages/settings/panels/Panels';
import EditBreakerPanel from '../pages/settings/panels/EditBreakerPanel';
import ActiveDevices from '../pages/settings/active-devices/ActiveDevices';
import Provision from '../pages/settings/active-devices/Provision';
import PassiveDevices from '../pages/settings/passive-devices/PassiveDevices';
import IndividualPassiveDevice from '../pages/settings/passive-devices/IndividualPassiveDevice';
import IndividualActiveDevice from '../pages/settings/active-devices/IndividualActiveDevice';
import Gateways from '../pages/settings/Gateways';
import AccountSettings from '../pages/settings/AccountSettings';
import Buildings from '../pages/settings/Buildings';
import Users from '../pages/settings/Users';
import UserProfile from '../pages/settings/UserProfile';
import Roles from '../pages/settings/Roles';
import SingleRole from '../pages/settings/SingleRole';

// controls
import PlugRules from '../pages/controls/PlugRules';

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
// dashboard
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const PageTracker = React.lazy(() => import('../components/PageTracker/PageTracker'));
// apps
const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
const EmailInbox = React.lazy(() => import('../pages/apps/Email/Inbox'));
const EmailDetail = React.lazy(() => import('../pages/apps/Email/Detail'));
const EmailCompose = React.lazy(() => import('../pages/apps/Email/Compose'));
const ProjectList = React.lazy(() => import('../pages/apps/Project/List'));
const ProjectDetail = React.lazy(() => import('../pages/apps/Project/Detail/'));
const TaskList = React.lazy(() => import('../pages/apps/Tasks/List'));
const TaskBoard = React.lazy(() => import('../pages/apps/Tasks/Board'));

// pages
const Starter = React.lazy(() => import('../pages/other/Starter'));
const Profile = React.lazy(() => import('../pages/other/Profile/'));
const Activity = React.lazy(() => import('../pages/other/Activity'));
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Error404 = React.lazy(() => import('../pages/other/Error404'));
const Error500 = React.lazy(() => import('../pages/other/Error500'));

// ui
const BSComponents = React.lazy(() => import('../pages/uikit/BSComponents/'));
const FeatherIcons = React.lazy(() => import('../pages/uikit/Icons/Feather'));
const UniconsIcons = React.lazy(() => import('../pages/uikit/Icons/Unicons'));
const Widgets = React.lazy(() => import('../pages/uikit/Widgets/'));

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

// forms
const BasicForms = React.lazy(() => import('../pages/forms/Basic'));
const FormAdvanced = React.lazy(() => import('../pages/forms/Advanced'));
const FormValidation = React.lazy(() => import('../pages/forms/Validation'));
const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
const Editor = React.lazy(() => import('../pages/forms/Editor'));

// tables
const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

// explore
const Explore = React.lazy(() => import('../pages/explore/Explore_old'));
const ExploreByEquipment = React.lazy(() => import('../pages/explore/ExploreByEquipment'));
const ExploreByBuildings = React.lazy(() => import('../pages/explore/ExploreByBuildings'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        exact
        {...rest}
        render={(props) => {
            if (!isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }

            // const loggedInUser = getLoggedInUser();
            // // check if route is restricted by role
            // if (roles && (roles.indexOf(loggedInUser.role) === -1)) {
            //     // role not authorised so redirect to home page
            //     return <Redirect to={{ pathname: '/' }} />;
            // }

            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    // component: () => <Redirect to="/dashboard" />,
    component: () => <Redirect to="/energy/portfolio/overview" />,
    route: PrivateRoute,
    visibility: true,
};

// dashboards
const dashboardRoutes = {
    path: '/dashboard',
    name: 'Dashboard',
    icon: FeatherIcon.Home,
    header: 'Navigation',
    badge: {
        variant: 'success',
        text: '1',
    },
    component: Dashboard,
    roles: ['Admin'],
    visibility: false,
    route: PrivateRoute,
};

// apps
const calendarAppRoutes = {
    path: '/apps/calendar',
    name: 'Calendar',
    header: 'Apps',
    icon: FeatherIcon.Calendar,
    component: CalendarApp,
    route: PrivateRoute,
    visibility: false,
    roles: ['Admin'],
};

const emailAppRoutes = {
    path: '/apps/email',
    name: 'Email',
    icon: FeatherIcon.Inbox,
    children: [
        {
            path: '/apps/email/inbox',
            name: 'Inbox',
            component: EmailInbox,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/apps/email/details',
            name: 'Details',
            component: EmailDetail,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/apps/email/compose',
            name: 'Compose',
            component: EmailCompose,
            route: PrivateRoute,
            roles: ['Admin'],
        },
    ],
};

const projectAppRoutes = {
    path: '/apps/projects',
    name: 'Projects',
    icon: FeatherIcon.Briefcase,
    children: [
        {
            path: '/apps/projects/list',
            name: 'List',
            component: ProjectList,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/apps/projects/detail',
            name: 'Detail',
            component: ProjectDetail,
            route: PrivateRoute,
            roles: ['Admin'],
        },
    ],
};

const taskAppRoutes = {
    path: '/apps/tasks',
    name: 'Tasks',
    icon: FeatherIcon.Bookmark,
    children: [
        {
            path: '/apps/tasks/list',
            name: 'List',
            component: TaskList,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/apps/tasks/board',
            name: 'Board',
            component: TaskBoard,
            route: PrivateRoute,
            roles: ['Admin'],
        },
    ],
};

const appRoutes = [calendarAppRoutes, emailAppRoutes, projectAppRoutes, taskAppRoutes];

// pages
const pagesRoutes = {
    path: '/pages',
    name: 'Pages',
    header: 'Custom',
    icon: FeatherIcon.FileText,
    children: [
        {
            path: '/pages/starter',
            name: 'Starter',
            component: Starter,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/pages/profile',
            name: 'Profile',
            component: Profile,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/pages/activity',
            name: 'Activity',
            component: Activity,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/pages/invoice',
            name: 'Invoice',
            component: Invoice,
            route: PrivateRoute,
            roles: ['Admin'],
        },
        {
            path: '/pages/pricing',
            name: 'Pricing',
            component: Pricing,
            route: PrivateRoute,
            roles: ['Admin'],
        },
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
        {
            path: '/energy/peak-demand/:bldgId',
            name: 'Peak Demand',
            component: PeakDemand,
            route: PrivateRoute,
            visibility: true,
            parent: 'buildings',
        },
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
            path: '/settings/passive-devices/single/:deviceId',
            name: 'Single Passive Devices',
            component: IndividualPassiveDevice,
            route: PrivateRoute,
            visibility: false,
            parent: 'building-settings',
        },
        {
            path: '/settings/passive-devices',
            name: 'Passive Devices',
            component: PassiveDevices,
            route: PrivateRoute,
            visibility: true,
            parent: 'building-settings',
        },
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
            path: '/settings/users',
            name: 'Users',
            component: Users,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },

        {
            path: '/settings/roles/config',
            name: 'Single Role',
            component: SingleRole,
            route: PrivateRoute,
            visibility: false,
            parent: 'account',
        },
        {
            path: '/settings/user-profile',
            name: 'Users',
            component: UserProfile,
            route: PrivateRoute,
            visibility: false,
            parent: 'account',
        },
        {
            path: '/settings/roles',
            name: 'Roles',
            component: Roles,
            route: PrivateRoute,
            visibility: true,
            parent: 'account',
        },
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
            path: '/account/register',
            name: 'Register',
            component: Register,
            route: Route,
            visibility: true,
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
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
            path: '/*',
            name: 'Error 404',
            component: Error404,
            route: Route,
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
    dashboardRoutes,
    chartRoutes,
    portfolioRoutes,
    settingsRoutes,
    controlRoutes,
    exploreRoutes,
    authRoutes,
    // ...appRoutes,
    // pagesRoutes,
    // componentsRoutes,
    // formsRoutes,
    // tableRoutes,
];

const authProtectedRoutes = [
    dashboardRoutes,
    portfolioRoutes,
    settingsRoutes,
    controlRoutes,
    exploreRoutes,
    chartRoutes,
    // ...appRoutes, pagesRoutes, componentsRoutes, , formsRoutes, tableRoutes
];

const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
