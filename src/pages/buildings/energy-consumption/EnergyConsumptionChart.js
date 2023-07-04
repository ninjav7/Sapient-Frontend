import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import './styles.scss';
import { Button } from '../../../sharedComponents/button';
import { TrendsBadge } from '../../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { TinyBarChart } from '../../../sharedComponents/tinyBarChart';

const EnergyConsumptionChart = (props) => {
    const { title = '', subTitle = '', style = {}, rows = [] } = props;

    return (
        <div className="energy-usage-chart-wrapper" style={style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
            </div>
            <Brick sizeInRem={1.5} />
            <div className="mb-2">
                <div className="EnergyConsumptionWidget-table d-block">
                    <table className="w-100 EnergyConsumptionWidget-widget-table-content align-items-baseline mb-2">
                        {rows.map(({ id, name, value, unit, consumption, percentage, badgePercentage, badgeType }) => (
                            <tr key={id}>
                                <td width={140}>
                                    <Typography.Subheader size={Typography.Sizes.md}>{name}</Typography.Subheader>
                                </td>
                                <td width={160}>
                                    <TinyBarChart percent={value} />
                                </td>
                                <td>
                                    <div className="energy-usage-chart-value ml-4">{`${formatConsumptionValue(
                                        consumption
                                    )} ${unit}`}</div>
                                </td>
                                <td>
                                    <div className="energy-usage-chart-value">{`${percentage}%`}</div>
                                </td>
                                <td width={40}>
                                    <TrendsBadge type={badgeType} value={badgePercentage} />
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
};

EnergyConsumptionChart.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
};

export default EnergyConsumptionChart;
