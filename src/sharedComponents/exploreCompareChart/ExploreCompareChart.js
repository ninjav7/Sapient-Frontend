import React, { useRef } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts/highstock';
import HighchartsData from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';

import Typography from '../typography';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import { HighchartsLowMedHigh } from '../common/charts/modules/lowmedhigh';
import EmptyExploreChart from '../exploreChart/components/emptyExploreChart/EmptyExploreChart';

import { DOWNLOAD_TYPES } from '../constants';
import { multipleChartMocks, multipleLineChartOptions } from './constants';

import { ReactComponent as BurgerSVG } from '../../assets/icon/burger.svg';

import './ExploreCompareChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
HighchartsLowMedHigh(Highcharts);

const ExploreCompareChart = (props) => {
    const chartComponentRef = useRef(null);

    const {
        title,
        subTitle,
        data = [],
        pastData = [],
        isLoadingData = false,
        tooltipUnit,
        tooltipLabel,
        chartProps = {},
        timeIntervalObj = {},
    } = props;

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
        multipleLineChartOptions({
            data,
            pastData,
            tooltipUnit,
            tooltipLabel,
            timeIntervalObj,
        }),
        chartProps
    );

    return (
        <div className="explore-compare-chart-wrapper">
            <div className="chart-header">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
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
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={chartConfig}
                ref={chartComponentRef}
            />
        </div>
    );
};

ExploreCompareChart.propTypes = {
    chartProps: PropTypes.object,
};

export default ExploreCompareChart;
