import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { DateRangeStore } from '../store/DateRangeStore';
import Select from '../sharedComponents/form/select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../pages/portfolio/style.scss';

const Header = (props) => {
    const dateValue = DateRangeStore.useState((s) => +s.dateFilter);
    const customStartDate = DateRangeStore.useState((s) => s.startDate);
    const customEndDate = DateRangeStore.useState((s) => s.endDate);

    const [dateFilter, setDateFilter] = useState(dateValue);
    const [startDate, setStartDate] = useState(customStartDate);
    const [endDate, setEndDate] = useState(customEndDate);

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 6,
        },
        {
            label: 'Last 4 Weeks',
            value: 27,
        },
        {
            label: 'Last 3 Months',
            value: 89,
        },
        {
            label: 'Last 12 Months',
            value: 364,
        },
        {
            label: 'Custom',
            value: -1,
        },
    ];

    const handleEvent = (event, picker) => {
        let start = picker.startDate._d;
        let end = picker.endDate._d;
        setStartDate(start);
        setEndDate(end);
        setDateFilter(-1);
    };

    const handleDateFilterChange = (value) => {
        let end = new Date();
        let start = new Date();
        if (value !== 0) {
            end.setDate(end.getDate());
        }
        start.setDate(start.getDate() - value);
        setStartDate(start);
        setEndDate(end);
        setDateFilter(value);

        localStorage.setItem('startDate', start);
        localStorage.setItem('endDate', end);

        DateRangeStore.update((s) => {
            s.startDate = start;
            s.endDate = end;
        });
        // setDateFilter(value);
    };

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        const setCustomDate = (dates) => {
            let startCustomDate = dates[0];
            let endCustomDate = dates[1];

            let end = new Date(endDate);
            let start = new Date(startDate);

            let time_difference = end.getTime() - start.getTime();
            let days_difference = time_difference / (1000 * 60 * 60 * 24);
            days_difference = parseInt(days_difference + 1);

            localStorage.setItem('startDate', startCustomDate);
            localStorage.setItem('endDate', endCustomDate);
            localStorage.setItem('daysCount', days_difference);

            DateRangeStore.update((s) => {
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
                s.daysCount = days_difference;
            });
        };
        setCustomDate([startDate, endDate]);
    }, [startDate, endDate]);

    useEffect(() => {
        localStorage.setItem('dateFilter', +dateFilter);

        DateRangeStore.update((s) => {
            s.dateFilter = +dateFilter;
        });
    }, [dateFilter]);

    useEffect(() => {
        console.log('Header startDate :>> ', startDate);
        console.log('Header endDate :>> ', endDate);
    });

    return (
        <React.Fragment>
            {props.type === 'modal' && (
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
                                if (value === -1) {
                                    return;
                                }
                                handleDateFilterChange(value);
                            }}
                        />
                    </div>
                    <div className="mr-1">
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            alwaysShowCalendars={false}
                            onApply={handleEvent}>
                            <button className="select-button form-control header-widget-styling datefilter-styling font-weight-bold">
                                <FontAwesomeIcon icon={faCalendar} size="md" color="#7C879C" className="mr-2" />
                                {moment(startDate).format('MMM D')} - {moment(endDate).format('MMM D')}
                            </button>
                        </DateRangePicker>
                    </div>
                </div>
            )}

            {props.type === 'page' && (
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
                                        if (value === -1) {
                                            return;
                                        }
                                        handleDateFilterChange(value);
                                    }}
                                />
                            </div>

                            <div>
                                <DateRangePicker
                                    startDate={startDate}
                                    endDate={endDate}
                                    alwaysShowCalendars={false}
                                    onApply={handleEvent}>
                                    <button className="select-button form-control header-widget-styling datefilter-styling font-weight-bold">
                                        <FontAwesomeIcon icon={faCalendar} size="md" color="#7C879C" className="mr-2" />
                                        {moment(startDate).format('MMM D')} - {moment(endDate).format('MMM D')}
                                    </button>
                                </DateRangePicker>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );
};

export default Header;
