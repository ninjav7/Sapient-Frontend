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

            <SubNavBreadCrumbs
                items={[
                    ...mockPath.slice(0, 3),
                    {
                        label: 'Profile',
                        path: '/profile',
                        active: true,
                        dropDownMenu: [
                            { label: 'Option 1', value: 1, },
                            { label: 'Option 2', value: 2 },
                            { label: 'Option 3', value: 3 },
                        ],
                    },
                ]}
            />
        </BrowserRouter>
    );
};
