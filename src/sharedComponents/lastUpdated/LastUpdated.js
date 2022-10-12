import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Radio } from '../form/radio';
import Brick from '../brick';
import Input from '../form/input/Input';
import Select from '../form/select';
import { TimeFrameSelector } from '../timeFrameSelector';

import './LastUpdated.scss';

const LastUpdated = ({ initialValues, onChange = () => {}, ...props }) => {
    const withinTheLast = initialValues['within-the-last'] || { value: 0, period: 'minutes' };
    const moreThan = initialValues['more-than'] || { value: 0, period: 'minutes ago' };
    const dateRange = initialValues['date-range'] || {};

    const handleInputChange = (event, variant) => {
        onChange(_.merge(initialValues, { [variant]: { value: event.target.value } }));
    };

    const handleSelectChange = (option, variant) => {
        onChange(_.merge(initialValues, { [variant]: { period: option.value } }));
    };

    const handleSelectDateRange = (dateRange, variant) => {
        onChange(_.merge(initialValues, { [variant]: dateRange }));
    };

    const handleRadioChange = (event) => {
        onChange(_.merge(initialValues, { active: event.target.value }));
    };

    return (
        <div className="last-updated-wrapper">
            <Radio
                label="Within the last"
                value="within-the-last"
                name="type"
                defaultChecked={initialValues.active === 'within-the-last'}
                onChange={handleRadioChange}
            />
            <Brick sizeInRem={0.8} />
            <div className="last-updated-label-related">
                <Input
                    defaultValue={withinTheLast.value}
                    onChange={(event) => handleInputChange(event, 'within-the-last')}
                />
                <Select
                    onChange={(option) => handleSelectChange(option, 'within-the-last')}
                    defaultValue={withinTheLast.period}
                    options={[
                        { label: 'minutes', value: 'minutes' },
                        { label: 'hours', value: 'hours' },
                    ]}
                />
            </div>

            <Brick sizeInRem={1.5} />

            <Radio
                label="More than"
                name="type"
                value="more-than"
                onChange={handleRadioChange}
                defaultChecked={initialValues.active === 'more-than'}
            />
            <Brick sizeInRem={0.8} />
            <div className="last-updated-label-related">
                <Input defaultValue={moreThan.value} onChange={(event) => handleInputChange(event, 'more-than')} />
                <Select
                    onChange={(option) => handleSelectChange(option, 'more-than')}
                    defaultValue={moreThan.period}
                    options={[
                        { label: 'minutes ago', value: 'minutes ago' },
                        { label: 'hours ago', value: 'hours ago' },
                    ]}
                />
            </div>

            <Brick sizeInRem={1.5} />

            <Radio
                label="Date Range"
                name="type"
                value="date-range"
                onChange={handleRadioChange}
                defaultChecked={initialValues.active === 'date-range'}
            />
            <Brick sizeInRem={0.8} />
            <div className="last-updated-label-related">
                <TimeFrameSelector
                    rangeDate={dateRange.rangeDate}
                    period={dateRange.period}
                    onChange={(args) => handleSelectDateRange(args, 'date-range')}
                />
            </div>
        </div>
    );
};

LastUpdated.propTypes = {
    initialValues: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

export default LastUpdated;
