export const exploreBldgMetrics = [
    { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
    { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    { value: 'current', label: 'Current (A)', unit: 'A', Consumption: 'Current' },
    { value: 'voltage', label: 'Voltage (V)', unit: 'V', Consumption: 'Voltage' },
    { value: 'apparent_power', label: 'Apparent Power (VA)', unit: 'VA', Consumption: 'Apparent Power' },
    { value: 'reactive_power', label: 'Reactive Power (VAR)', unit: 'VAR', Consumption: 'Reactive Power' },
    { value: 'frequency', label: 'Frequency (Hz)', unit: 'Hz', Consumption: 'Frequency' },
    { value: 'power_factor', label: 'Power Factor', unit: '', Consumption: 'Power Factor' },
    { value: 'carbon_emissions', label: 'Carbon Emissions', unit: 'kg', Consumption: 'Carbon Emissions' },
    {
        value: 'generated_carbon_rate',
        label: 'Generated Carbon Intensity',
        unit: 'kg/MWh',
        Consumption: 'Generated Carbon Intensity',
    },
];

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
