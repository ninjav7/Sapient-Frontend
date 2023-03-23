import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { LayoutLevelColumn } from './components/LayoutLevelColumn';

import useStateManager from './useStateManager';
import { getActionRestrictions } from './helper';
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
        actionsMap = {},
        isLoadingLastColumn,
        spaces,
    },
    stackMap
) => {
    //For preventing render next column if it was detected without children
    let rendering = true;

    return Object.entries(state.stack).map(
        ([key, { component, callbackState, currentItem }], currentIndex, stackEntries) => {
            //preventing render if column without children has been detected
            if (!rendering) {
                return null;
            }

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
                actionsMap,
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

            const currentId = currentItem[ACCESSORS._ID] || currentItem[ACCESSORS.FLOOR_ID];
            const actionMappedProps = getActionRestrictions(actionsMap[currentId], true);

            // Deal with spaces but not with first selected spaces based on floor
            if (stackMap.current[currentIndex] !== currentId) {
                rendering = false;
                return null;
            }

            // For selected floor
            // We don't deal with buildind id, we start work only with index 1
            if (currentIndex === 1 && !state.floors.some((floor) => currentId === floor[ACCESSORS.FLOOR_ID])) {
                rendering = false;
                return null;
            }

            return React.cloneElement(component, { ...customizedProps, ...actionMappedProps });
        }
    );
};

const LayoutElements = (props) => {
    const { state, dispatch } = useStateManager(props);
    const { onClickEachChild, onClickForAllItems, buildingData, className, style } = props;

    const childrenClickHandler = (title, key, callbackState, currentItem, restrictedActions, selectedItem) => {
        dispatch({
            type: ACTIONS.PUSH_INTO_STACK,
            payload: {
                component: (
                    <LayoutLevelColumn
                        {...restrictedActions}
                        title={title}
                        childrenCallBackValue={(props) => ({ level: String(props.type_name), ...props })}
                        onChildrenClick={(space, restrictedActions) => {
                            const currentKey = key + 1;

                            // Preserve current's id and number of column
                            stackMap.current[currentKey] = space[ACCESSORS.SPACE_ID];
                            countOfStack.current = currentKey;

                            const nativeHandler = () =>
                                childrenClickHandler(
                                    space[ACCESSORS.NAME],
                                    currentKey,
                                    (items) => {
                                        return items.spaces.filter(
                                            (item) => item[ACCESSORS.PARENT_SPACE] === space[ACCESSORS.SPACE_ID]
                                        );
                                    },
                                    space,
                                    restrictedActions
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
                        selectedItem={selectedItem}
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
                            // Preserve current's id and number of column
                            countOfStack.current = 1;
                            stackMap.current[1] = floor[ACCESSORS.FLOOR_ID];

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
                currentItem: {
                    [ACCESSORS.HAS_CHILDREN]: true,
                    ...buildingData,
                },
            },
        });
    }, []);

    const stackMap = useRef({});

    const countOfStack = useRef(0);
    const stackLength = Object.keys(state.stack).length;
    if (countOfStack.current < stackLength) {
        countOfStack.current = stackLength;
    }

    const putInStack = useCallback(
        (stackCount) => {
            // Using 2 because the first two levels are already remembered
            for (let i = 2; i < (stackCount || stackLength); i++) {
                const currentItem =
                    props.spaces.find((spaceData) => spaceData[ACCESSORS.SPACE_ID] === stackMap.current[i]) || {};

                childrenClickHandler(
                    currentItem[ACCESSORS.NAME],
                    i,
                    (items) => {
                        return items.spaces.filter((item) => item[ACCESSORS.PARENT_SPACE] === stackMap.current[i]);
                    },
                    currentItem,
                    //restriction maps
                    {},
                    // Id of selected item
                    stackMap.current[i + 1]
                );
            }
        },
        [countOfStack.current, countOfStack.current, props.spaces]
    );

    useEffect(() => {
        putInStack();
    }, [props.isLoadingLastColumn, countOfStack.current, props.spaces]);

    console.log(stackMap.current, 'stackmap');

    return (
        <div className={cx('layout-elements-wrapper d-flex', className)} style={style}>
            {renderStackColumns(state, props, stackMap)}
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
    actionsMap: PropTypes.object,
    isPathRemembered: PropTypes.bool,
};

export default LayoutElements;
