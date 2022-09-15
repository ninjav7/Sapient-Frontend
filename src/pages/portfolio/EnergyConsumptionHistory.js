import React from 'react';
import LineChartWidget from '../../sharedComponents/lineChartWidget';

const EnergyConsumptionHistory = ({ series, height, isConsumpHistoryLoading }) => {
    return (
        <LineChartWidget
            height={height}
            title="Energy Consumption History"
            subtitle="Energy Totals by Day"
            series={series}
            isConsumpHistoryLoading={isConsumpHistoryLoading}
        />
    );
};

export default EnergyConsumptionHistory;
