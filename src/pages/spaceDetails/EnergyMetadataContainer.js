import React from 'react';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { formatConsumptionValue } from '../../helpers/explorehelpers';
import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import Typography from '../../sharedComponents/typography';

const EnergyMetadataContainer = ({ metadata = {}, isFetching = false }) => {
    const { total_energy_consumption, peak_power = {}, square_footage = 1 } = metadata;

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;
    const totalConsumptionValue = total_energy_consumption
        ? formatConsumptionValue(total_energy_consumption / 1000, 0)
        : 0;

    const formattedSquareFootage = Number(square_footage) < 1 ? 1 : Number(square_footage);

    const calculatedConsumptionPerSquare = total_energy_consumption
        ? formatConsumptionValue(Number(total_energy_consumption / 1000) / formattedSquareFootage, 0)
        : 0;

    const powerConsumptionValue = peak_power?.power ? formatConsumptionValue(peak_power?.power / 1000000, 2) : 0;

    return (
        <>
            <div className="d-flex flex-column w-auto h-auto metadata-container">
                <div>
                    <Typography.Subheader size={Typography.Sizes.lg}>
                        {`Total Consumption (${moment(startDate).format(dateFormat)} to ${moment(endDate).format(
                            dateFormat
                        )})`}
                    </Typography.Subheader>

                    {isFetching ? (
                        <Skeleton count={1} />
                    ) : (
                        <div className="d-flex align-items-baseline" style={{ gap: '0.25rem' }}>
                            <span className="ytd-value">{totalConsumptionValue}</span>
                            <span className="ytd-unit">kWh</span>
                        </div>
                    )}
                </div>

                <div>
                    <Typography.Subheader size={Typography.Sizes.lg}>
                        {`Peak kW (${moment(startDate).format(dateFormat)} to ${moment(endDate).format(dateFormat)})`}
                    </Typography.Subheader>

                    {isFetching ? (
                        <Skeleton count={1} />
                    ) : (
                        <div className="d-flex align-items-baseline" style={{ gap: '0.25rem' }}>
                            <span className="ytd-value">{powerConsumptionValue}</span>

                            {peak_power?.timestamp ? (
                                <span className="ytd-unit">
                                    {`kW @ ${moment
                                        .utc(peak_power?.timestamp)
                                        .clone()
                                        .format(
                                            `${userPrefDateFormat === `DD-MM-YYYY` ? `DD/MM` : `MM/DD`} ${
                                                userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`
                                            }`
                                        )}`}
                                </span>
                            ) : (
                                <span className="ytd-unit">kW</span>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <Typography.Subheader size={Typography.Sizes.lg}>
                        {`Average Energy Per Square ${userPrefUnits === 'si' ? 'Meter' : 'Foot'} (${moment(
                            startDate
                        ).format(dateFormat)} to ${moment(endDate).format(dateFormat)})`}
                    </Typography.Subheader>

                    {isFetching ? (
                        <Skeleton count={1} />
                    ) : (
                        <div className="d-flex align-items-baseline" style={{ gap: '0.25rem' }}>
                            <span className="ytd-value">{calculatedConsumptionPerSquare}</span>
                            <span className="ytd-unit">kWh</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EnergyMetadataContainer;
