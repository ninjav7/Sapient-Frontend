import React from 'react';

import ColumnChart from './ColumnChart';
import { UNITS } from '../../constants/units';

import '../assets/scss/stories.scss';
import moment from 'moment';

export default {
    title: 'Charts/ColumnChart',
    component: ColumnChart,
};

export const Default = (args) => <ColumnChart {...args} />;

Default.args = {
    style: { width: 800 },
    title: 'Chart title',
    subTitle: 'Sub title',
    onMoreDetail: () => alert(),
    colors: ['#B863CF', '#5E94E4'],
    xAxisCallBackValue: ({ value }) => {
        return moment(value).format('MM/DD H:00 A');
    },
    //Categories should be timestamps
    categories: [
        '2022-11-28T00:30:00+00:00',
        '2022-11-28T01:30:00+00:00',
        '2022-11-28T02:30:00+00:00',
        '2022-11-28T04:30:00+00:00',
        '2022-11-28T05:30:00+00:00',
        '2022-11-28T06:30:00+00:00',
        '2022-11-28T07:30:00+00:00',
        '2022-11-28T08:30:00+00:00',
    ],
    tooltipUnit: UNITS.KWH,
    series: [
        {
            name: 'HVAC',
            data: [13.93, 13.63, 13.73, 13.67, 14.37, 14.89, 14.56, 14.32,],
        },
        {
            name: 'AVSC',
            data: [12.24, 12.24, 11.95, 12.02, 11.65, 11.96, 11.59, 11.94],
        },
    ],
};
