import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from '../store/DateRangeStore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faTelescope } from '@fortawesome/pro-regular-svg-icons';
import '../pages/portfolio/style.css';

const Header = (props) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 4 Weeks',
            value: 28,
        },
        {
            label: 'Last 3 Months',
            value: 90,
        },
        {
            label: 'Last 12 Months',
            value: 365,
        },
        {
            label: 'Month to Date',
            value: 30,
        },
        {
            label: 'Quarter to Date',
            value: 120,
        },
        {
            label: 'Year to Date',
            value: 365,
        },
    ];

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            localStorage.setItem('dateFilter', date);
            endCustomDate.setDate(endCustomDate.getDate() - 1);
            startCustomDate.setDate(startCustomDate.getDate() - date);
            setDateRange([startCustomDate, endCustomDate]);
            // localStorage.setItem('startDate', startCustomDate);
            // localStorage.setItem('endDate', endCustomDate);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        const setCustomDate = (date) => {
            let startCustomDate = date[0];
            let endCustomDate = date[1];
            let dt = new Date();
            DateRangeStore.update((s) => {
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateRange);
    }, [dateRange]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        {props.title}
                    </span>

                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="select-button form-control form-control-md custom-day-selection"
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                }}
                                defaultValue={dateFilter}>
                                {customDaySelect.map((el, index) => {
                                    return <option value={el.value}>{el.label}</option>;
                                })}
                            </Input>
                        </div>

                        <div className="select-button form-control form-control-md font-weight-bold custom-date-picker-block">
                            <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '1.3em' }} />
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                maxDate={new Date()}
                                dateFormat="MMMM d"
                                className="custom-date-picker-props ml-2"
                                placeholderText="Select Date Range"
                                // monthsShown={2}
                            />
                        </div>

                        {props.title !== 'Portfolio Overview' && props.title !== 'Compare Buildings' && (
                            <div className="float-right ml-2">
                                <Link
                                    to={{
                                        pathname: `/explore/page`,
                                    }}>
                                    <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                        <FontAwesomeIcon
                                            icon={faTelescope}
                                            size="md"
                                            color="#FFFFFF"
                                            className="mr-2"
                                        />
                                        Explore
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* )} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Header;
