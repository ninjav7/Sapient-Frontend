import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { percentageHandler } from '../../../utils/helper';
import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const EnergyConsumptionChart = (props) => {
    const { title = '', subTitle = '', style = {}, rows = [], unit = 'kWh', isFetching, totalBldgUsage = 0 } = props;

    const calculatePercentage = (newVal, totalVal) => {
        if (totalVal === 0) return 0;
        return Math.round((newVal / totalVal) * 100);
    };

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
                        <SkeletonTheme
                            baseColor={colorPalette.primaryGray150}
                            highlightColor={colorPalette.baseBackground}
                            borderRadius={10}
                            height={25}>
                            <Skeleton count={8} className="mb-2" />
                        </SkeletonTheme>
                    ) : (
                        <table className="w-100 EnergyConsumptionWidget-widget-table-content align-items-baseline">
                            <tbody>
                                <>
                                    {rows?.length !== 0 ? (
                                        <>
                                            {rows.map((record, index) => (
                                                <tr key={record?._id}>
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
                                                                max={totalBldgUsage}
                                                                barClassName="custom-on-hour"
                                                            />
                                                            <Progress
                                                                bar
                                                                value={record?.off_hours_usage}
                                                                max={totalBldgUsage}
                                                                barClassName="custom-off-hour"
                                                            />
                                                        </Progress>
                                                    </td>
                                                    <td width="20%">
                                                        <div className="energy-usage-chart-value">{`${formatConsumptionValue(
                                                            formatConsumptionValue(
                                                                record?.on_hours_usage?.new / 1000,
                                                                2
                                                            )
                                                        )} ${unit}`}</div>
                                                    </td>
                                                    <td width="10%">
                                                        <div className="energy-usage-chart-value">{`${calculatePercentage(
                                                            record?.on_hours_usage?.new,
                                                            totalBldgUsage
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
