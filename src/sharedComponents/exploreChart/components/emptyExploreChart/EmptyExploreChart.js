import React from 'react';
import './emptyExploreChart.scss';

import { ReactComponent as EmptyChartLine } from '../../../assets/icons/emptyChartLine.svg';
import { ReactComponent as ZoomedChartArea } from '../../../assets/icons/zoomed-chart-area.svg';

import Typography from '../../../typography';

const emptyExploreChart = () => {
    const mockedYAxis = ['0', '6k', '12k', '18k', '24k', '30k', '36k'].reverse();
    const mockedXAxis = [...Array(15).keys()];

    const renderYAxis = () => {
        return (
            <div className="empty-explorechart-yaxis-wrapper">
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
            <div className="empty-explorechart-xaxis-wrapper">
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
        <div className="empty-explorechart">
            <div className="empty-explorechart-first-line">
                {renderYAxis()}
                <div className="pulsate">
                    <EmptyChartLine />
                </div>
            </div>
            <div className="empty-explorechart-x-axis">{renderXAxis()}</div>
            <div className="empty-explorechart-footer">
                <ZoomedChartArea />
            </div>
        </div>
    );
};

export default emptyExploreChart;