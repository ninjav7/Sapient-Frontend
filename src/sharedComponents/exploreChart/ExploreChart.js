import React, { useEffect, useState, useRef, useCallback } from 'react';
import './ExploreChart.scss';
import Highcharts from 'highcharts/highstock';
import PropTypes from 'prop-types';
import _ from 'lodash';

import HighchartsReact from 'highcharts-react-official';
import Typography from '../typography';
import { options } from './constants';
import { DOWNLOAD_TYPES } from '../constants';
import { ReactComponent as BurgerSVG } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import EmptyExploreChart from './components/emptyExploreChart/EmptyExploreChart';
import { HighchartsLowMedHigh } from '../common/charts/modules/lowmedhigh';
import { LOW_MED_HIGH } from '../common/charts/modules/contants';
import { UpperLegendComponent } from '../common/charts/components/UpperLegendComponent/UpperLegendComponent';
import { useWeatherLegends } from '../common/charts/hooks/useWeatherLegends';
import { LOW_MED_HIGH_TYPES } from '../common/charts/modules/contants';
import { generateID } from '../helpers/helper';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
HighchartsLowMedHigh(Highcharts);

const ExploreChart = (props) => {
    const chartComponentRef = useRef(null);

    const {
        data,
        series,
        title,
        subTitle,
        dateRange,
        tooltipUnit,
        tooltipLabel,
        isLoadingData,
        chartProps,
        withTemp: withTempProp,
        upperLegendsProps = {},
        temperatureSeries,
    } = props;

    const [withTemp, setWithTemp] = useState(withTempProp);

    const { renderWeatherLegends } = useWeatherLegends();

    useEffect(() => {
        setWithTemp(withTempProp);
    }, [withTempProp]);

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
                break;
            default:
                break;
        }
    };

    const chartConfig = _.merge(
        options({
            series,
            temperatureSeries: withTemp && temperatureSeries,
            data,
            dateRange,
            tooltipUnit,
            tooltipLabel,
            widgetProps: props,
        }),
        chartProps
    );

    const { weather } = upperLegendsProps;
    const weatherIsAlwaysShown = weather?.isAlwaysShown;

    const showUpperLegends =
        series?.some((serie) => serie.type === LOW_MED_HIGH) || !!temperatureSeries || weatherIsAlwaysShown;

    return (
        <div className="explore-chart-wrapper">
            <div className="chart-header">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
                {showUpperLegends && (
                    <div className="ml-auto d-flex plot-bands-legends-wrapper">
                        {renderWeatherLegends.map((legendProps) => {
                            const props = { ...legendProps, disabled: !withTemp, ...upperLegendsProps.plotBands };

                            return (
                                <UpperLegendComponent
                                    {...props}
                                    disabled={!withTemp}
                                    onClick={(event) => {
                                        filterWeather(event);

                                        legendProps?.onClick && legendProps.onClick(event);

                                        const onClick = _.get(upperLegendsProps, 'weather.onClick');
                                        onClick && onClick({ event, props, withTemp: !withTemp });
                                    }}
                                    key={generateID()}
                                />
                            );
                        })}
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
                        handleClick={handleDropDownOptionClicked}
                    />
                </div>
            </div>
            {isLoadingData ? (
                <EmptyExploreChart />
            ) : (
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={chartConfig}
                    ref={chartComponentRef}
                />
            )}
        </div>
    );
};

ExploreChart.propTypes = {
    disableDefaultPlotBands: PropTypes.bool,
    chartProps: PropTypes.object,
    upperLegendsProps: PropTypes.shape({
        weather: PropTypes.object,
        plotBands: PropTypes.object,
    }),
    temperatureSeries: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(Object.values(LOW_MED_HIGH_TYPES)),
            data: PropTypes.arrayOf(PropTypes.number.isRequired),
            color: PropTypes.string.isRequired,
        })
    ),
    withTemp: PropTypes.bool,
};

export default ExploreChart;
