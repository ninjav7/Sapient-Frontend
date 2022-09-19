import React from 'react';
import LineChartWidget from '../../sharedComponents/lineChartWidget';

const EnergyConsumptionHistory = ({ series, height, isConsumpHistoryLoading }) => {
    return (
        <LineChartWidget
            height={height}
            title="Energy Consumption History"
            subtitle="Totals by Hour (kWh)"
            series={series}
            isConsumpHistoryLoading={isConsumpHistoryLoading}
        />
    );
};

export default EnergyConsumptionHistory;
