import { atom } from 'jotai';

export const switchValue = atom({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
});

export const closedEditFloorModal = atom(false);
export const closeEditSpaceModal = atom(false);
export const floorList = atom([]);
export const spaceId = atom('');
export const spaceName = atom('');
export const spacesList = atom([]);
export const areaList = atom([]);
export const iterationNumber = atom(0);
export const floorid = atom('');
export const iterationDataList = atom([]);
export const floorState = atom([]);

// export const floor1 = atom(['Room', 'Area']);
