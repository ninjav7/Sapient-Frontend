import React from 'react';
import PropTypes from 'prop-types';

import Brick from '../brick';
import Input from '../form/input/Input';
import { Button } from '../button';
import Select from '../form/select';

import SearchSVG from '../assets/icons/search.svg';
import { ReactComponent as PlusSVG } from '../assets/icons/plus.svg';

import './TableFilterWidget.scss';

const TableFilterWidget = ({ children, columns = [], onSelectColumn, selectedColumns }) => {
    return (
        <div className="TableFilterWidget-wrapper">
            <div className="TableFilterWidget-filters">
                <Input iconUrl={SearchSVG} />
                <Button label="Add Filter" type={Button.Type.SecondaryGrey} size={Button.Sizes.md} icon={<PlusSVG />} />
                <Select.MultiSelect
                    label="Columns"
                    options={columns}
                    onChange={onSelectColumn}
                    className="TableFilterWidget-columns"
                    value={selectedColumns}
                />
            </div>
            <Brick sizeInRem={1} />
            {children}
        </div>
    );
};

const optionType = PropTypes.arrayOf(
    PropTypes.exact({
        label: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired
);

TableFilterWidget.propTypes = {
    columns: optionType,
    onSelectColumn: PropTypes.func.isRequired,
    selectedColumns: optionType,
};

export default TableFilterWidget;
