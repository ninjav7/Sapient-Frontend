import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Brick from '../brick';
import Input from '../form/input/Input';

import SearchSVG from '../assets/icons/search.svg';
import { ReactComponent as PlusSVG } from '../assets/icons/plus.svg';
import { Button } from '../button';

import './TableFilterWidget.scss';
import Select from "../form/select";

const TableFilterWidget = ({ children }) => {
    return (
        <div className="TableFilterWidget-wrapper">
            <div className="TableFilterWidget-filters">
                <Input iconUrl={SearchSVG} />
                <Button label="Add Filter" type={Button.Type.SecondaryGrey} size={Button.Sizes.md} icon={<PlusSVG />} />
                <Select options={[{label: 'Columns', value: 'Columns'}]} defaultValue='Columns' />
            </div>
            <Brick sizeInRem={1} />
            {children}
        </div>
    );
};

TableFilterWidget.propTypes = {};

export default TableFilterWidget;
