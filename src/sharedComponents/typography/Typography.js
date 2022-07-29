import React from 'react';
import cx from 'classnames';

import TypographySubheader from './TypographySubheader';
import { TypographyBody } from './TypographyBody';

import './style.scss';

const FONT_WEIGHT_TYPES = Object.freeze({
    SemiBold: 'SemiBold',
    Bold: 'Bold',
    Regular: 'Regular',
    Medium: 'Medium',
});

const SIZES = Object.freeze({
    xxl: 'xxl',
    xl: 'xl',
    lg: 'lg',
    md: 'md',
    sm: 'sm',
    xs: 'xs',
});

const Typography = ({ children, variant, size, fontWeight, className, noPadding, as = 'div', innerRef, ...props }) => {
    const elementClassNames = cx(
        'typography-wrapper',
        variant,
        {
            [`${size}`]: !!size,
        },
        className
    );

    const classNames = cx(
        {
            [`${fontWeight}`]: !!fontWeight,
            ['no-padding']: noPadding,
        },
        elementClassNames
    );

    return React.createElement(as, { className: classNames, ref: innerRef, ...props }, children);
};

Typography.Types = FONT_WEIGHT_TYPES;
Typography.Sizes = SIZES;

Typography.Subheader = TypographySubheader;
Typography.Body = TypographyBody;

export default Typography;
