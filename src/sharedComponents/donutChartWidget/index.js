import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Typography from '../typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { configDonutChartWidget } from './config';
import DonutChartLabels from './DonutChartLabels';
import Button from '../button/Button';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as Download } from '../assets/icons/download.svg';
import { getCSVDataExport } from './utils';
import './style.scss';

export const DONUT_CHART_TYPES = Object.freeze({
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    VERTICAL_NO_TOTAL: 'vertical no-total',
});

const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

const Titles = ({ sizeBrick, title, subtitle, pageType }) => {
    return (
        <>
            <div className={`ml-3 mt-2`}>
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

const DonutChartWidget = ({
    className = '',
    id,
    type = DONUT_CHART_TYPES.HORIZONTAL,
    items,
    title,
    subtitle,
    isEnergyConsumptionChartLoading,
    pageType,
    bldgId,
    handleRouteChange,
    showRouteBtn,
    ...props
}) => {
    const labels = items.map(({ label }) => label);
    const colors = items.map(({ color }) => color);
    const series = items.map(({ value }) => parseInt(value));

    const options = {
        ...configDonutChartWidget(type),
        labels,
        colors,
        id,
    };

    return (
        <>
            <div className={`donut-main-wrapper ${className}`}>
                {type === DONUT_CHART_TYPES.HORIZONTAL && (
                    <>
                        {pageType === 'building' ? (
                            <div className="container-header">
                                <Titles {...{ title, subtitle, pageType }} />
                                <div className="d-flex justify-content-between mr-2">
                                    <Button
                                        size={Button.Sizes.sm}
                                        icon={<Download />}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() => getCSVDataExport(labels, series, pageType)}
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
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between">
                                <Titles {...{ title, subtitle, pageType }} />
                                <FontAwesomeIcon
                                    icon={faDownload}
                                    size="md"
                                    className="download-chart-btn mouse-pointer mr-3 mt-3"
                                    onClick={() => getCSVDataExport(labels, series, pageType)}
                                />
                            </div>
                        )}
                    </>
                )}
                <div className={`donut-chart-widget-wrapper w-100 justify-content-center ${className} ${type}`}>
                    {type !== DONUT_CHART_TYPES.HORIZONTAL && <Titles sizeBrick={1.5625} {...{ title, subtitle }} />}
                    <>
                        <div className={`chart-wrapper ${type}`}>
                            <ReactApexChart options={options} {...props} series={series} type="donut" />
                        </div>
                        <div className="chart-labels" style={{ maxWidth: 'max-content' }}>
                            <DonutChartLabels
                                className={type}
                                isShowTrend={type === DONUT_CHART_TYPES.HORIZONTAL}
                                isShowValue={type !== DONUT_CHART_TYPES.VERTICAL_NO_TOTAL}
                                labels={items}
                            />
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

DonutChartWidget.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(Object.values(DONUT_CHART_TYPES)),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
            unit: PropTypes.string.isRequired,
            trendValue: PropTypes.number,
            link: PropTypes.string,
        }).isRequired
    ).isRequired,
    pageType: PropTypes.string,
    bldgId: PropTypes.string,
    handleRouteChange: PropTypes.func,
    showRouteBtn: PropTypes.bool,
};

export default DonutChartWidget;
