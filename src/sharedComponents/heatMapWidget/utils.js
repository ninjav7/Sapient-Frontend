const getTableHeadersList = (record) => {
    let arr = [];
    record.forEach((element) => {
        arr.push(element?.name);
    });
    return arr.join(', ');
};

export const getCSVDataExport = (heatMapData, categories) => {
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
