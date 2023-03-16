import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Brick from '../../brick';
import Typography from '../../typography';
import { LayoutColumnHeader } from './LayoutColumnHeader';
import { LayoutLocationSelectionMenuList } from './LayoutLocationSelectionMenuList';
import { LayoutLoadingComponent } from './LayoutLoadingComponent';

import { generateID, stringOrNumberPropTypes } from '../../helpers/helper';
import { getActionRestrictions } from '../helper';
import { ACCESSORS } from '../constants';

const NoItems = () => {
    return (
        <div className="layout-level-column-no-items">
            <Typography.Body className="gray-500" size={Typography.Sizes.md}>
                No spaces within
            </Typography.Body>
            {/*/** Unrealized functionality*/}
            {/*<div>*/}
            {/*    <Typography.Subheader size={Typography.Sizes.sm} className='gray-600' >Equipment in this space</Typography.Subheader>*/}
            {/*    <div className='d-flex justify-content-between align-items-center'>*/}
            {/*        <Typography.Body size={Typography.Sizes.md}>4 Items</Typography.Body>*/}
            {/*        <Button size={Button.Sizes.sm} type={Button.Type.secondaryGrey} label='View'/>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

const LayoutLevelColumn = (props) => {
    const {
        title,
        children,
        onChildrenClick,
        childrenCallBackValue,
        state,
        onColumnAdd,
        onColumnAddIncludeChildren,
        onColumnEdit,
        onColumnEditIncludeChildren,
        onColumnNameEdit,
        onColumnNameEditIncludeChildren,
        onColumnFilter,
        onColumnFilterIncludeChildren,
        onItemEdit,
        onItemEditIncludeChildren,
        currentItem,
        isLoading,
        actionsMap,
    } = props;
    const [selectedItem, setSelectedItem] = useState(props.selectedItem);

    useEffect(() => {
        return () => {
            selectedItem && setSelectedItem(null);
        };
    }, [title]);

    const renderChildren = () => {
        if (isLoading) {
            return <LayoutLoadingComponent />;
        }

        return children.length ? (
            children.map((childProps) => {
                const { name, level, ...props } = childrenCallBackValue
                    ? childrenCallBackValue(childProps)
                    : childProps;

                const id = childProps[ACCESSORS.SPACE_ID] || childProps[ACCESSORS.FLOOR_ID];

                const hasChildren =
                    state[ACCESSORS.SPACES] &&
                    state[ACCESSORS.SPACES].some((space) => space[ACCESSORS.PARENT_SPACE] === id);
                const isActive = selectedItem === id;
                const { isEditable } = getActionRestrictions(actionsMap[id]);

                return (
                    <LayoutLocationSelectionMenuList
                        title={name}
                        key={generateID()}
                        level={level}
                        isActive={isActive}
                        notEditable={onColumnEditIncludeChildren}
                        onEdit={
                            !onColumnEditIncludeChildren && isEditable && onItemEdit
                                ? (event) => onItemEdit({ event, name, ...props })
                                : null
                        }
                        isArrowShown={hasChildren || childProps.hasChildren}
                        onClick={(event) => {
                            setSelectedItem(id);
                            onChildrenClick(
                                { event, name, ...props },
                                {
                                    onColumnAddIncludeChildren,
                                    onColumnEditIncludeChildren,
                                    onColumnNameEditIncludeChildren,
                                    onColumnFilterIncludeChildren,
                                    onItemEditIncludeChildren,
                                }
                            );
                        }}
                    />
                );
            })
        ) : (
            <NoItems />
        );
    };

    const columnAddHandler = useCallback(() => onColumnAdd(currentItem), [currentItem]);
    const columnEditHandler = useCallback(() => onColumnEdit(currentItem), [currentItem]);
    const columnNameEditHandler = useCallback(() => onColumnNameEdit(currentItem), [currentItem]);
    const columnFilterHandler = useCallback(() => onColumnFilter(currentItem), [currentItem]);

    return (
        <div className="layout-level-column">
            <LayoutColumnHeader
                title={title}
                onAdd={!onColumnAddIncludeChildren && onColumnAdd && columnAddHandler}
                onHeaderEdit={!onColumnNameEditIncludeChildren && onColumnNameEdit && columnNameEditHandler}
                onFilter={!onColumnFilterIncludeChildren && onColumnFilter && columnFilterHandler}
                onEdit={!onColumnEditIncludeChildren && onColumnEdit && columnEditHandler}
            />
            <Brick sizeInRem={0.6875} />
            <div className={cx('layout-level-column-children', { 'is-loading': isLoading })}>{renderChildren()}</div>
        </div>
    );
};

LayoutLevelColumn.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            level: PropTypes.string.isRequired,
        })
    ),
    onChildrenClick: PropTypes.func.isRequired,
    childrenCallBackValue: PropTypes.func,
    selectedItem: stringOrNumberPropTypes,
};

export { LayoutLevelColumn };
