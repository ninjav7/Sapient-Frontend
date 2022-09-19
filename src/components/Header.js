import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { DateRangeStore } from '../store/DateRangeStore';
import Select from '../sharedComponents/form/select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../pages/portfolio/style.scss';

const Header = (props) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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

    const handleEvent = (event, picker) => {
        let start = picker.startDate._d;
        let end = picker.endDate._d;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        const setCustomDate = (date) => {
            let end = new Date();
            let start = new Date();
            localStorage.setItem('dateFilter', date);
            if (date !== 0) {
                end.setDate(end.getDate() - 1);
            }
            start.setDate(start.getDate() - date);
            setStartDate(start);
            setEndDate(end);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = start;
                s.endDate = end;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        const setCustomDate = (dates) => {
            let startCustomDate = dates[0];
            let endCustomDate = dates[1];
            DateRangeStore.update((s) => {
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate([startDate, endDate]);
    }, [startDate, endDate]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style ml-2">{props.title}</span>

                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div>
                            <Select
                                className="header-datefilter-select font-weight-bold"
                                options={customDaySelect}
                                defaultValue={dateFilter}
                                onChange={({ value }) => {
                                    setDateFilter(value);
                                }}
                            />
                        </div>

                        <div>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                // initialSettings={{
                                //     startDate: startDate?.toISOString(),
                                //     endDate: endDate?.toISOString(),
                                // }}
                                alwaysShowCalendars={false}
                                onApply={handleEvent}>
                                <button className="select-button form-control header-widget-styling datefilter-styling font-weight-bold">
                                    <FontAwesomeIcon icon={faCalendar} size="md" color="#7C879C" className="mr-2" />
                                    {moment(startDate).format('MMM D')} - {moment(endDate).format('MMM D')}
                                </button>
                            </DateRangePicker>
                        </div>

                        {/* {props.title !== 'Portfolio Overview' && props.title !== 'Compare Buildings' && (
                            <div className="float-right ml-2">
                                <Link
                                    to={{
                                        pathname: `/explore-page/by-buildings`,
                                    }}>
                                    <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                        <i className="uil uil-pen mr-1"></i>Explore
                                    </button>
                                </Link>
                            </div>
                        )} */}
                    </div>
                    {/* )} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Header;
