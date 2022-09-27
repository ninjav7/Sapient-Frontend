import React, { useContext, useEffect } from 'react';

import { LocationListItem } from '../items/LocationListItem';
import { LocationBadgeRooms } from '../common/LocationBadgeRooms';
import { LocationSelectorContext } from '../../LocationSelector';

import { LOCATION_LEVEL } from '../../constants';

import { spacesMock } from '../../mock';

const LocationFloors = (props) => {
    const { handleSelect, setSelectedMap, selectedFloors, selectAllSpaces } = useContext(LocationSelectorContext);

    const handleClick = ({ floor_id, name }) => {
        handleSelect({ level: LOCATION_LEVEL.FLOOR, floor: { id: floor_id, name } });
    };

    const handleClickCheckBox = ({ event, floor_id, name, isIndeterminate }) => {
        event.stopPropagation();
        
        selectAllSpaces({floor_id, name, isIndeterminate });
    };

    return (
        <div className="location-selector-list">
            {props.floors.map(({ floor_id, name, rooms }) => {
                const {isIndeterminate, isChecked } = selectedFloors({ floor_id });
                const toggleAll = (event) => {
                    handleClickCheckBox({ event, floor_id, name, isIndeterminate });
                };
                
                return (
                    <div key={floor_id}>
                        {JSON.stringify(selectedFloors({ floor_id }))}
                        <LocationListItem
                            isSelected={isChecked}
                            isIndeterminate={isIndeterminate}
                            key={floor_id}
                            label={<div>{name}</div>}
                            badge={<LocationBadgeRooms rooms={rooms} />}
                            onClick={() => handleClick({ floor_id, name })}
                            onClickCheckBox={toggleAll}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export { LocationFloors };
