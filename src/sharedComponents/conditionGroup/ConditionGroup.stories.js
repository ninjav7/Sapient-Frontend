import React, { useState } from 'react';

import ConditionGroup from './ConditionGroup';
import '../assets/scss/stories.scss';

export default {
    title: 'Components/ConditionGroup',
    component: ConditionGroup,
};

const selectedDays = ['mon', 'tue'];
const disabledItemsList = ['sat','sun'];

export const Default = (props) => {
    const [selectedItemsList, setSelectedItemsList] = useState(selectedDays);
    const [isDisabled, setIsDisabled] = useState();
    const handleButtonClick = (day) => {
        let preparedArr = [...selectedItemsList];
        if (selectedItemsList.includes(day)) {
            preparedArr = selectedItemsList.filter((e) => e !== day);
        } else {
            preparedArr.push(day);
        }
        setSelectedItemsList(preparedArr);
    };

    return (
        <>
            <h6>Primary</h6>
            <ConditionGroup
                handleButtonClick={(id) => handleButtonClick(id)}
                disabledItemsList={disabledItemsList}
                selectedItemsList={selectedItemsList}/>
        </>
    );
};

Default.args = {
    selectedDays: Array,
    disabledItemsList: Array,
    handleButtonClick: () => console.log('Clicked'),
};
