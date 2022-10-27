import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { DateRangeStore } from '../store/DateRangeStore';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../pages/portfolio/style.scss';
import TimeFrameSelector from '../sharedComponents/timeFrameSelector/TimeFrameSelector';

const Header = (props) => {
    const customStartDate = DateRangeStore.useState((s) => s.startDate);
    const customEndDate = DateRangeStore.useState((s) => s.endDate);

    const [startDate, setStartDate] = useState(customStartDate);
    const [endDate, setEndDate] = useState(customEndDate);
    const [rangeDate, setRangeDate] = useState([moment(customStartDate), moment(customEndDate)]);

    // On Custom Date Change from Calender
    const onCustomDateChange = ({ startDate, endDate }) => {
        if (startDate === null || endDate === null) {
            return;
        }
        setStartDate(startDate);
        setEndDate(endDate);
    };

    // On DateFilter Change
    const onDateFilterChange = (rangeDate, period) => {
        setStartDate(rangeDate[0]);
        setEndDate(rangeDate[1]);

        localStorage.setItem('filterPeriod', period?.value);
        DateRangeStore.update((s) => {
            s.filterPeriod = period?.value;
        });
    };

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        const setCustomDate = (dates) => {
            setRangeDate([moment(dates[0]), moment(dates[1])]);
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

    return (
        <React.Fragment>
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
                                    onDateFilterChange={onDateFilterChange}
                                    rangeDate={rangeDate}
                                    // period={period}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            )}

            {props.type === 'modal' && (
                <div
                    className="btn-group custom-button-group header-widget-styling"
                    role="group"
                    aria-label="Basic example">
                    <div>
                        <TimeFrameSelector
                            onCustomDateChange={onCustomDateChange}
                            onDateFilterChange={onDateFilterChange}
                            rangeDate={rangeDate}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Header;
