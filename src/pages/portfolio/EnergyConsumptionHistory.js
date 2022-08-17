import React from 'react';
import LineChartWidget from '../../sharedComponents/lineChartWidget';

const EnergyConsumptionHistory = ({ series, height, isEnergyConsumptionHistoryLoading  }) => {

    return (
        <div>
            <LineChartWidget
                height={height}
                title="Energy Consumption History"
                subtitle="Energy Totals by Day"
                series={series}
                isEnergyConsumptionHistoryLoading={isEnergyConsumptionHistoryLoading}
            />
        </div>
    );
};

export default EnergyConsumptionHistory;
