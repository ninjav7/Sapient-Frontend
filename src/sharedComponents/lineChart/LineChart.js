import React, { useRef, useState, useEffect } from 'react';
import './LineChart.scss';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from 'highcharts-react-official';
import Button from '../button/Button';
import Typography from '../typography';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';
import { ReactComponent as BurgerSVG } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import { options } from './constants';
import { DOWNLOAD_TYPES } from '../constants';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);

const LineChart = (props) => {
    const chartComponentRef = useRef(null);
    const wrapperRef = useRef(null);
    const [widthOfWrapper, setWidthOfWrapper] = useState(0);

    const { data, title, subTitle, handleMoreClick, dateRange, tooltipUnit, tooltipLabel } = props;

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
    },[handleMoreClick]);

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
        <div className="line-chart-wrapper" ref={wrapperRef}>
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
                options={options({ data, dateRange, Highcharts, tooltipUnit, tooltipLabel, widthOfWrapper })}
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
        </div>
    );
};

export default LineChart;
