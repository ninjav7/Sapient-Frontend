import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import { HighchartsChart, HighchartsProvider, XAxis, YAxis, Title, Series, Tooltip, Chart } from 'react-jsx-highcharts';

import Typography from '../typography';

import { getColorBasedOnIndex } from './utils';
import { renderComponents } from '../columnChart/helper';
import { formatConsumptionValue } from '../helpers/helper';

import './styles.scss';

const SynchronizedCharts = (props) => {
    const { currentChartData = {}, pastChartData = {}, isComparisionOn = false, xAxisLabels } = props;

    const [chartData, setChartData] = useState(null);
    const [hoveredIndexId, setHoveredIndexId] = useState(null);

    // Cache the default values to restore when this component unmounts
    const oldReset = Highcharts.Pointer.prototype.reset;
    const oldHighlight = Highcharts.Point.prototype.highlight;

    const plotOptions = {
        series: {
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true,
                    },
                },
            },
        },
    };

    const handleMouseMove = (e) => {
        let point = null;
        let event = null;

        e.persist();
        Highcharts.charts.forEach((chart) => {
            if (!chart) return;
            event = chart.pointer.normalize(e); // Find coordinates within the chart
            point = chart.series[0].searchPoint(event, true); // Get the hovered point
            if (point) {
                point.highlight(e);
            }
        });
    };

    useEffect(() => {
        // Override the Highcharts prototypes here, so they only apply to this component
        Highcharts.Pointer.prototype.reset = () => {};

        Highcharts.Point.prototype.highlight = function (event) {
            this.onMouseOver(); // Show the hover marker
            // this.series.chart.tooltip.refresh(this); // Show the tooltip
            this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };

        const newCurrentData = _.cloneDeep(currentChartData);

        if (newCurrentData?.datasets && newCurrentData?.datasets.length !== 0) {
            newCurrentData.datasets.forEach((el, index) => {
                const { unit } = el;

                let newFormattedDataSets = [];

                if (el?.data && el?.data.length !== 0) {
                    el.data.forEach((record, dataIndex) => {
                        const color = getColorBasedOnIndex(dataIndex);

                        newFormattedDataSets.push({
                            ...record,
                            chart_color: color,
                            chart_units: unit,
                            dash_style: 'Solid',
                        });

                        if (isComparisionOn && pastChartData.datasets[index]?.data[dataIndex]) {
                            newFormattedDataSets.push({
                                ...pastChartData.datasets[index].data[dataIndex],
                                chart_color: color,
                                chart_units: unit,
                                dash_style: 'Dash',
                            });
                        }
                    });
                }

                el.data = newFormattedDataSets;
            });
        }

        setChartData(newCurrentData);

        // Cleanup: Restore the cached defaults
        return () => {
            Highcharts.Pointer.prototype.reset = oldReset;
            Highcharts.Point.prototype.highlight = oldHighlight;
        };
    }, [currentChartData, pastChartData, isComparisionOn]);

    if (!chartData) return null;

    return (
        <div onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
            {chartData?.datasets &&
                chartData.datasets.map((dataset, index) => {
                    return (
                        <div
                            onMouseOver={() => {
                                setHoveredIndexId(index);
                            }}
                            className="mb-1">
                            <HighchartsProvider Highcharts={Highcharts} key={dataset.name}>
                                <HighchartsChart plotOptions={plotOptions}>
                                    <Chart type="line" height={200}></Chart>
                                    <Title align="left" margin={25} x={0} style={{ fontSize: '1rem' }}>
                                        {dataset?.name}
                                    </Title>

                                    <XAxis
                                        crosshair
                                        id={`sync-chart-${index}`}
                                        type={'datetime'}
                                        gridLineWidth={0}
                                        labels={{ format: xAxisLabels }}
                                    />

                                    {/* <XAxis
                                        crosshair
                                        id={`opposite-sync-chart-${index}`}
                                        type={'datetime'}
                                        gridLineWidth={0}
                                        labels={{ format: xAxisLabels }}
                                        opposite
                                        visible={false}
                                    /> */}

                                    <YAxis>
                                        {dataset?.data.map((line, lineIndex) => (
                                            <Series
                                                key={`chart-${lineIndex}`}
                                                name={line?.name}
                                                data={line?.data}
                                                color={line?.chart_color}
                                                type="line"
                                                dashStyle={line?.dash_style}
                                                tooltip={{ valueSuffix: ` ${dataset?.unit}` }}
                                            />
                                        ))}
                                    </YAxis>

                                    {hoveredIndexId === index && (
                                        <Tooltip
                                            shared={true}
                                            split={false}
                                            snap={0}
                                            useHTML={true}
                                            shape={'div'}
                                            padding={0}
                                            borderWidth={0}
                                            shadow={0}
                                            zIndex={9999}
                                            formatter={function () {
                                                const points = this.points; // The `this` object refers to the tooltip context
                                                const indexPos = points[0]?.x; // Fetch index position
                                                const timestamp = chartData?.xData[indexPos]; // Fetch timestamp
                                                const dataSets = chartData?.datasets; // All Metrics & Buildings dataset

                                                const newMappedDataSets = dataSets?.flatMap((el) => el?.data) || []; // Fetched into single array

                                                let tooltipContent = `<div class='chart-tooltip'>
                                                <div class="gray-550 fs-1">Consumption Data:</div>
                                                 ${renderComponents(
                                                     <Typography.Subheader
                                                         size={Typography.Sizes.sm}
                                                         className="gray-550">
                                                         {timestamp}
                                                     </Typography.Subheader>
                                                 )} <table>`;

                                                // Iterate through each point in the tooltip
                                                newMappedDataSets.forEach((el, newDataSetIndex) => {
                                                    const value = el?.data[indexPos]
                                                        ? formatConsumptionValue(el?.data[indexPos], 2)
                                                        : 0;

                                                    tooltipContent += `
                                                        <div class="mt-1 mb-1" style="color: ${el?.chart_color};">
                                                            <span>${el?.name}:</span> ${value} ${el?.chart_units}
                                                        </div>                                                      
                                                       `;
                                                });

                                                // Footer content
                                                tooltipContent += '</div>';

                                                return tooltipContent;
                                            }}
                                            footerFormat={'</table></div>'}
                                        />
                                    )}
                                </HighchartsChart>
                            </HighchartsProvider>
                        </div>
                    );
                })}
        </div>
    );
};

SynchronizedCharts.propTypes = {
    currentChartData: PropTypes.object,
    pastChartData: PropTypes.object,
    isComparisionOn: PropTypes.bool,
    xAxisLabels: PropTypes.any,
};

export default SynchronizedCharts;
