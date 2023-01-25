import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../../typography';
import { Badge } from '../../badge';

import { ReactComponent as PenSVG } from '../../assets/icons/pen.svg';
import { ReactComponent as ArrowRightSVG } from '../../assets/icons/arrow-right.svg';

const LayoutLocationSelectionMenuList = (props) => {
    const { title, onEdit, onClick, isActive, level, isArrowShown } = props;

    const onEditHandlerMemoized = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();

        onEdit && onEdit(event);
    }, []);

    const classNameWrapper = useMemo(
        () => cx('layout-location-selection-menu-list d-flex align-items-center', { 'is-active': isActive }),
        [isActive]
    );

    return (
        <div className={classNameWrapper} role="button" onClick={onClick}>
            <Typography.Body size={Typography.Sizes.lg} className="gray-450 layout-location-selection-menu-list-title">
                {title}
            </Typography.Body>

            <div className="ml-auto layout-location-selection-menu-list-action-buttons">
                {onEdit && (
                    <button
                        className="reset-styles layout-location-selection-menu-list-action-buttons-edit"
                        onClick={onEditHandlerMemoized}>
                        <PenSVG />
                    </button>
                )}
                <Badge text={level} />
                <div className="layout-location-selection-menu-list-click">
                    {onClick && isArrowShown && (
                        <button onClick={onClick} className="reset-styles">
                            <ArrowRightSVG />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

LayoutLocationSelectionMenuList.propTypes = {
    title: PropTypes.string,
    onEdit: PropTypes.func,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    level: PropTypes.string.isRequired,
    isArrowShown: PropTypes.bool.isRequired,
};

export { LayoutLocationSelectionMenuList };
