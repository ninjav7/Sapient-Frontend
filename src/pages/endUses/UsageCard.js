import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style.css';

const UsageCard = ({
    bldgId,
    usage,
    button,
    lastPeriodPerTotalHrs,
    lastYearPerTotalHrs,
    lastPeriodPerAfterHrs,
    lastYearPerAfterHrs,
    lastPeriodPerTotalHrsNormal,
    lastYearPerTotalHrsNormal,
    lastPeriodPerAfterHrsNormal,
    lastYearPerAfterHrsNormal,
}) => {
    return (
        <Card className="ml-2 card-group-style">
            <CardBody className="pb-0 pt-2 mt-2">
                <h6 className="card-title usage-title-style" style={{ display: 'inline-block' }}>
                    {usage.device}
                </h6>

                {button === 'View' && (
                    <div className="float-right ml-2">
                        {usage.device === 'HVAC' && (
                            <Link
                                to={{
                                    pathname: `/energy/hvac/${bldgId}`,
                                }}>
                                <Button
                                    color="light"
                                    className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                                    View
                                </Button>
                            </Link>
                        )}
                        {usage.device === 'Lighting' && (
                            <Link
                                to={{
                                    pathname: `/energy/lighting/${bldgId}`,
                                }}>
                                <Button
                                    color="light"
                                    className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                                    View
                                </Button>
                            </Link>
                        )}
                        {usage.device === 'Plug' && (
                            <Link
                                to={{
                                    pathname: `/energy/plug-load/${bldgId}`,
                                }}>
                                <Button
                                    color="light"
                                    className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                                    View
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {button === 'Explore' && (
                    <div className="float-right ml-2">
                        <Link to="/explore/page">
                            <button type="button" className="btn btn-sm btn-primary font-weight-bold">
                                <i className="uil uil-pen mr-1"></i>Explore
                            </button>
                        </Link>
                    </div>
                )}

                <div className="mt-2">
                    <p className="subtitle-style" style={{ margin: '1px' }}>
                        Total Consumption
                    </p>
                    <p className="card-text usage-card-content-style">
                        {(usage.energy_consumption.now / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
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
                            maximumFractionDigits: 2,
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

export default UsageCard;
