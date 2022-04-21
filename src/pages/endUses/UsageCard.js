import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style.css';

const UsageCard = ({ usage, button }) => {
    return (
        <Card className="ml-2 card-group-style">
            <CardBody className="pb-0 pt-2 mt-2">
                <h6 className="card-title usage-title-style" style={{ display: 'inline-block' }}>
                    {usage.title}
                </h6>

                {button === 'View' && (
                    <div className="float-right ml-2">
                        {usage.title === 'HVAC' && (
                            <Link to="/energy/hvac" className="list-group-item border-0">
                                <Button
                                    color="light"
                                    className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                                    View
                                </Button>
                            </Link>
                        )}
                        {usage.title === 'Lighting' && (
                            <Link to="/energy/lightning" className="list-group-item border-0">
                                <Button
                                    color="light"
                                    className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                                    View
                                </Button>
                            </Link>
                        )}
                        {usage.title === 'Plug' && (
                            <Link to="/energy/plug" className="list-group-item border-0">
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
                        <button type="button" className="btn btn-sm btn-primary font-weight-bold">
                            <i className="uil uil-pen mr-1"></i>Explore
                        </button>
                    </div>
                )}

                <div className="mt-2">
                    <p className="subtitle-style" style={{ margin: '1px' }}>
                        Total Consumption
                    </p>
                    <p className="card-text usage-card-content-style">
                        {usage.totalConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val1.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="light-content-style">since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val2.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="light-content-style">from same period last year</span>
                </div>
                <div className="mt-4 mb-4">
                    <p className="subtitle-style" style={{ margin: '2px' }}>
                        After-Hours Consumption
                    </p>
                    <p className="card-text usage-card-content-style">
                        {usage.afterHourConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button
                        className="button-danger text-danger btn-font-style"
                        style={{ width: 'auto', marginBottom: '4px' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val3.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="light-content-style">since last period</span>
                    <br />
                    <button className="button-danger text-danger btn-font-style" style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val4.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="light-content-style">from same period last year</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default UsageCard;
