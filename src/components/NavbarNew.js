import React, { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import {Redirect, Link, useLocation, useHistory } from 'react-router-dom';
import { Settings } from 'react-feather';
import sapientLogo from '../assets/images/Sapient_Logo.png';
import SearchModal from './SearchModal';
import { Row, Col, Card } from 'reactstrap';
import { allRoutes, authProtectedRoutes, allFlattenRoutes } from '../routes/index';
import { ComponentStore } from '../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isUserAuthenticated } from '../helpers/authUtils';
import { logoutUser } from '../redux/actions';
import { faGear, faTelescope, faToggleOn, faCircleBolt, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import './style.css';

const NavbarNew = () => {
    const location = useLocation();
    console.log(location);
    const currentParentRoute = ComponentStore.useState((s) => s.parent);
    const activeSideRoutes = [];
    let history=useHistory();
    let cookies = new Cookies();
    allFlattenRoutes.forEach((route) => {
        if (route.parent === 'portfolio') {
            activeSideRoutes.push(route);
        }
    });
    const handleLogout=()=>{
        console.log("logout entered");
            cookies.remove('user', { path: '/' });
            const isAuthTokenValid = isUserAuthenticated();
            console.log(history);
            console.log(isAuthTokenValid);
            logoutUser(history);
        if (isAuthTokenValid) {
            return <Redirect to='/' />
        }
        else{
            history.push('/account/login');
            window.location.reload();
        }
    }

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

    useEffect(() => {
       
        console.log('location.pathname => ', location.pathname.split('/')[1]);
    });

    return (
        <>
            <div className="energy-top-nav">
                <span className="logo-lg energy-logo-style">
                    <img src={sapientLogo} alt="" height="30" className="ml-4 mr-4 mt-1" />
                </span>

                {/* All Routes  */}
                <div className="top-nav-routes-list">
                    {authProtectedRoutes.map((item, index) => {
                        const Icon = item.icon || null;
                        if (!item.visibility) {
                            return;
                        }

                        let str1 = item.path.split('/')[1];
                        let str2 = location.pathname.split('/')[1];
                        let active = str1.localeCompare(str2);

                        return (
                            <>
                                {active === 0 ? (
                                    <div key={index} className="container navbar-head-container-active">
                                        <Link to={item.path}>
                                            <div class="row" style={{ width: '7vw' }}>
                                                {item.name === 'Energy' && (
                                                    <div
                                                        className="col-3 font-icon-style-active"
                                                        style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faCircleBolt} size="lg" />
                                                    </div>
                                                )}
                                                {item.name === 'Control' && (
                                                    <div
                                                        className="col-3 font-icon-style-active"
                                                        style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faToggleOn} size="lg" />
                                                    </div>
                                                )}
                                                {item.name === 'Explore' && (
                                                    <div
                                                        className="col-3 font-icon-style-active"
                                                        style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faTelescope} size="lg" />
                                                    </div>
                                                )}
                                                <div
                                                    onClick={() => {
                                                        setSideNavBar(item.name);
                                                    }}
                                                    className="col-9 navbar-heading-active">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <div key={index} className="container navbar-head-container">
                                        <Link to={item.path}>
                                            <div class="row" style={{ width: '7vw' }}>
                                                {item.name === 'Energy' && (
                                                    <div className="col-3 font-icon-style" style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faCircleBolt} size="lg" />
                                                    </div>
                                                )}
                                                {item.name === 'Control' && (
                                                    <div className="col-3 font-icon-style" style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faToggleOn} size="lg" />
                                                    </div>
                                                )}
                                                {item.name === 'Explore' && (
                                                    <div className="col-3 font-icon-style" style={{ margin: '0' }}>
                                                        <FontAwesomeIcon icon={faTelescope} size="lg" />
                                                    </div>
                                                )}
                                                {/* <span className="custom-icon-style">{item.icon && <Icon />}</span> */}
                                                <div
                                                    onClick={() => {
                                                        setSideNavBar(item.name);
                                                    }}
                                                    className="col-9 navbar-heading">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>

                <div style={{ width: '100%', float: 'right' }}>
                    {currentParentRoute === 'buildings' ? (
                        <Link to="/settings/general">
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
                        <Link to="/settings/account">
                            {/* <div className="navbar-icon-container float-right" style={{ height: '100%' }}> */}
                            <div
                                className={`${
                                    location.pathname.split('/')[1] === 'settings'
                                        ? 'navbar-icon-container-active float-right'
                                        : 'navbar-icon-container float-right'
                                }`}
                                style={{ height: '100%' }}>
                                <button
                                    // className="btn btn-sm float-right other-font-icon-style"
                                    className={`${
                                        location.pathname.split('/')[1] === 'settings'
                                            ? 'btn btn-sm float-right other-font-icon-style-active'
                                            : 'btn btn-sm float-right other-font-icon-style'
                                    }`}
                                    onClick={() => {
                                        setSideNavBar('account');
                                    }}>
                                    <FontAwesomeIcon icon={faGear} size="lg" />
                                </button>
                            </div>
                        </Link>
                    )}
                            <button className="btn btn-sm btn-link nav-link right-bar-toggle float-right" onClick={handleLogout}>
                                Logout
                                {/* <FontAwesomeIcon icon={faGear} className="mt-1" size="xl" /> */}
                            </button>

                    <SearchModal />

                    <div className="navbar-icon-container float-right" style={{ height: '100%' }}>
                        <button className="btn btn-sm float-right other-font-icon-style">
                            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavbarNew;
