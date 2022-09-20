import { useEffect, useState } from 'react';
import _ from 'lodash';

import { LOCATION_LEVEL } from '../constants';

import { floorsMock, roomsMock, spacesMock } from '../mock';

const useStateManager = (props) => {
    const { FLOOR, SPACE, ROOM, BUILDIND } = LOCATION_LEVEL;

    const [selected, setSelected] = useState({});

    const [level, setLevel] = useState(props.level);
    const [floor, setFloor] = useState({});
    const [space, setSpace] = useState({});
    const [room, setRoom] = useState({});
    const [selectedMap, setSelectedMap] = useState({});

    const handleSelect = ({ level, floor, space, room, selectedId }) => {
        if (level) {
            setLevel(level);
        }

        if (floor) {
            setFloor(floor);
        }

        if (space) {
            setSpace(space);
        }

        if (room) {
            setRoom(room);
        }
    };

    const handleBreadCrumbsSelect = ({ level }) => {
        if (level === BUILDIND) {
            setFloor({});
            setRoom({});
            setSpace({});
        }

        if (level === FLOOR) {
            setRoom({});
            setSpace({});
        }

        if (level === SPACE) {
            setRoom({});
        }
    };

    //helpers
    const getFloorById = (floor_id) => selectedMap.floors[floor_id];
    const getSpacesByFloorId = (floor_id) => selectedMap.floors[floor_id].spaces;
    const getSpaceByIdAndFloorId = ({ space_id, floor_id }) =>
        selectedMap.floors[floor_id].spaces.find((space) => space_id === space._id);
    const getRoomByIdAndSpaceIdAndFloorId = ({ roomId, space_id, floor_id }) =>
        getSpaceByIdAndFloorId({ space_id, floor_id })?.rooms?.find(({ name }) => name === roomId);

    const getAmountOfSpacesByFloorId = (floor_id) => Object.keys(getSpacesByFloorId(floor_id)).length;

    const fetchAmountOfEquipmentsByFloorIdAndSpaceId = ({ floor_id, space_id }) =>
        fetchRoomByFloorIdAndSpaceId({ floor_id, space_id })?.data.length;
    const fetchSpacesByFloorId = (floor_id) => spacesMock.data.filter(({ parents }) => floor_id === parents);
    const fetchSpaceById = (spaceId) => spacesMock.data.find(({ _id }) => _id === spaceId);
    const fetchRoomByFloorIdAndSpaceId = ({ space_id, floor_id }) =>
        roomsMock.find((room) => room.space_id === space_id && room.floor_id === floor_id);
    const fetchRoomByIdAndSpaceIdAndFloorId = ({ roomId, space_id, floor_id }) =>
        fetchRoomByFloorIdAndSpaceId({ space_id, floor_id }).data.find(({ name }) => name === roomId);
    const fetchRoomsBySpaceId = ({ spaceId }) =>
        roomsMock.find(({ floor_id, space_id }) => {
            return spaceId === space_id;
        })?.data;
    const fetchSpaceWithRoomsByFloorIdAndSpaceId = ({ floorId, spaceId }) =>
        spacesMock.data
            .filter(({ parents, _id }) => parents === floorId && spaceId === _id)
            .map((space) => {
                const rooms = roomsMock.find(({ floor_id, space_id }) => {
                    return spaceId === space._id && floor_id === space.parents;
                })?.data;

                return {
                    ...space,
                    rooms: rooms,
                };
            });
    const fetchAllSpacesWithRoomsByFloorId = ({ floor_id, space_id }) =>
        spacesMock.data
            .filter(({ parents }) => parents === floor_id)
            .map((space) => {
                const rooms = roomsMock.find(({ floor_id, space_id }) => {
                    return space_id === space._id && floor_id === space.parents;
                });

                return {
                    ...space,
                    rooms: rooms?.data,
                };
            });
    const fetchFloorById = (floorId) => floorsMock.data.find(({ floor_id }) => floor_id === floorId);

    const selectedFloors = ({ floor_id }) => {
        if (!selectedMap.floors || !getFloorById(floor_id)) {
            return { isChecked: false, isIndeterminate: false };
        }

        const amountOfSelectedFloors = getAmountOfSpacesByFloorId(floor_id);
        const spacesOfCurrentFloor = fetchSpacesByFloorId(floor_id);

        //selected all
        const isChecked = amountOfSelectedFloors === spacesOfCurrentFloor.length;
        const isIndeterminate = amountOfSelectedFloors > 0 && !isChecked;

        return {
            isChecked,
            isIndeterminate,
        };
    };

    const selectedSpaces = ({ floor_id, space_id }) => {
        if (!selectedMap.floors || !selectedMap.floors[floor_id]) {
            return { isChecked: false, isIndeterminate: false };
        }

        const currentSpace = getSpaceByIdAndFloorId({ floor_id, space_id });

        //selected all
        const isChecked = currentSpace?.rooms?.length;
        const isIndeterminate = currentSpace?.rooms?.length > fetchSpacesByFloorId(floor_id).length && !isChecked;

        return {
            isChecked,
            isIndeterminate,
        };
    };

    const selectedRooms = ({ floor_id, space_id }) => {
        if (!selectedMap.floors || !selectedMap.floors[floor_id]) {
            return { isChecked: false, isIndeterminate: false };
        }

        const currentSpace = getSpaceByIdAndFloorId({ floor_id, space_id });
        const fetchedRooms = fetchRoomsBySpaceId({ spaceId: space_id });

        //selected all
        const isChecked = currentSpace?.rooms?.length === fetchedRooms?.length;
        const isIndeterminate = currentSpace?.rooms?.length < fetchedRooms?.length && currentSpace?.rooms?.length !== 0;

        return {
            isChecked,
            isIndeterminate,
        };
    };

    const selectedEquipments = () => {
        if (!selectedMap.floors || !selectedMap.floors[floor.id]) {
            return { isChecked: false, isIndeterminate: false };
        }

        const currentRoom = getRoomByIdAndSpaceIdAndFloorId({
            roomId: room.id,
            floor_id: floor.id,
            space_id: space.id,
        });
        const fetchedRoom = fetchRoomByIdAndSpaceIdAndFloorId({
            roomId: room.id,
            floor_id: floor.id,
            space_id: space.id,
        });

        const isChecked = currentRoom?.equipments?.length === fetchedRoom?.equipments?.length;

        return {};
        // const fetchedRooms = fetchRoomsBySpaceId({ spaceId: space_id });
        //
        // //selected all
        // const isChecked = currentSpace?.rooms?.length === fetchedRooms?.length;
        // const isIndeterminate = currentSpace?.rooms?.length < fetchedRooms?.length && currentSpace?.rooms?.length !== 0;
        //
        // return {
        //     isChecked,
        //     isIndeterminate,
        // };
    };

    const selectAllSpaces = ({ floor_id, name, isIndeterminate }) => {
        setSelectedMap((oldState) => {
            const isAddedfloor = oldState.floors && oldState.floors[floor_id];
            const newState = oldState.floors ? { ...oldState } : { ...oldState, floors: {} };

            if (isAddedfloor && !isIndeterminate) {
                delete newState.floors[floor_id];
                return newState;
            }

            newState.floors[floor_id] = {
                floor_id,
                name,
                spaces: fetchAllSpacesWithRoomsByFloorId({ floor_id }),
            };

            return newState;
        });
    };

    const selectAllRooms = ({ floorId, spaceId }) => {
        setSelectedMap((oldState) => {
            const isAddedfloor = oldState.floors && oldState.floors[floorId];
            const newState = oldState.floors ? { ...oldState } : { ...oldState, floors: {} };

            if (!isAddedfloor) {
                newState.floors[floorId] = {
                    floor_id: floorId,
                    spaces: fetchSpaceWithRoomsByFloorIdAndSpaceId({ spaceId, floorId }),
                };

                return newState;
            }

            const isSpaceAdded = newState.floors[floorId].spaces.find(({ _id }) => _id === spaceId);

            if (isSpaceAdded) {
                const oldSpaces = newState.floors[floorId].spaces;

                newState.floors[floorId].spaces = oldSpaces.filter(({ _id }) => _id !== spaceId);

                return newState;
            }

            newState.floors[floorId].spaces.push(...fetchSpaceWithRoomsByFloorIdAndSpaceId({ spaceId, floorId }));

            return newState;
        });
    };

    const selectAllEquipments = ({ floorId, spaceId, name, roomId }) => {
        setSelectedMap((oldState) => {
            const isAddedfloor = oldState.floors && oldState.floors[floorId];
            const newState = oldState.floors ? { ...oldState } : { ...oldState, floors: {} };

            if (!isAddedfloor) {
                newState.floors[floorId] = {
                    spaces: [
                        {
                            ...fetchSpaceById(spaceId),
                            rooms: [
                                fetchRoomByIdAndSpaceIdAndFloorId({ space_id: spaceId, floor_id: floorId, roomId }),
                            ],
                        },
                    ],
                };

                return newState;
            }

            const isRoomAdded = getRoomByIdAndSpaceIdAndFloorId({ space_id: spaceId, floor_id: floorId, roomId });
            const currentSpace = newState.floors[floorId].spaces.find(({ _id }) => _id === spaceId);

            if (isRoomAdded) {
                const currentSpace = newState.floors[floorId].spaces.find(({ _id }) => _id === spaceId);
                const oldRooms = currentSpace.rooms;
                const newRooms = oldRooms.filter(({ name }) => name !== roomId);

                if (newRooms.length) {
                    currentSpace.rooms = newRooms;
                } else {
                    const oldSpaces = newState.floors[floorId].spaces;
                    newState.floors[floorId].spaces = oldSpaces.filter(({ _id }) => _id !== spaceId);
                }

                return newState;
            }

            const addNewRoom = fetchRoomByIdAndSpaceIdAndFloorId({ space_id: spaceId, floor_id: floorId, roomId });

            if (!currentSpace) {
                newState.floors[floorId].spaces = [{ ...fetchSpaceById(spaceId), rooms: [addNewRoom] }];

                return newState;
            }

            currentSpace.rooms.push(addNewRoom);

            return newState;
        });
    };

    const selectEquipment = ({ equipment_id }) => {
        setSelectedMap((oldState) => {
            const newState = { ...oldState };

            const isFloorAdded = oldState.floors && oldState.floors[floor.id];

            const fetchCurrentSpace = fetchAllSpacesWithRoomsByFloorId({ floor_id: floor.id }).find(
                ({ _id }) => _id === space.id
            );
            const fetchCurrentRoom = fetchCurrentSpace.rooms.find(({ name }) => name === room.id);

            if (!isFloorAdded) {
                newState.floors = {
                    [floor.id]: {
                        ...fetchFloorById(floor.id),
                        spaces: [
                            {
                                ...fetchCurrentSpace,
                                rooms: [
                                    {
                                        ...fetchCurrentRoom,
                                        equipments: [
                                            fetchCurrentRoom.equipments.find((eq) => eq.equipment_id === equipment_id),
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                };

                return newState;
            }

            const currentRooms = newState.floors[floor.id].spaces.find(({ _id }) => _id === space.id).rooms;


            
            if (!currentRooms.find(({ name }) => name === room.id)) {
                const fetchedRoom = fetchRoomByIdAndSpaceIdAndFloorId({
                    roomId: room.id,
                    space_id: space.id,
                    floor_id: floor.id,
                })
                    
                
                
                newState.floors[floor.id].spaces.find(({ _id }) => _id === space.id).rooms = [
                    ...currentRooms,
                    {
                        ...fetchedRoom,
                        equipments: 
                            fetchedRoom.equipments.filter(( eq ) => eq.equipment_id === equipment_id)
                        
                    }
                    ,
                ];
                alert(1)
            }

            debugger


            try {
                const isAddedRoom = getRoomByIdAndSpaceIdAndFloorId({
                    space_id: space.id,
                    floor_id: floor.id,
                    roomId: room.id,
                });
            } catch (e) {}

            return newState;
        });
    };

    const selectedLevels = { space, room, floor };

    try {
        console.log(selectedMap.floors);
    } catch (e) {}

    return {
        handleSelect,
        handleBreadCrumbsSelect,
        level,
        selectedLevels,
        setSelected,
        selected,

        setSelectedMap,
        selectedMap,

        selectedFloors,
        selectedSpaces,
        selectedRooms,
        selectedEquipments,

        selectAllSpaces,
        selectAllRooms,
        selectAllEquipments,
        selectEquipment,

        countings: {},

        helpers: {
            getFloorById,
            getSpacesByFloorId,
            getAmountOfFloorsByFloorId: getAmountOfSpacesByFloorId,

            fetchSpacesByFloorId,
            fetchSpaceWithRoomsByFloorIdAndSpaceId,
            fetchSpacesById: fetchSpaceById,
            fetchFloorById,
            fetchRoomByFloorIdAndSpaceId,
        },
    };
};

export { useStateManager };
