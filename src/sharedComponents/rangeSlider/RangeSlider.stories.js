import React from 'react';
import RangeSlider from './RangeSlider';
import Brick from '../brick';

import { ReactComponent as TrendDownSVG } from '../assets/icons/arrow-trend-down.svg';
import { ReactComponent as TrendUpSVG } from '../assets/icons/arrow-trend-up.svg';
import '../assets/scss/stories.scss';

export default {
    title: 'Components/RangeSlider',
    component: RangeSlider,
};

export const Default = (props) => (
    <>
        <RangeSlider {...props} />
        <Brick />
        <RangeSlider {...props} onRefreshClick={() => alert('onRefreshClick')} />
    </>
);

export const WithFilters = (props) => (
    <>
        <RangeSlider
            {...props}
            buttonGroup={[{ label: 'All' }, { icon: <TrendDownSVG /> }, { icon: <TrendUpSVG /> }]}
            withTrendsFilter
        />
    </>
);

Default.args = {
    step: 1,
    min: -100,
    range: [0, 1000],
    max: 1000,
    prefix: '%',
    handleButtonClick: (args) => {
        console.log(args);
    },
};

WithFilters.args = Default.args;
