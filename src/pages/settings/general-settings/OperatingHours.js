import React, { useEffect } from 'react';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import colorPalette from '../../../assets/scss/_colors.scss';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import './styles.scss';

const OperatingHours = (props) => {
    return (
        <>
            {props.weekDay !== 'Mon' && <Brick sizeInRem={1} />}
            <div className="d-flex justify-content-start align-items-center">
                <div className="d-flex align-items-center mr-4">
                    <Switch
                        onChange={props.onSwitchToggle}
                        checked={!props.isOperating}
                        onColor={colorPalette.datavizBlue600}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className="react-switch"
                    />
                </div>

                <div className="d-flex weekday-container justify-content-center mr-4">
                    <Typography.Subheader size={Typography.Sizes.sm} style={{ color: colorPalette.primaryIndigo600 }}>
                        {props.weekDay}
                    </Typography.Subheader>
                </div>

                <div className="d-flex align-items-center">
                    <div>
                        <DatePicker
                            onInputClick={() => {}}
                            onChange={props.onStartTimeChange}
                            disabled={props.isOperating}
                            showTimeSelect
                            showTimeSelectOnly
                            value={props.startTime}
                            timeIntervals={60}
                            timeCaption="Time"
                            dateFormat={props.timeZone === '24' ? 'h:00 aa' : 'HH:00'}
                            timeFormat={props.timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                            className="time-selector-style"
                        />
                    </div>

                    <div className="ml-2 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>to</Typography.Body>
                    </div>

                    <div>
                        <DatePicker
                            onChange={props.onEndTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            disabled={props.isOperating}
                            timeIntervals={60}
                            value={props.endTime}
                            timeCaption="Time"
                            dateFormat={props.timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                            timeFormat={props.timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                            className="time-selector-style"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default OperatingHours;
