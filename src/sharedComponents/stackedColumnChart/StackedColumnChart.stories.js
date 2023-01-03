import React from 'react';
import StackedColumnChart from './StackedColumnChart';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';
import moment from 'moment';

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
    //Categories should be timestamps
    categories: [
        '2022-11-28T00:30:00+00:00',
        '2022-11-28T01:30:00+00:00',
        '2022-11-28T02:30:00+00:00',
        '2022-11-28T04:30:00+00:00',
    ],
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
    //callback to tooltip header
    // tooltipCallBackValue: ({value}) => {
    //     return  moment(value).format(`MMM D 'YY @ hh:mm A`);
    // },

    //callback to xAxis points
    xAxisCallBackValue: ({ value }) => {
        return moment(value).format('MM/DD H:00 A');
    },

    //For tooltip timezone
    // timeZone: 'en',

    // You can overwrite base config we used for chart, pls refer to Official Highcharts doc.
    restChartProps: {
        xAxis: {
            labels: {
                // enabled: false
            },
        },
    },
    selectUnit: {
        placeholder: 'Select unit...',
        defaultValue: `Energy (${UNITS.KWH})`,
        options: [
            { label: `Energy (${UNITS.KWH})`, value: `Energy (${UNITS.KWH})` },
            { label: `Square (${UNITS.KWH_SQ_FT})`, value: `Square (${UNITS.KWH_SQ_FT})` },
        ],
    },
    unitInfo: {
        unit: UNITS.KWH,
        value: '11,441',
        title: 'Estimated Energy Savings',
    },
};
