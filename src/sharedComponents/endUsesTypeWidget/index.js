import React from 'react';
import PropTypes from 'prop-types';
import StackedBarChart from './StackedBarChart';
import { UNITS } from '../../constants/units';
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

const EndUsesTypeWidget = ({ endUsesData, barChartOptions, barChartData }) => {
    return (
        <>
            <div className="enduse-type-widget-wrapper mt-4">
                <div className="p-3">
                    <EndUsesCategory endUsesData={endUsesData} />
                </div>

                <div className="pr-2 pb-3">
                    <StackedBarChart options={barChartOptions} series={barChartData} height={400} />
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
    barChartOptions: PropTypes.object.isRequired,
    barChartData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                }).isRequired
            ),
        })
    ).isRequired,
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
