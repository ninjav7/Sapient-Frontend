import React, { Component, Suspense } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';

import { changeLayout } from '../redux/actions';
import * as layoutConstants from '../constants/layout';
import PageTracker from '../components/PageTracker';

import ThemeCustomizer from '../components/ThemeCustomizer';
const CustomSideBar = React.lazy(() => import('../components/CustomSideBar'));

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
        const isCondensed = this.props.layout.leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
        const isLight = this.props.layout.leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT;

        return (
            <React.Fragment>
                <div id="wrapper">
                    {/*
                
                <Suspense fallback={loading()}>
                        <Topbar openLeftMenuCallBack={this.openMenu} {...this.props} />
                        
                    </Suspense>
                */}
                    <Suspense fallback={loading()}>
                        <Navbar isMenuOpened={this.state.isMenuOpened} {...this.props} />
                    </Suspense>

                    <PageTracker />

                    <div className="content-page">
                        <div className="content">
                            <Container fluid className="p-0">
                                <Row>
                                    <Col md={2} className="pr-0">
                                        <Suspense fallback={loading()}>
                                            <CustomSideBar
                                                isCondensed={isCondensed}
                                                isLight={isLight}
                                                {...this.props}
                                            />
                                        </Suspense>
                                    </Col>
                                    <Col md={10} className="pl-0">
                                        <Suspense fallback={loading()}>
                                            <Card className="p-4">{children}</Card>
                                        </Suspense>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <Suspense fallback={loading()}>
                            <Footer />
                        </Suspense>
                    </div>
                </div>

                <Suspense fallback={loading()}>
                    <RightSidebar title="Customize" {...this.props}>
                        <ThemeCustomizer />
                    </RightSidebar>
                </Suspense>
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
