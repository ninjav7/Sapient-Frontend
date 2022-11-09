import React, { useState, useEffect } from 'react';
import RangeSlider from './RangeSlider';

export const SliderAll = ({ bottom, top, handleChange, bottomPer, topPer }) => {
    return (
        <RangeSlider
            name="consumptionAll"
            STEP={1}
            MIN={bottom}
            range={[bottomPer, topPer]}
            MAX={top}
            onSelectionChange={handleChange}
        />
    )
};

export const SliderPos = ({ bottom, top, handleChange, bottomPer, topPer }) => {
    return (
        <RangeSlider
            name="consumptionAll"
            STEP={1}
            MIN={bottom}
            range={[bottomPer, topPer]}
            MAX={top}
            onSelectionChange={handleChange}
        />
    )
};

export const SliderNeg = ({ bottom, top, handleChange, bottomPer, topPer }) => {
    return (
        <RangeSlider
            name="consumptionAll"
            STEP={1}
            MIN={bottom}
            range={[bottomPer, topPer]}
            MAX={top}
            onSelectionChange={handleChange}
        />
    )
};