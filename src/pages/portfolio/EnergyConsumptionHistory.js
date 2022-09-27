import React from 'react';
import LineChartWidget from '../../sharedComponents/lineChartWidget';

const EnergyConsumptionHistory = ({ series, height, isConsumpHistoryLoading, startEndDayCount }) => {
    return (
        <LineChartWidget
            height={height}
            title="Energy Consumption History"
            subtitle="Totals by Hour (kWh)"
            series={series}
            isConsumpHistoryLoading={isConsumpHistoryLoading}
            startEndDayCount={startEndDayCount}
        />
    );
};

export default EnergyConsumptionHistory;
