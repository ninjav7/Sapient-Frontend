import React from 'react';

import { LocationFloor } from '../lists/LocationFloor';
import { LocationRoomsList } from '../lists/LocationRoomsList';
import { LocationEqipmentList } from '../lists/LocationEqipmentList';
import { LocationFloors } from '../lists/LocationFloors';

import { floorsMock } from '../../mock';
import { LOCATION_LEVEL } from '../../constants';

const ListMenu = ({ level }) => {
    const { FLOOR, SPACE, ROOM, BUILDIND } = LOCATION_LEVEL;

    switch (level) {
        case FLOOR: {
            return <LocationFloor />;
        }
        case SPACE: {
            return <LocationRoomsList />;
        }
        case ROOM: {
            return <LocationEqipmentList />;
        }
        case BUILDIND:
        default: {
            return <LocationFloors floors={floorsMock.data} />;
        }
    }
};

export { ListMenu };
