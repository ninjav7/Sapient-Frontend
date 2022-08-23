import React, { useState } from 'react';
import Switch from 'react-switch';
import './DropDownInput.css';

const DropDownInput = (props) => {
    const timing = [
        '12:00 AM',
        '01:00 AM',
        '02:00 AM',
        '03:00 AM',
        '04:00 AM',
        '05:00 AM',
        '06:00 AM',
        '07:00 AM',
        '08:00 AM',
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM',
        '07:00 PM',
        '08:00 PM',
        '09:00 PM',
        '10:00 PM',
        '11:00 PM',
    ];

    const [firstStateClicked, setfirstStateClicked] = useState(false);
    const [secondStateClicked, setSecondStateClicked] = useState(false);

    const [firstTime, setFirstTime] = useState('');
    const [secondTime, setSecondTime] = useState('');

    return (
        <div className="mainDivDropDownInput">
            <Switch onColor={'#2955E7'} uncheckedIcon={false} checkedIcon={false} className="react-switch" />
            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">Mon</div>
            <div>
                <div
                    className="drodownBox"
                    onClick={() => {
                        setfirstStateClicked(!firstStateClicked);
                    }}>
                    {firstTime}
                </div>
                {firstStateClicked && (
                    <div className="dropdownTimer">
                        {timing?.map((item) => {
                            return (
                                <div
                                    onClick={() => {
                                        setFirstTime(item);
                                    }}
                                    style={{ cursor: 'pointer' }}>
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div></div>
            </div>
            <div className="spacing"> to </div>
            <div>
                <div
                    className="drodownBox"
                    onClick={() => {
                        setSecondStateClicked(!secondStateClicked);
                    }}>
                    {secondTime}
                </div>
                {secondStateClicked && (
                    <div className="dropdownTimer">
                        {timing?.map((item) => {
                            return (
                                <div
                                    onClick={() => {
                                        setSecondTime(item);
                                    }}
                                    style={{ cursor: 'pointer' }}>
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropDownInput;
