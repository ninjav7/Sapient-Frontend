const selectedItem = ({selectedMap, spaceId, floorId}) => {
    if (!selectedMap.floors || !selectedMap.floors[floorId]?.spaces) {
        return null;
    }
    
    

    return selectedMap.floors[floorId].spaces.find(({ _id }) => _id === spaceId);
};


const extractFloors = () => {
    
}


export {selectedItem};