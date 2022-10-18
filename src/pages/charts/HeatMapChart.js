// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

const HeatMapChart = ({ options, series, height, className = '' }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`} style={{ minHeight: '0vh', height: '85%', padding:'0.5rem', justifyContent:'center'}}>
            <Chart series={series} options={options} type="heatmap" height={height} className="line-chart-widget" />
        </div>
    );
};

export default HeatMapChart;
