import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './Button.scss';

const SIZES = Object.freeze({
    sm: 'sm',
    md: 'md',
    lg: 'lg',
});

const BUTTON_TYPES = Object.freeze({
    primary: 'primary',
    secondary: 'secondary',
    secondaryGrey: 'secondary-grey',
    tertiary: 'tertiary',
    tertiaryGrey: 'tertiary-grey',
    primaryDistructive: 'primary-distructive',
    secondaryDistructive: 'secondary-distructive',
    link: 'link',
});

const BUTTON_ICON_ALIGNMENT = Object.freeze({
    left: 'left',
    right: 'right',
});

const keysToExclude = new Set([
    'typeButton',
    'label',
    'hoverLabel',
    'type',
    'size',
    'large',
    'wrapText',
    'className',
    'children',
    'buttonRef',
    'icon',
    'iconAlignment',
]);

const Button = (props) => {
    const typeButton = props.typeButton || 'button';
    const type = props.type || BUTTON_TYPES.secondaryGrey;

    const hasIconWithLabel = props.icon && props.label;
    const iconAlignedLeft = hasIconWithLabel && props.iconAlignment === BUTTON_ICON_ALIGNMENT.left;
    const iconAlignedRight =
        hasIconWithLabel && (props.iconAlignment === BUTTON_ICON_ALIGNMENT.right || !iconAlignedLeft);

    const iconClasses = ['aicon', 'cicon'];
    if (props.icon?.props?.className) {
        iconClasses.push(props.icon.props.className);
    }

    const sideAlignedClass =
        (iconAlignedLeft && BUTTON_ICON_ALIGNMENT.left) || (iconAlignedRight && BUTTON_ICON_ALIGNMENT.right);

    const buttonClasses = cx('button', props.size, type, {
        disabled: props.disabled,
        round: !props.children && !props.label,
        large: props.large,
        wrapText: props.wrapText,
        [`align-${sideAlignedClass}`]: props.icon && sideAlignedClass,
        ['wrap-text']: props.wrapText,
    });

    const finalClasses = cx(buttonClasses, props.className);
    const labelStyle = props.labelColor && !props.disabled ? { style: { color: `${props.labelColor}` } } : {};
    const iconColor = props.labelColor && !props.disabled && `${props.labelColor}`;

    const buttonProps = {};
    Object.keys(props).map((key) => {
        if (!keysToExclude.has(key)) {
            buttonProps[key] = props[key];
        }
    });

    return (
        <div className="button-wrapper">
            <button
                type={typeButton}
                ref={(node) => {
                    if (typeof props.buttonRef === 'function') {
                        props.buttonRef(node);
                    } else if (props.buttonRef) {
                        props.buttonRef.current = node;
                    }
                }}
                className={finalClasses}
                {...buttonProps}>
                {props.children ? (
                    props.children
                ) : (
                    <>
                        {props.icon &&
                            React.cloneElement(props.icon, {
                                className: iconClasses.join(' '),
                                style: {
                                    color: `${iconColor}`,
                                    ...(!!props.icon.props.style && props.icon.props.style),
                                },
                            })}
                        {props.label && (
                            <div className="button-label">
                                <span className={cx({ 'button-label--hovered': props.hoverLabel })} {...labelStyle}>
                                    {props.label}
                                </span>
                                {props.hoverLabel && <span className="button-hover-label">{props.hoverLabel}</span>}
                            </div>
                        )}
                    </>
                )}
            </button>
        </div>
    );
};

Button.Type = BUTTON_TYPES;
Button.Sizes = SIZES;
Button.IconAlignment = BUTTON_ICON_ALIGNMENT;

Button.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(BUTTON_TYPES)).isRequired,
    size: PropTypes.oneOf(Object.values(SIZES)).isRequired,
    icon: PropTypes.node,
    iconAlignment: PropTypes.oneOf(Object.values(BUTTON_ICON_ALIGNMENT)),
    typeButton: PropTypes.string,
};

Button.defaultProps = {
    iconAlignment: BUTTON_ICON_ALIGNMENT.left,
};

export default Button;
