import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './LineChart.scss';
import Highcharts from 'highcharts/highstock';
import _ from 'lodash';

import HighchartsReact from 'highcharts-react-official';
import Button from '../button/Button';
import Typography from '../typography';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';
import { ReactComponent as BurgerSVG } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import EmptyLineChart from './components/emptyLineChart/EmptyLineChart';
import { options } from './constants';
import { DOWNLOAD_TYPES } from '../constants';
import { PLOT_BANDS_TYPE } from '../common/charts/modules/contants';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import { generateID, stringOrNumberPropTypes } from '../helpers/helper';
import { UNITS } from '../../constants/units';

import Brick from '../brick';
import { UpperLegendComponent } from '../common/charts/components/UpperLegendComponent/UpperLegendComponent';
import { usePlotBandsLegends } from '../common/charts/hooks/usePlotBandsLegends';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);

const LineChart = (props) => {
    const chartComponentRef = useRef(null);
    const wrapperRef = useRef(null);
    const [widthOfWrapper, setWidthOfWrapper] = useState(0);

    const {
        data,
        title,
        subTitle,
        handleMoreClick,
        dateRange,
        tooltipUnit,
        tooltipLabel,
        plotBands: plotBandsProp,
        plotBandsLegends,
        isLoadingData,
        unitInfo,
        chartProps,
        customDownloadCsvHandler,
    } = props;

    useEffect(() => {
        const handleResize = () => {
            const width = wrapperRef.current?.offsetWidth;
            if (handleMoreClick) {
                setWidthOfWrapper(width - 150);
            } else {
                setWidthOfWrapper(width);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleMoreClick]);

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.downloadSVG:
                downloadSVG();
                break;
            case DOWNLOAD_TYPES.downloadPNG:
                downloadPNG();
                break;
            case DOWNLOAD_TYPES.downloadCSV:
                downloadCSV();
                break;
            default:
                break;
        }
    };

    const downloadCSV = () => {
        if (customDownloadCsvHandler) {
            customDownloadCsvHandler();
        } else {
            chartComponentRef.current.chart.downloadCSV();
        }
    };

    const downloadPNG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/png' });
    };

    const downloadSVG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
    };

    const { plotBands, renderPlotBandsLegends } = usePlotBandsLegends({ plotBandsProp, plotBandsLegends });

    const chartConfig = _.merge(
        options({
            data,
            dateRange,
            Highcharts,
            tooltipUnit,
            tooltipLabel,
            widthOfWrapper,
            plotBands,
        }),
        chartProps
    );

    return (
        <div className="line-chart-wrapper" ref={wrapperRef}>
            <div className="chart-header">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
                {!!renderPlotBandsLegends?.length && (
                    <div className="ml-auto d-flex plot-bands-legends-wrapper">
                        {renderPlotBandsLegends.map((legendProps) => {
                            return <UpperLegendComponent {...legendProps} key={generateID()} />;
                        })}
                    </div>
                )}
                {unitInfo && (
                    <div className="d-flex flex-column mr-4">
                        <Typography.Body size={Typography.Sizes.xs}>{unitInfo.title}</Typography.Body>
                        <div className="d-flex align-items-baseline gap-4 unit-wrapper">
                            <Typography.Header size={Typography.Sizes.md} className="unit-value">
                                {unitInfo.value}
                            </Typography.Header>
                            <Typography.Subheader size={Typography.Sizes.sm} className="unit">
                                {unitInfo.unit}
                            </Typography.Subheader>
                        </div>
                    </div>
                )}
                <div style={{ 'pointer-events': isLoadingData && 'none' }}>
                    <DropDownIcon
                        options={[
                            {
                                name: DOWNLOAD_TYPES.downloadSVG,
                                label: 'Download SVG',
                            },
                            {
                                name: DOWNLOAD_TYPES.downloadPNG,
                                label: 'Download PNG',
                            },
                            {
                                name: DOWNLOAD_TYPES.downloadCSV,
                                label: 'Download CSV',
                            },
                        ]}
                        label={null}
                        triggerButtonIcon={<BurgerSVG />}
                        handleClick={(name) => {
                            handleDropDownOptionClicked(name);
                        }}
                    />
                </div>
            </div>

            <Brick sizeInRem={1} />

            {isLoadingData ? (
                <EmptyLineChart />
            ) : (
                <>
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={chartConfig}
                        ref={chartComponentRef}
                    />
                    {handleMoreClick && (
                        <div className="more-details-wrapper">
                            <Button
                                onClick={handleMoreClick}
                                className="ml-4"
                                label="More Details"
                                size={Button.Sizes.md}
                                type={Button.Type.tertiary}
                                icon={<ArrowSVG />}
                                iconAlignment="right"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

LineChart.propTypes = {
    plotBands: PropTypes.arrayOf(
        PropTypes.shape({
            background: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            from: PropTypes.number.isRequired,
            to: PropTypes.number.isRequired,
            type: PropTypes.oneOf(Object.values(PLOT_BANDS_TYPE)),

            // refer doc https://api.highcharts.com/class-reference/Highcharts.LinearGradientColorObject
            linearGradient: PropTypes.shape({
                x1: PropTypes.number,
                y1: PropTypes.number,
                x2: PropTypes.number,
                y2: PropTypes.number,
            }),
        })
    ),
    chartProps: PropTypes.object,
    unitInfo: PropTypes.shape({
        title: PropTypes.string,
        unit: PropTypes.oneOf(Object.values(UNITS)),
        value: stringOrNumberPropTypes,
    }),
    plotBandsLegends: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            color: PropTypes.oneOfType([
                PropTypes.string.isRequired,
                PropTypes.shape({
                    background: PropTypes.string.isRequired,
                    borderColor: PropTypes.string.isRequired,
                }),
            ]).isRequired,
            onClick: PropTypes.func,
        })
    ),
};

LineChart.PLOT_BANDS_TYPE = PLOT_BANDS_TYPE;

export default LineChart;
