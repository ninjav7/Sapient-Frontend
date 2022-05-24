import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'react-feather';
import sapientLogo from '../assets/images/Sapient_Logo.png';
import SearchModal from './SearchModal';
import { allRoutes, authProtectedRoutes, allFlattenRoutes } from '../routes/index';
import { ComponentStore } from '../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/pro-regular-svg-icons';
import './style.css';

const NavbarNew = () => {
    const location = useLocation();
    const currentParentRoute = ComponentStore.useState((s) => s.parent);
    const activeSideRoutes = [];

    allFlattenRoutes.forEach((route) => {
        if (route.parent === 'portfolio') {
            activeSideRoutes.push(route);
        }
    });

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
                                    <div key={index} className="navbar-head-container-active">
                                        <Link to={item.path}>
                                            {/* <FontAwesomeIcon icon={faCoffee} /> */}
                                            {/* <span className="custom-icon-style">{item.icon && <Icon />}</span> */}
                                            <span
                                                onClick={() => {
                                                    setSideNavBar(item.name);
                                                }}
                                                className="navbar-heading-active">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div key={index} className="navbar-head-container">
                                        <Link to={item.path}>
                                            {/* <span className="custom-icon-style">{item.icon && <Icon />}</span> */}
                                            <span
                                                onClick={() => {
                                                    setSideNavBar(item.name);
                                                }}
                                                className="navbar-heading">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>

                <div style={{ width: '100%', float: 'right' }}>
                    <SearchModal />

                    {currentParentRoute === 'buildings' ? (
                        <Link to="/settings/general">
                            <button
                                className="btn btn-sm btn-link nav-link right-bar-toggle float-right"
                                onClick={() => {
                                    setSideNavBar('building-settings');
                                }}>
                                <Settings className="icon-sm" />
                            </button>
                        </Link>
                    ) : (
                        <Link to="/settings/account">
                            <button
                                className="btn btn-sm btn-link nav-link right-bar-toggle float-right"
                                onClick={() => {
                                    setSideNavBar('account');
                                }}>
                                <Settings className="icon-sm" />
                            </button>
                        </Link>
                    )}

                    {/* <Link to="/settings/general">
                        <button
                            className="btn btn-sm btn-link nav-link right-bar-toggle float-right"
                            onClick={() => {
                                setSideNavBar('account');
                            }}>
                            <Settings className="icon-sm" />
                        </button>
                    </Link> */}
                </div>
            </div>
        </>
    );
};

export default NavbarNew;
