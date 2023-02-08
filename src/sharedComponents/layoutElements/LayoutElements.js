import React, { useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { LayoutLevelColumn } from './components/LayoutLevelColumn';

import useStateManager from './useStateManager';
import { ACCESSORS, ACTIONS } from './constants';

import './scss/LayoutElements.scss';

const getHandlerFromArray = (array, index, ...props) => {
    if (array && array[index] && typeof array[index] === 'function') {
        if (!props) {
            return array[index];
        }

        array[index](...props);
        return true;
    }
};

const renderStackColumns = (
    state,
    {
        callBackEachColumn,
        callBackForAllColumns,
        onColumnAdd,
        onColumnEdit,
        onColumnNameEdit,
        onColumnFilter,
        onItemEdit,
        isLoadingLastColumn,
    }
) =>
    Object.entries(state.stack).map(([key, { component, callbackState, currentItem }], currentIndex, stackEntries) => {
        const children = typeof callbackState === 'function' ? callbackState(state) : state;
        const defaultProps = {
            key,
            state,
            children,
            onColumnAdd,
            onColumnEdit,
            onColumnNameEdit,
            onColumnFilter,
            onItemEdit,
            currentItem,
            isLoading: isLoadingLastColumn && stackEntries.length - 1 === currentIndex,
        };

        const customizedProps = (() => {
            const callBackPropsComponent = callBackEachColumn && callBackEachColumn[key];

            if (callBackForAllColumns && !callBackPropsComponent) {
                return callBackForAllColumns(defaultProps);
            }

            if (callBackPropsComponent) {
                return callBackPropsComponent({ ...component.props, ...defaultProps });
            }

            return defaultProps;
        })();

        return React.cloneElement(component, customizedProps);
    });

const LayoutElements = (props) => {
    const { state, dispatch } = useStateManager(props);
    const { onClickEachChild, onClickForAllItems, buildingData, className, style } = props;

    const childrenClickHandler = (title, key, callbackState, currentItem) => {
        dispatch({
            type: ACTIONS.PUSH_INTO_STACK,
            payload: {
                component: (
                    <LayoutLevelColumn
                        title={title}
                        childrenCallBackValue={(props) => ({ level: String(props.type_name), ...props })}
                        onChildrenClick={(space) => {
                            const currentKey = key + 1;

                            const nativeHandler = () =>
                                childrenClickHandler(
                                    space[ACCESSORS.NAME],
                                    currentKey,
                                    (items) => {
                                        return items.spaces.filter(
                                            (item) => item[ACCESSORS.PARENT_SPACE] === space[ACCESSORS.SPACE_ID]
                                        );
                                    },
                                    space
                                );

                            const handlerArgs = { data: space, nativeHandler };

                            if (getHandlerFromArray(onClickEachChild, currentKey, handlerArgs)) {
                                return;
                            }

                            if (onClickForAllItems) {
                                const preventProcess = onClickForAllItems(handlerArgs);

                                // we need it in case we want to prevent run "nativeHandler" by default
                                if (preventProcess) {
                                    return;
                                }
                            }

                            nativeHandler();
                        }}
                    />
                ),
                key,
                callbackState,
                currentItem,
            },
        });
    };

    useEffect(() => {
        dispatch({
            type: ACTIONS.PUSH_INTO_STACK,
            payload: {
                component: (
                    <LayoutLevelColumn
                        title="Building Root"
                        accessorArgsOnChildrenClick={[ACCESSORS.FLOOR_ID, ACCESSORS.NAME]}
                        childrenCallBackValue={(props) => ({ level: 'Floor', ...props })}
                        state={state}
                        onChildrenClick={(floor) => {
                            const nativeHandler = () =>
                                childrenClickHandler(
                                    floor[ACCESSORS.NAME],
                                    1,
                                    (items) => {
                                        return items.spaces.filter((item) => item[ACCESSORS.PARENT_SPACE] === null);
                                    },
                                    floor
                                );

                            const handlerArgs = { data: floor, nativeHandler };

                            if (getHandlerFromArray(onClickEachChild, 0, handlerArgs)) {
                                return;
                            }

                            if (onClickForAllItems) {
                                const preventProcess = onClickForAllItems(handlerArgs);
                                // we need it in case we want to prevent run "nativeHandler" by default
                                if (preventProcess) {
                                    return;
                                }
                            }

                            nativeHandler();
                        }}
                    />
                ),
                key: 0,
                callbackState: (state) => state.floors.map((floor) => ({ ...floor, hasChildren: floor.has_children })),
                currentItem: buildingData,
            },
        });
    }, []);

    return (
        <div className={cx('layout-elements-wrapper d-flex', className)} style={style}>
            {renderStackColumns(state, props)}
        </div>
    );
};

LayoutElements.propTypes = {
    // Callbacks have the highest priority.
    callBackEachColumn: PropTypes.arrayOf(PropTypes.func),
    // Won't be applied to item if there is callback found in "callBackEachColumn".
    callBackForAllColumns: PropTypes.func,

    //Click handler for each item in the list
    onClickEachChild: PropTypes.arrayOf(PropTypes.func),

    // handler for all items
    // Prevent calling "nativeHandler" if the function returns true, it works useless the function isn't async
    onClickForAllItems: PropTypes.func,

    // For some reasons these functions are defined by mock function, so they are commented.
    /* 
    onColumnAdd: PropTypes.func.isRequired,
    onColumnEdit: PropTypes.func.isRequired,
    onColumnNameEdit: PropTypes.func.isRequired,
    onColumnFilter: PropTypes.func.isRequired,
     */

    buildingData: PropTypes.any.isRequired,
    isLoadingLastColumn: PropTypes.bool,

    //data
    floors: PropTypes.arrayOf(PropTypes.object),
    spaces: PropTypes.arrayOf(PropTypes.object),
};

export default LayoutElements;
