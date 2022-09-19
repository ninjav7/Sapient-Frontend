import React from 'react';
import { TinyBarChart } from './index';

export default {
    title: 'Components/TinyBarChart',
    component: TinyBarChart,
};

export const Default = (props) => {
    return (
        <>
            Percent {props.percent}
            <TinyBarChart {...props} />
        </>
    );
};

Default.args = {
    percent: 80,
};
