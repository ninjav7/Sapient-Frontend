export const BaseUrl = 'https://energy-service-dev.azurewebsites.net';
//export const BaseUrl = 'http://122.175.198.21:8000';
// export const BaseUrl = 'http://localhost:8000';

export const portfolioOverall = '/api/energy/portfolio/overall';
export const portfolioBuilidings = '/api/energy/portfolio/buildings';
export const portfolioEndUser = '/api/energy/portfolio/end-user';

export const builidingOverview = '/api/energy/building/overview';
export const builidingAlerts = '/api/energy/building/alerts';
export const builidingPeak = '/api/energy/building/peak';
export const builidingHourly = '/api/energy/building/hourly';
export const builidingEquipments = '/api/energy/building/equipment';

// utility bills
export const generalUtilityBills = '/api/config/utility_bills';
export const updateUtilityBill = '/api/config/utility_bills';

// general settings
export const generalBuildingDetail = '/api/config/general/building_details';
export const generalBuildingAddress = '/api/config/general/address';
export const generalDateTime = '/api/config/general/date_time';
export const generalOperatingHours = '/api/config/general/operating_hours';
export const generalBldgDelete = '/api/config/general/delete_building';

// end-uses
export const endUses = '/api/energy/portfolio/end-user';
export const endUsesChart = '/api/energy/chart/end-uses';
export const hvacUsageChart = '/api/energy/chart/hvac';
export const endUsesFloorChart = '/api/energy/chart/byfloor';
export const endUsesUsageChart = '/api/energy/chart/usage';

// equipments
export const generalEquipments = '/api/config/equipments_details/';
export const equipmentType = '/api/config/get_equipment_type/';
export const addEquipmentType ='/api/config/create_equipment_type';
export const createEquipment = '/api/config/equipments_details/create_equipment/';
export const getEndUseId = '/api/config/get_end_use';
export const linkActiveSensorToEquip = '/api/config/sensor/active/lnk_act_snr_to_eqt';

// active
export const generalActiveDevices = '/api/config/devices/active';
export const updateActivePassiveDevice = '/api/config/devices/update_device';

// passive
export const generalPassiveDevices = '/api/config/devices/passive';
export const sensorGraphData = '/api/config/sensor/graph';
export const equipmentGraphData = '/api/explorer/equipment_chart';

//gateway
export const generalGateway = '/api/config/gateway';

// panel
export const generalPanels = '/api/config/panels/';
export const createPanel = '/api/config/panels/create_panel';
export const createBreaker = '/api/config/panels/create_breaker';
export const getBreakers = '/api/config/panels/breakers';

// getBuilding
export const getBuilding = '/api/config/get_buildings';
export const energyUsage = '/api/energy/energy/usage';

// compare-buildings
export const compareBuildings = '/api/energy/energy/compare_building';

//config settings
export const getBuildings = '/api/config/get_buildings';
export const createBuilding = '/api/config/create_building';
export const createDevice = '/api/config/devices/create_device';
export const kasaAuthenticate = '/api/config/kasa/authenticate';
export const get_kasa_account = '/api/config/kasa/get_kasa_account';

export const get_kasa_devices = '/api/config/kasa/get_devices';
export const insert_kasa_devices = '/api/config/kasa/insert_device';
export const doneProvisioning = '/api/config/kasa/done_provisioning';

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
export const avgDailyUsageByHour = '/api/energy/building/chart/timeofday';

// sensors list
export const listSensor = '/api/config/sensor/list_sensor';

// plug rules
export const listPlugRules = '/api/user_role/plug_rule/list';
export const createPlugRule = '/api/user_role/plug_rule/create';
export const updatePlugRule = '/api/user_role/plug_rule/update';

// Auth
export const signin = '/api/user_role/user/signin';
export const signup = '/api/user_role/user/signup';

export const linkSocketRules = '/api/user_role/plug_rule/list_link_socket';
export const unLinkSocketRules = '/api/user_role/plug_rule/list_sensor_by_buildingID';
export const linkSocket = '/api/user_role/plug_rule/link_socket';
export const unLinkSocket = '/api/user_role/plug_rule/unlink_socket';
