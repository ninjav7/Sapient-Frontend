import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import { useLocation, useHistory } from 'react-router-dom';
import { authProtectedRoutes } from '../../routes/index';
import { configChildRoutes } from '../SecondaryTopNavBar/utils';
import { ReactComponent as CarbonCo2 } from '../../assets/icon/carbon.svg';

import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { userPermissionData, buildingData } from '../../store/globalState';
import { EXPLORE_FILTER_TYPE } from '../../pages/explore/constants';

import { ReactComponent as User } from '../../assets/icon/user.svg';
import { ReactComponent as Toggleon } from '../../assets/icon/toggleon.svg';
import { ReactComponent as Telescope } from '../../assets/icon/telescope.svg';
import { ReactComponent as Circlebolt } from '../../assets/icon/circle-bolt.svg';
import { ReactComponent as Spaces } from '../../assets/icon/spaces-page.svg';

import './styles.scss';

const NavLinks = () => {
    const location = useLocation();
    const history = useHistory();

    const [buildingListData] = useAtom(buildingData);
    const [userPermission] = useAtom(userPermissionData);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [topNavRoutes, setTopNavRoutes] = useState([]);

    const isSuperUser = userPermission?.is_superuser ?? false;
    const isEnergyTabVisible = userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ?? false;
    const isExploreTabVisible = userPermission?.permissions?.permissions?.explore_general_permission?.view ?? false;
    const isControlTabVisible = userPermission?.permissions?.permissions?.control_control_permission?.view ?? false;
    const isCarbonTabVisible = userPermission?.permissions?.permissions?.carbon_portfolio_permission?.view ?? false;

    const ENERGY_TAB = '/energy/portfolio/overview';
    const CARBON_TAB = '/carbon/portfolio/overview';
    const CONTROL_TAB = '/control/plug-rules';
    const EXPLORE_TAB = '/explore/overview/by-buildings';
    const SUPER_USER_ROUTE = '/super-user/accounts';
    const SPACES_TAB = '/spaces/portfolio/overview';

    const configRoutes = [
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/smart-plugs',
        '/settings/smart-meters',
        '/settings/utility-monitors',
    ];

    const redirectToPortfolioPage = () => {
        history.push({
            pathname: `/energy/portfolio/overview`,
        });
    };

    const redirectToControlPage = () => {
        history.push({
            pathname: `/control/plug-rules`,
        });
    };

    const redirectToCarbonPage = () => {
        history.push({
            pathname: `/carbon/portfolio/overview`,
        });
    };

    const redirectToSpacesPage = () => {
        history.push({
            pathname: `/spaces/portfolio/overview`,
        });
    };

    const handleEnergyClick = () => {
        const bldgObj = buildingListData.find((bldg) => bldg.building_id === bldgId);

        if (!bldgObj?.active) {
            redirectToPortfolioPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
            return;
        }

        if (
            location.pathname.includes('/explore/building') ||
            location.pathname.includes('/control/plug-rules') ||
            location.pathname.includes('/spaces/building/overview') ||
            location.pathname.includes('/carbon/building/overview')
        ) {
            history.push({
                pathname: `/energy/building/overview/${bldgId}`,
            });
            return;
        }

        if (location.pathname.includes('/settings')) {
            configRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/energy/building/overview/${bldgId}`,
                    });
                    return;
                }
            });

            configChildRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/energy/building/overview/${bldgId}`,
                    });
                    return;
                }
            });
        } else {
            redirectToPortfolioPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
        }
    };

    const handleCarbonClick = () => {
        const bldgObj = buildingListData.find((bldg) => bldg.building_id === bldgId);
        if (!bldgObj?.active) {
            redirectToCarbonPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
            return;
        }

        if (
            location.pathname.includes('/energy/building/overview') ||
            location.pathname.includes('/spaces/building/overview') ||
            location.pathname.includes('/energy/end-uses') ||
            location.pathname.includes('/energy/time-of-day') ||
            location.pathname.includes('/control/plug-rules') ||
            location.pathname.includes('/explore/building')
        ) {
            history.push({
                pathname: `/carbon/building/overview/${bldgId}`,
            });
            return;
        }

        if (location.pathname.includes('/settings')) {
            configRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/carbon/building/overview/${bldgId}`,
                    });
                    return;
                }
            });

            configChildRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/carbon/building/overview/${bldgId}`,
                    });
                    return;
                }
            });
        } else {
            redirectToCarbonPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
        }
    };

    const handleControlClick = () => {
        const bldgObj = buildingListData.find((bldg) => bldg.building_id === bldgId);
        if (bldgObj) {
            if (!bldgObj?.active) {
                redirectToPortfolioPage();
                updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
                return;
            } else {
                redirectToControlPage();
                return;
            }
        } else {
            redirectToControlPage();
        }
    };

    const handleExploreClick = () => {
        const bldgObj = buildingListData.find((bldg) => bldg.building_id === bldgId);
        if (!bldgObj?.active) {
            history.push({
                pathname: `/explore/overview/by-buildings`,
            });
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
            return;
        }

        if (
            location.pathname.includes('/energy/building/overview') ||
            location.pathname.includes('/spaces/building/overview') ||
            location.pathname.includes('/energy/end-uses') ||
            location.pathname.includes('/energy/time-of-day') ||
            location.pathname.includes('/control/plug-rules') ||
            location.pathname.includes('/carbon/building/overview')
        ) {
            history.push({
                pathname: `/explore/building/${bldgId}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`,
            });
            return;
        }

        if (location.pathname.includes('/settings')) {
            configRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/explore/building/${bldgId}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`,
                    });
                    return;
                }
            });

            configChildRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/explore/building/${bldgId}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`,
                    });
                    return;
                }
            });
        } else {
            history.push({
                pathname: '/explore/overview/by-buildings',
            });
        }
    };

    const handleSpacesClick = () => {
        const bldgObj = buildingListData.find((bldg) => bldg.building_id === bldgId);

        if (!bldgObj?.active) {
            redirectToSpacesPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
            return;
        }

        if (
            location.pathname.includes('/energy/building/overview') ||
            location.pathname.includes('/explore-page/by-equipment') ||
            location.pathname.includes('/control/plug-rules')
        ) {
            history.push({
                pathname: `/spaces/building/overview/${bldgId}`,
            });
            return;
        }

        if (location.pathname.includes('/settings')) {
            configRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/spaces/building/overview/${bldgId}`,
                    });
                    return;
                }
            });

            configChildRoutes.forEach((record) => {
                if (location.pathname.includes(record)) {
                    history.push({
                        pathname: `/spaces/building/overview/${bldgId}`,
                    });
                    return;
                }
            });
        } else {
            redirectToSpacesPage();
            updateBuildingStore('portfolio', 'Portfolio', ''); // (BldgId, BldgName, BldgTimeZone)
        }
    };

    const handleSideNavChange = (componentName) => {
        if (componentName === 'Energy') {
            ComponentStore.update((s) => {
                s.parent = 'portfolio';
            });
        }
        if (componentName === 'Spaces') {
            ComponentStore.update((s) => {
                s.parent = 'spaces';
            });
        }
        if (componentName === 'Carbon') {
            ComponentStore.update((s) => {
                s.parent = 'carbon';
            });
        }
        if (componentName === 'Control') {
            ComponentStore.update((s) => {
                s.parent = 'control';
            });
        }
        if (componentName === 'Explore') {
            ComponentStore.update((s) => {
                s.parent = 'explore';
            });
        }
        if (componentName === 'account') {
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        }
        if (componentName === 'building-settings') {
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        } else {
            return;
        }
    };

    const handlePathChange = (pathName) => {
        switch (pathName) {
            case ENERGY_TAB:
                handleEnergyClick();
                break;
            case SPACES_TAB:
                handleSpacesClick();
                break;
            case CARBON_TAB:
                handleCarbonClick();
                break;
            case CONTROL_TAB:
                handleControlClick();
                break;
            case EXPLORE_TAB:
                handleExploreClick();
                break;
            default:
                history.push({
                    pathname: pathName,
                });
                break;
        }
    };

    useEffect(() => {
        if (!authProtectedRoutes || authProtectedRoutes.length === 0) return;

        const tabVisibilityMap = {
            Energy: isEnergyTabVisible || isSuperUser,
            Spaces: isEnergyTabVisible || isSuperUser,
            Carbon: isCarbonTabVisible || isSuperUser,
            Control: isControlTabVisible || isSuperUser,
            Explore: isExploreTabVisible || isSuperUser,
            Admin: isSuperUser || location.pathname === SUPER_USER_ROUTE,
        };

        const newRoutesList = authProtectedRoutes.filter((route) => {
            return tabVisibilityMap[route?.name];
        });

        setTopNavRoutes(newRoutesList);
    }, [
        authProtectedRoutes,
        isSuperUser,
        isEnergyTabVisible,
        isCarbonTabVisible,
        isControlTabVisible,
        isExploreTabVisible,
    ]);

    return (
        <div className="top-nav-routes-list d-flex align-items-center">
            {topNavRoutes.map((item, index) => {
                if (!item.visibility) return;
                if (item.name === 'Admin' && location.pathname !== SUPER_USER_ROUTE) return;
                if (location.pathname === SUPER_USER_ROUTE && item.path !== SUPER_USER_ROUTE) return;

                let className = '';

                // For SuperUser Route no split is required
                if (item.name === 'Admin') {
                    className = 'active';
                } else {
                    const str1 = item.path.split('/')[1];
                    const str2 = location.pathname.split('/')[1];
                    const active = str1.localeCompare(str2);
                    className = active === 0 ? 'active' : '';
                }

                const routeName = item?.name === 'Admin' ? 'Accounts' : item?.name;

                return (
                    <div
                        key={index}
                        className={`d-flex align-items-center mouse-pointer navbar-head-container ${className}`}
                        onClick={() => {
                            handleSideNavChange(item?.name);
                            handlePathChange(item?.path);
                        }}>
                        <div className="d-flex align-items-center">
                            {item.name === 'Energy' && <Circlebolt className={`navbar-icons-style ${className}`} />}
                            {item.name === 'Spaces' && <Spaces className={`navbar-icons-style ${className}`} />}
                            {item.name === 'Control' && <Toggleon className={`navbar-icons-style ${className}`} />}
                            {item.name === 'Carbon' && <CarbonCo2 className={`navbar-icons-style ${className}`} />}
                            {item.name === 'Explore' && <Telescope className={`navbar-icons-style ${className}`} />}
                            {item.name === 'Admin' && (
                                <User className={`navbar-icons-style ${className}`} width={18} height={19} />
                            )}
                            <div className={`navbar-heading ml-2 ${className}`}>{routeName}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NavLinks;
