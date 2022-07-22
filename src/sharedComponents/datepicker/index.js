import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg';

import './Datepicker.scss';

const Datepicker = ({ className = '', datepickerClassName = '', iconBtnClassName = '', ...props }) => {
    const datepickerRef = useRef(null);

    const handleClickDatepickerBtn = () => {
        datepickerRef.current?.setFocus(true);
    };

    return (
        <div className={`datepicker-wrapper ${className}`}>
            <button
                type="button"
                className={`datepicker-icon-btn ${iconBtnClassName}`}
                onClick={() => handleClickDatepickerBtn()}>
                <CalendarIcon />
            </button>
            <DatePicker {...props} className={`datepicker ${datepickerClassName}`} ref={datepickerRef} />
        </div>
    );
};

export default Datepicker;
