import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { isMobileOnly } from 'react-device-detect';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import * as FeatherIcon from 'react-feather';

import AppMenu from './AppMenu';

/**
 * User Widget
 */
const BuildingProfile = () => {
    return (
        <React.Fragment>
            <div className="media user-profile mt-2 mb-2">
                <UncontrolledDropdown className="align-self-center profile-dropdown-menu">
                    <DropdownToggle
                        data-toggle="dropdown"
                        tag="button"
                        className="btn btn-link p-0 dropdown-toggle mr-0">
                        <FeatherIcon.ChevronDown />
                    </DropdownToggle>
                    <DropdownMenu right className="topbar-dropdown-menu profile-dropdown-items">
                        <Link to="/" className="dropdown-item notify-item">
                            <FeatherIcon.User className="icon-dual icon-xs mr-2" />
                            <span>My Account</span>
                        </Link>
                        <Link to="/" className="dropdown-item notify-item">
                            <FeatherIcon.Settings className="icon-dual icon-xs mr-2" />
                            <span>Settings</span>
                        </Link>
                        <Link to="/" className="dropdown-item notify-item">
                            <FeatherIcon.HelpCircle className="icon-dual icon-xs mr-2" />
                            <span>Support</span>
                        </Link>
                        <Link to="/" className="dropdown-item notify-item">
                            <FeatherIcon.Lock className="icon-dual icon-xs mr-2" />
                            <span>Lock Screen</span>
                        </Link>
                        <DropdownItem divider />
                        <Link to="/account/logout" className="dropdown-item notify-item">
                            <FeatherIcon.LogOut className="icon-dual icon-xs mr-2" />
                            <span>Logout</span>
                        </Link>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        </React.Fragment>
    );
};

/**
 * Sidenav
 */
const SideNav = () => {
    return (
        <div className="sidebar-content">
            <div id="sidebar-menu" style={{ position: 'fixed', width: '100%' }}>
                <AppMenu showBuilding showChildOnly />
            </div>
        </div>
    );
};

class CustomSideBar extends Component {
    menuNodeRef;

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleOtherClick = this.handleOtherClick.bind(this);
    }

    /**
     * Bind event
     */
    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleOtherClick, false);
    };

    /**
     * Bind event
     */
    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleOtherClick, false);
    };

    /**
     * Handle the click anywhere in doc
     */
    handleOtherClick = (e) => {
        if (this.menuNodeRef.contains(e.target)) return;
        // else hide the menubar
        if (document.body && isMobileOnly) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    /**
     * Handle click
     * @param {*} e
     * @param {*} item
     */
    handleClick(e) {
        console.log(e);
    }

    render() {
        const isCondensed = this.props.isCondensed || false;

        return (
            <React.Fragment>
                <div ref={(node) => (this.menuNodeRef = node)}>
                    {!isCondensed && (
                        <PerfectScrollbar>
                            <SideNav />
                        </PerfectScrollbar>
                    )}
                    {isCondensed && <SideNav />}
                </div>
            </React.Fragment>
        );
    }
}

export default connect()(CustomSideBar);
