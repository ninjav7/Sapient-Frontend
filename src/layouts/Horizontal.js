import React, { Component, Suspense } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import './style.css';
import { changeLayout } from '../redux/actions';
import * as layoutConstants from '../constants/layout';
import PageTracker from '../components/PageTracker';
import NavbarNew from '../components/NavbarNew';
import SideNavbar from '../components/SideNavbar';

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
        console.log('children => ', this.props.children);
        const isCondensed = this.props.layout.leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
        const isLight = this.props.layout.leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT;

        return (
            <React.Fragment>
                <div id="wrapper">
                    <div>
                        <NavbarNew />
                    </div>

                    <div>
                        <PageTracker />
                    </div>

                    <div>
                        <div className="energy-side-nav">
                            <SideNavbar />
                        </div>
                        <div className="energy-page-content">
                            <Suspense fallback={loading()}>
                                <Card className="pl-1 pr-1 pt-0">{children}</Card>
                            </Suspense>
                        </div>
                    </div>

                    {/* <Suspense fallback={loading()}>
                        <Footer />
                    </Suspense> */}
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
