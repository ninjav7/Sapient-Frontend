import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Cookies } from 'react-cookie';
import { useLocation, useHistory } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { ReactComponent as Gear } from '../../assets/icon/gear.svg';
import { ReactComponent as ProfilePhoto } from '../../assets/icon/user.svg';
import { ReactComponent as PreferencesSVG } from '../../assets/icon/top-nav/preferences.svg';
import { ReactComponent as LogoutSVG } from '../../assets/icon/top-nav/logout.svg';

import { ComponentStore } from '../../store/ComponentStore';
import { userPermissionData } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';

import { routesForAccountSettings } from './utils';
import { accountChildRoutes } from '../SecondaryTopNavBar/utils';

import UserPreferences from './user-preference/UserPreferences';

import './styles.scss';

const Control = () => {
    const location = useLocation();
    const history = useHistory();
    const cookies = new Cookies();
    const user = cookies.get('user');

    const [userPermission] = useAtom(userPermissionData);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // User Preference Modal
    const [isModalOpen, setModalStatus] = useState(false);
    const handleModalOpen = () => setModalStatus(true);
    const handleModalClose = () => setModalStatus(false);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [pageType, setPageType] = useState('');
    const [userName, setUserName] = useState('');

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

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const handleLogout = () => {
        ComponentStore.update((s) => {
            s.parent = '';
        });
        localStorage.clear();
        cookies.remove('user', { path: '/' });
        window.location.reload();
    };

    const handleSettingsClick = () => {
        handleRouteChange();
        handleSideNavChange();
    };

    const dropdownMenuStyle = {
        zIndex: 2000,
    };

    const handleSideNavChange = () => {
        const currentPath = location.pathname;
        accountRoutes.forEach((record) => {
            if (currentPath.includes(record)) {
                ComponentStore.update((s) => {
                    s.parent = 'account';
                });
                return;
            }
        });

        configRoutes.forEach((record) => {
            if (currentPath.includes(record)) {
                ComponentStore.update((s) => {
                    s.parent = 'building-settings';
                });
                return;
            }
        });
    };

    const handleRouteChange = () => {
        let currentPath = location.pathname;
        let pathName = '';

        if (currentPath.includes('/control/plug-rules')) {
            bldgId === 'portfolio' ? (pathName = accountRoutes[0]) : (pathName = `${configRoutes[0]}/${bldgId}`);
        } else {
            routesForAccountSettings.includes(currentPath) || currentPath.includes(accountChildRoutes[0])
                ? (pathName = accountRoutes[0])
                : (pathName = `${configRoutes[0]}/${bldgId}`);
        }

        history.push({
            pathname: `${pathName}`,
        });
    };

    useEffect(() => {
        if (user?.user_id) {
            user?.name ? setUserName(user?.name) : setUserName(`User`);
        }
    }, [user]);

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
                <div className="d-flex align-items-center">
                    {/* Portfolio / Building Settings are not for super-user  */}
                    {pageType !== 'super-user' && (
                        <div
                            className={`float-right h-100 mr-3 navbar-head-container d-flex align-items-center ${
                                pageType === 'settings' ? 'active ' : ''
                            }`}>
                            <button className="btn btn-sm" onClick={handleSettingsClick}>
                                <Gear className={`navbar-icons-style ${pageType === 'settings' ? 'active' : ''}`} />
                            </button>
                        </div>
                    )}

                    <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                        className="mouse-pointer navbar-head-container ">
                        <DropdownToggle tag="div" className=" mr-3 user-profile-container">
                            <div className="profile-container mr-2">
                                <ProfilePhoto className="profile-photo" />
                            </div>
                            <div className="user-name">{userName}</div>
                        </DropdownToggle>
                        <DropdownMenu right className="mr-2" style={dropdownMenuStyle}>
                            {pageType !== 'super-user' && (
                                <>
                                    <DropdownItem onClick={handleModalOpen} className="pb-3 pl-3 pr-3">
                                        <PreferencesSVG className="mr-3 topnav-dropdown-style topnav-icon-color" />
                                        {`User Preference`}
                                    </DropdownItem>
                                    <hr className="m-0 p-0" />
                                </>
                            )}
                            <DropdownItem onClick={handleLogout} className="pt-2 pl-3 pr-3">
                                <LogoutSVG className="mr-3 topnav-dropdown-style topnav-icon-color" />
                                {`Sign out`}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <UserPreferences isModalOpen={isModalOpen} closeModal={handleModalClose} />
        </>
    );
};

export default Control;
