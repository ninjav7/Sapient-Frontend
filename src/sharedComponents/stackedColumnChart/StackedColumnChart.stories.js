import React from 'react';
import StackedColumnChart from './StackedColumnChart';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';

export default {
    title: 'Charts/StackedColumnChart',
    component: StackedColumnChart,
};

export const Default = (props) => <StackedColumnChart {...props} />;

Default.args = {
    style: { width: 800 },
    title: 'Chart title',
    subTitle: 'Sub title',
    onMoreDetail: () => alert(),
    colors: ['#E2AD5B', '#44B87F', '#5E94E4', '#B863CF'],
    categories: ['0', '2', '4', '6', '8', '9', '10', '12', '14', '16', '18', '30'],
    tooltipUnit: UNITS.KWH,
    series: [
        {
            name: 'Office-Hours',
            data: [3, 3, 2, 3],
        },
        {
            name: 'After-Hours',
            data: [9, 5, 5, 3],
        },
        {
            name: 'Series 3',
            data: [15, 10, 13, 20],
        },
        {
            name: 'Series 4',
            data: [20, 52, 16, 33],
        },
    ],
};
