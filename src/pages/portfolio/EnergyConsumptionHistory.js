import React from 'react';
import LineChartWidget from '../../sharedComponents/lineChartWidget';

const EnergyConsumptionHistory = ({ series, height = 259 }) => {

    return (
        <div>
            <LineChartWidget
                height={height}
                title="Energy Consumption History"
                subtitle="Energy Totals by Day"
                series={series}
            />
        </div>
    );
};

export default EnergyConsumptionHistory;
