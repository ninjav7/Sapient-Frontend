import React from 'react';
import { TinyBarChart } from './index';

export default {
    title: 'Components/TinyBarChart',
    component: TinyBarChart,
};

export const Default = (arg) => {
    return (
        <>
            Percent {arg.percent}
            <TinyBarChart {...arg} />
        </>
    );
};

Default.args = {
    percent: 80,
};
