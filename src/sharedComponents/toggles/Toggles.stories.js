import React from 'react';
import Toggles from './Toggles';
import '../assets/scss/stories.scss';

export default {
    title: 'Components/Toggles',
    component: Toggles,
};

export const Default = () => (
    <>
        <h6>{'{SM}'}</h6>
        <Toggles size={Toggles.Sizes.sm} label='Remember me' description='Save my login details for next time.' />
        
        <hr/>
        <h6>Text alignment</h6>
        <Toggles size={Toggles.Sizes.sm} label='Remember me' description='Save my login details for next time.' textAlignment={Toggles.TextAlignment.left} />
    </>
);

