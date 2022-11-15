import React, { useRef } from 'react';
import './ExploreChart.scss';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from 'highcharts-react-official';
import Typography from '../typography';
import { options } from './constants';
import { DOWNLOAD_TYPES } from '../constants';
import { ReactComponent as BurgerSVG } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);

const ExploreChart = (props) => {
    const chartComponentRef = useRef(null);

    const { data, title, subTitle, dateRange } = props;

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
        chartComponentRef.current.chart.downloadCSV();
    };

    const downloadPNG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/png' });
    };

    const downloadSVG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
    };

    return (
        <div className="explore-chart-wrapper">
            <div className="chart-header">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
                <div>
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
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options({ data, dateRange })}
                ref={chartComponentRef}
            />
        </div>
    );
};

export default ExploreChart;
