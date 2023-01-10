import React from 'react';
import './EmptyLineChart.scss';

import { ReactComponent as EmptyChartLine } from '../../../assets/icons/emptyChartLine.svg';
import { ReactComponent as ArrowSVG } from '../../../../assets/icon/arrow.svg';

import Button from '../../../button/Button';
import Typography from '../../../typography';

const EmptyLineChart = () => {
    const mockedYAxis = ['0', '6k', '12k', '18k', '24k', '30k', '36k'].reverse();
    const mockedXAxis = [...Array(15).keys()]

    const renderYAxis = () => {
        return (
            <div className="empty-linechart-yaxis-wrapper">
                {mockedYAxis.map((el) => {
                    return (
                        <Typography.Body size={Typography.Sizes.xs} className="axis-item">
                            {el}
                        </Typography.Body>
                    );
                })}
            </div>
        );
    };

    const renderXAxis = () => {
        return (
            <div className="empty-linechart-xaxis-wrapper">
                {mockedXAxis.map((el) => {
                    return (
                        <Typography.Body size={Typography.Sizes.xs} className="axis-item">
                            {el * 2}
                        </Typography.Body>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="empty-linechart">
            <div className="empty-linechart-first-line">
                {renderYAxis()}
                <div className="pulsate">
                    <EmptyChartLine />
                </div>
            </div>
            <div className="empty-linechart-x-axis">{renderXAxis()}</div>
            <div className="empty-linechart-footer">
                <div className="chart-legend-item">
                    <div className="circle-legend"></div>
                    <Typography.Subheader size={Typography.Sizes.sm}>Series 1</Typography.Subheader>
                </div>

                <Button
                    className="more-details"
                    label="More Details"
                    size={Button.Sizes.md}
                    type={Button.Type.tertiary}
                    icon={<ArrowSVG />}
                    iconAlignment="right"
                />
            </div>
        </div>
    );
};

export default EmptyLineChart;