import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';

import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './Datepicker.scss';

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

const Datepicker = ({
    rangeDate = [moment(), moment().add(7, 'd')],
    className = '',
    datepickerClassName = '',
    iconBtnClassName = '',
    ...props
}) => {
    const [startDate, setStartDate] = useState(rangeDate[0]);
    const [endDate, setEndDate] = useState(rangeDate[1]);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!!focusedInput) {
            props.onOpen && props.onOpen();
            setIsOpen(true);
        }
    }, [!!focusedInput]);

    function onDateChange({ startDate, endDate }) {
        props.onChange && props.onChange({ startDate, endDate });

        setStartDate(startDate);
        setEndDate(endDate);
    }

    function onFocusChange(focusedInput) {
        setFocusedInput(focusedInput);
    }

    const handleClose = () => {
        props.onClose && props.onClose();
        setIsOpen(false);
    };

    const handleClickDay = (moment) => {
        props.onManuallyChangedDate && props.onManuallyChangedDate({ moment });
    };

    const handleClickDatepickerBtn = () => {
        setFocusedInput('startDate');
    };

    const formattedStartDate = rangeDate[0]?.format('MMM D') || '';
    const formattedEndDate = rangeDate[1]?.format('MMM D') || '';

    useEffect(() => {
        setStartDate(rangeDate[0]);
        setEndDate(rangeDate[1]);
    }, [formattedStartDate, formattedEndDate]);

    const isTheSameYear = rangeDate[0].isSame(rangeDate[1], 'year');

    return (
        <div className={cx(`datepicker-wrapper ${className}`, { 'is-open': isOpen })}>
            <DateRangePicker
                {...props}
                onClose={handleClose}
                noBorder={true}
                readOnly
                displayFormat="MMM D"
                isOutsideRange={() => false}
                startDateId="startDate" // PropTypes.string.isRequired,
                endDateId="endDate" // PropTypes.string.isRequired,
                startDate={startDate}
                endDate={endDate}
                onDatesChange={onDateChange}
                focusedInput={focusedInput}
                onFocusChange={onFocusChange}
                navPrev={<ArrowSVG className="Calendar--arrow-left" />}
                navNext={<ArrowSVG className="Calendar--arrow-right" />}
                renderMonthElement={({ month }) => (
                    <Typography.Subheader size={Typography.Sizes.md}>{month.format('MMMM YYYY')}</Typography.Subheader>
                )}
                renderDayContents={(moment, modifiers) => {
                    const selectedInRange =
                        modifiers.has('selected-span') ||
                        modifiers.has('selected-start') ||
                        modifiers.has('selected-end');
                    const day = moment.format('D');

                    return (
                        <div
                            {...moment}
                            className="datepicker-day-content-wrapper"
                            onClick={() => handleClickDay(moment)}>
                            {selectedInRange ? (
                                <Typography.Subheader size={Typography.Sizes.md}>{day}</Typography.Subheader>
                            ) : (
                                <Typography.Body size={Typography.Sizes.md}>{day}</Typography.Body>
                            )}
                        </div>
                    );
                }}
            />
            <button
                type="button"
                className={cx('datepicker-icon-btn', iconBtnClassName)}
                onClick={handleClickDatepickerBtn}>
                <CalendarIcon />
            </button>
            <Typography.Body
                size={Typography.Sizes.lg}
                role="button"
                onClick={handleClickDatepickerBtn}
                className="datepicker-custom-dates">
                {startDate && startDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}
                <span> - </span>
                {endDate && endDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}
            </Typography.Body>
        </div>
    );
};

Datepicker.propTypes = {
    onManuallyChangedDate: PropTypes.func,
    onChange: PropTypes.func,
};

export default Datepicker;
