import React from 'react';
import Datepicker from './index';
import Brick from '../brick';

import 'react-datepicker/dist/react-datepicker.css';


export default {
    title: 'Components/Datepicker',
    component: Datepicker,
};

export const Default = () => {
    return <Datepicker />;
};

export const Single = () => {
    return <Datepicker isSingleDay={true} />;
};

export const WithoutApplyButton = () => {
    return (
        <>
            <Datepicker isSingleDay={true} withApplyButton={false} />
            <Brick />
            <Datepicker withApplyButton={false} />
        </>
    );
};
