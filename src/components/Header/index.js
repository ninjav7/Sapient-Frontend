import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { DateRangeStore } from '../../store/DateRangeStore';
import { customOptions } from './utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../../pages/portfolio/style.scss';
import TimeFrameSelector from '../../sharedComponents/timeFrameSelector/TimeFrameSelector';

const Header = ({ type, title }) => {
    const filterPeriod = DateRangeStore.useState((s) => s.filterPeriod);
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const [rangeDate, setRangeDate] = useState([moment(startDate), moment(endDate)]);

    // On Custom Date Change from Calender
    const onCustomDateChange = ({ startDate, endDate }) => {
        if (startDate === null || endDate === null) {
            return;
        }

        localStorage.setItem('filterPeriod', 'Custom');
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);

        DateRangeStore.update((s) => {
            s.filterPeriod = 'Custom';
            s.startDate = startDate;
            s.endDate = endDate;
        });
    };

    // On DateFilter Change
    const onDateFilterChange = (rangeDate, period) => {
        localStorage.setItem('filterPeriod', period?.value);
        localStorage.setItem('startDate', rangeDate[0]);
        localStorage.setItem('endDate', rangeDate[1]);

        DateRangeStore.update((s) => {
            s.filterPeriod = period?.value;
            s.startDate = rangeDate[0];
            s.endDate = rangeDate[1];
        });
    };

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        const setCustomDate = (dates) => {
            setRangeDate([moment(dates[0]), moment(dates[1])]);

            let end = new Date(endDate);
            let start = new Date(startDate);

            let time_difference = end.getTime() - start.getTime();
            let days_difference = time_difference / (1000 * 60 * 60 * 24);
            days_difference = parseInt(days_difference + 1);

            localStorage.setItem('daysCount', days_difference);

            DateRangeStore.update((s) => {
                s.daysCount = days_difference;
            });
        };
        setCustomDate([startDate, endDate]);
    }, [startDate, endDate]);

    return (
        <React.Fragment>
            {type === 'page' && (
                <div className="d-flex justify-content-between">
                    <div className="heading-style">{title}</div>
                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div>
                            <TimeFrameSelector
                                onCustomDateChange={onCustomDateChange}
                                onDateFilterChange={onDateFilterChange}
                                rangeDate={rangeDate}
                                timeOptions={customOptions}
                                defaultValue={filterPeriod}
                            />
                        </div>
                    </div>
                </div>
            )}

            {type === 'modal' && (
                <div
                    className="btn-group custom-button-group header-widget-styling"
                    role="group"
                    aria-label="Basic example">
                    <div>
                        <TimeFrameSelector
                            onCustomDateChange={onCustomDateChange}
                            onDateFilterChange={onDateFilterChange}
                            rangeDate={rangeDate}
                            timeOptions={customOptions}
                            defaultValue={filterPeriod}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Header;
