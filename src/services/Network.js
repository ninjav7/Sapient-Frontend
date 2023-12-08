export const BaseUrl = 'https://sapient-dev-service.stacksapien.com';
export const SingularityBaseUrl = 'https://api.singularity.energy/v2/';
// Auth
export const signin = '/api/user_role/user/signin';
export const signup = '/api/user_role/user/signup';

//SuperUser Auth
export const googleSignIn = '/api/user_role/sso/google/auth';
export const sessionValidator = '/api/user_role/user/user-session-details';
export const customerList = '/api/v2/customer/list';
export const offlineDevices = '/api/user_role/vendor/customer-offline-devices';
export const selectCustomer = '/api/user_role/superuser-select-customer';
export const getCustomer = '/api/user_role/vendor/create-customer';
export const updateUsers = '/api/user_role/user/update-user';
export const checkLinkValidity = '/api/user_role/user/check-token-validity';

// portfolio overview
export const portfolioOverall = '/api/energy/portfolio/overall';
export const portfolioKPIsV2 = '/api/v2/metrics/portfolio/kpi';
export const portfolioBuilidings = '/api/energy/portfolio/buildings';
export const portfolioEndUser = '/api/energy/portfolio/end-user';

// building overview
export const builidingOverview = '/api/energy/building/overview';
export const builidingAlerts = '/api/energy/building/alerts';
export const builidingPeak = '/api/energy/building/peak';
export const builidingEquipments = '/api/energy/building/equipment';
export const energyConsumptionByEquipmentType = '/api/v2/metrics/equipment_type';
export const energyConsumptionBySpaceType = '/api/v2/metrics/space_type';
export const energyConsumptionByFloor = '/api/v2/metrics/floor';

// time of day
export const builidingHourly = '/api/energy/time_of_day/hourly';
export const builidingHourlyV2 = '/api/v2/metrics/time_of_day/hourly';
export const avgDailyUsageByHour = '/api/energy/time_of_day/chart';
export const buildingAfterHours = '/api/energy/time_of_day/after-hour-end-use';

// utility bills
export const generalUtilityBills = '/api/config/utility_bills';
export const updateUtilityBill = '/api/config/utility_bills';

// general settings
export const generalBuildingDetail = '/api/config/general/building_details';
export const getFiltersForBuildings = '/api/config/general/general-buildings-filter';
export const generalBldgDelete = '/api/config/general/delete_building';

//user roles
export const updateVendor = '/api/user_role/vendor/update-customer';
export const listUsers = '/api/user_role/user/list_user_by_parentId';
export const addUser = '/api/user_role/user/add_user';
export const vendorPermissions = '/api/user_role/user-permission-role/vendor-permissions';

// user permission and roles
export const addMemberUser = '/api/user_role/user-permission-role/invite-reset-user';
export const forgotUserPassword = '/api/user_role/user-permission-role/forgot-user-password';
export const getMemberUser = '/api/user_role/user-permission-role/all-member-users';
export const getUserFilters = '/api/user_role/user-permission-role/users-filter';
export const UpdateUserPassword = '/api/user_role/user-permission-role/user-update-password';
export const createPermissionRole = '/api/user_role/user-permission-role/create-permission-role';
export const getPermissionRole = '/api/user_role/user-permission-role/permission-roles-list';
export const getPermissionSingleDetail = '/api/user_role/user-permission-role/permission-details';
export const updatePermissionDetail = '/api/user_role/user-permission-role/update-permission-role';
export const getSingleUserDetail = '/api/user_role/user-permission-role/user-info';
export const updateSingleUserDetail = '/api/user_role/user-permission-role/update-member-user';
export const assignUser = '/api/user_role/user-permission-role/assign-user-role';
export const updateUserRole = '/api/user_role/user-permission-role/update-user-role';
export const singleUserPermissionDetail = '/api/user_role/user-permission-role/user-permissions';

// Search
export const serachUser = '/api/user_role/user-permission-role/all-member-users';

// end-uses
export const energyEndUseInfo = '/api/energy/portfolio/end-uses-info';
export const endUsesChart = '/api/energy/end_use/chart/end-uses';
export const endUsesUsageChart = '/api/energy/end_use/load_usage';
export const endUsesEquipmentUsage = '/api/energy/end_use/equipment_type_usage';
export const equipmentDetails = '/api/config/equipments_details/by_id';

// equipments
export const generalEquipments = '/api/config/equipments_details/';
export const generalEquipmentsV2 = '/api/v2/config/equipment/device';
export const getFiltersForEquipment = '/api/config/configuration-filter';
export const equipmentType = '/api/config/get_equipment_type';
export const addEquipmentType = '/api/config/create_equipment_type';
export const updateEquipmentType = '/api/config/update_equipment_type';
export const deleteEquipmentType = '/api/config/delete-equipment-type';
export const createEquipment = '/api/config/equipments_details/create_equipment';
export const updateEquipment = '/api/config/equipments_details/update_equipment';
export const searchEquipment = '/api/config/equipments_details/search_by_equipments';
export const getEndUseId = '/api/config/get_end_use';
export const linkActiveSensorToEquip = '/api/config/sensor/active/lnk_act_snr_to_eqt';
export const deleteEquipment = '/api/config/equipments_details/delete-equipment';

// active
export const generalActiveDevices = '/api/config/devices/active';
export const updateActivePassiveDevice = '/api/config/devices/update_device';

//search active and Smart Meter
export const searchDevices = '/api/config/devices/search_by_devices';
export const lastUsedEquimentDevice = '/api/config/equipments_details/equipments_last_used';

// utility-monitors
export const createUtilityMeter = '/api/v2/config/device/utility/create';
export const getUtilityMeters = '/api/v2/config/device/utility/get';
export const updateUtilityMeters = '/api/v2/config/device/utility/update';
export const deleteUtilityMeters = '/api/v2/config/device/utility/delete';

// passive
export const generalPassiveDevices = '/api/config/devices/passive';
export const sensorGraphData = '/api/config/sensor/graph';
export const updateDevice = '/api/config/devices/update_device';
export const deletePassiveDevice = `/api/config/devices/delete/passive`;
export const linkPassiveSensorToBreaker = `/api/config/sensor/passive/lnk_pas_snr_to_pnl_bkr`;

//gateway
export const generalGateway = '/api/config/gateway';

// panel
export const generalPanels = '/api/config/panels/';
export const createPanel = '/api/config/panels/create_panel';
export const updatePanel = '/api/config/panels/update_panel';
export const createBreaker = '/api/config/panels/create_breaker';
export const updateBreakers = '/api/config/panels/v2/update_breaker';
export const groupBreakers = '/api/config/panels/group_breakers';
export const ungroupBreakers = '/api/config/panels/ungroup_breakers';
export const getBreakers = '/api/config/panels/breakers';
export const updateLinkBreakers = '/api/config/panels/link_breakers';
export const updateBreakerTypes = '/api/config/panels/update_breaker_config';
export const resetBreakers = '/api/config/panels/reset/breakers';
export const deletePanel = '/api/config/panels/delete';
export const deleteBreaker = '/api/config/panels/delete/breaker';

// getBuilding
export const energyUsage = '/api/energy/energy/usage';
export const getBuildingTypes = '/api/config/building-types';

// compare-buildings
export const compareBuildings = '/api/energy/energy/compare-buildings';

//config settings
export const getBuildings = '/api/config/get_buildings';
export const createBuilding = '/api/config/create_building';
export const generalBuilding = '/api/config/general/general-buildings';
export const createDevice = '/api/config/devices/create_device';
export const kasaLinkAccount = '/api/config/kasa/link_account';
export const kasaUnLinkAccount = '/api/config/kasa/unlink_account';
export const get_kasa_account = '/api/config/kasa/get_kasa_account';
export const getMetadata = '/api/config/metadata';
export const getMetadataFilter = '/api/config/metadata-filter';

// kasa accounts
export const get_kasa_devices = '/api/config/kasa/get_devices';
export const insert_kasa_devices = '/api/config/kasa/insert_device';
export const addToSystem = '/api/config/kasa/add_to_system';

// layout
export const getLayouts = '/api/config/get_layout/';
export const getFloors = '/api/config/layout/get-floors';
export const createFloors = '/api/config/layout/create-floor';
export const updateFloor = '/api/config/layout/update-floor';
export const getSpaces = '/api/config/layout/get-spaces';
export const getSpaceTypes = '/api/config/layout/get-spacetype';
export const createSpace = '/api/config/layout/create-space';
export const createSpaceType = '/api/config/layout/create-spacetype';
export const updateSpace = '/api/config/layout/update-space';
export const updateSpaceType = '/api/config/layout/update-spacetype';
export const deleteSpace = '/api/config/layout/delete-space/';
export const deleteSpaceType = '/api/config/layout/delete-spacetype';
export const deleteFloor = '/api/config/layout/delete-floor';

// getLocation
export const getLocation = '/api/config/get_location';

// charts
export const getEnergyConsumption = '/api/energy/chart';

// explore
export const getExplore = '/api/explorer/chart';
export const getExploreByBuilding = '/api/explorer/chart/by_building';
export const getExploreBuildingList = '/api/explorer/building_list';
export const getExploreBuildingChart = '/api/explorer/building_chart';
export const getExploreEquipmentList = '/api/explorer/equipment_list';
export const getExploreEquipmentChart = '/api/explorer/equipment_chart';
export const getExploreByEquipment = '/api/explorer/chart/by_equipment';
export const getExploreEquipmentYTDUsage = '/api/explorer/equipment_ytd_usage';
export const getExploreFilter = '/api/explorer/filter_by_daterange';

// Peak Demand
export const peakDemand = '/api/energy/peak_demand';
export const peakDemandTrendChart = '/api/energy/peak_demand/chart/peak';
export const peakDemandYearlyPeak = '/api/energy/peak_demand/yearly_peaks';
export const peakEquipType = '/api/energy/peak_demand/equipment_type';
export const peakEquipUsage = '/api/energy/peak_demand/equipment';

// sensors list
export const listSensor = '/api/config/sensor/list_sensor';
export const updateSensor = '/api/v2/sensor/update_sensor';

// plug rules
export const listPlugRules = '/api/energy/plug_rule/all-plug-rules';
export const plugRuleDetails = '/api/energy/plug_rule/plug-rule-details';
export const listConditions = '/api/energy/plug_rule/all-conditions';
export const createPlugRule = '/api/energy/plug_rule/create-plug-rule';
export const updatePlugRule = '/api/energy/plug_rule/update-plug-rule';
export const deletePlugRule = '/api/energy/plug_rule/delete-plug-rule';

export const listLinkSocketRules = '/api/energy/plug_rule/list-link-socket';
export const getListSensorsForBuildings = '/api/energy/plug_rule/sensor-for-buildings';
export const getEstimateSensorSavings = '/api/energy/plug_rule/estimate-sensor-savings';
export const getFiltersForSensors = '/api/energy/plug_rule/sensor-for-buildings-filter';
export const assignSensorsToRule = '/api/energy/plug_rule/assign-sensor-rule';
export const reassignSensorsToRule = '/api/energy/plug_rule/reassign-socket-rule';
export const unLinkSocket = '/api/energy/plug_rule/unlink-socket';
export const graphData = '/api/energy/plug_rule/average-sensor-usage';
export const getSensorLastUsed = '/api/energy/plug_rule/sensor-last-used';
export const linkSocket = '/api/user_role/plug_rule/link_socket';
export const getPlugRuleStatus = '/api/v2/control/plug_rule/status';

// weather api
export const getWeather = '/api/weather/';

// V2 API's
export const listCts = '/api/v2/config/sensor/get-cts';
export const getUtilityMeterSensor = '/api/v2/config/sensor/get';
export const updateSensorV2 = '/api/v2/config/sensor/update';
export const signinV2 = '/api/v2/user/user/signin';
export const updateUserProfile = '/api/v2/user/user/profile';
export const generalBuildingDetailV2 = '/api/v2/building/building_details';
export const sensorUsageData = '/api/v2/metrics/sensor';
export const sensorUsageDataForUtilityMonitor = '/api/v2/metrics/ytd';
export const getEnergyConsumptionV2 = '/api/v2/metrics/building';
export const compareBuildingsV2 = '/api/v2/metrics/portfolio/compare-buildings';
export const getRawDeviceData = '/api/v2/metrics/raw/devices';

// Alerts API's
export const listAlerts = '/api/v2/alerts';
export const alertAcknowledgement = '/api/v2/alerts/mark-acknowledgement';
export const createAlert = '/api/v2/alerts/create-alert';
