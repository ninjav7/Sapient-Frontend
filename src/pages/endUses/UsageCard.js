import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import './style.css';

const UsageCard = ({ usage, button }) => {
    return (
        <Card className="ml-2 card-group-style">
            <CardBody className="pb-0 pt-2 mt-2">
                <h6 className="card-title title-style" style={{ display: 'inline-block', fontWeight: 'bolder' }}>
                    {usage.title}
                </h6>

                {button === 'View' && (
                    <div className="float-right ml-2">
                        {usage.title === 'HVAC' && (
                            <Button
                                color="light"
                                className="btn btn-sm btn-outline-dark font-weight-bold button-style"
                                onClick={(e) => {
                                    window.open('/energy/hvac', '_parent');
                                }}>
                                View
                            </Button>
                        )}
                        {usage.title === 'Lighting' && (
                            <Button
                                color="light"
                                className="btn btn-sm btn-outline-dark font-weight-bold button-style"
                                onClick={(e) => {
                                    window.open('/energy/lightning', '_parent');
                                }}>
                                View
                            </Button>
                        )}
                        {usage.title === 'Plug' && (
                            <Button
                                color="light"
                                className="btn btn-sm btn-outline-dark font-weight-bold button-style"
                                onClick={(e) => {
                                    window.open('/energy/plug', '_parent');
                                }}>
                                View
                            </Button>
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
                    <p className="subtitle-style muted" style={{ margin: '1px', fontWeight: 'bold' }}>
                        Total Consumption
                    </p>
                    <p className="card-text card-content-style">
                        {usage.totalConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val1.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="muted">since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val2.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="muted">from same period last year</span>
                </div>
                <div className="mt-4 mb-4">
                    <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                        After-Hours Consumption
                    </p>
                    <p className="card-text card-content-style">
                        {usage.afterHourConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                        <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val3.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span>since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val4.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span>from same period last year</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default UsageCard;
