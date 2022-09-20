import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash'

import Typography from '../../../typography';
import Brick from '../../../brick';

import { LocationListItem } from '../items/LocationListItem';
import { LocationBadgeRooms } from '../common/LocationBadgeRooms';
import { LocationSelectorContext } from '../../LocationSelector';

import { roomsMock, spacesMock } from '../../mock';

import { LOCATION_LEVEL } from '../../constants';
import { MenuListHeader } from '../common/MenuListHeader';

const LocationRoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [space, setSpace] = useState({});

    const { selectedLevels, handleSelect, selectedMap, helpers, selectAllEquipments  } = useContext(LocationSelectorContext);
    const {fetchRoomByFloorIdAndSpaceId, fetchSpacesById} = helpers
    
    const spaceId = selectedLevels.space.id;
    const floorId = selectedLevels.floor.id;

    useEffect(() => {
        const roomsData =
            fetchRoomByFloorIdAndSpaceId({ floor_id: floorId, space_id: spaceId })?.data || [];
        setRooms(roomsData);

        setSpace(fetchSpacesById(spaceId));
    }, []);

    const handleClick = ({ roomId, name }) => {
        handleSelect({ level: LOCATION_LEVEL.ROOM, room: { id: roomId, name } });
    };
    
    const handleClickCheckBox = ({event, spaceId: _id, name, roomId}) => {
        event.stopPropagation();
        selectAllEquipments({floorId, spaceId, name, roomId});
    }

   

    const isSelected = ({id}) => {
        try {
           return !!selectedMap.floors[floorId].spaces.find(({ _id }) => _id === spaceId).rooms.find(({name}) => id === name);
        } catch (e) {
         
        }
    }
    
    return (
        <>
            <MenuListHeader badge={rooms.length} title={space.name} id={space.id} />

            <Brick />
            <div className="borders-bottom" />
            <Brick sizeInRem={0.5} />

            {rooms.map(({ name, equipments }) => {
                return (
                    <LocationListItem
                        isSelected={isSelected({id: name})}
                        onClickCheckBox={(event) => {
                            handleClickCheckBox({ event, roomId: name, name });
                        }}
                        onClick={() => handleClick({ roomId: name, name })}
                        key={name}
                        label={<div>{name}</div>}
                        badge={<LocationBadgeRooms rooms={equipments.length} />}
                    />
                );
            })}
        </>
    );
};

export { LocationRoomsList };
