import React, { useState } from 'react';
import Select from './index';
import MultiSelect from './MultiSelect';
import Brick from '../../brick';

export default {
    title: 'Components/Select',
    component: Select,
    argTypes: {
        selectClassName: {
            control: false,
        },
        className: {
            control: false,
        },
        defaultValue: {
            control: false,
        },
    },
};

export const Default = arg => {
    const [state, setState] = useState([]);

    return (
        <>
            <h5>Select</h5>
            <Select {...arg} />
            <Brick />
            <h5>Multi Select</h5>

            <MultiSelect {...arg} onChange={e => setState(e)} label="Columns" />
            <small>{JSON.stringify(state)}</small>
        </>
    );
};

Default.args = {
    options: [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Year',
            value: 12,
        },
    ],
};
