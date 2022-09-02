import React from 'react';
import Typography from '../typography';
import Brick from '../brick';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
import { configLineChartWidget } from './config';

import './style.scss';

const LineChartWidget = ({
    className = '',
    series,
    title,
    subtitle,
    height = 259,
    width,
    isEnergyConsumptionHistoryLoading,
}) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Typography.Subheader size={Typography.Sizes.md} as="h5" fontWeight={Typography.Types.Medium}>
                {title}
            </Typography.Subheader>
            <Typography.Body size={Typography.Sizes.xs} as="h6">
                {subtitle}
            </Typography.Body>
            <Brick sizeInRem={1} />
            {/* {isEnergyConsumptionHistoryLoading ? (
                <div className="loader-center-style">
                    <Spinner className="m-2" color={'primary'} />
                </div>
            ) : (<> */}
            <Chart
                className="line-chart-widget"
                options={configLineChartWidget}
                series={series}
                {...{ height, width }}
                type="line"
            />
            {/* </>
            )} */}
        </div>
    );
};

LineChartWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                }).isRequired
            ),
        })
    ).isRequired,
};

export default LineChartWidget;
