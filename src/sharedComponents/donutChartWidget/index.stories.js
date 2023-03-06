import React from 'react';
import DonutChartWidget, { DONUT_CHART_TYPES } from './index';
import { BrowserRouter } from 'react-router-dom';
import colors from '../../assets/scss/_colors.scss';

export default {
    title: 'Charts/Donut Chart Widget',
    component: DonutChartWidget,
};

const donatChartMock = [
    {
        label: 'HVAC',
        color: '#66A4CE',
        value: '12.553',
        unit: 'kWh',
        trendValue: 1,
        onClick: () => alert(1),
    },
    { label: 'Lighting', color: '#FBE384', value: '11.553', unit: 'kWh', trendValue: 5 },
    { label: 'Plug', color: '#59BAA4', value: '1.553', unit: 'kWh', trendValue: 2, link: '#' },
    { label: 'Process', color: '#82EAF0', value: '0.553', unit: 'kWh', trendValue: 1, link: '#' },
];

const series = [12.553, 11.553, 1.553, 0.553];

export const Default = () => {
    return (
        <BrowserRouter>
            <DonutChartWidget
                items={donatChartMock}
                series={series}
                title="Title"
                subtitle="subtitle"
                style={{ width: 540 }}
            />
        </BrowserRouter>
    );
};

export const Vertical = () => {
    return (
        <BrowserRouter>
            <small>
                Just for demo purposes:
                <ul>
                    <li>HVAC - is clickable, for that we use onClick property</li>
                    <li>Lighting - is not clickable</li>
                    <li>Other items are Link component from react-route</li>
                </ul>
            </small>
            <DonutChartWidget
                items={donatChartMock}
                type={DONUT_CHART_TYPES.VERTICAL}
                title="Title"
                subtitle="subtitle"
                series={series}
                style={{ width: 400 }}
            />
        </BrowserRouter>
    );
};

Default.storyName = 'Horizontal';
