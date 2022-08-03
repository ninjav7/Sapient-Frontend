import React from 'react';
import DonutChartWidget, {DONUT_CHART_TYPES} from "./index";
import {BrowserRouter} from "react-router-dom";

export default {
    title: 'Components/Donut Chart Widget',
    component: DonutChartWidget
}

const donatChartMock = [
    {
        label: 'HVAC',
        color: '#66A4CE',
        value: '12.553',
        unit: 'kWh',
        trendValue: 1,
        link: '#',
    },
    { label: 'Lighting', color: '#FBE384', value: '11.553', unit: 'kWh', trendValue: 5, link: '#' },
    { label: 'Plug', color: '#59BAA4', value: '1.553', unit: 'kWh', trendValue: 2, link: '#' },
    { label: 'Process', color: '#82EAF0', value: '0.553', unit: 'kWh', trendValue: 1, link: '#' },
];

export const Default = () => {
    return (
        <BrowserRouter>
        <DonutChartWidget items={donatChartMock} />
        </BrowserRouter>
    )
}

export const Vertical = () => {
    return (
        <BrowserRouter>
            <DonutChartWidget items={donatChartMock} type={DONUT_CHART_TYPES.VERTICAL} />
        </BrowserRouter>
    )
}

export const VerticalNoTotal = () => {
    return (
        <BrowserRouter>
            <DonutChartWidget items={donatChartMock} type={DONUT_CHART_TYPES.VERTICAL_NO_TOTAL} />
        </BrowserRouter>
    )
}


Default.storyName = "Horizontal";