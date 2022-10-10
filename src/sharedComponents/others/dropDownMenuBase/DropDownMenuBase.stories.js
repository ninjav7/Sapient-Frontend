import React from 'react';
import DropDownMenuBase from './DropDownMenuBase';
import '../../assets/scss/stories.scss';
import DropDownListItem from '../dropDownListItem/DropDownListItem';
import Brick from '../../brick';

export default {
    title: 'Others/DropDownMenuBase',
    component: DropDownMenuBase,
};

export const Default = (props) => {
    return (
        <>
            <h5>Dropdown list item </h5>
            <DropDownListItem labelText={'Text'} />

            <Brick />

            <h5>Menu base with list</h5>
            <DropDownMenuBase {...props} />
        </>
    );
};

Default.args = {
    lists: [
        { labelText: 'Select All', border: true, labelClassName: 'gray-800' },
        { labelText: 'Small Office' },
        { labelText: 'Large Office' },
        { labelText: 'Retail Store' },
    ],
};
