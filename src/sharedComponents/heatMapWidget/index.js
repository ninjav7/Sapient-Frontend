import React from 'react';
import 'moment-timezone';
import Typography from '../typography';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as Download } from '../assets/icons/download.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import HeatMapChart from './HeatMapChart';
import { getHeatMapCSVExport } from '../helpers/chartsExport';
import Brick from '../brick';
import './style.scss';

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
                {showRouteBtn ? (
                    <div className="container-header">
                        <Titles {...{ title, subtitle, pageType }} />

                        <div className="mr-2">
                            {showRouteBtn ? (
                                <div className="d-flex justify-content-between mr-1">
                                    <Button
                                        size={Button.Sizes.sm}
                                        icon={<Download />}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() =>
                                            getHeatMapCSVExport(
                                                hourlyAvgConsumpData,
                                                hourlyAvgConsumpOpts?.xaxis?.categories
                                            )
                                        }
                                        className="mr-4"
                                    />
                                    <Button
                                        label="More Details"
                                        size={Button.Sizes.lg}
                                        icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
                                        type={Button.Type.tertiary}
                                        iconAlignment={Button.IconAlignment.right}
                                        onClick={handleRouteChange}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-between">
                        <Titles {...{ title, subtitle, pageType }} />
                        <FontAwesomeIcon
                            icon={faDownload}
                            size="md"
                            className="download-chart-btn mouse-pointer mr-3 mt-3"
                            onClick={() =>
                                getHeatMapCSVExport(
                                    hourlyAvgConsumpData.reverse(),
                                    hourlyAvgConsumpOpts?.xaxis?.categories
                                )
                            }
                        />
                    </div>
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
    showRouteBtn: PropTypes.bool,
    handleRouteChange: PropTypes.func,
};

export default HeatMapWidget;
