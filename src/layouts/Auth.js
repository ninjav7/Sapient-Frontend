import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Notification } from '../sharedComponents/notification/Notification';
import { UserStore } from '../store/UserStore';
import './styles.scss';
const loading = () => <div className="text-center"></div>;

const AuthLayout = (props) => {
    const children = props.children || null;
    const showNotification = UserStore.useState((s) => s.showNotification);
    const notificationMessage = UserStore.useState((s) => s.notificationMessage);
    const notificationType = UserStore.useState((s) => s.notificationType);
    const componentType = UserStore.useState((s) => s.componentType);

    const updateNotification = () => {
        UserStore.update((s) => {
            s.showNotification = false;
        });
    };

    return (
        <div id="wrapper">
            <div>
                <Suspense fallback={loading()}>{children}</Suspense>
                {showNotification ? (
                    <div className="notification-alignment">
                        <Notification
                            type={
                                notificationType === 'success' ? Notification.Types.success : Notification.Types.error
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
    );
};

export default connect()(AuthLayout);
