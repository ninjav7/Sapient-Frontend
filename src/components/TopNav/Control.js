import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { useLocation, useHistory } from 'react-router-dom';
import { ComponentStore } from '../../store/ComponentStore';
import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';
import { ReactComponent as Gear } from '../../assets/icon/gear.svg';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { routesForAccountSettings } from './utils';
import { BuildingStore } from '../../store/BuildingStore';
import { accountChildRoutes } from '../SecondaryTopNavBar/utils';

const Control = () => {
    const location = useLocation();
    const history = useHistory();
    const cookies = new Cookies();

    const [userPermission] = useAtom(userPermissionData);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [pageType, setPageType] = useState('');

    const [accountRoutes, setAccountRoutes] = useState([
        '/settings/account',
        '/settings/buildings',
        '/settings/users',
        '/settings/roles',
        '/settings/equipment-types',
    ]);

    const [configRoutes, setConfigRoutes] = useState([
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
    ]);

    const handleLogout = () => {
        ComponentStore.update((s) => {
            s.parent = '';
        });
        localStorage.clear();
        cookies.remove('user', { path: '/' });
        window.location.reload();
    };

    const handleSideNavChange = () => {
        if (accountRoutes.includes(location.pathname)) {
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
            return;
        }
        if (configRoutes.includes(location.pathname)) {
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
            return;
        }
    };

    const handleRouteChange = () => {
        let currentPath = location.pathname;
        let pathName = '';

        if (currentPath.includes('/control/plug-rules')) {
            bldgId === 'portfolio' ? (pathName = accountRoutes[0]) : (pathName = configRoutes[0]);
        } else {
            routesForAccountSettings.includes(currentPath) || currentPath.includes(accountChildRoutes[0])
                ? (pathName = accountRoutes[0])
                : (pathName = configRoutes[0]);
        }

        history.push({
            pathname: `${pathName}`,
        });
    };

    useEffect(() => {
        if (userPermission?.user_role !== 'admin') {
            if (!userPermission?.permissions?.permissions?.account_general_permission?.view) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/account';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.account_buildings_permission?.view) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/buildings';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.account_user_permission?.view) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/users';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.account_roles_permission?.view) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/roles';
                    })
                );
                if (!accountRoutes.includes('/settings/equipment-types')) {
                    setAccountRoutes((el) => [...el, '/settings/equipment-types']);
                }
            }

            if (
                userPermission?.permissions?.permissions?.account_general_permission?.view &&
                !accountRoutes.includes('/settings/account')
            ) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment-types';
                    })
                );
                setAccountRoutes((el) => [...el, '/settings/account']);
            }

            if (
                userPermission?.permissions?.permissions?.account_buildings_permission?.view &&
                !accountRoutes.includes('/settings/buildings')
            ) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment-types';
                    })
                );
                setAccountRoutes((el) => [...el, '/settings/buildings']);
            }

            if (
                userPermission?.permissions?.permissions?.account_user_permission?.view &&
                !accountRoutes.includes('/settings/users')
            ) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment-types';
                    })
                );
                setAccountRoutes((el) => [...el, '/settings/users']);
            }

            if (
                userPermission?.permissions?.permissions?.account_roles_permission?.view &&
                !accountRoutes.includes('/settings/roles')
            ) {
                setAccountRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment-types';
                    })
                );
                setAccountRoutes((el) => [...el, '/settings/roles']);
            }
        }
        if (userPermission?.user_role === 'admin') {
            setAccountRoutes([]);
            setAccountRoutes(['/settings/account']);
        }
    }, [userPermission]);

    useEffect(() => {
        if (userPermission?.user_role !== 'admin') {
            if (userPermission?.permissions?.permissions === 'All Permissions') {
                setAccountRoutes((el) => [...el, '/settings/general']);
            }

            if (!userPermission?.permissions?.permissions?.building_details_permission?.view) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/general';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_layout_permission?.view) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/layout';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_panels_permission?.view) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/panels';
                    })
                );
                if (!accountRoutes.includes('/settings/active-devices')) {
                    setConfigRoutes((el) => [...el, '/settings/active-devices']);
                }
            }

            if (
                userPermission?.permissions?.permissions?.building_details_permission?.view &&
                !accountRoutes.includes('/settings/general')
            ) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setConfigRoutes((el) => [...el, '/settings/general']);
            }

            if (
                userPermission?.permissions?.permissions?.building_layout_permission?.view &&
                !accountRoutes.includes('/settings/layout')
            ) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setConfigRoutes((el) => [...el, '/settings/layout']);
            }

            if (
                userPermission?.permissions?.permissions?.building_equipment_permission?.view &&
                !accountRoutes.includes('/settings/equipment')
            ) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setConfigRoutes((el) => [...el, '/settings/equipment']);
            }

            if (
                userPermission?.permissions?.permissions?.building_panels_permission?.view &&
                !accountRoutes.includes('/settings/panels')
            ) {
                setConfigRoutes((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setConfigRoutes((el) => [...el, '/settings/panels']);
            }
        }
        if (userPermission?.user_role === 'admin') {
            setConfigRoutes([]);
            setConfigRoutes(['/settings/general']);
        }
    }, [userPermission]);

    useEffect(() => {
        setPageType(location.pathname.split('/')[1]);
    }, [location.pathname]);

    return (
        <>
            <div className="topbar-buttons-wrapper">
                <div className="topbar-buttons">
                    <div
                        className={`float-right h-100 ${
                            pageType === 'settings' ? 'navbar-icon-container-active ' : 'navbar-icon-container'
                        }`}>
                        <button
                            className={`btn btn-sm float-right ${
                                pageType === 'settings' ? 'other-font-icon-style-active' : 'other-font-icon-style'
                            }`}
                            onClick={() => {
                                handleSideNavChange();
                                handleRouteChange();
                            }}>
                            <Gear />
                        </button>
                    </div>
                </div>
            </div>

            <button className="btn topbar-logout-btn" onClick={handleLogout}>
                <LogoutIcon />
                Sign Out
            </button>
        </>
    );
};

export default Control;
