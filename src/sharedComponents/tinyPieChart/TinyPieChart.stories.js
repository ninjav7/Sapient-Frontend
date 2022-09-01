import React from 'react';
import TinyPieChart from './TinyPieChart';

import Brick from '../brick';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/TinyPieChart',
    component: TinyPieChart,

    argTypes: {
        percent: {
            control: false,
        },
        label: {
            control: false,
        },
    },
};

export const Default = (props) => (
    <>
        <h5>Tiny Pie Chart</h5>
        <TinyPieChart {...props} percent={80} label="80%" />
        <Brick />
        <TinyPieChart {...props} percent={73} label="73% 1,5 kWh" />
        <Brick />
        <TinyPieChart {...props} percent={22} label="22% 0.7 kWh" />
    </>
);
