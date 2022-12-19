import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import { Button } from '../button';

import { renderElementIfValid } from '../helpers/helper';
import { COMPONENT_TYPES, TYPES, COLORS_MAP_ALERT, COLORS_MAP_SNACKBAR } from './constants';

import { ReactComponent as ExclamationCircleSVG } from '../assets/icons/exclamation-circle.svg';
import { ReactComponent as TriangleExclamationSVG } from '../assets/icons/triangle-exclamation.svg';
import { ReactComponent as TooltipSVG } from '../assets/icons/tooltip.svg';
import { ReactComponent as CircleCheckSVG } from '../assets/icons/circle-check.svg';
import { ReactComponent as CloseButtonSVG } from '../assets/icons/close-button.svg';

import './Notification.scss';

const IconMap = {
    error: ExclamationCircleSVG,
    warning: TriangleExclamationSVG,
    info: TooltipSVG,
    success: CircleCheckSVG,
};

const Notification = (props) => {
    const {
        title,
        description,
        onClose,
        icon,
        actionButtons,
        component,
        type,
        isShownCloseBtn,
        closeByCloseBtn = true,
    } = props;

    const [isShown, setIsShown] = useState(props.isShown);

    useEffect(() => {
        setIsShown(props.isShown);
    }, [props.isShown]);

    const handleClose = useCallback((event) => {
        onClose && onClose(event);
        closeByCloseBtn && setIsShown(false);
    }, []);

    if (!isShown) {
        return null;
    }

    const renderActionButtons = (currentColorsSchema) => {
        if (React.isValidElement(actionButtons)) {
            return renderElementIfValid(actionButtons);
        }

        if (actionButtons) {
            return (
                <div className="notification-action-buttons-container">
                    {actionButtons.map((data, index) => {
                        if (React.isValidElement(data)) {
                            return renderElementIfValid(data);
                        }

                        return (
                            data.label && (
                                <Button
                                    type={Button.Type.secondaryGrey}
                                    size={Button.Sizes.sm}
                                    key={index}
                                    style={{ color: currentColorsSchema.title }}
                                    {...data}
                                    className={cx('reset-styles notification-action-button', data.className)}
                                />
                            )
                        );
                    })}
                </div>
            );
        }
    };

    const colorsSchema = component === COMPONENT_TYPES.alert ? COLORS_MAP_ALERT : COLORS_MAP_SNACKBAR;
    const currentColorsSchema = colorsSchema[type];

    const renderIcon = () => {
        const classNamesIcon = cx(
            'notification-icon',
            type,
            component === COMPONENT_TYPES.alert ? 'alert-icon' : 'snack-bar-icon'
        );

        if (React.isValidElement(icon)) {
            return React.cloneElement(icon, { ...icon.props, className: cx(classNamesIcon, icon.props?.className) });
        }

        if (icon && typeof icon === 'string') {
            return <img src={icon} alt={type} className={classNamesIcon} />;
        }

        const Icon = IconMap[type];

        return <Icon className={cx(classNamesIcon, 'internal-icon')} width={null} height={null} />;
    };

    return (
        <div className="notification-wrapper" style={{ background: currentColorsSchema.background, ...props.style }}>
            <div className="notification-body">
                <div className="notification-icon-container">{renderIcon()}</div>
                <div className="notification-text-container">
                    <div className="notification-titles-container">
                        <Typography.Header size={Typography.Sizes.xs} style={{ color: currentColorsSchema.title }}>
                            {title}
                        </Typography.Header>
                        <Brick sizeInRem={title ? 0.25 : 0.11} />
                        <Typography.Body size={Typography.Sizes.md} style={{ color: currentColorsSchema.description }}>
                            {description}
                        </Typography.Body>
                    </div>

                    {renderActionButtons(currentColorsSchema)}
                </div>
                {isShownCloseBtn && (
                    <button
                        onClick={handleClose}
                        type="button"
                        role="button"
                        className="reset-styles ml-auto align-self-start notification-btn-close">
                        <CloseButtonSVG
                            style={{ fill: currentColorsSchema.closeIcon }}
                            className="notification-btn-close-icon"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

Notification.Types = TYPES;
Notification.ComponentTypes = COMPONENT_TYPES;

Notification.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    onClose: PropTypes.func,
    icon: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired]),
    actionButtons: PropTypes.oneOfType([
        PropTypes.node.isRequired,
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                onClick: PropTypes.func,
            })
        ),
    ]),
    component: PropTypes.oneOf(Object.values(COMPONENT_TYPES)),
    type: PropTypes.oneOf(Object.values(TYPES)),
    isShown: PropTypes.bool,
    isShownCloseBtn: PropTypes.bool,
    closeByCloseBtn: PropTypes.bool,
};

Notification.defaultProps = {
    isShown: true,
    isShownCloseBtn: true,
};

export { Notification };
