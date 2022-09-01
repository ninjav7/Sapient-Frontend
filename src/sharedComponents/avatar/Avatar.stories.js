import React from 'react';
import Avatar from './Avatar';
import '../assets/scss/stories.scss';

import AvatarBigURL from '../assets/images/avatar-big.png';

export default {
    title: 'Components/Avatar',
    component: Avatar,
};

export const Default = (props) => <Avatar {...props} />;

Default.args = {
    userName: 'Olivia Rhye',
    userEmail: 'olivia@untitledui.com',
    avatarUrl: AvatarBigURL,
};
