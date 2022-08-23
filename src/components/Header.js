import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from '../store/DateRangeStore';
import '../pages/portfolio/style.scss';
import Select from '../sharedComponents/form/select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

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

    const handleEvent = (event, picker) => {
        let start = picker.startDate._d;
        let end = picker.endDate._d;
        setDateRange([start, end]);
    };

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date();
            let startCustomDate = new Date();
            localStorage.setItem('dateFilter', date);
            if (date !== 0) {
                endCustomDate.setDate(endCustomDate.getDate() - 1);
            }
            startCustomDate.setDate(startCustomDate.getDate() - date);
            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        if (dateRange[0] === null || dateRange[1] === null) {
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
                                className="header-datefilter-select date-selector-width"
                                options={customDaySelect}
                                defaultValue={dateFilter}
                                onChange={({ value }) => {
                                    setDateFilter(value);
                                }}
                            />
                        </div>

                        <div className="header-datefilter-datepicker">
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                alwaysShowCalendars={false}
                                onEvent={handleEvent}>
                                <button className="">
                                    {moment(startDate).format('LL')} to {moment(endDate).format('LL')}
                                </button>
                            </DateRangePicker>
                        </div>

                        {props.title !== 'Portfolio Overview' && props.title !== 'Compare Buildings' && (
                            <></>
                            // <div className="float-right ml-2">
                            //     <Link
                            //         to={{
                            //             pathname: `/explore/page`,
                            //         }}>
                            //         <button type="button" className="btn btn-md btn-primary font-weight-bold">
                            //             <i className="uil uil-pen mr-1"></i>Explore
                            //         </button>
                            //     </Link>
                            // </div>
                        )}
                    </div>
                    {/* )} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Header;
