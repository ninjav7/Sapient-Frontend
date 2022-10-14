import React from 'react';
import cx from 'classnames';

import { Button } from '../../button';

import { ReactComponent as CloseSVG } from '../../assets/icons/close-button-2x.svg';
import { ReactComponent as PenSVG } from '../../assets/icons/pen.svg';

export const FilterHeaderButton = ({ onDeleteFilter, buttonLabel, isOpen, ...props }) => {
    const handleCloseFilter = (event) => {
        event.preventDefault();
        event.stopPropagation();

        onDeleteFilter && onDeleteFilter(props);
    };

    const label = () => (
        <div className={cx('table-filter-widget-header-button-label', { 'is-open': isOpen })}>
            <div className="table-filter-widget-header-button-label-text">{buttonLabel || props.placeholder}</div>
            <div className="table-filter-widget-header-button-label-icon">
                <PenSVG />
            </div>
        </div>
    );

    return (
        <Button
            label={label()}
            size={Button.Sizes.md}
            type={Button.Type.secondaryGrey}
            icon={<CloseSVG onClick={handleCloseFilter} />}
            iconAlignment={Button.IconAlignment.right}
        />
    );
};
