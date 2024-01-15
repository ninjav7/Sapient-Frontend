import React, { useState, useEffect, Suspense } from 'react';
import { useAtom } from 'jotai';
import { useLocation } from 'react-router-dom';
import { Card } from 'reactstrap';
import { connect } from 'react-redux';
import { changeLayout } from '../redux/actions';

import TopNav from '../components/TopNav/TopNav';
import SideNav from '../components/SideNav/SideNav';

import { UserStore } from '../store/UserStore';
import { userPermissionData } from '../store/globalState';
import SecondaryTopNavBar from '../components/SecondaryTopNavBar';
import { Notification } from '../sharedComponents/notification/Notification';

import ChatBox from '../components/ChatBox';

import { deviceConfigRoutes, secondaryNavBarNotRequiredRoutes, sideNavNotBarRequiredRoutes } from './utils';

import '../components/style.css';
import './styles.scss';

const loading = () => <div className="text-center"></div>;

const HorizontalLayout = (props) => {
    const location = useLocation();
    const children = props.children || null;

    const [showSideNav, setShowSideNav] = useState(true);
    const [showTopNav, setShowTopNav] = useState(true);
    const [showSecondaryNav, setShowSecondaryNav] = useState(true);

    const [userPermission] = useAtom(userPermissionData);
    const isSuperUser = userPermission?.is_superuser ?? false;

    const [chatHistory, setChatHistory] = useState({
        history: [],
    });

    const componentType = UserStore.useState((s) => s.componentType);
    const notificationType = UserStore.useState((s) => s.notificationType);
    const showNotification = UserStore.useState((s) => s.showNotification);
    const notificationMessage = UserStore.useState((s) => s.notificationMessage);

    // Default 2rem padding not required for device configuration pages in energy app settings
    const isPaddingRequired = deviceConfigRoutes.some((route) => location.pathname.includes(route));
    const isSuperUserPage = location.pathname.includes('/super-user/accounts');

    const updateNotification = () => {
        UserStore.update((s) => {
            s.showNotification = false;
        });
    };

    useEffect(() => {
        const isSideNavReq = sideNavNotBarRequiredRoutes.some((route) => location.pathname.includes(route));
        setShowSideNav(!isSideNavReq);

        const isSecondaryNavReq = secondaryNavBarNotRequiredRoutes.some((route) => location.pathname.includes(route));
        setShowSecondaryNav(!isSecondaryNavReq);

        location.pathname.includes('/login') ? setShowTopNav(false) : setShowTopNav(true);
    }, [location.pathname]);

    return (
        <React.Fragment>
            <div id="wrapper">
                <div className="position-relative">
                    {showTopNav && <TopNav />}
                    {showSecondaryNav && <SecondaryTopNavBar />}
                </div>

                <div>
                    {showSideNav && (
                        <div className="energy-side-nav">
                            <SideNav />
                        </div>
                    )}

                    <div
                        className={showSideNav ? 'energy-page-content' : 'energy-page-content-full-screen'}
                        style={{
                            padding: isPaddingRequired ? '0rem' : '2rem',
                            paddingTop: isSuperUserPage ? '0rem' : isPaddingRequired ? '0rem' : '2rem',
                        }}>
                        <Suspense fallback={loading()}>
                            <Card className="energy-page-content-card shadow-none">{children}</Card>
                        </Suspense>
                    </div>

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

                    {isSuperUser && <ChatBox chatHistory={setChatHistory}></ChatBox>}
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
