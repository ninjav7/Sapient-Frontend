import React, { useEffect, useRef, useState } from 'react';
import { SingleDatePicker, DateRangePicker } from 'react-dates';
import moment from 'moment';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';
import { Button } from '../button';

import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './Datepicker.scss';
import { Checkbox } from '../form/checkbox';

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
    withApplyButton = true,
    withTimeSelect = true,
    isClosed = true,
    ...props
}) => {
    const [startDate, setStartDate] = useState(rangeDate[0]);
    const [endDate, setEndDate] = useState(rangeDate[1]);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const refApi = useRef(null);

    const onDateChangeSingle = (startDate) => {
        setStartDate(startDate);
    };
    const onFocusChangeSingle = ({ focused }) => {
        if (withApplyButton) {
            return;
        }
        setFocusedInput(focused);
    };

    useEffect(() => {
        if (!!focusedInput) {
            props.onOpen && props.onOpen();
            setIsOpen(true);
        }
    }, [!!focusedInput]);

    useEffect(() => {
        if (isClosed) {
            props.onClose && props.onClose();
            setFocusedInput(null);
            handleClose();
        }
    }, [isClosed]);

    function onDateChange({ startDate, endDate }) {
        props.onChange && props.onChange(props.isSingleDay ? { startDate } : { startDate, endDate });

        setStartDate(startDate);
        setEndDate(endDate);
    }

    function onFocusChange(focusedInput) {
        if (withApplyButton && !focusedInput) {
            return;
        }
        setFocusedInput(focusedInput);
    }

    const handleClose = (event) => {
        props.onClose && props.onClose();
        setIsOpen(false);
        refApi.current = false;

        if (!withApplyButton) {
            applyDate(event);
        }
    };

    const handleClickDay = (moment) => {
        props.onManuallyChangedDate && props.onManuallyChangedDate({ moment });
    };

    const handleCancelClick = (event) => {
        setStartDate(rangeDate[0]);
        setEndDate(rangeDate[1]);

        props.onCancel && props.onCancel({ startDate: rangeDate[0], endDate: rangeDate[1], event });
        setFocusedInput(null);
        handleClose();
    };

    const handleClickDatepickerBtn = (event) => {
        if (refApi.current) {
            refApi.current = false;
            withApplyButton && handleCancelClick(event);
            setIsOpen(false);
            return;
        }

        refApi.current = !refApi.current;
        setFocusedInput('startDate');
    };

    const applyDate = (event) => {
        if (!endDate) {
            setEndDate(startDate);
        }

        const endDateOrStartDate = endDate ? endDate : startDate;

        props.onApply && props.onApply({ startDate, endDate: endDateOrStartDate, event });
        onDateChange({ startDate, endDate: endDateOrStartDate });
        props.onCustomDateChange && props.onCustomDateChange({ startDate, endDate: endDateOrStartDate });
    };

    const formattedStartDate = rangeDate[0]?.format('MMM D') || '';
    const formattedEndDate = rangeDate[1]?.format('MMM D') || '';
    const ANCHOR_RIGHT = 'right';

    useEffect(() => {
        setStartDate(rangeDate[0]);
        setEndDate(rangeDate[1]);
    }, [formattedStartDate, formattedEndDate]);

    const isTheSameYear = rangeDate[0].isSame(rangeDate[1], 'year');

    const datePickerProps = props.isSingleDay
        ? {
              onDateChange: onDateChangeSingle,
              onFocusChange: onFocusChangeSingle,
              focused: focusedInput,
              date: startDate,
          }
        : {
              focusedInput,
              startDate,
              endDate,
              onDatesChange: onDateChange,
              onFocusChange,
              minimumNights: 0,
          };

    const DatePickerComponent = props.isSingleDay ? SingleDatePicker : DateRangePicker;

    return (
        <div
            className={cx(
                `datepicker-wrapper ${className}`,
                { 'is-single-day': props.isSingleDay },
                { 'is-open': isOpen }
            )}>
            <DatePickerComponent
                {...datePickerProps}
                {...props}
                renderCalendarInfo={() =>
                    withApplyButton && (
                        <div
                            className={`datepicker-calendar-bottom d-flex align-items-center justify-content-${
                                withTimeSelect ? `between` : `end`
                            }`}>
                            {withTimeSelect && (
                                <div className="d-flex flex-column" style={{ gap: '0.25rem' }}>
                                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                                        <div>
                                            <Typography.Body
                                                size={Typography.Sizes.sm}
                                                className="gray-550 font-weight-medium">
                                                {`Start Time`}
                                            </Typography.Body>
                                            <div className="timepicker">
                                                <input type="time" id="appt" name="appt" value={'12:00'} step="60" />
                                            </div>
                                        </div>

                                        <div>
                                            <Typography.Body
                                                size={Typography.Sizes.sm}
                                                className="gray-550 font-weight-medium">
                                                {`End Time`}
                                            </Typography.Body>

                                            <div className="timepicker">
                                                <input type="time" id="appt" name="appt" value={'23:00'} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="item2" style={{ color: 'black' }}>
                                            <input
                                                type="checkbox"
                                                name="item1"
                                                label="Enable Time select "
                                                checked={true}
                                            />
                                            Enable time select
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div className="d-flex" style={{ gap: '0.5rem', height: 'fit-content' }}>
                                <Button
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    label="Cancel"
                                    onClick={handleCancelClick}
                                />
                                <Button
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    label="Apply"
                                    onClick={(event) => {
                                        applyDate(event);
                                        setFocusedInput(null);
                                        handleClose();
                                    }}
                                />
                            </div>
                        </div>
                    )
                }
                onClose={!withApplyButton ? handleClose : undefined}
                noBorder={true}
                readOnly
                displayFormat="MMM D"
                isOutsideRange={() => false}
                startDateId="startDate" // PropTypes.string.isRequired,
                endDateId="endDate" // PropTypes.string.isRequired,
                navPrev={<ArrowSVG className="Calendar--arrow-left" />}
                navNext={<ArrowSVG className="Calendar--arrow-right" />}
                anchorDirection={ANCHOR_RIGHT}
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
                className="datepicker-custom-dates flex-grow-1">
                {props.isSingleDay ? (
                    <>{startDate && startDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}</>
                ) : (
                    <>
                        {startDate && startDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}
                        <span> - </span>
                        {endDate && endDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}
                    </>
                )}
            </Typography.Body>
        </div>
    );
};

Datepicker.propTypes = {
    onManuallyChangedDate: PropTypes.func,
    onChange: PropTypes.func,
    isSingleDay: PropTypes.bool,
    withApplyButton: PropTypes.bool,
    withTimeSelect: PropTypes.bool,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    onCustomDateChange: PropTypes.func,
    isClosed: PropTypes.bool,
};

export default Datepicker;
