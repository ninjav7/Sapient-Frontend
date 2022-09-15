import React from 'react';

import { ReactComponent as ArrowRightSVG } from '../../../assets/icons/arrow-right.svg';
import { Checkbox } from '../../../form/checkbox';
import { ListBase } from './ListBase';

const LocationListItem = ({ label, badge, onClick, onClickCheckBox, isSelected = false, isIndeterminate }) => {
    return (
        <ListBase className="location-selector-list-item" onClick={onClick}>
            <Checkbox readOnly label={''} onClick={onClickCheckBox} checked={isSelected} indeterminate={isIndeterminate} onChange={() => {}} />
            {React.cloneElement(label)}
            <div className="ml-auto mr-0">
                {React.cloneElement(badge)}
                <ArrowRightSVG />
            </div>
        </ListBase>
    );
};

export { LocationListItem };
