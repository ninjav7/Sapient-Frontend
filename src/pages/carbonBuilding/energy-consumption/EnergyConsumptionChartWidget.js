import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { TrendsBadge } from '../../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { Progress } from 'reactstrap';
import './styles.scss';

const EnergyConsumptionChart = (props) => {
    const { title = '', subTitle = '', style = {}, rows = [] } = props;

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
                    <table className="w-100 EnergyConsumptionWidget-widget-table-content align-items-baseline">
                        <tbody>
                            {rows.map(
                                ({
                                    id,
                                    name,
                                    value,
                                    unit,
                                    consumption,
                                    percentage,
                                    badgePercentage,
                                    badgeType,
                                    onHour,
                                    offHour,
                                }) => (
                                    <tr key={id}>
                                        <td width="25%">
                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                {name}
                                            </Typography.Subheader>
                                        </td>
                                        <td width="40%">
                                            <Progress multi className="custom-progress-bar">
                                                <Progress
                                                    bar
                                                    value={onHour}
                                                    max={totalVal}
                                                    barClassName="custom-on-hour"
                                                />
                                                <Progress
                                                    bar
                                                    value={offHour}
                                                    max={totalVal}
                                                    barClassName="custom-off-hour"
                                                />
                                            </Progress>
                                        </td>
                                        <td width="20%">
                                            <div className="energy-usage-chart-value">{`${formatConsumptionValue(
                                                consumption
                                            )} ${unit}`}</div>
                                        </td>
                                        <td width="10%">
                                            <div className="energy-usage-chart-value">{`${percentage}%`}</div>
                                        </td>
                                        <td width="5%">
                                            <TrendsBadge type={badgeType} value={badgePercentage} />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
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
};

export default EnergyConsumptionChart;
