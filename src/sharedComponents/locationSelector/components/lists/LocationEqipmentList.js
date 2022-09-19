import React, { useContext, useState } from 'react';

import Typography from '../../../typography';
import Brick from '../../../brick';

import { LocationEquipmentItem } from '../items/LocationEquipmentItem';
import { LocationSelectorContext } from '../../LocationSelector';

import { roomsMock } from '../../mock';
import { MenuListHeader } from '../common/MenuListHeader';

const LocationEqipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [room, setRoom] = useState({});

    const { selectedLevels, selectedEquipments } = useContext(LocationSelectorContext);

    const spaceId = selectedLevels.space.id;
    const floorId = selectedLevels.floor.id;
    const roomId = selectedLevels.room.id;

    useState(() => {
        const equipmentsData = roomsMock
            .find(({ floor_id, space_id }) => {
                return floor_id === floorId && spaceId === space_id;
            })
            .data.find(({ name: roomName }) => roomName === roomId).equipments;

        setEquipments(equipmentsData);


        setRoom(
            roomsMock
                .find(({ floor_id, space_id }) => {
                    return floor_id === floorId && spaceId === space_id;
                })
                .data.find(({ name: roomName }) => roomName === roomId)
        );
    }, []);

    return (
        <div>
            <MenuListHeader title={room.name} id={room.id} />

            <Brick />
            <div className="borders-bottom" />
            <Brick sizeInRem={0.5} />

            {equipments.map(({ end_use_name, equipment_id }) => (
                <LocationEquipmentItem
                    key={equipment_id}
                    equipment_id={equipment_id}
                    label={<div>{end_use_name}</div>}
                />
            ))}
        </div>
    );
};

export { LocationEqipmentList };
