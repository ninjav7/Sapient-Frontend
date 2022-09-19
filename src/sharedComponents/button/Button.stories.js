import React from 'react';

import Button from './Button';
import Brick from '../brick';
import '../assets/scss/stories.scss';

import { ReactComponent as PlusSVG } from '../assets/icons/plus.svg';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

export default {
    title: 'Components/Button',
    component: Button,
};

export const Default = () => (
    <>
        <h6>Primary</h6>
        <Button label="Primary" size={Button.Sizes.lg} type={Button.Type.primary} />
        <h6>Secondary</h6>
        <Button label="Secondary" size={Button.Sizes.lg} type={Button.Type.secondary} />
        <h6>Secondary grey</h6>
        <Button label="Secondary grey" size={Button.Sizes.lg} type={Button.Type.secondaryGrey} />
        <h6>Tertiary</h6>
        <Button
            label="Tertiary"
            size={Button.Sizes.lg}
            icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
            type={Button.Type.tertiary}
            iconAlignment={Button.IconAlignment.right}
        />
        <h6>Tertiary Grey</h6>
        <Button
            label="Tertiary"
            icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
            iconAlignment={Button.IconAlignment.right}
            size={Button.Sizes.lg}
            type={Button.Type.tertiaryGrey}
        />
        <h6>Link style</h6>
        <Button label="Link Style" size={Button.Sizes.lg} type={Button.Type.link} />

        <h6>Primary distructive</h6>
        <Button label="Primary Distructive" size={Button.Sizes.lg} type={Button.Type.primaryDistructive} />
        <h6>Secondary Distructive</h6>
        <Button label="Secondary Distructive" size={Button.Sizes.lg} type={Button.Type.secondaryDistructive} />

        <h6>Without Icon</h6>
        <Button label="Button CTA {MD}" size={Button.Sizes.md} type={Button.Type.secondaryGrey} />
        <Brick />
        <Button label={'Button CTA {SM}'} size={Button.Sizes.sm} type={Button.Type.secondaryGrey} />

        <Brick sizeInRem={2} />

        <h6>With Icon - Aligned to Left/Right</h6>
        <div className="d-flex">
            <Button
                label="Button CTA {MD}"
                size={Button.Sizes.md}
                type={Button.Type.secondaryGrey}
                icon={<PlusSVG />}
            />
            <div className="p-2" />
            <Button
                label="Button CTA {MD}"
                size={Button.Sizes.md}
                type={Button.Type.secondaryGrey}
                icon={<PlusSVG />}
                iconAlignment={Button.IconAlignment.right}
            />
        </div>
    </>
);

export const Primary = () => <Button label="Button CTA {LG}" size={Button.Sizes.lg} type={Button.Type.primary} />;
