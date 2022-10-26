import React, { useState } from 'react';
import TimeFrameSelector from './TimeFrameSelector';
import '../assets/scss/stories.scss';
import { DayPickerSingleDateController } from 'react-dates';
import Brick from '../brick';

export default {
    title: 'Components/TimeFrameSelector',
    component: TimeFrameSelector,
};

export const Default = () => (
    <TimeFrameSelector
        onChange={() => alert('Changed')}
        onCancel={({ startDate, endDate, event }) => alert(JSON.stringify({ startDate, endDate }))}
        onApply={({ startDate, endDate, event }) => {
            event.preventDefault();
            alert(JSON.stringify({ startDate, endDate }));
        }}
    />
);

export const Single = () => (
    <TimeFrameSelector
        isSingleDay={true}
        onChange={() => alert('Changed')}
        onCancel={({ startDate, endDate, event }) => alert(JSON.stringify({ startDate, endDate }))}
        onApply={({ startDate, endDate, event }) => {
            event.preventDefault();
            alert(JSON.stringify({ startDate, endDate }));
        }}
    />
);

export const WithoutApplyButton = () => {
    return (
        <>
            <TimeFrameSelector isSingleDay={true} withApplyButton={false} />
            <Brick />
            <TimeFrameSelector withApplyButton={false} />
        </>
    );
};
