import React from 'react';
import Radio from './Radio';
import '../../assets/scss/stories.scss';

export default {
    title: 'Components/Radio',
    component: Radio,
};

export const Default = () => {
    return (
        <div className='small-grid'>
            <Radio name='radio-1' label='radio 1' checked />
            <Radio name='radio-1' label='radio 1-1' />
            <Radio name='radio-2' label='radio 2-1' checked disabled />
            <Radio name='radio-2' label='radio 2-2' />
        </div>
    );
}