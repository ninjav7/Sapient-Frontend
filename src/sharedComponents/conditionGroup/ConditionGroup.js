import React from 'react';
import cx from 'classnames';
import './ConditionGroup.scss';
import { ReactComponent as ConditionCircleUnchecked } from '../../sharedComponents/assets/icons/condition-circle-unchecked.svg';
import { ReactComponent as ConditionCircleDisabled } from '../../sharedComponents/assets/icons/condition-circle-disabled.svg';
import { ReactComponent as ConditionCircleChecked } from '../../sharedComponents/assets/icons/condition-circle-checked.svg';
import { weekDays } from './constants';
import Typography from '../typography';

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
                        className={cx('condition-item', disabledClass, isSelectedClass)}>
                        {icon}
                        <Typography.Body size={Typography.Sizes.md} fontWeight={Typography.Types.Medium}>
                            {buttonItem.label}
                        </Typography.Body>
                    </div>
                );
            })}
        </div>
    );
};

export default ConditionGroup;
