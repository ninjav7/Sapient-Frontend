import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../../typography';

import { ReactComponent as PlusSVG } from '../../assets/icons/plus.svg';
import { ReactComponent as PenSVG } from '../../assets/icons/pen.svg';
import { ReactComponent as FilterSVG } from '../../assets/icons/filter.svg';
import { ReactComponent as FilteredSVG } from '../../assets/icons/filtered.svg';

const LayoutColumnHeader = (props) => {
    const { className, style, isDisabled, title, isFiltered, onHeaderEdit, onAdd, onEdit, onFilter } = props;

    const [filtered, setFiltered] = useState(isFiltered);

    useEffect(() => {
        setFiltered(isFiltered);
    }, [isFiltered]);

    const onFilterMemoized = useCallback(() => {
        const currentFilterState = !filtered;

        setFiltered(currentFilterState);
        onFilter && onFilter(currentFilterState);
    }, [onFilter, filtered]);

    const classNameWrapper = useMemo(
        () => cx('layout-column-header', { disabled: isDisabled }, className),
        [isDisabled, className]
    );

    return (
        <div className={classNameWrapper} style={style}>
            {!isDisabled && (
                <Typography.Subheader className="layout-column-header-title-edit d-flex" size={Typography.Sizes.md}>
                    <div className="layout-column-header-title-text">{title}</div>
                    {onHeaderEdit && (
                        <button className="reset-styles layout-column-header-title-edit-button" onClick={onHeaderEdit}>
                            <PenSVG />
                        </button>
                    )}
                </Typography.Subheader>
            )}
            <div className="layout-column-header-action-buttons ml-auto">
                {onAdd && (
                    <button className="reset-styles" type="button" disabled={isDisabled} onClick={onAdd}>
                        <PlusSVG />
                    </button>
                )}
                {onEdit && (
                    <button className="reset-styles" type="button" disabled={isDisabled} onClick={onEdit}>
                        <PenSVG />
                    </button>
                )}
                {onFilter && (
                    <button className="reset-styles" type="button" disabled={isDisabled} onClick={onFilterMemoized}>
                        {filtered ? (
                            <FilteredSVG className="layout-column-header-action-buttons-filtered" />
                        ) : (
                            <FilterSVG />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

LayoutColumnHeader.propTypes = {
    isDisabled: PropTypes.bool,
    title: PropTypes.string,
    isFiltered: PropTypes.bool,
    onHeaderEdit: PropTypes.func,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onFilter: PropTypes.func,
};

export { LayoutColumnHeader };
