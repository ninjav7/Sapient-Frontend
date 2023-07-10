import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { percentageHandler } from '../../../utils/helper';
import './styles.scss';

const EnergyConsumptionChart = (props) => {
    const { title = '', subTitle = '', style = {}, rows = [], unit = 'kWh', isFetching } = props;

    const [totalVal, setTotalVal] = useState(0);

    useEffect(() => {
        if (rows.length !== 0) {
            rows.sort((a, b) => b?.onHour - a?.onHour);
            setTotalVal(rows[0]?.onHour + rows[0]?.offHour);
        }
    }, [rows]);

    return (
        <div className="energy-usage-chart-wrapper" style={style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
            </div>

            <Brick sizeInRem={0.75} />
            <div className="horizontal-line"></div>
            <Brick sizeInRem={0.75} />

            <div className="mb-2 energy-usage-chart-scroll-container">
                <div className="EnergyConsumptionWidget-table d-block">
                    {isFetching ? (
                        <Skeleton count={8} height={25} className="mb-2" />
                    ) : (
                        <table className="w-100 EnergyConsumptionWidget-widget-table-content align-items-baseline">
                            <tbody>
                                <>
                                    {rows?.length !== 0 ? (
                                        <>
                                            {rows.map((record, index) => (
                                                <tr key={index}>
                                                    <td width="25%">
                                                        <Typography.Subheader size={Typography.Sizes.md}>
                                                            {record?.name}
                                                        </Typography.Subheader>
                                                    </td>
                                                    <td width="40%">
                                                        <Progress multi className="custom-progress-bar">
                                                            <Progress
                                                                bar
                                                                value={record?.on_hours_usage?.new}
                                                                max={totalVal}
                                                                barClassName="custom-on-hour"
                                                            />
                                                            <Progress
                                                                bar
                                                                value={record?.off_hours_usage}
                                                                max={totalVal}
                                                                barClassName="custom-off-hour"
                                                            />
                                                        </Progress>
                                                    </td>
                                                    <td width="20%">
                                                        <div className="energy-usage-chart-value">{`${formatConsumptionValue(
                                                            record?.on_hours_usage?.new
                                                        )} ${unit}`}</div>
                                                    </td>
                                                    <td width="10%">
                                                        <div className="energy-usage-chart-value">{`${percentageHandler(
                                                            record?.total_energy_consumed,
                                                            record?.on_hours_usage?.new
                                                        )}%`}</div>
                                                    </td>
                                                    <td width="5%">
                                                        <TrendsBadge
                                                            value={percentageHandler(
                                                                record?.on_hours_usage?.new,
                                                                record?.on_hours_usage?.old
                                                            )}
                                                            type={
                                                                record?.on_hours_usage?.new >=
                                                                record?.on_hours_usage?.old
                                                                    ? TRENDS_BADGE_TYPES.UPWARD_TREND
                                                                    : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr>
                                            <td
                                                width="100%"
                                                className="d-flex justify-content-center align-items-center">
                                                <Typography.Body size={Typography.Sizes.md}>
                                                    No records found.
                                                </Typography.Body>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

EnergyConsumptionChart.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    style: PropTypes.object,
    rows: PropTypes.array,
    isFetching: PropTypes.bool,
};

export default EnergyConsumptionChart;
