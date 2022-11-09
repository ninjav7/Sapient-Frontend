export const getCSVDataExport = (labels, series, pageType) => {
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
