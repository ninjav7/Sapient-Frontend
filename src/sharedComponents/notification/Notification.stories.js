import React from 'react';

import { Notification } from './Notification';
import { NotificationProvider } from './NotificationProvider';
import { NotificationDemo } from './NotificationDemo';
import Brick from '../brick';

import { ReactComponent as DownloadSVG } from '../assets/icons/download.svg';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/Notification',
    component: Notification,
};

const actionButtons = [
    { label: 'ACTION', onClick: () => alert('click 1') },
    { label: 'ACTION', onClick: () => alert('click 2') },
    { label: 'ACTION', onClick: () => alert('click 3') },
];

export const Default = () => (
    <>
        <h5>
            actionButtons - prop can receive any props related to Button component or you can pass any other custom
            elements instead objects
        </h5>
        <div style={{ width: 320 }}>
            <Notification
                type={Notification.Types.error}
                component={Notification.ComponentTypes.alert}
                title="Title text"
                description="Description text"
                onClose={() => alert('close')}
                actionButtons={actionButtons}
            />
            <Brick />
            <Notification
                type={Notification.Types.warning}
                component={Notification.ComponentTypes.alert}
                title="Title text"
                description="Description text"
                onClose={() => alert('close')}
                actionButtons={
                    <div>
                        <Brick sizeInRem={0.625} />
                        One big element
                    </div>
                }
            />
            <Brick />
            <Notification
                type={Notification.Types.info}
                component={Notification.ComponentTypes.alert}
                title="Title text"
                description="Description text"
                onClose={() => alert('close')}
                actionButtons={[<a href="#">Custom</a>, <a href="#">Custom 2</a>, <span>text</span>]}
            />
            <Brick />
            <Notification
                type={Notification.Types.success}
                component={Notification.ComponentTypes.alert}
                title="Title text (without action buttons)"
                description="Description text"
                onClose={() => alert('close')}
            />

            <Brick />
            <Notification
                type={Notification.Types.success}
                component={Notification.ComponentTypes.alert}
                description="Description text"
                onClose={() => alert('close')}
            />

            <Brick />
            <Notification
                type={Notification.Types.success}
                component={Notification.ComponentTypes.alert}
                title="Title text (without action buttons)"
                description="Description text"
                onClose={() => alert('close')}
                icon={<DownloadSVG />}
            />
        </div>
    </>
);

Default.storyName = 'Alert';

export const SnackBar = () => (
    <NotificationProvider>
        <NotificationDemo actionButtons={actionButtons} />
    </NotificationProvider>
);
