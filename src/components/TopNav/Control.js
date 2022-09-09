import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';

import SearchModal from '../SearchModal';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { logoutUser } from '../../redux/actions';
import { faGear, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';

import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';

const Control = () => {
    const location = useLocation();

    const currentParentRoute = ComponentStore.useState((s) => s.parent);
    let history = useHistory();
    let cookies = new Cookies();

    const handleLogout = () => {
        cookies.remove('user', { path: '/' });
        const isAuthTokenValid = isUserAuthenticated();

        logoutUser(history);
        if (isAuthTokenValid) {
            return <Redirect to="/" />;
        } else {
            history.push('/account/login');
            window.location.reload();
        }
    };

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

    const [route, setRoute] = useState([
        '/settings/account',
        '/settings/buildings',
        '/settings/users',
        '/settings/roles',
        '/settings/equipment-types',
    ]);

    const [internalRoute, setInternalRoute] = useState([
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
    ]);

    console.log('Allroute', internalRoute);
    const [userPermission] = useAtom(userPermissionData);

    useEffect(() => {
        if (!userPermission?.permissions?.permissions?.account_general_permission?.view) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/account';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.account_buildings_permission?.view) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/buildings';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.account_user_permission?.view) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/users';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.account_roles_permission?.view) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/roles';
                })
            );
            if (!route.includes('/settings/equipment-types')) {
                setRoute((el) => [...el, '/settings/equipment-types']);
            }
        }

        if (
            userPermission?.permissions?.permissions?.account_general_permission?.view &&
            !route.includes('/settings/account')
        ) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment-types';
                })
            );
            setRoute((el) => [...el, '/settings/account']);
        }

        if (
            userPermission?.permissions?.permissions?.account_buildings_permission?.view &&
            !route.includes('/settings/buildings')
        ) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment-types';
                })
            );
            setRoute((el) => [...el, '/settings/buildings']);
        }

        if (
            userPermission?.permissions?.permissions?.account_user_permission?.view &&
            !route.includes('/settings/users')
        ) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment-types';
                })
            );
            setRoute((el) => [...el, '/settings/users']);
        }

        if (
            userPermission?.permissions?.permissions?.account_roles_permission?.view &&
            !route.includes('/settings/roles')
        ) {
            setRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment-types';
                })
            );
            setRoute((el) => [...el, '/settings/roles']);
        }

        if (userPermission?.permissions?.permissions === 'All Permissions') {
            setRoute((el) => [...el, '/settings/account']);
        }
    }, [userPermission]);

    useEffect(() => {
        if (userPermission?.permissions?.permissions === 'All Permissions') {
            setRoute((el) => [...el, '/settings/general']);
        }

        if (!userPermission?.permissions?.permissions?.building_details_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/general';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_layout_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/layout';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_panels_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/panels';
                })
            );
            if (!route.includes('/settings/active-devices')) {
                setInternalRoute((el) => [...el, '/settings/active-devices']);
            }
        }

        if (
            userPermission?.permissions?.permissions?.building_details_permission?.view &&
            !route.includes('/settings/general')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/general']);
        }

        if (
            userPermission?.permissions?.permissions?.building_layout_permission?.view &&
            !route.includes('/settings/layout')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/layout']);
        }

        if (
            userPermission?.permissions?.permissions?.building_equipment_permission?.view &&
            !route.includes('/settings/equipment')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/equipment']);
        }

        if (
            userPermission?.permissions?.permissions?.building_panels_permission?.view &&
            !route.includes('/settings/panels')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/panels']);
        }
    }, [userPermission]);

    return (
        <>
            <div className="topbar-buttons-wrapper">
                {currentParentRoute === 'buildings' ? (
                    <>
                        <Link to={`${internalRoute[0]}`} className="topbar-buttons">
                            {/* <div className="navbar-icon-container float-right" style={{ height: '100%' }}> */}
                            <div
                                className={`${
                                    location.pathname.split('/')[1] === 'settings'
                                        ? 'navbar-icon-container-active float-right'
                                        : 'navbar-icon-container float-right'
                                }`}
                                style={{ height: '100%' }}>
                                <button
                                    // className="btn btn-sm float-right font-icon-style"
                                    className={`${
                                        location.pathname.split('/')[1] === 'settings'
                                            ? 'btn btn-sm float-right other-font-icon-style-active'
                                            : 'btn btn-sm float-right other-font-icon-style'
                                    }`}
                                    onClick={() => {
                                        setSideNavBar('building-settings');
                                    }}>
                                    <FontAwesomeIcon icon={faGear} size="lg" />
                                </button>
                            </div>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to={`${route[0]}`} className="topbar-buttons">
                            <div
                                className={`${
                                    location.pathname.split('/')[1] === 'settings'
                                        ? 'navbar-icon-container-active'
                                        : 'navbar-icon-container'
                                }`}>
                                <button
                                    className={`${
                                        location.pathname.split('/')[1] === 'settings'
                                            ? 'btn btn-sm other-font-icon-style-active p-0'
                                            : 'btn btn-sm other-font-icon-style'
                                    }`}
                                    onClick={() => {
                                        setSideNavBar('account');
                                    }}>
                                    <FontAwesomeIcon icon={faGear} size="lg" />
                                </button>
                            </div>
                        </Link>
                    </>
                )}

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
