import React, { useState, useEffect, Suspense } from 'react';
import { Card } from 'reactstrap';
import { connect } from 'react-redux';
import './style.css';
import { changeLayout } from '../redux/actions';
import PageTracker from '../components/PageTracker/PageTracker';
import SideNav from '../components/SideNav/SideNav';
import TopNav from '../components/TopNav/TopNav';
import { useLocation } from 'react-router-dom';

const loading = () => <div className="text-center"></div>;

const HorizontalLayout = (props) => {
    const children = props.children || null;
    const location = useLocation();
    const [showSideNav, setShowSideNav] = useState(true);

    useEffect(() => {
        if (!location.pathname.includes('/explore-page/')) {
            setShowSideNav(true);
        }
        if (location.pathname.includes('/explore-page/')) {
            setShowSideNav(false);
        }
    }, [location]);

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
                    {showSideNav && (
                        <div className="energy-side-nav">
                            <SideNav />
                        </div>
                    )}

                    {showSideNav ? (
                        <div className="energy-page-content">
                            <Suspense fallback={loading()}>
                                <Card className="energy-page-content-card shadow-none">{children}</Card>
                            </Suspense>
                        </div>
                    ) : (
                        <div className="energy-page-content-full-screen">
                            <Suspense fallback={loading()}>
                                <Card className="energy-page-content-card shadow-none">{children}</Card>
                            </Suspense>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        layout: state.Layout,
        user: state.Auth.user,
    };
};
export default connect(mapStateToProps, { changeLayout })(HorizontalLayout);
