import React, { useRef } from 'react';
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

import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { options } from './configuration';
import { DOWNLOAD_TYPES } from '../constants';

import './ColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const ColumnChart = (props) => {
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
                chartComponentRef.current.chart.downloadCSV();
                break;
            default:
                break;
        }
    };

    return (
        <div className="column-chart-wrapper" style={props.style}>
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
                    className={cx("column-chart-more-detail", {
                        //@TODO as temporary solution, need to investigate to put button inside chart's container
                        'no-legends': props?.restChartProps?.legend?.enabled === false
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
    onMoreDetail: PropTypes.func,
    chartHeight: PropTypes.number,
    tooltipUnit: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    tooltipCallBackValue: PropTypes.func,
    restChartProps: PropTypes.object,
};

export default ColumnChart;
