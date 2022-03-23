// @flow
import React from 'react';
import AppMenu from './AppMenu';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import logo from '../assets/images/logo.png';
import { Settings, User } from 'react-feather';

const Navbar = (props) => {
    return (
        <React.Fragment>
            <div className="topnav shadow-sm">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topbar-nav">
                        <Link to="/" className="navbar-brand mr-0 mr-md-2 logo">
                            <span className="logo-lg">
                                {/* <img src={logo} alt="" height="24" /> */}
                                <span className="d-inline h5 ml-2 text-logo">Sapient</span>
                            </span>
                            <span className="logo-sm">
                                <img src={logo} alt="" height="24" />
                            </span>
                        </Link>
                        <Collapse isOpen={props.isMenuOpened} className="navbar-collapse" id="topnav-menu-content">
                            <AppMenu mode={'horizontal'} />
                        </Collapse>
                        <ul className="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0">
            

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
              
            </ul>

                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;
