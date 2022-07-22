import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import Datepicker from '../sharedComponents/datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from '../store/DateRangeStore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import '../pages/portfolio/style.css';
import Select from '../sharedComponents/form/select';

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
                    <span className="heading-style">{props.title}</span>

                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div>
                            <Select
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="header-datefilter-select"
                                options={customDaySelect}
                                defaultValue={dateFilter}
                                onChange={({ value }) => {
                                    setDateFilter(value);
                                }}
                            />

                            {/* <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                }}
                                defaultValue={dateFilter}>
                                {customDaySelect.map((el, index) => {
                                    return <option value={el.value}>{el.label}</option>;
                                })}
                            </Input> */}
                        </div>

                        <div className="header-datefilter-datepicker-wrapper">
                            <Datepicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                maxDate={new Date()}
                                dateFormat="MMMM d"
                                className="header-datefilter-datepicker"
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
                                        <i className="uil uil-pen mr-1"></i>Explore
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
