import React, { useState } from 'react';
import ExploreChart from './ExploreChart';
import { mockedData, mockedData2, mockedData3 } from './mock';
import colors from '../../assets/scss/_colors.scss';
import { LOW_MED_HIGH } from '../common/charts/modules/contants';

export default {
    title: 'Charts/ExploreChart',
    component: ExploreChart,
};
const dateRange = {
    minDate: new Date('2022-09-1').getTime(),
    maxDate: new Date('2022-11-1').getTime(),
};

const data = [
    { name: 'mockedData1', data: mockedData },
    { name: 'mockedData2', data: mockedData2 },
    { name: 'mockedData3', data: mockedData3 },
];

export const Default = (args) => {
    const [isLoadingData, setIsLoadingData] = useState(true);
    setTimeout(() => {
        setIsLoadingData(false);
    }, 3000);
    return <ExploreChart {...args} isLoadingData={isLoadingData} />;
};

Default.args = {
    title: 'Chart title',
    subTitle: 'Chart subtitle',
    isLoadingData: true,
    data,
    dateRange,
};

export const WithTemp = (args) => {
    return (
        <ExploreChart
            {...args}
            isLoadingData={false}
            chartProps={{
                navigator: {
                    outlineWidth: 0,
                },
                plotOptions: {
                    series: {
                        states: {
                            inactive: {
                                opacity: 1,
                            },
                        },
                    },
                },
                xAxis: {
                    gridLineWidth: 0,
                },
                yAxis: [
                    {
                        gridLineWidth: 1,
                        lineWidth: 1,
                        opposite: false,
                        lineColor: null,
                    },
                    {
                        opposite: true,
                        title: false,
                        max: 120,
                        postFix: '23',
                        gridLineWidth: 0,
                    },
                ],
            }}
            series={[
                {
                    type: 'line',
                    name: 'mockedData1',
                    color: '#B863CF',
                    data: [
                        {
                            x: 1664564400000,
                            y: 0,
                        },
                        {
                            x: 1664650800000,
                            y: 0,
                        },
                        {
                            x: 1664737200000,
                            y: 21500,
                        },
                        {
                            x: 1664823600000,
                            y: 23000,
                        },
                        {
                            x: 1664910000000,
                            y: 34000,
                        },
                        {
                            x: 1664996400000,
                            y: 20000,
                        },
                        {
                            x: 1665082800000,
                            y: 23000,
                        },
                        {
                            x: 1665169200000,
                            y: 10000,
                        },
                        {
                            x: 1665255600000,
                            y: 20000,
                        },
                    ],
                    lineWidth: 2,
                    showInLegend: true,
                },
            ]}
            withTemp={true}
        />
    );
};

WithTemp.args = {
    title: 'Chart title',
    subTitle: 'Chart subtitle',
    isLoadingData: true,
    disableDefaultPlotBands: true,
    upperLegendsProps: {
        weather: {
            onClick: ({ event, props, withTemp }) => {
                alert(withTemp);
            },

            // Will be shown even we don't have data for "temperatureSeries"
            // In case we didn't fetch the data so far, and we want fetch it once user clicked in the legend.
            // It has been made porposly to avoid additional not required API call execution.
            isAlwaysShown: true,
        },
    },
    temperatureSeries: {
        pointStart: new Date('2022-10-1').getTime(),
        pointInterval: 16 * 3600 * 1000,
        data: [
            [10, 31, 90],
            [33, 42, 45],
            [28, 30, 38],
            [21, 61, 95],
            [30, 38, 42],
            [50, 60, 70],
            null,
            null,
            [75, 77, 80],
            [23, 54, 75],
            [34, 61, 70],
            [69, 75, 80],
        ],
    },
    // Not necessary, merely for demo purposes
    tooltipValuesKey: '{point.y:.1f}',
    data,
    dateRange,
};
