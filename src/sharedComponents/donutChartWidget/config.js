import _ from 'lodash';

import { DONUT_CHART_TYPES } from '.';
import { UNITS } from '../../constants/units';
import { formatConsumptionValue } from '../../helpers/helpers';

export const configDonutChartWidget = (type) => {
    const options = {
        chart: {
            type: 'donut',
            events: {
                mounted: function (chartContext, config) {
                    chartContext.toggleDataPointSelection(0, 0);
                },
            },

            height: '100%',
            width: '120%',
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 0,
        },
        itemMargin: {
            horizontal: 0,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '82px',
                    labels: {
                        show: true,
                        name: {
                            show: false,
                        },
                        value: {
                            show: true,
                            fontSize: '1rem',
                            fontWeight: 500,
                            lineHeight: '1rem',
                            formatter: function (val) {
                                return `${formatConsumptionValue(val, 0)} ${UNITS.KWH}`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            fontSize: '1rem',
                            fontWeight: 500,
                            lineHeight: '1rem',
                            formatter: function (w) {
                                let sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return Number(a) + Number(b);
                                }, 0);
                                return `${formatConsumptionValue(sum, 0)} ${UNITS.KWH}`;
                            },
                        },
                    },
                },
            },
        },
        grid: {
            padding: {
                top: -5,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
    };

    if (type === DONUT_CHART_TYPES.VERTICAL_NO_TOTAL) {
        _.set(options, 'plotOptions.pie.donut.labels.value.show', false);
        _.set(options, 'plotOptions.pie.donut.labels.total.show', false);
    }

    return options;
};
