import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from '../store/DateRangeStore';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../pages/portfolio/style.scss';
import TimeFrameSelector from '../sharedComponents/timeFrameSelector/TimeFrameSelector';

const Header = (props) => {
    const dateValue = DateRangeStore.useState((s) => +s.dateFilter);
    const customStartDate = DateRangeStore.useState((s) => s.startDate);
    const customEndDate = DateRangeStore.useState((s) => s.endDate);

    const [dateFilter, setDateFilter] = useState(dateValue);
    const [startDate, setStartDate] = useState(customStartDate);
    const [endDate, setEndDate] = useState(customEndDate);

    // const defaultDateRange = {
    //     label: 'Last 7 Days',
    //     value: 'Last 7 Days',
    // };

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

        localStorage.setItem('dateFilter', value);
        localStorage.setItem('startDate', start);
        localStorage.setItem('endDate', end);

        DateRangeStore.update((s) => {
            s.dateFilter = value;
            s.startDate = start;
            s.endDate = end;
        });
        setDateFilter(value);
    };

    const onCustomDateChange = ({ startDate, endDate }) => {
        if (startDate === null || endDate === null) {
            return;
        }
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const onFilterChange = (rangeDate) => {
        console.log('onFilterChange function triggered');
        setStartDate(rangeDate[0]);
        setEndDate(rangeDate[1]);
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

    return (
        <React.Fragment>
            {props.type === 'modal' && (
                <div
                    className="btn-group custom-button-group header-widget-styling"
                    role="group"
                    aria-label="Basic example">
                    <div>
                        <TimeFrameSelector onCustomDateChange={onCustomDateChange} onFilterChange={onFilterChange} />
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
                                <TimeFrameSelector
                                    onCustomDateChange={onCustomDateChange}
                                    onFilterChange={onFilterChange}
                                    // period={defaultDateRange}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );
};

export default Header;
