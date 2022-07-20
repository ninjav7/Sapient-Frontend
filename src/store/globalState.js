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

export const floorList = atom([]);
export const spacesList = atom([]);
export const areaList = atom([]);
export const iterationNumber = atom(1);
export const iterationDataList = atom([]);

// export const floor1 = atom(['Room', 'Area']);
