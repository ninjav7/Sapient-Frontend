import _ from 'lodash';
import moment from 'moment';

import { chartsBaseConfig } from '../configs/chartsBaseConfig';

export const options = (props) =>
    _.merge(
        {
            ...chartsBaseConfig({
                columnType: 'column',
                chartHeight: props.chartHeight || 341,
                colors: props.colors,
                series: props.series,
                categories: props.categories,
                onMoreDetail: props.onMoreDetail,
                tooltipUnit: props.tooltipUnit,
                yAxisWithAssignMeasure: false,
                tooltipValuesKey: '{point.y}',
            }),
        },
        _.merge(
            {
                tooltip: {
                    formatter: function (tooltip) {
                        let _this = this;
                        let formatter = (args) => {
                            let momentInstance = moment(args.value);

                            if (props.timeZone) {
                                momentInstance = momentInstance.tz(props.timeZone);
                            }

                            return props.tooltipCallBackValue
                                ? props.tooltipCallBackValue(args)
                                : momentInstance.format(`MMM D 'YY @ hh:mm A`);
                        };

                        _this.points = _this.points.map((point) => ({
                            ...point,
                            key: formatter({ tooltip, _this: this, value: point.key }),
                        }));

                        return tooltip.defaultFormatter.call(_this, tooltip);
                    },
                },
                xAxis: {
                    labels: {
                        formatter: function (args) {
                            let value;

                            if (props.xAxisCallBackValue) {
                                value = props.xAxisCallBackValue({ value: this.value, _this: this, args });
                            }

                            return this.axis.defaultLabelFormatter.call(value ? { ...this, value } : this);
                        },
                    },
                },
            },
            props?.restChartProps
        )
    );
