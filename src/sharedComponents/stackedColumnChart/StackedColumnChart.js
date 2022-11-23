import React, { useRef } from 'react';
import HighchartsExporting from 'highcharts/modules/exporting';
import Highcharts from 'highcharts';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import Button from '../button/Button';
import Typography from '../typography';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import Brick from '../brick';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import { options } from './configuration';
import { DOWNLOAD_TYPES } from '../constants';

import './StackedColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const StackedColumnChart = (props) => {
    const chartComponentRef = useRef(null);

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.downloadSVG:
                chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
                break;
            case DOWNLOAD_TYPES.downloadPNG:
                chartComponentRef.current.chart.exportChart({ type: 'image/png' });
                break;
            case DOWNLOAD_TYPES.downloadCSV:
                console.log('csv');
                chartComponentRef.current.chart.downloadCSV();
                break;
            default:
                break;
        }
    };

    return (
        <div className="stacked-column-chart-wrapper" style={props.style}>
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
                    ]}
                    label={''}
                    triggerButtonIcon={<BurgerIcon />}
                    handleClick={handleDropDownOptionClicked}
                />
            </div>
            <Brick sizeInRem={1.5} />

            <HighchartsReact highcharts={Highcharts} options={options(props)} ref={chartComponentRef} />

            {props.onMoreDetail && (
                <Button
                    className="stacked-column-chart-more-detail"
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
            data: PropTypes.array,
        })
    ),
    onMoreDetail: PropTypes.func,
    chartHeight: PropTypes.number,
    tooltipUnit: PropTypes.string,
    categories: PropTypes.array,
};

export default StackedColumnChart;
