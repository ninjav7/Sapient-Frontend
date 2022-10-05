import React from 'react';

import ButtonGroup from './ButtonGroup';
import '../assets/scss/stories.scss';
import { ReactComponent as PlusSVG } from '../assets/icons/plus.svg';

export default {
    title: 'Components/ButtonGroup',
    component: ButtonGroup,
};
const buttonsExample = [
    { label: 'left', icon: <PlusSVG />},
    { label: 'center', icon: <PlusSVG /> },
    {  icon: <PlusSVG />, },
    { label: 'right', icon: <PlusSVG />, iconAlignment: 'right', },
];
export const Default = () => {
    const handleButtonClick = (id) => {
        console.log('IDOFCLICKED', id);
    };
    return (
        <>
            <h6>Primary</h6>
            <ButtonGroup
                buttons={buttonsExample}
                handleButtonClick={(id) => handleButtonClick(id)}></ButtonGroup>
        </>
    );
};
