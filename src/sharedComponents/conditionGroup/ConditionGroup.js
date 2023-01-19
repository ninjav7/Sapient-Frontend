import React from 'react';
import classNames from 'classnames';
import './ConditionGroup.scss';
import { ReactComponent as ConditionCircleUnchecked } from '../../sharedComponents/assets/icons/condition-circle-unchecked.svg';
import { ReactComponent as ConditionCircleDisabled } from '../../sharedComponents/assets/icons/condition-circle-disabled.svg';
import { ReactComponent as ConditionCircleChecked } from '../../sharedComponents/assets/icons/condition-circle-checked.svg';

import Typography from '../typography';

const weekDays = [
    { label: 'Mo', value: 'mon' },
    { label: 'Tu', value: 'tue' },
    { label: 'We', value: 'wed' },
    { label: 'Th', value: 'thr' },
    { label: 'Fr', value: 'fri' },
    { label: 'Sa', value: 'sat' },
    { label: 'Su', value: 'sun' },
];

const ConditionGroup = ({ selectedItemsList, handleButtonClick, disabledItemsList }) => {
    return (
        <div className="condition-group-wrapper">
            {weekDays.map((buttonItem, i) => {
                const isDisabledDay = disabledItemsList && disabledItemsList.includes(buttonItem.value) ? true : false;
                const disabledClass = isDisabledDay ? 'disabled' : null;
                const isSelectedDay = selectedItemsList && selectedItemsList.includes(buttonItem.value);
                const isSelectedClass = !isDisabledDay && isSelectedDay ? 'selected' : null;
                const icon = isDisabledDay ? (
                    <ConditionCircleDisabled />
                ) : isSelectedDay ? (
                    <ConditionCircleChecked />
                ) : (
                    <ConditionCircleUnchecked />
                );
                return (
                    <div
                        key={i}
                        onClick={() => !isDisabledDay && handleButtonClick(buttonItem.value)}
                        className={classNames('condition-item', disabledClass, isSelectedClass)}>
                        {icon}
                        <Typography.Body size={Typography.Sizes.md}>{buttonItem.label}</Typography.Body>
                    </div>
                );
            })}
        </div>
    );
};

export default ConditionGroup;
