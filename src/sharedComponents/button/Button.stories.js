import React from 'react';
import Button from './Button';
import { ReactComponent as PlusSVG } from '../assets/icons/plus.svg';
import Brick from '../brick';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/Button',
    component: Button,
};

export const SecondaryGrey = () => (
    <>
        <h6>Without Icon</h6>
        <Button label="Button CTA {MD}" size={Button.Sizes.md} type={Button.Type.SecondaryGrey} />
        <Brick />
        <Button label={'Button CTA {SM}'} size={Button.Sizes.sm} type={Button.Type.SecondaryGrey} />

        <Brick sizeInRem={2} />

        <h6>With Icon</h6>
        <Button label="Button CTA {MD}" size={Button.Sizes.md} type={Button.Type.SecondaryGrey} icon={<PlusSVG />} />
    </>
);
