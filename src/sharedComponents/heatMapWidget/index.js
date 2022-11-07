import React from 'react';
import 'moment-timezone';
import Typography from '../typography';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import HeatMapChart from './HeatMapChart';
import './style.scss';
import Brick from '../brick';

const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

const Titles = ({ title, subtitle, pageType }) => {
    return (
        <>
            <div className={`ml-3 ${pageType === 'building' ? 'mt-2' : 'mt-3'}`}>
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    as="h5"
                    fontWeight={Typography.Types.Medium}
                    className="mb-1">
                    {title}
                </Typography.Subheader>
                <Typography.Body size={Typography.Sizes.xs} as="h6">
                    {subtitle}
                </Typography.Body>
            </div>
        </>
    );
};

const HeatMapWidget = ({
    className = '',
    title,
    subtitle,
    heatMapChartHeight = 125,
    hourlyAvgConsumpOpts,
    hourlyAvgConsumpData,
    pageType,
    handleRouteChange,
    showRouteBtn = false,
}) => {
    return (
        <div className={`heatmap-chart-widget-wrapper ${className}`}>
            <>
                {pageType === 'building' ? (
                    <div className="container-header">
                        <Titles {...{ title, subtitle, pageType }} />
                        <div className="mr-2">
                            {showRouteBtn ? (
                                <Button
                                    label="More Details"
                                    size={Button.Sizes.lg}
                                    icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
                                    type={Button.Type.tertiary}
                                    iconAlignment={Button.IconAlignment.right}
                                    onClick={handleRouteChange}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    <Titles {...{ title, subtitle, pageType }} />
                )}
            </>
            <Brick sizeInRem={1} />
            <div>
                <HeatMapChart
                    options={hourlyAvgConsumpOpts}
                    series={hourlyAvgConsumpData}
                    height={heatMapChartHeight}
                />
            </div>
        </div>
    );
};

HeatMapWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    startEndDayCount: PropTypes.number,
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

export default HeatMapWidget;
