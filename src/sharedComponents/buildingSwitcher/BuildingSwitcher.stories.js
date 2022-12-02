import React from 'react';

import BuildingSwitcher from './BuildingSwitcher';
import Typography from '../typography';

import { ReactComponent as BuildingSVG } from '../assets/icons/building-icon.svg';
import { ReactComponent as PortfolioSVG } from '../assets/icons/portfolio-icon.svg';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/BuildingSwitcher',
    component: BuildingSwitcher,
};

export const Default = (props) => <BuildingSwitcher {...props} defaultMenuIsOpen />;

Default.args = {
    style: {
        width: 226,
    },
    onChange: (args) => {
        console.log(args);
    },
    defaultValue: {
        label: '123 Main St. Portland, OR',
        value: 1,
        iconForSelected: <BuildingSVG />,
    },
    options: [
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
                    value: 1,
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
};
