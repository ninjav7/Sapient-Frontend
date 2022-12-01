import { percentageHandler } from '../utils/helper';

export const getTableHeadersList = (record) => {
    let arr = [];
    record.forEach((element) => {
        arr.push(element?.name);
    });
    return arr.join(', ');
};

export const getEquipmentTableCSVExport = (name, tableData, columns, preparedEndUseData) => {
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

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    hiddenElement.click();
};

export const getCompareBuildingTableCSVExport = (tableData, columns, topEnergyDensity) => {
    let dataToExport = [];

    tableData.forEach((tableRow, index) => {
        let arr = [];
        for (let i = 0; i <= columns.length - 1; i++) {
            switch (columns[i].accessor) {
                case 'total_consumption':
                    const preparedConsumption = parseInt(tableRow.total_consumption / 1000);
                    arr.push(`${preparedConsumption} kWh`);
                    break;
                case 'energy_consumption':
                    const diffPercentage = percentageHandler(
                        tableRow.energy_consumption.now,
                        tableRow.energy_consumption.old
                    );
                    {
                        tableRow.energy_consumption.now >= tableRow.energy_consumption.old
                            ? arr.push(`+${diffPercentage}%`)
                            : arr.push(`-${diffPercentage}%`);
                    }
                    break;
                case 'energy_density':
                    const densityData =
                        tableData.length > 1 ? (row.energy_density / topEnergyDensity) * 100 : topEnergyDensity;
                    const preparedEnergyDestiny = `${parseInt(densityData)} kWh / sq. ft.`;
                    arr.push(preparedEnergyDestiny);
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

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `Compare_Buildings_${new Date().toISOString().split('T')[0]}.csv`;
    hiddenElement.click();
};
