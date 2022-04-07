// @flow
import React from 'react';
import AppMenu from './AppMenu';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import logo from '../assets/images/logo.png';
import { Settings, User } from 'react-feather';
import '../pages/portfolio/style.css';

const Navbar = (props) => {
    return (
        <React.Fragment>
            <div className="topnav shadow-sm">
                <div className="container-fluid navbar navbar-expand-lg topbar-nav custom-navbar">
                    {/* <nav className="navbar navbar-expand-lg topbar-nav custom-navbar custom-navbar-fonts"> */}
                    <Link to="/" className="navbar-brand mr-0 mr-md-2 logo">
                        <span className="logo-lg">
                            <img src={logo} alt="" height="24" className="ml-4 mr-5" />
                            {/* <span className="d-inline h5 ml-4 mr-5 text-logo">Sapient</span> */}
                        </span>
                        {/* <span className="logo-sm">
                                <img src={logo} alt="" height="24" />
                            </span> */}
                    </Link>
                    <Collapse isOpen={props.isMenuOpened} className="navbar-collapse" id="topnav-menu-content">
                        <AppMenu mode={'vertical'} />
                    </Collapse>

                    <Link to="/settings/general">
                        <button className="btn btn-sm btn-link nav-link right-bar-toggle float-right">
                            <Settings className="icon-sm" />
                        </button>
                    </Link>

                    {/* <ul className="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0"> */}
                    {/*
            <LanguageDropdown tag="li" />
              <NotificationDropdown notifications={Notifications} />
            */}

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
