import React from 'react';
import BarChartWidget from '../../sharedComponents/barChartWidget';

const EnergyConsumptionHistory = ({ series, height, isConsumpHistoryLoading, startEndDayCount, title, subtitle }) => {
    return (
        <BarChartWidget
            title={title}
            subtitle={subtitle}
            series={series}
            isConsumpHistoryLoading={isConsumpHistoryLoading}
            startEndDayCount={startEndDayCount}
            height={height}
        />
    );
};

export default EnergyConsumptionHistory;
