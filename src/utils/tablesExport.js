import { percentageHandler } from '../utils/helper';
import { getBuildingName } from '../helpers/helpers';
import { handleUnitConverstion } from '../pages/settings/general-settings/utils';
import { UNITS } from '../constants/units';

export const getTableHeadersList = (record) => {
    let arr = [];
    record.forEach((element) => {
        arr.push(element?.name);
    });
    return arr.join(', ');
};

export const getEquipmentTableCSVExport = (tableData, columns, preparedEndUseData) => {
    let dataToExport = [];
    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'end_use_id':
                    const fieldName = tableRow['end_use_id'];
                    arr.push(preparedEndUseData[fieldName]);
                    break;
                case 'tags':
                    const tags = tableRow['tags'];
                    const convertedTags = tags.join(' ');
                    arr.push(convertedTags);
                    break;
                case 'sensor_number':
                    const sensors = tableRow['sensor_number'];
                    const totalSensor = tableRow['total_sensor'];
                    let preparedData = '';
                    sensors.forEach((el) => {
                        preparedData += `${el}/${totalSensor} `;
                    });

                    arr.push(preparedData);
                    break;
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });
    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getExploreByEquipmentTableCSVExport = (tableData, columns) => {
    let dataToExport = [];
    tableData.forEach((tableRow) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'equipment_name':
                    const name = tableRow['equipment_name'];
                    const search = ',';
                    const replaceWith = ' ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'consumption':
                    const consumption = tableRow['consumption'];
                    arr.push(`${consumption.now / 1000} kWh`);
                    break;

                case 'change':
                    const consumptionObj = tableRow['consumption'];
                    arr.push(`${consumptionObj?.change} %`);
                    break;

                case 'tags':
                    const tags = tableRow['tags'];
                    const tagsString = tags.join('; ');
                    arr.push(tagsString);
                    break;

                case 'breaker_number':
                    const breaker_number = tableRow['breaker_number'];
                    const breakersNumberString = 'Breaker ' + breaker_number.join('; ');
                    arr.push(breakersNumberString);
                    break;

                case 'note':
                    const note = tableRow['note'];
                    const stringWithSemicolons = note.replace(/,/g, ';');
                    const stringWithoutSlashN = stringWithSemicolons.replace('\n', ' ');
                    arr.push(stringWithoutSlashN);
                    break;

                default:
                    arr.push(tableRow[columns[i]?.accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });
    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getExploreByBuildingTableCSVExport = (tableData, columns, userPrefUnits) => {
    let dataToExport = [];
    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'building_name':
                    const name = tableRow['building_name'];
                    const search = ',';
                    const replaceWith = ' ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'total_consumption':
                    const energy_consumption = tableRow['energy_consumption'];
                    const energyValue = energy_consumption?.now / 1000;
                    arr.push(`${energyValue ? energyValue.toFixed(2) : 0} kWh`);
                    break;

                case 'change':
                    const change = tableRow['energy_consumption'];
                    arr.push(`${change?.change} %`);
                    break;

                case 'square_footage':
                    const square_footage = tableRow['square_footage'];
                    const unit = userPrefUnits === 'si' ? `Sq.M.` : `Sq.Ft.`;
                    const value = Math.round(handleUnitConverstion(square_footage, userPrefUnits));
                    arr.push(`${value} ${unit}`);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });
    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getSocketsForPlugRulePageTableCSVExport = (tableData, columns) => {
    let dataToExport = [];
    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'assigned_rule':
                    const result = tableRow['assigned_rules'];

                    arr.push(result);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });
    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};
export const getAverageEnergyDemandCSVExport = (chartData, columns) => {
    let dataToExport = [];
    chartData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            arr.push(tableRow[columns[i].accessor]);
        }
        dataToExport.push(arr);
    });
    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getBuildingsTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'building_name':
                    const name = tableRow['building_name'];
                    const search = ',';
                    const replaceWith = ' ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'building_size':
                    const size = tableRow['building_size'];
                    arr.push(`${size} ${columns[i].name}`);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getUsersTableCSVExport = (tableData, columns, handleLastActiveDate) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'name':
                    const userName = tableRow['name'];
                    arr.push(`${userName}`);
                    break;

                case 'email':
                    const userEmail = tableRow['email'];
                    arr.push(`${userEmail}`);
                    break;

                case 'role':
                    const userRole =
                        tableRow?.role === '' || tableRow?.permissions.length === 0
                            ? '-'
                            : tableRow?.permissions[0]?.permission_name;
                    arr.push(`${userRole}`);
                    break;

                case 'status':
                    const userStatus = tableRow['status'];
                    arr.push(`${userStatus}`);
                    break;

                case 'last_login':
                    const userLastLogin = tableRow['last_login'];
                    const data = userLastLogin ? handleLastActiveDate(userLastLogin) : `Never`;
                    arr.push(`${data}`);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};
export const getCarbonCompareBuildingsTableCSVExport = (tableData, columns) => {
    let dataToExport = [];
    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'building_name':
                    const formattedBldgName = `${tableRow?.building_name}`;
                    arr.push(formattedBldgName);
                    break;
                case 'average_carbon_intensity':
                    const preparedEnergyDestiny =
                        tableRow.average_carbon_intensity !== null
                            ? `${tableRow.average_carbon_intensity.toFixed(2)} lbs/MWh`
                            : `0 lbs/MWh`;
                    arr.push(preparedEnergyDestiny);
                    break;
                case 'total_carbon_emissions':
                    const preparedConsumption = Math.round(tableRow.total_carbon_emissions / 1000);
                    arr.push(`${preparedConsumption} ${UNITS.ibs}`);
                    break;
                case 'change':
                    const diffPercentage = percentageHandler(
                        tableRow?.carbon_emissions.now,
                        tableRow?.carbon_emissions.old
                    );
                    {
                        tableRow?.carbon_emissions.now >= tableRow?.carbon_emissions.old
                            ? arr.push(`+${diffPercentage}%`)
                            : arr.push(`-${diffPercentage}%`);
                    }
                    break;
                case 'square_footage':
                    const squareFootage = tableRow.square_footage;
                    arr.push(`${squareFootage} ${columns[i].name}`);
                    break;
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getCompareBuildingTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'building_name':
                    const formattedBldgName = `${tableRow?.building_name}`;
                    arr.push(formattedBldgName);
                    break;
                case 'energy_density':
                    const preparedEnergyDestiny = `${tableRow.energy_density.toFixed(2)} kWh${
                        columns[i].name.split(`Average Consumption`)[1]
                    }`;
                    arr.push(preparedEnergyDestiny);
                    break;
                case 'total_consumption':
                    const preparedConsumption = Math.round(tableRow.total_consumption / 1000);
                    arr.push(`${preparedConsumption} kWh`);
                    break;
                case 'change':
                    const diffPercentage = percentageHandler(
                        tableRow?.energy_consumption.now,
                        tableRow?.energy_consumption.old
                    );
                    {
                        tableRow?.energy_consumption.now >= tableRow?.energy_consumption.old
                            ? arr.push(`+${diffPercentage}%`)
                            : arr.push(`-${diffPercentage}%`);
                    }
                    break;
                case 'square_footage':
                    const squareFootage = tableRow.square_footage;
                    arr.push(`${squareFootage} ${columns[i].name}`);
                    break;
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getPlugRulesTableCSVExport = (tableData, columns, buildingList) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'days':
                    const days = [
                        ...new Set(
                            tableRow.action.reduce((acc, actionItem) => {
                                actionItem.action_day &&
                                    actionItem.action_day.forEach((item) => {
                                        acc.push(item);
                                    });

                                return acc;
                            }, [])
                        ),
                    ];

                    arr.push(days.join(' '));
                    break;
                case 'buildings':
                    const buildingName = tableRow.buildings
                        ? getBuildingName(buildingList, tableRow.buildings[0]?.building_id)
                        : '';
                    arr.push(buildingName);
                    break;
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getEquipTypeTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getSpaceTypeTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getPassiveDeviceTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    columns.forEach((element) => {
        if (element.accessor === 'sensor_number') element.name = 'Sensors [In Use]';
    });

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'sensor_number':
                    const name = tableRow['sensor_number'];
                    const search = '/';
                    const replaceWith = ' out of ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'status':
                    const status = tableRow['status'];
                    const data = status ? 'Online' : 'Offline';
                    arr.push(data);
                    break;

                case 'model':
                    const model = tableRow['model'];
                    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
                    arr.push(modelName);
                    break;

                case 'location':
                    const locationData = tableRow['location'];
                    const locationName = locationData === '' ? '-' : locationData;
                    arr.push(locationName);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getRawDeviceDataTableCSVExport = (tableData, columns, handleDateFormat) => {
    let dataToExport = [];

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'time_stamp':
                    const timestamp = tableRow['time_stamp'];
                    const formattedTimestamp = handleDateFormat(timestamp);
                    arr.push(formattedTimestamp);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getActiveDeviceTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    columns.forEach((element) => {
        if (element.accessor === 'sensor_count') element.name = 'Sensors [In Use]';
    });

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'sensor_count':
                    const name = tableRow['sensor_number'];
                    const search = '/';
                    const replaceWith = ' out of ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'stat':
                    const status = tableRow['stat'];
                    const data = status ? 'Online' : 'Offline';
                    arr.push(data);
                    break;

                case 'model':
                    const model = tableRow['model'];
                    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
                    arr.push(modelName);
                    break;

                case 'location':
                    const locationData = tableRow['location'];
                    const locationName = locationData === '' ? '-' : locationData;
                    arr.push(locationName);
                    break;

                case 'hardware_version':
                    const hardwareData = tableRow['hardware_version'];
                    const hardwareName = hardwareData === '' ? '-' : String(hardwareData);
                    arr.push(hardwareName);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getPanelsTableCSVExport = (tableData, columns) => {
    let dataToExport = [];

    columns.forEach((element) => {
        if (element.accessor === 'breakers_linked') element.name = 'Breakers Linked';
    });

    tableData.forEach((tableRow) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'panel_flags':
                    const flagCount = tableRow['flag_count'];
                    const flagData = flagCount && flagCount > 0 ? flagCount : null;
                    arr.push(flagData);
                    break;

                case 'breakers_linked':
                    const linked_breakers = tableRow['breakers_linked'];
                    const total_breakers = tableRow['breakers'];
                    const results = `${linked_breakers} out of ${total_breakers}`;
                    arr.push(results);
                    break;

                case 'panel_type':
                    const panel = tableRow['panel_type'];
                    const panelType = panel.charAt(0).toUpperCase() + panel.slice(1);
                    arr.push(panelType);
                    break;

                case 'location':
                    const locationData = tableRow['location'];
                    const locationName = locationData === '' ? '-' : locationData;
                    arr.push(locationName);
                    break;

                case 'passive_devices':
                    const tags = tableRow['connected_devices'];
                    const devicesName = [];
                    tags.forEach((record) => devicesName.push(record?.device_identifier));
                    const convertedTags = devicesName.join('; ');
                    arr.push(convertedTags);
                    break;

                case 'parent':
                    const parentPanel = tableRow['parent'];
                    const parentPanelName = parentPanel ? parentPanel : '-';
                    arr.push(parentPanelName);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });

    let csv = `${getTableHeadersList(columns)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};

export const getCustomerListCSVExport = (tableData, columns) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];

        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'id':
                    const accountID = tableRow['id'];
                    arr.push(`${accountID}`);
                    break;

                case 'company_name':
                    const name = tableRow['company_name'];
                    const search = ',';
                    const replaceWith = ' ';
                    const result = name.split(search).join(replaceWith);
                    arr.push(result);
                    break;

                case 'status':
                    const status = tableRow['status'];
                    const stat = status === true ? 'Active' : 'Inactive';
                    arr.push(stat);
                    break;

                case 'active_devices':
                    const activeDevices = tableRow['active_devices'];
                    arr.push(`${activeDevices}`);
                    break;

                case 'passive_devices':
                    const passiveDevices = tableRow['passive_devices'];
                    arr.push(`${passiveDevices}`);
                    break;

                case 'total_usage':
                    const energy = tableRow['total_usage'];
                    arr.push(`${(energy / 1000).toFixed(2)} kWh`);
                    break;

                default:
                    arr.push(tableRow[columns[i].accessor]);
                    break;
            }
        }
        dataToExport.push(arr);
    });
    let col = columns.filter((ele) => ele?.accessor !== 'actions');
    let csv = `${getTableHeadersList(col)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });
    return csv;
};
