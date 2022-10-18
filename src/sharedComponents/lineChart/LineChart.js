import React from 'react';
import classnames from 'classnames';
import './LineChart.scss';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
const LineChart = (props) => {
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className, setPageSize } = props;
    const data = { data1: [1, 3, 5, 6, 3, 2, 5, 6, 7, 5, 3] };

    // const options = {
    //     title: {
    //         text: 'Line chart',
    //         style: {
    //             display: 'none',
    //         },
    //     },
    //     legend: {
    //         align: 'right',
    //         verticalAlign: 'top',
    //         symbolWidth: 5,
    //         symbolHeight: 8,
    //     },
    //     xAxis: {
    //         tickColor: '#FFFFFF',
    //         categories: props.categories,
    //     },
    //     yAxis: {
    //         tickColor: '#FFFFFF',
    //         gridLineColor: '#FFFFFF',
    //         title: {
    //             style: {
    //                 display: 'none',
    //             },
    //         },
    //         labels: {
    //             formatter: function () {
    //                 return `$${this.value}`;
    //             },
    //         },
    //     },
    //     plotOptions: {
    //         series: {
    //             marker: {
    //                 symbol: 'circle',
    //             },
    //         },
    //     },
    //     tooltip: {
    //         shared: true,
    //     },
    //     series: [
    //         {
    //             type: 'column',
    //             name: 'Bar',
    //             color: '#6a6a6a',
    //             pointPadding: 0,
    //             groupPadding: 0,
    //             data: props.data3,
    //         },
    //         {
    //             type: 'line',
    //             name: 'Line 1',
    //             color: '#0071ce',
    //             data: props.data1,
    //         },
    //         {
    //             type: 'line',
    //             name: 'Line 2',
    //             color: '#ff671b',
    //             data: props.data2,
    //         },
    //     ],
    // };
    const options = {
        title: {
          text: "My stock chart"
        },
        boost: {
            useGPUTranslations: true,
            // Chart-level boost when there are more than 5 series in the chart
            seriesThreshold: 5
        },
        series: [
          {
            data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
          }
        ]
      };
    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    const categories = ['one', 'two', 'three', 'four', 'five', 'six'];
  

    return (
        <div className="line-chart-wrapper">

            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
            
        </div>
    );
};

export default LineChart;
