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

export const validateSeriesData = (selectedEquipIds, exploreEquipDataList, seriesData) => {
    if (selectedEquipIds.length === 0 || exploreEquipDataList.length === 0) return [];
    const filteredSeriesData = seriesData.filter((el) => selectedEquipIds.some((id) => id === el?.id));
    return filteredSeriesData;
};
