import React from 'react';
import SubNavBreadCrumbs from './index';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/scss/stories.scss';

export default {
    title: 'Components/SubNav Breadcrumbs',
    component: SubNavBreadCrumbs,
};

const mockPath = [
    { label: 'Home', path: '/home', active: false },
    { label: 'Settings', path: '/settings', active: false },
    { label: 'Security', path: '/security', active: false },
    { label: 'Profile', path: '/profile', active: true },
];

export const Default = () => {
    return (
        <BrowserRouter>
            <SubNavBreadCrumbs items={mockPath} />
            <SubNavBreadCrumbs items={mockPath.slice(2)} />
            <SubNavBreadCrumbs items={mockPath.slice(-1)} />
        </BrowserRouter>
    );
};
