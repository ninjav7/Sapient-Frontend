import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import Select from '../form/select';
import Datepicker from '../datepicker';

import './TimeFrameSelector.scss';

const selectOptions = [
    { label: 'Today', value: 'Today', moment: () => [moment().subtract(1, 'd'), moment()] },
    { label: 'Last 7 Days', value: 'Last 7 Days', moment: () => [moment().subtract(7, 'd'), moment()] },
    { label: 'Last 4 Weeks', value: 'Last 4 Weeks', moment: () => [moment().subtract(4, 'week'), moment()] },
    { label: 'Last 3 Months', value: 'Last 3 Months', moment: () => [moment().subtract(3, 'month'), moment()] },
    { label: 'Last 12 Months', value: 'Last 12 Months', moment: () => [moment().subtract(12, 'month'), moment()] },
    { label: 'Month to Date', value: 'Month to Date', moment: () => [moment().startOf('month'), moment()] },
    { label: 'Quarter to Date', value: 'Quarter to Date', moment: () => [moment().startOf('quarter'), moment()] },
    { label: 'Year to Date', value: 'Year to Date', moment: () => [moment().startOf('year'), moment()] },
    { label: 'Custom', value: 'Custom' },
];

const TimeFrameSelector = (props) => {
    const [period, setPeriod] = useState(props.period);
    const [rangeDate, setRangeDate] = useState(props.rangeDate);

    const handleChangeSelect = (option) => {
        option.moment && setRangeDate(option.moment());

        props.onDateFilterChange(option.moment(), option);
        setPeriod(option);

        props.onChange && props.onChange({ period: option, rangeDate: option.moment() });
    };

    const setCustomDate = () => {
        setPeriod({ label: 'Custom', value: 'Custom' });
    };

    const handleDatePickerChange = ({ startDate, endDate }) => {
        props.onChange && props.onChange({ period, rangeDate: [startDate, endDate] });
    };

    return (
        <div className="time-frame-selector-wrapper">
            <div className="btn-group custom-button-group header-widget-styling" role="group">
                <Select
                    value={period}
                    options={props.timeOptions || selectOptions}
                    onChange={handleChangeSelect}
                    {...props}
                />
                <Datepicker
                    rangeDate={rangeDate}
                    onManuallyChangedDate={setCustomDate}
                    onChange={handleDatePickerChange}
                    onCancel={props.onCancel}
                    onApply={props.onApply}
                    withApplyButton={props.withApplyButton}
                    {...props}
                />
            </div>
        </div>
    );
};

TimeFrameSelector.propTypes = {
    rangeDate: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    selectedOption: PropTypes.string,
    timeOptions: PropTypes.array,
    isSingleDay: PropTypes.bool,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    onCustomDateChange: PropTypes.func,
    onDateFilterChange: PropTypes.func,
    withApplyButton: PropTypes.bool,
};

TimeFrameSelector.options = selectOptions;

TimeFrameSelector.defaultProps = {
    rangeDate: [moment().subtract(6, 'd'), moment()],
};

export default TimeFrameSelector;

// start, end, onChage, optionsF
