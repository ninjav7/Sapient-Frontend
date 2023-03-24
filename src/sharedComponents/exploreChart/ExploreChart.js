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
    } = props;

    const [withTemp, setWithTemp] = useState(withTempProp);

    const { renderWeatherLegends } = useWeatherLegends();

    useEffect(() => {
        setWithTemp(withTempProp);
    }, [withTempProp]);

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

    const filterWeather = useCallback(() => {
        setWithTemp((old) => !old);
    }, []);

    const showUpperLegends = series.some((serie) => serie.type === LOW_MED_HIGH);

    const chartConfig = _.merge(
        options({
            series: withTemp ? series : series.filter(({ type }) => type !== LOW_MED_HIGH),
            data,
            dateRange,
            tooltipUnit,
            tooltipLabel,
            widgetProps: props,
        }),
        chartProps
    );

    return (
        <div className="explore-chart-wrapper">
            <div className="chart-header">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
                {showUpperLegends && (
                    <div className="ml-auto d-flex plot-bands-legends-wrapper">
                        {renderWeatherLegends.map((legendProps) => (
                            <UpperLegendComponent {...legendProps} disabled={!withTemp} onClick={filterWeather} />
                        ))}
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
};

export default ExploreChart;
