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
    pageType,
    className,
    handleRouteChange,
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
            pageType={pageType}
            className={className}
            handleRouteChange={handleRouteChange}
        />
    );
};

export default TotalEnergyConsumption;
