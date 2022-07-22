import React from 'react';
import { Cookies } from 'react-cookie';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';

import SearchModal from '../SearchModal';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { logoutUser } from '../../redux/actions';
import { faGear, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';

import {ReactComponent as LogoutIcon} from '../../assets/images/logout.svg'

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

    
    return (
        <>
            <div className='topbar-buttons-wrapper'>
            {currentParentRoute === 'buildings' ? (
                <Link to="/settings/general" class="topbar-buttons">
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
            ) : (
                <Link to="/settings/account" className='topbar-buttons'>
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
            )}

            <SearchModal />

            <div className="navbar-icon-container float-right topbar-buttons">
                <button className="btn btn-sm float-right other-font-icon-style">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                </button>
            </div>
            </div>

            <button
                className="btn topbar-logout-btn"
                onClick={handleLogout}>
                    <LogoutIcon />
                    Sign Out
            </button>
        </>
    )
}

export default Control;