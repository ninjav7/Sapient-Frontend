import React, { useState, useEffect, Suspense } from 'react';
import { Card } from 'reactstrap';
import { connect } from 'react-redux';
import { changeLayout } from '../redux/actions';
import SideNav from '../components/SideNav/SideNav';
import TopNav from '../components/TopNav/TopNav';
import AdminNav from '../components/AdminNav/AdminNav';
import { useLocation } from 'react-router-dom';
import SecondaryTopNavBar from '../components/SecondaryTopNavBar';
import { Notification } from '../sharedComponents/notification/Notification';
import { UserStore } from '../store/UserStore';
import './style.css';

const loading = () => <div className="text-center"></div>;

const HorizontalLayout = (props) => {
    const children = props.children || null;
    const location = useLocation();
    const [showSideNav, setShowSideNav] = useState(true);
    const [showTopNav, setShowTopNav] = useState(true);
    const showNotification = UserStore.useState((s) => s.showNotification);
    const notificationMessage = UserStore.useState((s) => s.notificationMessage);
    const notificationType = UserStore.useState((s) => s.notificationType);
    const componentType = UserStore.useState((s) => s.componentType);

    const deviceRouteList = [
        '/settings/active-devices/single',
        '/settings/smart-meters/single',
        '/settings/utility-meters/single',
    ];

    const isDeviceRoute = deviceRouteList.some((route) => location.pathname.includes(route));

    useEffect(() => {
        if (!location.pathname.includes('/super-user/')) {
            setShowTopNav(true);
        }
        if (location.pathname.includes('/super-user/')) {
            setShowTopNav(false);
        }
        if (!location.pathname.includes('/explore-page/')) {
            setShowSideNav(true);
        }
        if (location.pathname.includes('/explore-page/')) {
            setShowSideNav(false);
        }
        if (location.pathname.includes('/super-user/')) {
            setShowSideNav(false);
        }
        if (location.pathname.includes('/control/plug-rules/')) {
            setShowSideNav(false);
        }
        if (location.pathname.includes('/login')) {
            setShowTopNav(false);
            setShowSideNav(false);
        }
    }, [location]);

    const updateNotification = () => {
        UserStore.update((s) => {
            s.showNotification = false;
        });
    };

    return (
        <React.Fragment>
            <div id="wrapper">
                <div>{showTopNav ? <TopNav /> : <AdminNav />}</div>

                <div>{showTopNav ? <SecondaryTopNavBar /> : null}</div>

                <div>
                    {showSideNav && (
                        <div className="energy-side-nav">
                            <SideNav />
                        </div>
                    )}

                    {showSideNav ? (
                        <div
                            className="energy-page-content"
                            style={{
                                padding: isDeviceRoute ? '0rem' : '2rem',
                            }}>
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

                    {showNotification ? (
                        <div className="notification-alignment">
                            <Notification
                                type={
                                    notificationType === 'success'
                                        ? Notification.Types.success
                                        : Notification.Types.error
                                }
                                component={
                                    componentType === 'alert'
                                        ? Notification.ComponentTypes.alert
                                        : Notification.ComponentTypes.snackBar
                                }
                                description={notificationMessage}
                                closeAutomatically={true}
                                onClose={updateNotification}
                            />
                        </div>
                    ) : null}
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
