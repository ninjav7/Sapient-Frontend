import React, { useRef } from 'react';
//@TODO Probably we can find something better then use React Server to render components to string.
import ReactDOMServer from 'react-dom/server';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsData from 'highcharts/modules/export-data';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../typography';
import Button from '../button/Button';
import Brick from '../brick';

// import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

import './ColumnChart.scss';

HighchartsExporting(Highcharts);
HighchartsData(Highcharts);
highchartsAccessibility(Highcharts);

const assignMeasureUnit = (value) => {
    return value !== '0' ? value + 'k' : value;
};

const renderComponents = (elems) => {
    return ReactDOMServer.renderToString(elems);

    // const container = document.createElement('div');

    // ReactDOM.render(elems, container);

    // return container;
};

const options = ({ props }) => ({
    chart: {
        type: 'column',
        height: props.chartHeight || 341,
        spacing: [10, 5, 15, 5],
        components: {
            chartMenu: null,
        },
    },

    navigation: {
        buttonOptions: {
            enabled: false,
        },
    },

    legend: {
        // @TODO Option if button is existing
        align: props.onMoreDetail ? 'left' : 'center',
        // labelFormatter: function () {
        //     return this.name + ' (click to hide)';
        // },
        useHTML: true,
        labelFormat: renderComponents(
            <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                {'{name}'}
            </Typography.Subheader>
        ),
        // itemMarginBottom: 100,
        itemMarginTop: 22,
        // symbolWidth: 10,
        // symbolPadding: 0,

        x: -5,
        // y: 26,
        // symbolPadding: 20,
        symbolWidth: 10,
    },

    xAxis: {
        categories: ['0', '2', '4', '6', '8', '9', '10', '12', '14', '16', '18', '20'],
        crosshair: true,
        labels: {
            format: renderComponents(
                <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                    {'{text}'}
                </Typography.Subheader>
            ),
        },
    },
    title: {
        text: '',
    },
    // subtitle: {
    //     text: 'Source: ' + '<a href="https://www.ssb.no/en/statbank/table/08940/" ' + 'target="_blank">SSB</a>',
    // },
    yAxis: [
        {
            // Primary yAxis
            // title: {
            //     useHTML: true,
            //     text: 'Million tonnes CO<sub>2</sub>-equivalents',
            // },
            title: null,
            labels: {
                format: renderComponents(
                    <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                        {'{text}'}
                    </Typography.Subheader>
                ),
                formatter: function (args) {
                    const { axis, value } = args;

                    const { numberFormatter } = axis.chart;

                    /* eslint-enable valid-jsdoc */
                    return renderComponents(
                        <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                            {assignMeasureUnit(numberFormatter(value || 0, -1))}
                        </Typography.Subheader>
                    );
                },
            },
        },
        {
            // Secondary yAxis
            gridLineWidth: 0,
            title: null,
            labels: {
                format: '{value} mm',
                style: {
                    color: Highcharts.getOptions().colors[0],
                },
            },
            opposite: true,
        },
    ],
    tooltip: {
        headerFormat: `<div class="сhart-tooltip">${renderComponents(
            <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                {'{point.key}'}
            </Typography.Subheader>
        )} <table>`,
        pointFormat: `<tr> <td style="color:{series.color};padding:0">
            ${renderComponents(
                <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                    content
                </Typography.Header>
            ).replace('content', '<span style="color:{series.color};">{series.name}:</span>')}
            </td><td style="padding:0; display: flex; align-items: center; gap: 4px; justify-content: end;">${renderComponents(
                <Typography.Header size={Typography.Sizes.xs}>{'{point.y:.1f}'}</Typography.Header>
            )}${renderComponents(
            <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                kWh
            </Typography.Subheader>
        )}</td></tr>`,
        footerFormat: '</table></div>',
        shared: true,
        useHTML: true,
        shape: 'div',
        padding: 0,
        borderWidth: 0,
        shadow: 0,
        borderRadius: '4px',
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
        },
    },
    credits: {
        enabled: false,
    },
    colors: props.colors,
    // series: props.series,

    series: props.series,
});

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
        <div className="сolumn-сhart-wrapper" style={props.style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{props.subTitle}</Typography.Body>
                </div>
                <DropDownIcon
                    classNameButton="сolumn-сhart-download-button"
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
                    className="сolumn-сhart-more-detail"
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
};

export default ColumnChart;
