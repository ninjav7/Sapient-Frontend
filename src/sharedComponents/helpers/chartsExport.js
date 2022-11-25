import { getTableHeadersList } from '../heatMapWidget/utils';
import { xaxisCategoryByHour } from './helper';

export const getDonutChartCSVExport = (labels, series, pageType) => {
    let data = [];

    labels.forEach((record, index) => {
        let arr = [];
        arr.push(record);
        arr.push(series[index]);
        data.push(arr);
    });

    let totalSeriesCount = series.reduce((partialSum, a) => partialSum + a, 0);
    data.push(['Total', totalSeriesCount]);

    let csv = 'EndUse Type,Consumption (kWh)\n';
    data.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    if (pageType === 'building') {
        hiddenElement.download = `Energy_EndUse_By_Building_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
        hiddenElement.download = `Energy_EndUse_By_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    }

    hiddenElement.click();
};

export const getHeatMapCSVExport = (heatMapData, categories) => {
    let dataToExport = [];
    let length = heatMapData.length;

    categories.forEach((record, index) => {
        let arr = [];
        arr.push(record);

        for (let i = 0; i <= length - 1; i++) {
            arr.push(heatMapData[i]?.data[index]?.z);
        }

        dataToExport.push(arr);
    });

    let csv = `Categories, ${getTableHeadersList(heatMapData)}\n`;

    dataToExport.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `Hourly_Average_Consumption_${new Date().toISOString().split('T')[0]}.csv`;
    hiddenElement.click();
};

export const getAreaChartCSVExport = (chartData) => {
    if (chartData.length === 0) {
        return;
    }

    let exportData = [];

    xaxisCategoryByHour.forEach((record, index) => {
        let arr = [];
        arr.push(record);
        arr.push(chartData[0].data[index]);
        arr.push(chartData[1].data[index]);
        exportData.push(arr);
    });

    let csv = `Time, ${getTableHeadersList(chartData)}\n`;

    exportData.forEach(function (row) {
        csv += row.join(',');
        csv += '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `Average_Usage_By_Hour_${new Date().toISOString().split('T')[0]}.csv`;
    hiddenElement.click();
};
