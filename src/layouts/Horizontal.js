import React, { Component, Suspense } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import './style.css';
import { changeLayout } from '../redux/actions';
import * as layoutConstants from '../constants/layout';
import PageTracker from '../components/PageTracker/PageTracker';
import SideNav from '../components/SideNav/SideNav';
import TopNav from '../components/TopNav/TopNav';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('../components/Topbar'));
const Navbar = React.lazy(() => import('../components/Navbar'));
const RightSidebar = React.lazy(() => import('../components/RightSidebar'));
const Footer = React.lazy(() => import('../components/Footer'));
const loading = () => <div className="text-center"></div>;

class HorizontalLayout extends Component {
    constructor(props) {
        super(props);

        this.openMenu = this.openMenu.bind(this);
        this.state = {
            isMenuOpened: false,
        };
    }

    /**
     *
     */
    componentDidMount = () => {
        console.log(this.props);
        this.props.changeLayout(layoutConstants.LAYOUT_HORIZONTAL);
    };

    /**
     * Opens the menu - mobile
     */
    openMenu = (e) => {
        e.preventDefault();
        this.setState({ isMenuOpened: !this.state.isMenuOpened });
    };

    render() {
        // get the child view which we would like to render
        const children = this.props.children || null;
        const isCondensed = this.props.layout.leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
        const isLight = this.props.layout.leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT;

        return (
            <React.Fragment>
                <div id="wrapper">
                    <div>
                        <TopNav />
                    </div>

                    <div>
                        <PageTracker />
                    </div>

                    <div>
                        {!window.location.pathname.includes('/explore-page/') ? (
                            <div className="energy-side-nav">
                                <SideNav />
                            </div>
                        ) : (
                            ''
                        )}
                        <div
                            className={
                                window.location.pathname.includes('/explore-page/')
                                    ? 'energy-page-content-full-screen'
                                    : 'energy-page-content'
                            }>
                            <Suspense fallback={loading()}>
                                <Card className="energy-page-content-card shadow-none">{children}</Card>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        layout: state.Layout,
        user: state.Auth.user,
    };
};
export default connect(mapStateToProps, { changeLayout })(HorizontalLayout);
