import React, { useEffect, useRef, useState } from 'react';
import { SingleDatePicker, DateRangePicker } from 'react-dates';
import moment from 'moment';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TimePicker } from 'antd';
import dayjs from 'dayjs';

import Typography from '../typography';
import { Button } from '../button';
import { Checkbox } from '../form/checkbox';

import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';

import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './Datepicker.scss';

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

const handleTimeSelector = (value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value === 'true';
};

const getTimeWithDefault = (type, time) => {
    if (type === 'startTime') {
        if (time) {
            const defaultTime = time ? time.split(':') : [0, 0];
            const [hour, minute] = defaultTime;

            return dayjs()
                .startOf('day')
                .set('hour', +hour)
                .set('minute', +minute);
        } else {
            return dayjs().startOf('day');
        }
    }
    if (type === 'endTime') {
        if (time) {
            const defaultTime = time ? time.split(':') : [0, 0];
            const [hour, minute] = defaultTime;

            return dayjs()
                .startOf('day')
                .set('hour', +hour)
                .set('minute', +minute);
        } else {
            return dayjs().endOf('day');
        }
    }
};

const Datepicker = ({
    rangeDate = [moment(), moment().add(7, 'd')],
    className = '',
    datepickerClassName = '',
    iconBtnClassName = '',
    withApplyButton = true,
    withTimeSelect = true,
    isClosed = true,
    isTimeSelectionEnabled,
    ...props
}) => {
    const [startDate, setStartDate] = useState(rangeDate[0]);
    const [endDate, setEndDate] = useState(rangeDate[1]);

    const globalStartTime = DateRangeStore.useState((s) => s.startTime);
    const globalEndTime = DateRangeStore.useState((s) => s.endTime);

    const [startTime, setStartTime] = useState(getTimeWithDefault('startTime', globalStartTime));
    const [endTime, setEndTime] = useState(getTimeWithDefault('endTime', globalEndTime));

    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const [isTimePickerEnabled, setTimePickerEnabled] = useState(handleTimeSelector(isTimeSelectionEnabled));

    const [isOpen, setIsOpen] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const refApi = useRef(null);

    const handleTimeRangeChange = (timeRange) => {
        const [newStartTime, newEndTime] = timeRange;

        if (newStartTime && newEndTime) {
            setStartTime(newStartTime);
            setEndTime(newEndTime);
        }
    };

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
        props.onCustomDateChange &&
            props.onCustomDateChange({
                startDate,
                endDate: endDateOrStartDate,
                startTime,
                endTime,
                isTimePickerEnabled,
            });
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

    useEffect(() => {
        if (!isTimePickerEnabled) {
            const defaultStartTime = getTimeWithDefault('startTime');
            const defaultEndTime = getTimeWithDefault('endTime');
            setStartTime(defaultStartTime);
            setEndTime(defaultEndTime);
        }
    }, [isTimePickerEnabled]);

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
                                <div className="d-flex flex-column" style={{ gap: '0.5rem' }}>
                                    <TimePicker.RangePicker
                                        showNow={false}
                                        size="medium"
                                        minuteStep={15}
                                        allowClear={false}
                                        placeholder={['Start Time', 'End Time']}
                                        value={[startTime, endTime]}
                                        onChange={handleTimeRangeChange}
                                        use12Hours={userPrefTimeFormat === '12h' ? true : false}
                                        format={userPrefTimeFormat === '12h' ? 'hh:mm A' : 'HH:mm'}
                                        disabled={!isTimePickerEnabled}
                                    />
                                    <Checkbox
                                        label="Custom Time Select"
                                        type="checkbox"
                                        id="select-time"
                                        name="select-time"
                                        size="sm"
                                        checked={isTimePickerEnabled}
                                        value={isTimePickerEnabled}
                                        onClick={(e) => {
                                            setTimePickerEnabled(e.target.value === 'false' ? true : false);
                                        }}
                                    />
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
                        {isTimePickerEnabled
                            ? userPrefTimeFormat === '24h'
                                ? startTime.format('HH:mm')
                                : startTime.format('hh:mm A')
                            : null}
                        <span> - </span>
                        {endDate && endDate.format(`MMM D ${!isTheSameYear ? 'YYYY' : ''}`)}
                        {isTimePickerEnabled
                            ? userPrefTimeFormat === '24h'
                                ? endTime.format('HH:mm')
                                : endTime.format('hh:mm A')
                            : null}
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
