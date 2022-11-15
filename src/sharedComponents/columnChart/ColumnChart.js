import React, { useRef } from 'react';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Button from '../button/Button';
import Brick from '../brick';

// import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { options } from './configuration';

import './ColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const DOWNLOAD_TYPES = Object.freeze({
    DOWNLOAD_SVG: 'downloadSVG',
    DOWNLOAD_PNG: 'downloadPNG',
    DOWNLOAD_CSV: 'downloadCSV',
});

const ColumnChart = (props) => {
    const chartComponentRef = useRef(null);

    const BurgerIcon = () => <div />;

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.DOWNLOAD_SVG:
                chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
                break;
            case DOWNLOAD_TYPES.DOWNLOAD_PNG:
                chartComponentRef.current.chart.exportChart({ type: 'image/png' });
                break;
            case DOWNLOAD_TYPES.DOWNLOAD_CSV:
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
                            name: DOWNLOAD_TYPES.DOWNLOAD_SVG,
                            label: 'Download SVG',
                        },
                        {
                            name: DOWNLOAD_TYPES.DOWNLOAD_PNG,
                            label: 'Download PNG',
                        },
                        {
                            name: DOWNLOAD_TYPES.DOWNLOAD_CSV,
                            label: 'Download CSV',
                        },
                    ]}
                    label={''}
                    triggerButtonIcon={<BurgerIcon />}
                    handleClick={handleDropDownOptionClicked}
                />
            </div>
            <Brick sizeInRem={1.5} />
            <HighchartsReact highcharts={Highcharts} options={options({ props })} ref={chartComponentRef} />

            {props.onMoreDetail && (
                <Button
                    className="column-chart-more-detail"
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
};

export default ColumnChart;
