import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import PickDemandWidget from './PickDemandWidget';

import '../assets/scss/stories.scss';

export default {
    title: 'Widgets/PickDemandWidget',
    component: PickDemandWidget,
};

export const Default = (props) => {
    return (
        <div>
            <BrowserRouter>
                <PickDemandWidget {...props} style={{ display: 'inline-block' }} />
            </BrowserRouter>
        </div>
    );
};

Default.args = {
    title: 'Energy Consumption by End Use',
    subtitle: 'Max power draw (15 minute period',
    pickDemandItems: [
        {
            links: [
                { label: 'AHU 1', to: '#', value: 22.2, unit: 'kWh' },
                { label: 'AHU 2', to: '#', value: 0.2, unit: 'kWh' },
                { label: 'Compressor 1', to: '#', value: 0.4, unit: 'kWh' },
            ],
            dateText: 'March 3rd @ 3:20 PM',
            value: '245.3',
            unit: 'kWh',
            handleClick: alert,
        },
        {
            links: [
                { label: 'Test 1', to: '#', value: 212.2, unit: 'kWh' },
                { label: 'test 2', to: '#', value: 1.2, unit: 'kWh' },
                { label: 'Compressor 1', to: '#', value: 0.4, unit: 'kWh' },
            ],
            dateText: 'March 10th @ 9:20 PM',
            value: '25.3',
            unit: 'kWh',
            handleClick: alert,
        },
        {
            links: [
                { label: 'Computer 1', to: '#', value: 9.2, unit: 'kWh' },
                { label: 'Computer 2', to: '#', value: 1.2, unit: 'kWh' },
                { label: 'Computer 10', to: '#', value: 1.4, unit: 'kWh' },
            ],
            dateText: 'March 3rd @ 10:20 PM',
            value: '20.3',
            unit: 'kWh',
            handleClick: alert,
        },
    ],
    buttonLabel: 'More Details',
    handleClick: alert,
};
