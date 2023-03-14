import React, { useCallback, useRef, useState } from 'react';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Button from '../button/Button';
import Brick from '../brick';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import { UpperLegendComponent } from '../common/charts/components/UpperLegendComponent/UpperLegendComponent';

import { useWeatherLegends } from '../common/charts/hooks/useWeatherLegends';
import { options } from './configuration';
import { usePlotBandsLegends } from '../common/charts/hooks/usePlotBandsLegends';
import { highchartsAddLowMedHighToTooltip } from './module';

import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { DOWNLOAD_TYPES } from '../constants';
import { LOW_MED_HIGH_TYPES, PLOT_BANDS_TYPE } from '../common/charts/modules/contants';

import './ColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);
highchartsAddLowMedHighToTooltip(Highcharts);

const ColumnChart = (props) => {
    const { plotBandsLegends, plotBands: plotBandsProp, withTemp: withTempProp = true } = props;

    const chartComponentRef = useRef(null);
    const [withTemp, setWithTemp] = useState(withTempProp);

    const { plotBands, renderPlotBandsLegends } = usePlotBandsLegends({ plotBandsProp, plotBandsLegends });
    const { renderWeatherLegends } = useWeatherLegends();

    const filterWeather = useCallback(() => {
        setWithTemp((old) => !old);
    }, []);

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.downloadSVG:
                chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
                break;
            case DOWNLOAD_TYPES.downloadPNG:
                chartComponentRef.current.chart.exportChart({ type: 'image/png' });
                break;
            case DOWNLOAD_TYPES.downloadCSV:
                chartComponentRef.current.chart.downloadCSV();
        }
    };

    const chartConfig = options({ ...props, temperatureSeries: withTemp ? props.temperatureSeries : [], plotBands });

    return (
        <div className="column-chart-wrapper" style={props.style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{props.subTitle}</Typography.Body>
                </div>
                {!!renderPlotBandsLegends?.length && (
                    <div className="ml-auto d-flex plot-bands-legends-wrapper">
                        {renderPlotBandsLegends.map((legendProps) => {
                            return <UpperLegendComponent {...legendProps} />;
                        })}
                        {props.temperatureSeries &&
                            renderWeatherLegends.map((legendProps) => (
                                <UpperLegendComponent {...legendProps} disabled={!withTemp} onClick={filterWeather} />
                            ))}
                    </div>
                )}
                <DropDownIcon
                    classNameButton="column-chart-download-button"
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
            </div>
            <Brick sizeInRem={1.5} />
            <HighchartsReact highcharts={Highcharts} options={chartConfig} ref={chartComponentRef} />

            {props.onMoreDetail && (
                <Button
                    className={cx('column-chart-more-detail', {
                        //@TODO as temporary solution, need to investigate to put button inside chart's container
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

ColumnChart.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.number.isRequired),
        })
    ),
    temperatureSeries: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(Object.values(LOW_MED_HIGH_TYPES)),
            data: PropTypes.arrayOf(PropTypes.number.isRequired),
            color: PropTypes.string.isRequired,
        })
    ),
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
    onMoreDetail: PropTypes.func,
    chartHeight: PropTypes.number,
    tooltipUnit: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    tooltipCallBackValue: PropTypes.func,
    restChartProps: PropTypes.object,
    withTempProp: PropTypes.bool,
};

export default ColumnChart;
