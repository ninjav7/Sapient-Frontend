import React from 'react';
import BarChartWidget from '../barChartWidget';

const TotalEnergyConsumption = ({
    series,
    height,
    isConsumpHistoryLoading,
    startEndDayCount,
    title,
    subtitle,
    timeZone,
}) => {
    return (
        <BarChartWidget
            title={title}
            subtitle={subtitle}
            series={series}
            isConsumpHistoryLoading={isConsumpHistoryLoading}
            startEndDayCount={startEndDayCount}
            height={height}
            timeZone={timeZone}
        />
    );
};

export default TotalEnergyConsumption;
