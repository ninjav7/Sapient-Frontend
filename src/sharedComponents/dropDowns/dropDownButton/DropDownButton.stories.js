import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Avatar } from '../../avatar';
import { DropDownIcon, DropDownButton } from './index';

import { ReactComponent as ProfileSVG } from '../../assets/icons/profile.svg';
import AvatarBigURL from '../../assets/images/avatar-big.png';

import '../../assets/scss/stories.scss';

export default {
    title: 'Components/DropDownButton',
    component: DropDownButton,
};

export const Default = (props) => {
    return (
        <BrowserRouter>
            <div className="d-flex justify-content-between">
                <div>
                    <h6>Default</h6>
                    <DropDownButton {...props} />
                </div>

                <div>
                    <h6>With Search</h6>
                    <DropDownButton {...props} withSearch={true} label="Searchable" />
                </div>

                <div>
                    <h6>Icon Leading</h6>
                    <DropDownButton
                        {...props}
                        options={props.options.map((option, index) =>
                            index === 3 ? { ...option } : { ...option, icon: <ProfileSVG /> }
                        )}
                    />
                </div>

                <div>
                    <h6>With Avatar Header</h6>
                    <DropDownButton
                        {...props}
                        header={
                            <Avatar userEmail="olivia@untitledui.com" userName="Olivia Rhye" avatarUrl={AvatarBigURL} />
                        }
                    />
                </div>

                <div>
                    <h6>Dropdown Icon</h6>
                    <DropDownIcon {...props} label={null} />
                </div>
            </div>
        </BrowserRouter>
    );
};

Default.args = {
    label: 'Account',
    options: [
        {
            link: '#',
            label: 'View profile',
        },
        {
            link: '#',
            label: 'Settings',
        },
        {
            link: '#',
            label: 'Keyboard shortcuts',
            active: true,
        },
        {
            link: '#',
            label: 'Company profile',
        },
        {
            link: '#',
            label: 'Team',
        },
        {
            link: '#',
            label: 'Invite colleagues',
        },
        {
            link: '#',
            label: 'Changelog',
        },
        {
            link: '#',
            label: 'Slack Community',
        },
        {
            link: '#',
            label: 'Support',
        },
        {
            link: '#',
            label: 'API',
        },
        {
            link: '#',
            label: 'Log out',
            className: 'border-top',
        },
    ],
};
