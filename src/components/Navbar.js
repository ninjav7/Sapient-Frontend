// @flow
import React from 'react';
import AppMenu from './AppMenu';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import logo from '../assets/images/logo.png';
import sapientLogo from '../assets/images/Sapient_Logo.png';
import { Settings, User, Search } from 'react-feather';
import SearchModal from './SearchModal';
import '../pages/portfolio/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './style.css';

const Navbar = (props) => {
    return (
        <React.Fragment>
            {/* <div className="navbar-container">
                <h5>Navbar</h5>
            </div> */}

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
                        {/* <SearchModal /> */}

                        <Link to="/settings/general">
                            <button className="btn btn-sm btn-link nav-link right-bar-toggle float-right">
                                <Settings className="icon-sm" />
                                {/* <FontAwesomeIcon icon={faGear} className="mt-1" size="xl" /> */}
                            </button>
                        </Link>
                    </div>
                    {/* <ul className="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0"> */}

                    {/*
            <li className="notification-list">
                <button className="btn btn-sm btn-link nav-link right-bar-toggle" onClick={e=> {
                 
                }}>
                  <Settings className="icon-sm" />
                  <User className="ml-2 icon-sm"/>
                </button>
              </li>
            */}

                    {/*
            <ProfileDropdown profilePic={profilePic} menuItems={ProfileMenus} username={'Sapient N'} description="Administrator" />
          */}
                    {/* </ul> */}
                    {/* </nav> */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;
