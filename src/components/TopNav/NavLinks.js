import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { authProtectedRoutes } from '../../routes/index';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelescope, faToggleOn, faCircleBolt } from '@fortawesome/pro-regular-svg-icons';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';

const NavLinks = () => {
    const location = useLocation();
    const history = useHistory();
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [userPermission] = useAtom(userPermissionData);
    const [userPermissionBuildingExplore, setuserPermissionBuildingExplore] = useState('');
    const [userPermisionBuildingEnergy, setuserPermisionBuildingEnergy] = useState('');
    const [userPermisionBuildingControl, setuserPermisionBuildingControl] = useState('');

    const ENERGY_TAB = '/energy/portfolio/overview';
    const CONTROL_TAB = '/control/plug-rules';
    const EXPLORE_TAB = '/explore-page/by-buildings';

    const configRoutes = [
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
        '/settings/passive-devices',
    ];

    const handleEnergyClick = () => {
        if (configRoutes.includes(location.pathname) || location.pathname.includes('/explore-page/by-equipment')) {
            history.push({
                pathname: `/energy/building/overview/${bldgId}`,
            });
        } else {
            history.push({
                pathname: `/energy/portfolio/overview`,
            });
            BuildingStore.update((s) => {
                s.BldgId = 'portfolio';
                s.BldgName = 'Portfolio';
                s.BldgTimeZone = '';
            });
        }
    };

    const handleControlClick = () => {
        history.push({
            pathname: `/control/plug-rules`,
        });
    };

    const handleExploreClick = () => {
        if (
            configRoutes.includes(location.pathname) ||
            location.pathname.includes('/energy/building/overview') ||
            location.pathname.includes('/energy/end-uses') ||
            location.pathname.includes('/energy/time-of-day')
        ) {
            history.push({
                pathname: `/explore-page/by-equipment/${bldgId}`,
            });
        } else {
            history.push({
                pathname: `/explore-page/by-buildings`,
            });
        }
    };

    const handleSideNavChange = (componentName) => {
        if (componentName === 'Energy') {
            ComponentStore.update((s) => {
                s.parent = 'portfolio';
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
            case CONTROL_TAB:
                handleControlClick();
                break;
            case EXPLORE_TAB:
                handleExploreClick();
                break;
            default:
                history.push({
                    pathname: `${pathName}`,
                });
                break;
        }
    };

    useEffect(() => {
        if (userPermission?.user_role !== 'admin') {
            if (!userPermission?.permissions?.permissions?.explore_general_permission?.view) {
                setuserPermissionBuildingExplore('Explore');
            }
            if (!userPermission?.permissions?.permissions?.energy_portfolio_permission?.view) {
                setuserPermisionBuildingEnergy('Energy');
            }
            if (!userPermission?.permissions?.permissions?.control_control_permission?.view) {
                setuserPermisionBuildingControl('Control');
            }
            if (userPermission?.permissions?.permissions?.explore_general_permission?.view) {
                setuserPermissionBuildingExplore('');
            }
            if (userPermission?.permissions?.permissions?.energy_portfolio_permission?.view) {
                setuserPermisionBuildingEnergy('');
            }
            if (userPermission?.permissions?.permissions?.control_control_permission?.view) {
                setuserPermisionBuildingControl('');
            }
        }
        if (userPermission?.user_role === 'admin') {
            setuserPermissionBuildingExplore('');
            setuserPermisionBuildingEnergy('');
            setuserPermisionBuildingControl('');
        }
    }, [userPermission]);

    return (
        <div className="top-nav-routes-list">
            {authProtectedRoutes
                .filter(
                    (item) =>
                        item?.name !== userPermissionBuildingExplore &&
                        item?.name !== userPermisionBuildingEnergy &&
                        item?.name !== userPermisionBuildingControl
                )
                .map((item, index) => {
                    const Icon = item.icon || null;
                    if (!item.visibility) {
                        return;
                    }

                    let str1 = item.path.split('/')[1];
                    let str2 = location.pathname.split('/')[1];
                    let active = str1.localeCompare(str2);
                    let className = active === 0 ? 'active' : '';

                    return (
                        <div key={index} className={`navbar-head-container mouse-pointer ${className}`}>
                            <div className="d-flex align-items-center">
                                {item.name === 'Energy' && (
                                    <div className={`font-icon-style ${className}`}>
                                        <FontAwesomeIcon icon={faCircleBolt} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Control' && (
                                    <div className={`font-icon-style ${className}`}>
                                        <FontAwesomeIcon icon={faToggleOn} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Explore' && (
                                    <div className={`font-icon-style ${className}`}>
                                        <FontAwesomeIcon icon={faTelescope} size="lg" />
                                    </div>
                                )}
                                <div
                                    onClick={() => {
                                        handleSideNavChange(item.name);
                                        handlePathChange(item.path);
                                    }}
                                    className={`navbar-heading ${className}`}>
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default NavLinks;
