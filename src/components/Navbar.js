// @flow
import React from 'react';
import AppMenu from './AppMenu';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import sapientLogo from '../assets/images/Sapient_Logo.png';
import { Settings } from 'react-feather';
import '../pages/portfolio/style.scss';
import './style.css';
import { BuildingStore } from '../store/BuildingStore';

const Navbar = (props) => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    return (
        <React.Fragment>
            <div className="topnav shadow energy-topnav-custom">
                <div className="container-fluid navbar navbar-expand-lg topbar-nav custom-navbar">
                    <Link to="/" className="navbar-brand mr-0 mr-md-2 logo">
                        <span className="logo-lg">
                            <img src={sapientLogo} alt="" height="30" className="ml-4 mr-4" />
                        </span>
                    </Link>
                    <Collapse
                        isOpen={props.isMenuOpened}
                        className="navbar-collapse nav-height-custom"
                        id="topnav-menu-content"
                        style={{ height: '50px' }}>
                        <AppMenu mode={'vertical'} />
                    </Collapse>

                    <AppMenu mode={'vertical'} />

                    <div className="nav-right-icon-style">
                        <Link to={`/settings/general/${bldgId}`}>
                            <button className="btn btn-sm btn-link nav-link right-bar-toggle float-right">
                                <Settings className="icon-sm" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;
