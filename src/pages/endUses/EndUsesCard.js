import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import './style.css';

const EndUsesCard = ({
    bldgId,
    usage,
    lastPeriodPerTotalHrs,
    lastPeriodPerAfterHrs,
    lastYearPerAfterHrs,
    lastPeriodPerTotalHrsNormal,
    lastPeriodPerAfterHrsNormal,
    lastYearPerAfterHrsNormal,
}) => {
    const history = useHistory();

    const redirectToEndUse = (endUseType) => {
        let endUse = endUseType.toLowerCase();
        history.push({
            pathname: `/energy/end-uses/${endUse}/${bldgId}`,
        });
    };

    return (
        <Card className="ml-2 card-group-style">
            <CardBody className="pb-0 pt-2 mt-2">
                <div className="enduse-card-style">
                    <div className="enduse-card-title">
                        <h6 className="card-title usage-title-style">{usage.device}</h6>
                        <p className="dot" style={{ backgroundColor: usage.color }}></p>
                    </div>

                    <div>
                        <Button
                            color="light"
                            className="btn btn-sm btn-outline-dark font-weight-bold button-style"
                            onClick={() => {
                                redirectToEndUse(usage.device);
                            }}>
                            View
                        </Button>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="subtitle-style" style={{ margin: '1px' }}>
                        Total Consumption
                    </p>
                    <p className="card-text usage-card-content-style">
                        {(usage.energy_consumption.now / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                        <span className="card-unit-style ml-1">kWh</span>
                    </p>
                    {lastPeriodPerTotalHrsNormal && (
                        <button
                            className="button-danger text-danger btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{lastPeriodPerTotalHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {!lastPeriodPerTotalHrsNormal && (
                        <button
                            className="button-success text-success btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-chart-down">
                                <strong>{lastPeriodPerTotalHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {/* <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{lastPeriodPerTotalHrs} %</strong>
                        </i>
                    </button> */}
                    &nbsp;&nbsp;
                    <span className="light-content-style">since last period</span>
                    <br />
                    {lastPeriodPerAfterHrsNormal && (
                        <button
                            className="button-danger text-danger btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{lastPeriodPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {!lastPeriodPerAfterHrsNormal && (
                        <button
                            className="button-success text-success btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-chart-down">
                                <strong>{lastPeriodPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {/* <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{lastYearPerTotalHrs} %</strong>
                        </i>
                    </button> */}
                    &nbsp;&nbsp;
                    <span className="light-content-style">from same period last year</span>
                </div>
                <div className="mt-4 mb-4">
                    <p className="subtitle-style" style={{ margin: '2px' }}>
                        After-Hours Consumption
                    </p>
                    <p className="card-text usage-card-content-style">
                        {(usage.after_hours_energy_consumption.now / 1000).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                        })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    {lastPeriodPerAfterHrsNormal && (
                        <button
                            className="button-danger text-danger btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{lastPeriodPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {!lastPeriodPerAfterHrsNormal && (
                        <button
                            className="button-success text-success btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-chart-down">
                                <strong>{lastPeriodPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {/* <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{lastPeriodPerAfterHrs} %</strong>
                        </i>
                    </button> */}
                    &nbsp;&nbsp;
                    <span className="light-content-style">since last period</span>
                    <br />
                    {lastYearPerAfterHrsNormal && (
                        <button
                            className="button-danger text-danger btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{lastYearPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {!lastYearPerAfterHrsNormal && (
                        <button
                            className="button-success text-success btn-font-style"
                            style={{ width: 'auto', marginBottom: '4px' }}>
                            <i className="uil uil-chart-down">
                                <strong>{lastYearPerAfterHrs} %</strong>
                            </i>
                        </button>
                    )}
                    {/* <button className="button-danger text-danger btn-font-style" style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{lastYearPerAfterHrs} %</strong>
                        </i>
                    </button> */}
                    &nbsp;&nbsp;
                    <span className="light-content-style">from same period last year</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default EndUsesCard;
