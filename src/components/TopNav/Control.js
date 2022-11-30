import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { logoutUser } from '../../redux/actions';
import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { routesForAccountSettings } from './utils';

const Control = () => {
    const location = useLocation();
    const history = useHistory();
    const cookies = new Cookies();

    const [userPermission] = useAtom(userPermissionData);
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
        cookies.remove('user', { path: '/' });
        const isAuthTokenValid = isUserAuthenticated();

        logoutUser(history);

        if (isAuthTokenValid) {
            return <Redirect to="/" />;
        } else {
            localStorage.clear();

            history.push('/account/login');
            window.location.reload();
        }
    };

    const handleSideNavChange = (routeType) => {
        if (routeType === 'account-settings') {
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        }
        if (routeType === 'building-settings') {
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        }
    };

    const handleRouteChange = () => {
        let currentPath = location.pathname;
        let pathName = '';
        routesForAccountSettings.includes(currentPath) ? (pathName = accountRoutes[0]) : (pathName = configRoutes[0]);
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
                        className={`float-right ${
                            pageType === 'settings' ? 'navbar-icon-container-active ' : 'navbar-icon-container'
                        }`}
                        style={{ height: '100%' }}>
                        <button
                            className={`btn btn-sm float-right ${
                                pageType === 'settings' ? 'other-font-icon-style-active' : 'other-font-icon-style'
                            }`}
                            onClick={() => {
                                handleSideNavChange('building-settings');
                                handleRouteChange();
                            }}>
                            <FontAwesomeIcon icon={faGear} size="lg" />
                        </button>
                    </div>
                </div>

                {/* <SearchModal /> */}
                {/* <div className="navbar-icon-container float-right topbar-buttons">
                    <button className="btn btn-sm float-right other-font-icon-style">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                    </button>
                </div> */}
            </div>

            <button className="btn topbar-logout-btn" onClick={handleLogout}>
                <LogoutIcon />
                Sign Out
            </button>
        </>
    );
};

export default Control;
