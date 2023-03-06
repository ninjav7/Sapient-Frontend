import React, { useRef, useState } from 'react';
import DataTableWidget from './DataTableWidget';
import '../assets/scss/stories.scss';
import { FILTER_TYPES } from './constants';
import { Button } from '../button';

export default {
    title: 'Widgets/DataTableWidget',
    component: DataTableWidget,
};

export const Default = (props) => {
    const [searchResultRows, setSearchResultRows] = useState([]);
    const [filtersValues, setFiltersValues] = useState({});

    const handleSearchChange = (query) => {
        if (!query) {
            return setSearchResultRows([]);
        }

        setSearchResultRows(
            props.rows.filter(({ name, description }) => name.includes(query) || description.includes(query))
        );
    };

    const resetFilters = () => {
        setFiltersValues({
            selectedFilters: [],
        });
    };

    return (
        <>
            <DataTableWidget
                {...props}
                filters={filtersValues}
                onSearch={handleSearchChange}
                searchResultRows={searchResultRows}
            />
            <hr />
            <Button type={Button.Type.primary} label={'Reset Filters'} onClick={resetFilters} />
        </>
    );
};

Default.args = {
    filterOptions: [
        {
            label: 'Energy Consumption',
            value: 'consumption',
            placeholder: 'All Energy Consumption',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: [
                { label: 'Label 1', value: 1 },
                { label: 'Label 2', value: 2 },
                { label: 'Label 3', value: 3 },
            ],
            //Add any props you need for filter component
            componentProps: {
                isSearchable: true,
            },
        },
        {
            label: 'Total Consumption',
            value: 'totalConsumption',
            placeholder: 'All Energy Consumption',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: [
                { label: 'Label 1', value: 12 },
                { label: 'Label 2', value: 21 },
                { label: 'Label 3', value: 31 },
            ],
            onChange: (options) => alert('FilterChanged: onClick ' + JSON.stringify(options)),
        },
        {
            label: 'Test',
            value: 'totalConsumptiontest',
            placeholder: 'All tests',
            filterType: FILTER_TYPES.MULTISELECT,
            filterOptions: [
                { label: 'Label 1', value: 12 },
                { label: 'Label 2', value: 21 },
                { label: 'Label 3', value: 31 },
            ],
            onClose: (options) => alert('FilterChanged onClose : ' + JSON.stringify(options)),
        },
        {
            label: 'Range Slider',
            value: 'totalRange',
            placeholder: 'All Ranges',
            filterType: FILTER_TYPES.RANGE_SELECTOR,
            filterOptions: [20, 100],
            componentProps: {
                prefix: '%',
                min: 0,
                max: 120,
                // We need specify callback if we want use Trends Filter Buttons.
                withTrendsFilter: true,
                handleButtonClick: (...args) => console.log(args),
            },
            onChange: (...args) => console.log(args),
            onClose: (options) => alert('FilterChanged onClose : ' + JSON.stringify(options)),
        },
    ],
    onDownload: () => alert('Download file'),
    onSearch: (query) => alert(query),
    onDeleteRow: (event, id) => alert('Delete ' + id),
    onEditRow: (event, id) => alert('Edit ' + id),
    onChangePage: (query) => alert('Page: ' + query),
    onPageSize: (query) => alert('Per page ' + query),
    onStatus: (query) => alert('Status changed to: ' + query),
    totalCount: 90,
    currentPage: 1,
    headers: [
        {
            name: 'Name',
            accessor: 'name',
            onSort: (type, accessor, name) => alert(`Type: ${type}, Accessor: ${accessor}, Name: ${name}`),
        },
        {
            name: 'Description',
            accessor: 'description',
            onSort: (type, accessor, name) => alert(`Type: ${type}, Accessor: ${accessor}, Name: ${name}`),
        },
        { name: 'Location', accessor: 'location' },
        { name: 'Breakers', accessor: 'breakers' },
        { name: 'Socket Count', accessor: 'socketCount', cellProps: { width: 180 } },
    ],
    //@TODO Likely should be refactored
    //For demo purposes, here are added two handlers with specific id's
    isEditable: ({id}) => id !== '63194b735d86669cdae8da67',
    isDeletable: ({id}) => id !== '63194b735d86669cdae8da67',
    /****/
    rows: [
        {
            id: '63194b735d86669cdae8da67',
            name: 'Test 10101',
            identifiers: null,
            description: 'as',
            is_active: false,
            action: [],
            breakers: 'Weekdays',
            socketCount: 15,
            rowProps: {
                style: { height: 53 },
            },
        },
        {
            id: '632b0bf3142672f801c84318',
            name: 'First Test Rule',
            identifiers: null,
            description: 'Turn off at 2:15PM, Turn on at 2:30PM M-F',
            is_active: false,
            action: [],
            breakers: 'All Days',
            socketCount: 88,
        },
        {
            id: '632b0bf042c9f857a5c5dbd0',
            name: '',
            identifiers: null,
            description: '',
            is_active: false,
            action: [],
        },
    ],
};
