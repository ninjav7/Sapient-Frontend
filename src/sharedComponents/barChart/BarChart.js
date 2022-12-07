import React, { useRef, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import _ from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../typography';
import Brick from '../brick';
import Button from '../button/Button';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';

import { generateID } from '../helpers/helper';
import { TrendsBadge } from '../trendsBadge';

import useCSVDownload from '../hooks/useCSVDownload';
import { getBarMetricsCSVExport } from './helper';
import { options } from './configuration';
import { DOWNLOAD_TYPES as DOWNLOAD_TYPES_CONSTANT } from '../constants';
import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

import './BarChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const DOWNLOAD_TYPES = {
    ...DOWNLOAD_TYPES_CONSTANT,
    downloadCSVMetrics: 'downloadCSVMetrics',
};

const BarChart = (props) => {
    const { isMetricShown = true } = props;

    const chartComponentRef = useRef(null);
    const [seriesRenderedData, setSeriesRenderedData] = useState({});
    const { download } = useCSVDownload();

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
            case DOWNLOAD_TYPES.downloadCSVMetrics:
                const fileName = `Metrics_${new Date().toISOString().split('T')[0]}.csv`;
                download(fileName, getBarMetricsCSVExport(props?.series[0], props.csvColumns));
                break;
            default:
                break;
        }
    };

    const seriesData = props?.series[0]?.data;
    const isMetricDataExist = seriesData.some((data) => data[2]);
    const showMetric = isMetricShown && seriesData && isMetricDataExist;

    return (
        <div className={cx('bar-chart-wrapper', props.className)} style={props.style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{props.subTitle}</Typography.Body>
                </div>
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
                        {
                            name: DOWNLOAD_TYPES.downloadCSVMetrics,
                            label: 'Download Chart & Table CSV',
                        },
                    ]}
                    label={''}
                    triggerButtonIcon={<BurgerIcon />}
                    handleClick={handleDropDownOptionClicked}
                />
            </div>

            <Brick sizeInRem={1.15} />

            <div
                className={cx({
                    'd-flex': showMetric,
                })}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options({
                        ...props,
                        //series is mutating for some reasons
                        series: _.cloneDeep(props.series),
                        seriesRenderedData: setSeriesRenderedData,
                    })}
                    ref={chartComponentRef}
                />

                {showMetric && (
                    <ul className="bar-chart-meta-info-wrapper">
                        {(seriesData || []).map(([name, value, data = {}]) => {
                            return (
                                <li
                                    className="text-nowrap d-flex align-items-center bar-chart-meta-info"
                                    key={generateID()}
                                    style={{ height: seriesRenderedData.barW }}>
                                    <Typography.Body size={Typography.Sizes.lg} className="gray-600">
                                        {data.value}
                                    </Typography.Body>
                                    <Typography.Body size={Typography.Sizes.lg} className="gray-600">
                                        {data.percent}
                                    </Typography.Body>
                                    {data.trendValue && (
                                        <TrendsBadge
                                            type={data.trendType}
                                            value={data.trendValue}
                                            className="bar-chart-meta-info-trend-badge"
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {props.onMoreDetail && (
                <div className="bar-chart-more-detail mt-3">
                    <Button
                        label="More Details"
                        size={Button.Sizes.lg}
                        icon={<ArrowRight style={{ height: 11 }} />}
                        type={Button.Type.tertiary}
                        iconAlignment={Button.IconAlignment.right}
                        onClick={props.onMoreDetail}
                    />
                </div>
            )}
        </div>
    );
};

BarChart.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
        PropTypes.shape([
            PropTypes.string,
            PropTypes.string,
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                data: PropTypes.arrayOf(PropTypes.number.isRequired),
            }),
        ])
    ),
    csvColumns: PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    onMoreDetail: PropTypes.func,
    chartHeight: PropTypes.number,
    isMetricShown: PropTypes.bool,
};

export default BarChart;
