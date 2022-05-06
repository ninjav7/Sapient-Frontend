// @flow
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = ({ donutChartOpts, donutChartData, height, title }) => {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (donutChartOpts) {
            setOptions(donutChartOpts);
        }
        if (donutChartData) {
            setSeries(donutChartData);
        }
    }, [donutChartOpts, donutChartData]);

    return (
        <Card>
            <CardBody>
                {title && <h4 className="header-title mt-0 mb-3">{title}</h4>}
                <Chart options={options} series={series} type="donut" height={height} className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default DonutChart;
