import React, { useContext } from 'react';

import { LocationSelectorContext } from '../../LocationSelector';

import { ReactComponent as CheckedSVG } from '../../../assets/icons/checked-big.svg';
import { ListBase } from './ListBase';
import { Checkbox } from '../../../form/checkbox';

const LocationEquipmentItem = ({ label, equipment_id }) => {
    const { handleSelect, selected, isMulti, selectEquipment } = useContext(LocationSelectorContext);

    const handleClick = ({ selectedId }) => {
        handleSelect({ selectedId });
        selectEquipment({equipment_id: selectedId})
    };

    const isChecked = selected[equipment_id];

    return (
        <div className="location-selector-list-item equipment">
            {isMulti && (
                <Checkbox
                    checked={isChecked}
                    label={''}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleClick({ selectedId: equipment_id });
                    }}
                />
            )}
            <ListBase
                onClick={(event) => handleClick({ selectedId: equipment_id })}
                type="button"
                role="button"
                className="location-selector-list-item-button">
                {React.cloneElement(label)}
            </ListBase>
            {!isMulti && isChecked && <CheckedSVG />}
        </div>
    );
};

export { LocationEquipmentItem };
