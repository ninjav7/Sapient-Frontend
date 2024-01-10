export const exploreBldgMetrics = [
    {
        value: 'energy',
        label: 'Energy (kWh)',
        unit: 'kWh',
        Consumption: 'Energy',
        selectType: 'Explore',
    },
    {
        value: 'power',
        label: 'Power (W)',
        unit: 'W',
        Consumption: 'Power',
        selectType: 'Explore',
    },
    {
        value: 'current',
        label: 'Current (A)',
        unit: 'A',
        Consumption: 'Current',
        selectType: 'Explore',
    },
    {
        value: 'voltage',
        label: 'Voltage (V)',
        unit: 'V',
        Consumption: 'Voltage',
        selectType: 'Explore',
    },
    {
        value: 'apparent_power',
        label: 'Apparent Power (VA)',
        unit: 'VA',
        Consumption: 'Apparent Power',
        selectType: 'Explore',
    },
    {
        value: 'reactive_power',
        label: 'Reactive Power (VAR)',
        unit: 'VAR',
        Consumption: 'Reactive Power',
        selectType: 'Explore',
    },
    {
        value: 'frequency',
        label: 'Frequency (Hz)',
        unit: 'Hz',
        Consumption: 'Frequency',
        selectType: 'Explore',
    },
    {
        value: 'power_factor',
        label: 'Power Factor',
        unit: '',
        Consumption: 'Power Factor',
        selectType: 'Explore',
    },
    {
        value: 'carbon_emissions',
        label: 'Carbon Emissions',
        unit: 'kg',
        Consumption: 'Carbon Emissions',
        selectType: 'Explore',
    },
    {
        value: 'generated_carbon_rate',
        label: 'Generated Carbon Intensity',
        unit: 'kg/MWh',
        Consumption: 'Generated Carbon Intensity',
        selectType: 'Explore',
    },
    {
        value: 'weather',
        label: 'Weather (°F)',
        unit: '°F',
        Consumption: 'Weather',
        selectType: 'Explore',
    },
];

const unitTypesToBeConverted = ['energy', 'current', 'voltage', 'power'];

export const calculateDataConvertion = (data, unit_type) =>
    data === '' ? null : unitTypesToBeConverted.includes(unit_type) ? data / 1000 : data;

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
