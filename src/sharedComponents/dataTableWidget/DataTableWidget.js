import React, { useCallback, useEffect, useState, useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Table } from '../table';
import { DropDownIcon } from '../dropDowns/dropDownButton';
import Typography from '../typography';
import Brick from '../brick';
import { TimeFrameSelector } from '../timeFrameSelector';
import Pagination from '../pagination/Pagination';
import { DownloadButton } from './components/DownloadButton';

import { Filters } from './components/Filters';
import { DraggableColumns } from './components/DraggableColumns';
import { TableCellCheckBox } from './components/TableComponents/TableCellCheckBox';
import { MenuListPerRow } from './components/TableComponents/MenuListPerRow';

import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage/useLocalStorage';
import {
    arrayMoveImmutable,
    generateID,
    getStatesForSelectAllCheckbox,
    stringOrNumberPropTypes,
} from '../helpers/helper';

import { FILTER_TYPES, LOCAL_STORAGE, SORT_TYPES } from './constants';
import { ReactComponent as ArrowSortSVG } from '../assets/icons/arrow-sort.svg';

import './DataTableWidget.scss';

export const DataTableWidgetContext = React.createContext({});

export const initialFilterState = {
    [FILTER_TYPES.LAST_UPDATED_SELECTOR]: {
        active: 'more-than',
        'within-the-last': {
            value: '0',
            period: 'minutes',
        },
        'more-than': {
            value: '0',
            period: 'minutes ago',
        },
        'date-range': {
            period: { ...TimeFrameSelector.options[0] },
            rangeDate: TimeFrameSelector.options[0].moment(),
        },
    },
    [FILTER_TYPES.RANGE_SELECTOR]: [0, 100],
    [FILTER_TYPES.MULTISELECT]: [],
};

const DataTableWidget = (props) => {
    const [excludedHeaderLocalStorage, setExcludedHeadersLocalStorage] = useLocalStorage(
        `${LOCAL_STORAGE.EXCLUDED_HEADERS}${props.id && '-' + props.id}`,
        []
    );
    const [orderHeaders, setOrderHeaders] = useLocalStorage(
        `${LOCAL_STORAGE.ORDER_HEADERS}${props.id && '-' + props.id}`,
        []
    );

    const orderedHeaders = [...props.headers].sort(function (a, b) {
        return (
            orderHeaders.findIndex(({ name }) => name === a.name) -
            orderHeaders.findIndex(({ name }) => name === b.name)
        );
    });

    const [headers, setHeaders] = useState(orderedHeaders || props.headers);
    const [excludedHeaders, setExcludedHeaders] = useState(excludedHeaderLocalStorage || []);

    const [rows, setRows] = useState(props.rows);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchedRows, setSearchedRows] = useState([]);

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedFiltersValues, setSelectedFiltersValues] = useState(_.cloneDeep(initialFilterState));

    const [search, setSearch] = useState('');
    const [searchMode, setSearchMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(props.currentPage || 0);
    const [pageSize, setPageSize] = useState(props.pageSize || 20);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setHeaders((items) => arrayMoveImmutable(items, oldIndex, newIndex));
    };

    const handleDeleteFilter = ({ value, filterType }) => {
        //reset filter's value to default state
        setSelectedFiltersValues((oldState) => {
            return { ...oldState, [filterType]: initialFilterState[filterType] };
        });

        setSelectedFilters((oldState) => {
            return [...oldState.filter((filter) => filter.value !== value)];
        });
    };

    const handleCheckboxChange = (event, id) => {
        const checked = event.target.checked;
        setSelectedRows((oldState) => {
            return checked ? [...oldState, id] : oldState.filter((item) => item !== id);
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        props.onChangePage(page);
    };

    const handlePageSize = (pageSize) => {
        setPageSize(pageSize);
        props.onPageSize(pageSize);
    };

    const stateSelectAll = getStatesForSelectAllCheckbox(selectedRows, rows);
    const selectAll = {
        onChange: (event) => {
            const checked = event.target.checked;
            setSelectedRows(checked ? _.map(rows, 'id') : []);
            props.onCheckAll && props.onCheckAll(checked);
        },
        defaultChecked: stateSelectAll.checked,
        indeterminate: stateSelectAll.indeterminate,
    };

    const filteredHeaders = headers.filter(({ name }) => !excludedHeaders.includes(name));

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setCurrentPage(props.currentPage || 0);
    }, [props.currentPage]);

    useEffect(() => {
        const isEmptySearch = _.isEmpty(debouncedSearch);

        setSearchMode(!isEmptySearch);
        props.onSearch && props.onSearch(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        setOrderHeaders(headers);
    }, [headers]);

    useEffect(() => {
        setExcludedHeadersLocalStorage(excludedHeaders);
    }, [excludedHeaders]);

    useEffect(() => {
        setSearchedRows(props.searchResultRows);
    }, [props.searchResultRows]);

    useEffect(() => {
        setRows(props.rows);
    }, [props.rows]);

    // Probably we need just hide all filters by default and show them then use props directly without save them in state, it will be like
    // link to object, but in this case to props (props.filterOptions) object, by this way we will avoid recalclation and therefore
    // we won't need this useEffect.
    useEffect(() => {
        setSelectedFilters((prevState) => {
            return prevState?.map((filter) => {
                const newFilter = props.filterOptions.find(({ value }) => value === filter.value);
                return newFilter ? newFilter : filter;
            });
        });
    }, [JSON.stringify(props.filterOptions)]);

    useEffect(() => {
        props.filters?.selectedFilters && setSelectedFilters([]);
    }, [props.filters]);

    const cellChildrenTemplate = useCallback((children) => {
        return React.isValidElement(props.customComponentForCells) ? (
            React.cloneElement(props.customComponentForCells, { children, ...props.customComponentForCells.props })
        ) : (
            <Typography.Body size={Typography.Sizes.md}>{children}</Typography.Body>
        );
    }, []);

    const cellCheckboxTemplate = useCallback(
        (rowId) => (
            <TableCellCheckBox
                onChange={(event) => handleCheckboxChange(event, rowId)}
                defaultChecked={selectedRows.includes(rowId)}
            />
        ),
        [selectedRows]
    );

    const currentRows = searchMode ? searchedRows : rows;

    const isActionsAvailable = props.onDeleteRow || props.onEditRow;

    const HeadComponent = ({ onSort, name, accessor, ...props }) => {
        const [state, setState] = useState(0);

        const cellProps = {
            onClick:
                onSort &&
                (() => {
                    setState((prevState) => {
                        if (state === 2) {
                            onSort(SORT_TYPES[0], accessor, name);
                            return 0;
                        }
                        onSort(SORT_TYPES[prevState + 1], accessor, name);
                        return prevState + 1;
                    });
                }),
            role: onSort && 'button',
            className: cx(SORT_TYPES[state], SORT_TYPES[state] !== null && 'sort-type-selected', onSort && 'on-sort'),
            ...props,
        };

        return (
            <Table.Cell {...cellProps}>
                <div className="d-flex justify-content-between align-items-center">
                    <Typography.Subheader size={Typography.Sizes.sm}>{name}</Typography.Subheader>
                    {onSort && SORT_TYPES[state] && <ArrowSortSVG className={state === 2 && 'rotate-180'} />}
                </div>
            </Table.Cell>
        );
    };

    const memoizedHeaders = useMemo(() => {
        return filteredHeaders.map(({ name, onSort, accessor, cellProps }, index) => (
            <HeadComponent name={name} onSort={onSort} accessor={accessor} {...cellProps} key={index} />
        ));
    }, [JSON.stringify(filteredHeaders)]);

    return (
        <DataTableWidgetContext.Provider
            value={{
                selectedFiltersValues,
                setSelectedFiltersValues,
                excludedHeaders,
                setExcludedHeaders,
                widgetProps: props,
                search,
                setSearch,
            }}>
            <div className="data-table-widget-wrapper">
                <div className="table-filter-widget-wrapper d-flex">
                    <Filters
                        selectedFiltersValues={selectedFiltersValues}
                        onChangeFilterValue={setSelectedFiltersValues}
                        onChange={setSelectedFilters}
                        filterOptions={props.filterOptions}
                        selectedFilters={selectedFilters}
                        onDeleteFilter={handleDeleteFilter}
                    />
                    <div className="ml-auto data-table-widget-action-button-wrapper">
                        <DraggableColumns onSortEnd={onSortEnd} headers={headers} />
                        {props.onDownload && <DownloadButton onClick={props.onDownload} />}
                    </div>
                </div>

                <Brick sizeInRem={1} />

                {!!filteredHeaders.length ? (
                    <Table>
                        <Table.THead>
                            {/*//@ It is probably need to improve custom checkbox to make it generic*/}
                            {props.onCheckAll &&
                                (props.customCheckAll ? (
                                    <Table.Cell>{props.customCheckAll(selectAll)}</Table.Cell>
                                ) : (
                                    <TableCellCheckBox {...selectAll} />
                                ))}

                            {!props.onCheckAll && props.customCheckAll && (
                                <>
                                    <Table.Cell>{props.customCheckAll(selectAll)}</Table.Cell>
                                </>
                            )}

                            {memoizedHeaders}

                            {isActionsAvailable && (
                                <Table.Cell>
                                    <Typography.Subheader size={Typography.Sizes.sm}>Actions</Typography.Subheader>
                                </Table.Cell>
                            )}
                        </Table.THead>
                        <Table.TBody>
                            {props.isLoading &&
                                props.isLoadingComponent &&
                                React.cloneElement(props.isLoadingComponent, { ...props.isLoadingComponent.props })}

                            {!props.isLoading &&
                                currentRows.map((row) => {
                                    let isDeletable = props?.isDeletable && props?.isDeletable(row);

                                    const menuListPerRowProps = {};
                                    if (props.onEditRow) {
                                        menuListPerRowProps.onEditRow = (event) =>
                                            props.onEditRow(event, row.id, row, props);
                                    }
                                    if (props.onDeleteRow && isDeletable) {
                                        menuListPerRowProps.onDeleteRow = (event) =>
                                            props.onDeleteRow(event, row.id, row, props);
                                    }
                                    return (
                                        <Table.Row {...(row.rowProps || {})} key={generateID()}>
                                            {props.onCheckboxRow &&
                                                //@ It is probably need to improve custom checkbox to make it generic
                                                (props.customCheckboxForCell ? (
                                                    <Table.Cell width={16}>
                                                        {props.customCheckboxForCell(row)}
                                                    </Table.Cell>
                                                ) : (
                                                    cellCheckboxTemplate(row.id)
                                                ))}

                                            {!props.onCheckboxRow && props.customCheckboxForCell && (
                                                <Table.Cell width={16}>{props.customCheckboxForCell(row)}</Table.Cell>
                                            )}

                                            {filteredHeaders.map(({ accessor, callbackValue, cellProps }) => {
                                                return (
                                                    <Table.Cell {...cellProps} key={accessor}>
                                                        {accessor &&
                                                            (callbackValue
                                                                ? callbackValue(row, cellChildrenTemplate)
                                                                : cellChildrenTemplate(row[accessor] || '-'))}

                                                        {!accessor &&
                                                            callbackValue &&
                                                            callbackValue(row, cellChildrenTemplate, accessor)}
                                                    </Table.Cell>
                                                );
                                            })}

                                            {isActionsAvailable && (
                                                <Table.Cell align="center" width={36}>
                                                    <div className="d-flex justify-content-center">
                                                        <DropDownIcon classNameMenu="data-table-widget-drop-down-button-menu">
                                                            <MenuListPerRow {...menuListPerRowProps} />
                                                        </DropDownIcon>
                                                    </div>
                                                </Table.Cell>
                                            )}
                                        </Table.Row>
                                    );
                                })}
                            {!props.isLoading && currentRows.length === 0 && (
                                <>
                                    <Table.Row>
                                        <Table.Cell colSpan={10}>
                                            <Typography.Subheader
                                                className="text-center p-3"
                                                size={Typography.Sizes.md}>
                                                <span className="gray-550">No data.</span>
                                            </Typography.Subheader>
                                        </Table.Cell>
                                    </Table.Row>
                                </>
                            )}
                        </Table.TBody>
                    </Table>
                ) : (
                    <Typography.Subheader size={Typography.Sizes.lg} className="text-center">
                        <span className="gray-800">Select at least one "Header".</span>
                    </Typography.Subheader>
                )}
            </div>
            <Brick sizeInRem={1.25} />
            {props.onPageSize && props.onChangePage && (
                <div className="d-flex justify-content-center">
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={props.totalCount}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        setPageSize={handlePageSize}
                        pageListSizes={props.pageListSizes}
                    />
                </div>
            )}
        </DataTableWidgetContext.Provider>
    );
};

DataTableWidget.SortTypes = SORT_TYPES;

DataTableWidget.propTypes = {
    onDownload: PropTypes.func,
    onSearch: PropTypes.func,
    onDeleteRow: PropTypes.func,
    isDeletable: PropTypes.func,
    onEditRow: PropTypes.func,
    onChangePage: PropTypes.func,
    totalCount: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    onPageSize: PropTypes.func,
    //@TODO More generic func, now it is not important
    onStatus: PropTypes.func,
    status: PropTypes.number,
    rows: PropTypes.array.isRequired,
    searchResultRows: PropTypes.array.isRequired,
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            filterType: PropTypes.oneOf(Object.values(FILTER_TYPES)),
            filterOptions: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: stringOrNumberPropTypes.isRequired,
                })
            ),
            // Props depend on what component was selected for particular filter.
            componentProps: PropTypes.object,
            isOpened: PropTypes.bool,
        })
    ),
    headers: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            callbackValue: PropTypes.func,
            onSort: PropTypes.func,
        })
    ),
    onCheckboxRow: PropTypes.func,
    onCheckAll: PropTypes.func,
    id: PropTypes.string,
    buttonGroupFilterOptions: PropTypes.array,
    customComponentForCells: PropTypes.node,
    customCheckboxForCell: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    customCheckAll: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    isLoadingComponent: PropTypes.node.isRequired,
    isLoading: PropTypes.bool.isRequired,
    filters: PropTypes.shape({
        selectedFilters: PropTypes.object,
        selectedFiltersValues: PropTypes.object,
    }),
};

export default DataTableWidget;
