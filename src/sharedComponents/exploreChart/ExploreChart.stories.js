import React, { useEffect, useState } from 'react';
import ExploreChart from './ExploreChart';
import { mockedData, mockedData2, mockedData3 } from './mock';
import colors from '../../assets/scss/_colors.scss';
import { LOW_MED_HIGH } from '../common/charts/modules/contants';

export default {
    title: 'Charts/ExploreChart',
    component: ExploreChart,
};
const dateRange = {
    minDate: new Date('2023-01-1').getTime(),
    maxDate: new Date('2023-02-1').getTime(),
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
    const [weatherData, setWeatherData] = useState(null);
    const [isWeatherChartVisible, setWeatherChartVisibility] = useState(false);

    useEffect(() => {
        console.log(weatherData);
    }, [weatherData]);

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
            temperatureSeries={weatherData}
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
                            x: 1664564400000,
                            y: 20000,
                        },
                    ],
                    lineWidth: 2,
                    showInLegend: true,
                },
            ]}
            upperLegendsProps={{
                weather: {
                    onClick: ({ event, props, withTemp }) => {
                        setWeatherData({
                            pointStart: 1664564400000,
                            pointInterval: 57600000,
                            data: [
                                [4.4, 9.2, 13.3],
                                [3.9, 8.4, 13.3],
                                [8.9, 12.3, 16.1],
                                [11.7, 14.9, 18.3],
                                [8.3, 13.3, 16.7],
                                [5, 7.8, 9.4],
                                [3.9, 6.1, 7.8],
                                [0.6, 4, 6.1],
                                [3.3, 4.5, 6.7],
                                [0.6, 3.7, 6.7],
                                [-1.1, 3.5, 7.2],
                                [3, 8.9, 15],
                                [2.8, 9.5, 14.4],
                                [-1.1, 0.6, 2.5],
                                [-2.2, 1.4, 6.1],
                                [-1.7, 3.8, 10],
                                [1.7, 5.2, 7.8],
                                [5.6, 8.7, 12.2],
                                [2.8, 5.8, 7.2],
                                [3.9, 7.1, 8.9],
                                [3.3, 4.5, 5.6],
                                [1.1, 3.5, 6.1],
                                [3.3, 4.4, 5.6],
                                [1.1, 4.6, 8.9],
                                [-1.1, 5, 14.4],
                                [2.2, 8, 14.4],
                                [0.6, 3.3, 8.9],
                                [0, 6.1, 11.1],
                                [1.1, 6.4, 11.1],
                                [2.8, 7.1, 12.2],
                                [1.7, 3.6, 12.8],
                                [-0.6, 1.3, 3.9],
                                [-2.2, 1.1, 5],
                            ],
                        });
                        setWeatherChartVisibility(withTemp);
                    },

                    isAlwaysShown: true,
                },
            }}
            withTemp={isWeatherChartVisible}
        />
    );
};

WithTemp.args = {
    title: 'Chart title',
    subTitle: 'Chart subtitle',
    isLoadingData: true,
    disableDefaultPlotBands: true,
    // Not necessary, merely for demo purposes
    tooltipValuesKey: '{point.y:.1f}',
    data,
    dateRange,
};
