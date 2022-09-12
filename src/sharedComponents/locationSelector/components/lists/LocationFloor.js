import React, { useContext, useEffect, useState } from 'react';

import Typography from '../../../typography';
import Brick from '../../../brick';

import { LocationListItem } from '../items/LocationListItem';
import { LocationBadgeRooms } from '../common/LocationBadgeRooms';
import { LocationSelectorContext } from '../../LocationSelector';

import { LOCATION_LEVEL } from '../../constants';

import { spacesMock, floorsMock, roomsMock } from '../../mock';
import { MenuListHeader } from '../common/MenuListHeader';
import { selectedItem } from '../../helpers/helpers';
import { spaceId } from '../../../../store/globalState';

const LocationFloor = () => {
    const [floor, setFloor] = useState({});

    const { selectedLevels, handleSelect, selectedRooms, selectedMap, helpers, selectAllRooms } = useContext(LocationSelectorContext);

    const floorId = selectedLevels.floor.id;
    const { fetchFloorById } = helpers;

    useEffect(() => {
        const floorsData = fetchFloorById(floorId);
        setFloor(floorsData);
    }, []);

    const handleClick = ({ spaceId, name }) => {
        handleSelect({ level: LOCATION_LEVEL.SPACE, space: { id: spaceId, name } });
    };

    const handleClickCheckBox = ({ event, spaceId, name }) => {
        event.stopPropagation();
        selectAllRooms({spaceId, floorId})
    };

    const isSelectedSpace = (spaceId) => {
        return !!selectedItem({ selectedMap, spaceId, floorId });
    };
    
    const isIndeterminate = () => {
        
    }

    console.log(selectedRooms({ floor_id: floorId, space_id: spaceId }));

    return (
        <div>
            <MenuListHeader title={floor.name} badge={floor.rooms} id={floor.id} />

            <Brick />
            <div className="borders-bottom" />
            <Brick sizeInRem={0.5} />

            <div className="location-selector-list">
                {spacesMock.data
                    .filter(({ parents }) => parents === floorId)
                    .map(({ _id, name, rooms }) => {
                        return (
                            <LocationListItem
                                // isIndeterminate={!isSelectedSpace(_id)}
                                isSelected={isSelectedSpace(_id)}
                                onClick={() => handleClick({ spaceId: _id, name })}
                                onClickCheckBox={(event) => {
                                    handleClickCheckBox({ event, spaceId: _id, name });
                                }}
                                key={_id}
                                label={<div>{name}</div>}
                                badge={<LocationBadgeRooms rooms={rooms} />}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export { LocationFloor };
