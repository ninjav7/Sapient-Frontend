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

export const Default = arg => {
    return (
        <BrowserRouter>
            <div className="d-flex justify-content-between">
                <div>
                    <h6>Default</h6>
                    <DropDownButton {...arg} />
                </div>

                <div>
                    <h6>With Search</h6>
                    <DropDownButton {...arg} withSearch={true} label="Searchable" />
                </div>

                <div>
                    <h6>Icon Leading</h6>
                    <DropDownButton
                        {...arg}
                        links={arg.links.map((link, index) =>
                            index === 3 ? { ...link } : { ...link, icon: <ProfileSVG /> }
                        )}
                    />
                </div>

                <div>
                    <h6>With Avatar Header</h6>
                    <DropDownButton
                        {...arg}
                        header={
                            <Avatar userEmail="olivia@untitledui.com" userName="Olivia Rhye" avatarUrl={AvatarBigURL} />
                        }
                    />
                </div>

                <div>
                    <h6>Dropdown Icon</h6>
                    <DropDownIcon {...arg} label={null} />
                </div>
            </div>
        </BrowserRouter>
    );
};

Default.args = {
    label: 'Account',
    links: [
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
