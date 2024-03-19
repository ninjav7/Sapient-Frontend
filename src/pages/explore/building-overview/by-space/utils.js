export const validateSeriesDataForSpaces = (selectedSpaceIds, spacesList, seriesData) => {
    if (selectedSpaceIds.length === 0 || spacesList.length === 0) return [];
    const filteredSeriesData = seriesData.filter((el) => selectedSpaceIds.some((id) => id === el?.id));
    return filteredSeriesData;
};
