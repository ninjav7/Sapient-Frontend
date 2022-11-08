import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SecondaryNavBar from './SecondaryNavBar';

import { ReactComponent as BuildingSVG } from '../assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../assets/icons/portfolio-icon.svg';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/SecondaryNavBar',
    component: SecondaryNavBar,
};

export const Default = (props) => (
    <>
        <BrowserRouter>
            <SecondaryNavBar {...props} />
        </BrowserRouter>
    </>
);

Default.args = {
    onChangeBuilding: (args) => {
        console.log(args);
    },
    selectedBuilding: {
        label: '123 Main St. Portland, OR',
        value: 1,
        iconForSelected: <BuildingSVG />,
    },
    buildings: [
        {
            group: null,
            options: [
                {
                    icon: <PortfolioSVG className="p-0 square" />,
                    label: 'Portfolio',
                    value: 0,
                },
            ],
        },
        {
            group: 'recent',
            options: [
                {
                    label: '123 Main St. Portland, OR',
                    value: 1,
                    iconForSelected: <BuildingSVG />,
                },
                {
                    label: '15 University Blvd.',
                    value: 2,
                    iconForSelected: <BuildingSVG />,
                },
            ],
        },
        {
            group: 'All Buildings',
            options: [
                {
                    label: '123 Main St. Portland, OR',
                    value: 3,
                    iconForSelected: <BuildingSVG />,
                },
                {
                    label: '15 University Blvd. Hartford, CT',
                    value: 4,
                    iconForSelected: <BuildingSVG />,
                },
                {
                    label: '6223 Sycamore Ave. Pittsburgh, PA',
                    value: 5,
                    iconForSelected: <BuildingSVG />,
                },
                {
                    label: '246 Blackburn Rd. Philadelphia, PA',
                    value: 6,
                    iconForSelected: <BuildingSVG />,
                },
            ],
        },
    ],
    breadCrumbsItems: [
        { label: 'Plug Rules', path: '/home', active: false },
        { label: '8am-6pm M-F', path: '/settings', active: true },
    ],
};
