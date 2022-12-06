export const getBarMetricsCSVExport = ({ name, data }, csvColumns) => {
    let csv;

    if (csvColumns) {
        csv = `${Array.isArray(csvColumns) ? csvColumns.join() : csvColumns} \n`;
    } else {
        csv = `Location, ${name}, Consumption (kWh), Percentage, Trend type \n`;
    }

    data.forEach(function (row) {
        const metricValues = Object.values(row[2] || {});
        csv += row.slice(0, 2).join();
        csv += ',';
        csv += `${metricValues[0].replace(',', '.')}, ${metricValues[1]}, ${metricValues[2]}% ${metricValues[3].replace(
            '-trend',
            ''
        )}`;
        csv += '\n';
    });

    return csv;
};
