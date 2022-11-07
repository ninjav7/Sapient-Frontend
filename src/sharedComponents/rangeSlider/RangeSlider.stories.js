import React from 'react';
import RangeSlider from './RangeSlider';
import '../assets/scss/stories.scss';
import { ReactComponent as TrendDownSVG } from '../assets/icons/arrow-trend-down.svg';
import { ReactComponent as TrendUpSVG } from '../assets/icons/arrow-trend-up.svg';

export default {
    title: 'Components/RangeSlider',
    component: RangeSlider,
};

export const Default = (props) => <RangeSlider {...props} />;

export const WithFilters = (props) => <RangeSlider {...props} buttonGroup={[
    {label: 'All'},
    {icon: <TrendDownSVG />},
    {icon: <TrendUpSVG />},
]} withTrendsFilter/>;

Default.args = {
    step: 1,
    min: 0,
    range: [0, 1000],
    max: 1000,
    prefix: '%',
};

WithFilters.args = Default.args;
