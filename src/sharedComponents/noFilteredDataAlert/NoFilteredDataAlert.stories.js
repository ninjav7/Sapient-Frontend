import React from 'react';
import NoFilteredDataAlert from './NoFilteredDataAlert';
import '../assets/scss/stories.scss';

export default {
    title: 'Others/NoFilteredDataAlert',
    component: NoFilteredDataAlert,
};

export const Default = (props) => <NoFilteredDataAlert {...props} />;

Default.args = {
    style: { width: 252 },
};
