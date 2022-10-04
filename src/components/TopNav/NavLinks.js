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

    const configRoutes = [
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/active-devices',
        '/settings/passive-devices',
    ];

    const setSideNavBar = (componentName) => {
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

    const [userPermission] = useAtom(userPermissionData);

    console.log('userPermissionnowdatanow', userPermission);

    const [userPermissionBuildingExplore, setuserPermissionBuildingExplore] = useState('');
    const [userPermisionBuildingEnergy, setuserPermisionBuildingEnergy] = useState('');
    const [userPermisionBuildingControl, setuserPermisionBuildingControl] = useState('');

    console.log(
        'userPermissionBuildingExplore',
        userPermissionBuildingExplore,
        'userPermisionBuildingEnergy',
        userPermisionBuildingEnergy
    );

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

    const navigateToPath = (pathName) => {
        if (pathName === '/energy/portfolio/overview') {
            if (configRoutes.includes(location.pathname)) {
                history.push({
                    pathname: `/energy/building/overview/${bldgId}`,
                });
            } else {
                history.push({
                    pathname: `${pathName}`,
                });
            }
        }

        if (pathName !== '/energy/portfolio/overview') {
            history.push({
                pathname: `${pathName}`,
            });
        }
    };

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
                    console.log('item.visibility', item.visibility);
                    const Icon = item.icon || null;
                    if (!item.visibility) {
                        return;
                    }

                    let str1 = item.path.split('/')[1];
                    let str2 = location.pathname.split('/')[1];
                    let active = str1.localeCompare(str2);

                    return active === 0 ? (
                        <div key={index} className="navbar-head-container active mouse-pointer">
                            <div className="d-flex align-items-center">
                                {item.name === 'Energy' && (
                                    <div className="font-icon-style active">
                                        <FontAwesomeIcon icon={faCircleBolt} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Control' && (
                                    <div className="font-icon-style active">
                                        <FontAwesomeIcon icon={faToggleOn} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Explore' && (
                                    <div className="font-icon-style active">
                                        <FontAwesomeIcon icon={faTelescope} size="lg" />
                                    </div>
                                )}
                                <div
                                    onClick={() => {
                                        setSideNavBar(item.name);
                                        navigateToPath(item.path);
                                    }}
                                    className="navbar-heading active">
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="navbar-head-container mouse-pointer">
                            <div className="d-flex align-items-center">
                                {item.name === 'Energy' && (
                                    <div className="font-icon-style">
                                        <FontAwesomeIcon icon={faCircleBolt} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Control' && (
                                    <div className="font-icon-style">
                                        <FontAwesomeIcon icon={faToggleOn} size="lg" />
                                    </div>
                                )}
                                {item.name === 'Explore' && (
                                    <div className="font-icon-style">
                                        <FontAwesomeIcon icon={faTelescope} size="lg" />
                                    </div>
                                )}
                                <div
                                    onClick={() => {
                                        setSideNavBar(item.name);
                                        navigateToPath(item.path);
                                    }}
                                    className="navbar-heading">
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
