import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangeStore } from '../../store/DateRangeStore';
import { customOptions } from './utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../../pages/portfolio/style.scss';
import TimeFrameSelector from '../../sharedComponents/timeFrameSelector/TimeFrameSelector';
import { convertToUserLocalTime } from '../../helpers/helpers';
import Button from '../../sharedComponents/button/Button';
import { ReactComponent as TelescopeSVG } from '../../assets/icon/telescope-purple.svg';

const Header = ({ type, title, showExplore = false }) => {
    const filterPeriod = DateRangeStore.useState((s) => s.filterPeriod);
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const isTimeSelectionEnabled = DateRangeStore.useState((s) => s.isTimePickerEnabled);
    const [rangeDate, setRangeDate] = useState([moment(startDate), moment(endDate)]);

    // On Custom Date Change from Calender
    const onCustomDateChange = ({ startDate, endDate, startTime, endTime, isTimePickerEnabled }) => {
        if (startDate === null || endDate === null) return;

        // Start & End date
        const start_date = convertToUserLocalTime(startDate);
        const end_date = convertToUserLocalTime(endDate);

        // Start & End time
        const start_time = startTime.format('HH:mm');
        const end_time = endTime.format('HH:mm');

        localStorage.setItem('filterPeriod', 'Custom');
        localStorage.setItem('startDate', start_date);
        localStorage.setItem('endDate', end_date);
        localStorage.setItem('startTime', start_time);
        localStorage.setItem('endTime', end_time);
        localStorage.setItem('isTimePickerEnabled', isTimePickerEnabled);

        DateRangeStore.update((s) => {
            s.filterPeriod = 'Custom';
            s.startDate = start_date;
            s.endDate = end_date;
            s.startTime = start_time;
            s.endTime = end_time;
            s.isTimePickerEnabled = isTimePickerEnabled;
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
        if (startDate === null || endDate === null) return;

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
                                isTimeSelectionEnabled={isTimeSelectionEnabled}
                            />
                        </div>
                        {showExplore && (
                            <Button
                                size={Button.Sizes.md}
                                type="secondary"
                                icon={<TelescopeSVG />}
                                label="Explore"
                                className="ml-2"
                            />
                        )}
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
                            isTimeSelectionEnabled={isTimeSelectionEnabled}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Header;
