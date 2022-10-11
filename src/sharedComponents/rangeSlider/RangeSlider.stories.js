import React from 'react';
import RangeSlider from './RangeSlider';
import '../assets/scss/stories.scss';

export default {
    title: 'Components/RangeSlider',
    component: RangeSlider,
};

export const Default = (props) => <RangeSlider {...props} />;

Default.args = {
    step: 1,
    min: 0,
    range: [0, 1000],
    max: 1000,
    prefix: '%',
};
