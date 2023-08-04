import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { UNITS } from '../../../constants/units';
import { UserStore } from '../../../store/UserStore';
import StackedColumnChart from '../../../sharedComponents/stackedColumnChart/StackedColumnChart';
import './style.scss';

const EndUsesCategory = ({ endUsesData }) => {
    return (
        <div className="w-50 d-flex justify-content-start enduse-type">
            {endUsesData?.map((record) => {
                return (
                    <div className={`enduse-type-body`}>
                        <div className="d-flex align-items-center">
                            <p className="dot mt-2 mr-2" style={{ backgroundColor: record?.color }}></p>
                            <h5 className="enduse-type-title">{record?.device}</h5>
                        </div>
                        <div className="d-flex">
                            <p className="enduse-type-text"> {record?.energy_consumption?.now}</p>
                            <div className="enduse-type-unit"> {UNITS.KWH} </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const EndUsesTypeWidget = ({
    endUsesData,
    stackedColumnChartData,
    stackedColumnChartCategories,
    endUseCategories,
    xAxisObj,
    timeZone,
    dateFormat,
    daysCount,
}) => {
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const formatXaxis = ({ value }) => {
        return moment.utc(value).format(`${dateFormat}`);
    };

    const toolTipFormatter = ({ value }) => {
        const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
        const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

        return daysCount >= 182
            ? moment.utc(value).format(`MMM 'YY`)
            : moment.utc(value).format(`${date_format} @ ${time_format}`);
    };

    return (
        <>
            <div className="enduse-type-widget-wrapper">
                <div className="p-3">
                    <EndUsesCategory endUsesData={endUsesData} />
                </div>

                <div>
                    <StackedColumnChart
                        style={{ width: 'auto', border: '0rem' }}
                        colors={endUseCategories}
                        categories={stackedColumnChartCategories}
                        tooltipUnit={UNITS.KWH}
                        series={stackedColumnChartData}
                        isLegendsEnabled={false}
                        timeZone={timeZone}
                        xAxisCallBackValue={formatXaxis}
                        restChartProps={xAxisObj}
                        tooltipCallBackValue={toolTipFormatter}
                    />
                </div>
            </div>
        </>
    );
};

EndUsesTypeWidget.propTypes = {
    endUsesData: PropTypes.arrayOf(
        PropTypes.shape({
            device: PropTypes.string.isRequired,
            energy_consumption: PropTypes.object.isRequired,
            after_hours_energy_consumption: PropTypes.object.isRequired,
            color: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    stackedColumnChartData: PropTypes.array.isRequired,
    stackedColumnChartCategories: PropTypes.array.isRequired,
};

EndUsesCategory.propTypes = {
    endUsesData: PropTypes.arrayOf(
        PropTypes.shape({
            device: PropTypes.string.isRequired,
            energy_consumption: PropTypes.object.isRequired,
            after_hours_energy_consumption: PropTypes.object.isRequired,
            color: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default EndUsesTypeWidget;
