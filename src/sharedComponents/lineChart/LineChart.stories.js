import React from 'react';
import LineChart from './LineChart';
import { mockedData, mockedData2, mockedData3 } from './mock';
import colors from '../../assets/scss/_colors.scss';

export default {
    title: 'Charts/LineChart',
    component: LineChart,
};

const data = [
    { name: 'MockedData1', data: mockedData },
    { name: 'MockedData2', data: mockedData2 },
    { name: 'MockedData3', data: mockedData3 },
    { name: 'MockedData4', data: mockedData3 },
    { name: 'MockedData5', data: mockedData3 },
    { name: 'MockedData6', data: mockedData3 },
];
const dateRange = {
    minDate: new Date('2022-09-1').getTime(),
    maxDate: new Date('2022-11-1').getTime(),
};
export const Default = (args) => {
    return (
        <>
            <LineChart {...args} />

            <hr />

            <LineChart
                {...args}
                data={args.data.map((d) => ({
                    ...d,
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [[1, 'rgba(255,255,255,.01)']],
                    },
                }))}
                /*
                // Optional, if we want to create customs labels
                plotBandsLegends={[
                    { label: 'Plug Rule Off-Hours', color: 'rgb(16 24 40 / 25%)' },
                    {
                        label: 'After-Hours',
                        color: {
                            background: 'rgba(180, 35, 24, 0.1)',
                            borderColor: colors.error700,
                        },
                        onClick: () => {}
                    },
                ]}
                */


                // "from" and "to" depend on what data was passed to Xaxis
                plotBands={[
                    { type: LineChart.PLOT_BANDS_TYPE.off_hours, from: 1664394400000, to: 1664614400000 },
                    {
                        type: LineChart.PLOT_BANDS_TYPE.after_hours,
                        from: 1664364400000,
                        to: 1664650800000,
                    },

                    { type: LineChart.PLOT_BANDS_TYPE.off_hours, from: 1664194400000, to: 1664294400000 },

                    {
                        type: LineChart.PLOT_BANDS_TYPE.after_hours,
                        from: 1664094400000,
                        to: 1664214400000,
                    },
                    
                    
                    // we specify colors and don't specify type, when we need custom colors
                    { background: 'rgb(16 24 40 / 25%)', from: 1662464400000, to: 1662564400000 },
                    {
                        //If it is array you need to provide stop points for linear gradient 0 - minumux; 1 - maximum
                        background: [
                            [0, 'rgba(240, 68, 56, 0.4)'],
                            [0.07, 'rgba(240, 68, 56, 0.08)'],
                            [1, 'rgba(240, 68, 56, 0.08)'],
                        ],
                        borderBottomColor: colors.error700,
                        from: 1662364400000,
                        to: 1663300800000,
                    },
                ]}
                 
            />
        </>
    );
};

Default.args = {
    title: 'Chart title',
    subTitle: 'Chart subtitle',
    data,
    dateRange,
    handleMoreClick: () => console.log('Clicked'),
};
