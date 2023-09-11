export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

export const truncateString = (inputString) => {
    if (inputString.length > 50) {
        return inputString.substring(0, 50);
    } else {
        return inputString;
    }
};

export const validateSeriesDataForBuildings = (selectedBldgIds, exploreBuildingsList, seriesData) => {
    if (selectedBldgIds.length === 0 || exploreBuildingsList.length === 0) return [];
    const filteredSeriesData = seriesData.filter((el) => selectedBldgIds.some((id) => id === el?.id));
    return filteredSeriesData;
};

export const validateSeriesDataForEquipments = (selectedEquipIds, exploreEquipDataList, seriesData) => {
    if (selectedEquipIds.length === 0 || exploreEquipDataList.length === 0) return [];
    const filteredSeriesData = seriesData.filter((el) => selectedEquipIds.some((id) => id === el?.id));
    return filteredSeriesData;
};
