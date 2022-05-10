// export const BaseUrl = 'https://sapient-ele.herokuapp.com';
// export const BaseUrl = 'https://eneryg-service.ukwest.cloudapp.azure.com';
export const BaseUrl = 'http://127.0.0.1:8000';

export const portfolioOverall = '/api/energy/portfolio/overall';
export const portfolioBuilidings = '/api/energy/portfolio/buildings';
export const portfolioEndUser = '/api/energy/portfolio/end-user';

export const builidingOverview = '/api/energy/building/overview';
export const builidingAlerts = '/api/energy/building/alerts';
export const builidingPeak = '/api/energy/building/peak';
export const builidingHourly = '/api/energy/building/hourly';
// export const builidingHourly = '/api/energy/chart';
export const builidingEquipments = '/api/energy/building/equipment';

// utility bills
export const generalUtilityBills = '/api/config/utility_bills';

// general settings
export const generalBuildingDetail = '/api/config/general/building_details';
export const generalBuildingAddress = '/api/config/general/address';
export const generalDateTime = '/api/config/general/date_time';
export const generalOperatingHours = '/api/config/general/operating_hours';

// end-uses
export const endUses = '/api/energy/portfolio/end-user';
export const endUsesChart = '/api/energy/chart/end-uses';
export const hvacUsageChart = '/api/energy/chart/hvac';

// equipments
export const generalEquipments = '/api/config/equipments_details';
// export const generalEquipments = '/api/config/equipments/equipments_details';  --- Old API

// active
// export const generalActiveDevices = '/api/config/active/equipments_details';
export const generalActiveDevices = '/api/config/devices/active';

// passive
// export const generalPassiveDevices = '/api/config/passive/equipments_details';
export const generalPassiveDevices = '/api/config/devices/passive';

//gateway
// export const generalGateway = '/api/config/gateway/equipments_details';
export const generalGateway = '/api/config/gateway';

// panel
export const generalPanels = '/api/config/panels';

// getBuilding
export const getBuilding = '/api/config/get_buildings';
export const energyUsage = '/api/energy/energy/usage';

export const compareBuildings = '/api/energy/energy/compare_building';

//config settings
export const getBuildings = '/api/config/get_buildings';

// general settings
export const deleteBuilding = '/api/config/general/delete_building';

// layout
export const getLayouts = '/api/config/get_layout';

// getLocation
export const getLocation = '/api/config/get_location';

// charts
export const getEnergyConsumption = '/api/energy/chart';

// explore
export const getExplore = '/api/energy/explorer/chart';

// peakDemand Chart
export const peakDemandTrendChart = '/api/energy/peak_demand/chart/peak';
export const peakDemandYearlyPeak = '/api/energy/peak_demand/yearly_peaks';
