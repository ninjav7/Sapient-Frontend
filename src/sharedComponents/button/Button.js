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
    SecondaryGrey: 'secondary-grey',
    Primary: 'primary'
});

const ButtonIconAlignment = Object.freeze({
    left: 'left',
    right: 'right',
});

const keysToExclude = new Set([
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
    const type = props.type || BUTTON_TYPES.SecondaryGrey;

    const hasIconWithLabel = props.icon && props.label;
    const iconAlignedLeft = hasIconWithLabel && props.iconAlignment === ButtonIconAlignment.left;
    const iconAlignedRight =
        hasIconWithLabel && (props.iconAlignment === ButtonIconAlignment.right || !iconAlignedLeft);
    const iconClasses = ['aicon', 'cicon'];
    if (props.icon?.props?.className) {
        iconClasses.push(props.icon.props.className);
    }

    const buttonClasses = cx('button', props.size, type, {
        disabled: props.disabled,
        round: !props.children && !props.label,
        large: props.large,
        wrapText: props.wrapText,
        align:
            props.icon &&
            ((iconAlignedLeft && ButtonIconAlignment.left) || (iconAlignedRight && ButtonIconAlignment.right)),
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
        <div className="Button-wrapper">
            <button
                type="button"
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

Button.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(BUTTON_TYPES)).isRequired,
    size: PropTypes.oneOf(Object.values(SIZES)).isRequired,
    icon: PropTypes.node,
};

export default Button;
