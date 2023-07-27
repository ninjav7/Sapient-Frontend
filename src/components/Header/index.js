import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangeStore } from '../../store/DateRangeStore';
import { convertToUserLocalTime, customOptions } from './utils';
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
        if (startDate === null || endDate === null) return;

        const start_date = convertToUserLocalTime(startDate);
        const end_date = convertToUserLocalTime(endDate);

        localStorage.setItem('filterPeriod', 'Custom');
        localStorage.setItem('startDate', start_date);
        localStorage.setItem('endDate', end_date);

        DateRangeStore.update((s) => {
            s.filterPeriod = 'Custom';
            s.startDate = start_date;
            s.endDate = end_date;
        });
    };

    // On DateFilter Change
    const onDateFilterChange = (rangeDate, period) => {
        const startDate = convertToUserLocalTime(rangeDate[0]);
        const endDate = convertToUserLocalTime(rangeDate[1]);

        localStorage.setItem('filterPeriod', period?.value);
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);

        DateRangeStore.update((s) => {
            s.filterPeriod = period?.value;
            s.startDate = startDate;
            s.endDate = endDate;
        });
    };

    useEffect(() => {
        if (startDate === null || endDate === null) {
            return;
        }
        const setCustomDate = (dates) => {
            setRangeDate([moment(dates[0]), moment(dates[1])]);

            let startDate = moment(dates[0]);
            let endDate = moment(dates[1]);
            let days_difference = endDate.diff(startDate, 'days') + 1;

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
                    <div className="heading-style d-flex align-items-center">{title}</div>
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
