import React, { useRef, useState, useEffect } from 'react';
import HighchartsExporting from 'highcharts/modules/exporting';
import Highcharts from 'highcharts';
import { Spinner } from 'reactstrap';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from '../button/Button';
import Typography from '../typography';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import Brick from '../brick';
import Select from '../form/select';
import { usePlotBandsLegends } from '../common/charts/hooks/usePlotBandsLegends';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import { options } from './configuration';
import { stringOrNumberPropTypes } from '../helpers/helper';
import { DOWNLOAD_TYPES } from '../constants';
import { UNITS } from '../../constants/units';
import { UpperLegendComponent } from '../common/charts/components/UpperLegendComponent/UpperLegendComponent';
import _ from 'lodash';

import './StackedColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const StackedColumnChart = (props) => {
    const { isChartLoading = false, parentChartComponentRef = {}, showExport = true } = props;
    const chartComponentRef = useRef(null);
    const [plotBandsShown, setPlotBandsShown] = useState(true);

    const { plotBandsProp, plotBandsLegends, upperLegendsProps, cbCustomCSV } = props;

    const { plotBands, renderPlotBandsLegends } = usePlotBandsLegends({
        plotBandsProp,
        plotBandsLegends,
        setStateDisabledAfterHours: setPlotBandsShown,
    });

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.downloadSVG:
                chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
                break;
            case DOWNLOAD_TYPES.downloadPNG:
                chartComponentRef.current.chart.exportChart({ type: 'image/png' });
                break;
            case DOWNLOAD_TYPES.downloadCSV:
                if (plotBandsShown && cbCustomCSV && typeof cbCustomCSV === 'function') {
                    const originalCSV = chartComponentRef.current.chart.getCSV();

                    cbCustomCSV(originalCSV);
                } else {
                    chartComponentRef.current.chart.downloadCSV();
                }
                break;
            default:
                break;
        }
    };

    const chartConfig = options({
        ...props,
        plotBands,
    });

    const showUpperLegends = !!renderPlotBandsLegends?.length;

    return (
        <div className="stacked-column-chart-wrapper" style={props.style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{props.subTitle}</Typography.Body>
                </div>
                {showUpperLegends && (
                    <div className="ml-auto d-flex plot-bands-legends-wrapper">
                        {renderPlotBandsLegends.map((legendProps) => {
                            const props = { ...legendProps, ...upperLegendsProps.plotBands };

                            return (
                                <UpperLegendComponent
                                    {...props}
                                    onClick={(event) => {
                                        legendProps?.onClick && legendProps.onClick(event);
                                        const onClick = _.get(upperLegendsProps, 'plotBands.onClick');
                                        onClick && onClick({ event, props });
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
                <div className="d-flex stacked-column-chart-actions">
                    <div className="stacked-column-chart-unit-wrapper">
                        {props.unitInfo?.title && (
                            <Typography.Body size={Typography.Sizes.xs}>{props.unitInfo.title}</Typography.Body>
                        )}
                        {props.unitInfo?.value && (
                            <Typography.Header size={Typography.Sizes.md} className="stacked-column-chart-unit-value">
                                {props.unitInfo.value}
                                {props.unitInfo?.unit && (
                                    <Typography.Body
                                        size={Typography.Sizes.xs}
                                        className="Bold base-black d-inline-block stacked-column-chart-unit-text">
                                        {props.unitInfo.unit}
                                    </Typography.Body>
                                )}
                            </Typography.Header>
                        )}
                    </div>
                    {props.selectUnit && <Select {...props.selectUnit} className="stacked-column-chart-select-unit" />}
                    {showExport && (
                        <DropDownIcon
                            classNameButton="stacked-column-chart-download-button"
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
                            label={''}
                            triggerButtonIcon={<BurgerIcon />}
                            handleClick={handleDropDownOptionClicked}
                        />
                    )}
                </div>
            </div>
            {isChartLoading ? (
                <div className="stacked-column-container w-100">
                    <div className="stacked-column-container-loader">
                        <Spinner />
                    </div>
                </div>
            ) : (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartConfig}
                    ref={showExport ? chartComponentRef : parentChartComponentRef}
                />
            )}

            {props.onMoreDetail && (
                <Button
                    className={cx('column-chart-more-detail', {
                        'no-legends': props?.restChartProps?.legend?.enabled === false,
                    })}
                    label="More Details"
                    size={Button.Sizes.lg}
                    icon={<ArrowRight style={{ height: 11 }} />}
                    type={Button.Type.tertiary}
                    iconAlignment={Button.IconAlignment.right}
                    onClick={props.onMoreDetail}
                />
            )}
        </div>
    );
};

StackedColumnChart.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.number.isRequired),
        })
    ),
    onMoreDetail: PropTypes.func,
    chartHeight: PropTypes.number,
    tooltipUnit: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    restChartProps: PropTypes.object,
    isLegendsEnabled: PropTypes.bool,
    xAxisCallBackValue: PropTypes.func,
    tooltipCallBackValue: PropTypes.func,
    timeZone: PropTypes.string,
    parentChartComponentRef: PropTypes.object,
    showExport: PropTypes.bool,
    ownTooltip: PropTypes.bool,
    // Props for select
    selectUnit: PropTypes.object,
    unitInfo: PropTypes.shape({
        title: PropTypes.string,
        unit: PropTypes.oneOf(Object.values(UNITS)),
        value: stringOrNumberPropTypes,
    }),
};

export default StackedColumnChart;
