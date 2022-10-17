import React, { useState } from 'react';
import DataTableWidget from './DataTableWidget';
import '../assets/scss/stories.scss';

export default {
    title: 'Widgets/DataTableWidget',
    component: DataTableWidget,
};

export const Default = (props) => {
    const [searchResultRows, setSearchResultRows] = useState([]);

    const handleSearchChange = (query) => {
        if (!query) {
            return setSearchResultRows([]);
        }

        setSearchResultRows(
            props.rows.filter(({ name, description }) => name.includes(query) || description.includes(query))
        );
    };

    return <DataTableWidget {...props} onSearch={handleSearchChange} searchResultRows={searchResultRows} />;
};

Default.args = {
    onDownload: () => alert('Download file'),
    onSearch: (query) => alert(query),
    onDeleteRow: (event, id) => alert('Delete ' + id),
    onEditRow: (event, id) => alert('Edit ' + id),
    onChangePage: (query) => alert('Page: ' + query),
    onPageSize: (query) => alert('Per page ' + query),
    onStatus: (query) => alert('Status changed to: ' + query),
    totalPages: 90,
    headers: [
        { name: 'Name', accessor: 'name' },
        { name: 'Description', accessor: 'description' },
        { name: 'Location', accessor: 'location' },
        { name: 'Breakers', accessor: 'breakers' },
        { name: 'Socket Count', accessor: 'socketCount' },
    ],
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
