import React, { useEffect, useState } from 'react';
import { Table } from '../../../table';
import { Checkbox } from '../../../form/checkbox';

const TableCellCheckBox = ({ onChange = () => {}, defaultChecked, ...props }) => {
    const [checked, setChecked] = useState(defaultChecked);

    const handleCheckboxChange = (event) => {
        setChecked(!checked);
        onChange(event);
    };

    useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    return (
        <Table.Cell width={16}>
            <Checkbox label={''} {...props} checked={checked} onChange={handleCheckboxChange} />
        </Table.Cell>
    );
};

export { TableCellCheckBox };
