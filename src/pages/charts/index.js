// @flow
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../components/PageTitle';

import LineChart from './LineChart';
import LineAnnotationChart from './LineAnnotationChart';
import SplineAreaChart from './SplineAreaChart';
import StackedAreaChart from './StackedAreaChart';
import BarChart from './BarChart';
import StackedBarChart from './StackedBarChart';
import DonutChart from './DonutChart';
import PieChart from './PieChart';
import MixedChart from './MixedChart';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';

const ApexChart = () => {
    const apexLineChartWithLables = {
        chart: {
            height: 380,
            type: 'line',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#5369f8', '#43d39e', '#f77e53', '#1ce1ac', '#25c2e3', '#ffbe0b'],
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3, 3],
            curve: 'smooth',
        },
        title: {
            // text: 'Average High & Low Temperature',
            align: 'left',
            style: {
                fontSize: '14px',
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        markers: {
            style: 'inverted',
            size: 6,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            title: {
                text: 'Month',
            },
        },
        yaxis: {
            title: {
                text: 'Temperature',
            },
            min: 5,
            max: 40,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5,
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    const apexLineChartWithLablesData = [
        {
            name: 'High - 2018',
            data: [28, 29, 33, 36, 32, 32, 33],
        },
        {
            name: 'Low - 2018',
            data: [12, 11, 14, 18, 17, 13, 13],
        },
    ];

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: [
                'Week 1',
                'Week 2',
                'Week 3',
                'Week 4',
                'Week 5',
                'Week 6',
                'Week 7',
                'Week 8',
                'Week 9',
                'Week 10',
            ],
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' K';
                    }
                    return val;
                },
            },
        },
        colors: ['#3094B9', '#66D6BC', '#2C4A5E', '#847CB5'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'K';
                },
            },
            theme: 'dark',
            x: { show: false },
        },
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'center',
        },

        grid: {
            borderColor: '#f1f3fa',
        },
    });

    const [barChartData, setBarChartData] = useState([
        {
            name: 'HVAC',
            data: [15000, 14000, 12000, 11000, 12000, 14000, 12000, 11000, 12000, 10000],
        },
        {
            name: 'Lighting',
            data: [8000, 7000, 8000, 4000, 5000, 6000, 5000, 7000, 9000, 6000],
        },
        {
            name: 'Plug',
            data: [12000, 14000, 16000, 18000, 20000, 16000, 16000, 14000, 12000, 18000],
        },
        {
            name: 'Other',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ]);

    const [apexDonutOpts, setApexDonutOpts] = useState({
        chart: {
            height: 320,
            type: 'pie',
        },
        labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
        colors: ['#5369f8', '#43d39e', '#f77e53', '#1ce1ac', '#25c2e3', '#ffbe0b'],
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: -10,
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 240,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    });

    const [apexDonutData, setApexDonutData] = useState([44, 55, 41, 17, 15]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Charts',
                        path: '/charts',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Charts', path: '/charts' },
                            { label: 'Apex', path: '/charts', active: true },
                        ]}
                        title={'Charts'}
                    />
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <LineChart
                        title="Line with Data Labels"
                        options={apexLineChartWithLables}
                        series={apexLineChartWithLablesData}
                    />
                </Col>

                <Col xl={6}>
                    <LineAnnotationChart title="Line Chart with Annotations" />
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <SplineAreaChart />
                </Col>

                <Col xl={6}>
                    <StackedAreaChart />
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <BarChart />
                </Col>

                <Col xl={6}>
                    <StackedBarChart
                        title="Stacked Bar Chart"
                        options={barChartOptions}
                        series={barChartData}
                        height={340}
                    />
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <DonutChart
                        donutChartOpts={apexDonutOpts}
                        donutChartData={apexDonutData}
                        height={320}
                        title="Donut Chart"
                    />
                </Col>

                <Col xl={6}>
                    <PieChart />
                </Col>
            </Row>

            <Row>
                <Col>
                    <MixedChart title="Line, Bar and Area (Mixed)" />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ApexChart;
