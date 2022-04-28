import React, { useEffect, useState } from 'react';
import { Row, Col, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from './DateRangeStore';
import '../pages/portfolio/style.css';

const Header = (props) => {
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };
    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [dateFilter, setDateFilter] = useState(30);

    const customDaySelect = [
        {
            label: 'Last 30 Days',
            value: 30,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 5 Days',
            value: 5,
        },
        {
            label: 'Last 3 Days',
            value: 3,
        },
        {
            label: 'Last 1 Day',
            value: 1,
        },
    ];

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            startCustomDate.setDate(startCustomDate.getDate() - date);
            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        console.log('DateRangeStore => ', DateRangeStore.currentState);
    });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        {props.title}
                    </span>

                    {props.title === 'Compare Buildings' && (
                        <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                            <div>
                                {Object.keys(TABS).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={
                                            activeTab === TABS[key]
                                                ? 'btn btn-sm btn-dark font-weight-bold custom-buttons active'
                                                : 'btn btn-sm btn-light font-weight-bold custom-buttons'
                                        }
                                        onClick={() => setActiveTab(TABS[key])}>
                                        {TABS[key]}
                                    </button>
                                ))}
                            </div>
                            {/* <div className="float-right ml-2">
                                <button type="button" className="btn btn-sm btn-primary font-weight-bold">
                                    <i className="uil uil-pen mr-1"></i>Explore
                                </button>
                            </div> */}
                        </div>
                    )}

                    {props.title !== 'Compare Buildings' && (
                        <div
                            className="btn-group custom-button-group header-widget-styling"
                            role="group"
                            aria-label="Basic example">
                            <div>
                                <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                    className="select-button form-control form-control-md"
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        DateRangeStore.update((s) => {
                                            s.dateFilter = e.target.value;
                                        });
                                    }}>
                                    {customDaySelect.map((el, index) => {
                                        return <option value={el.value}>{el.label}</option>;
                                    })}
                                </Input>
                            </div>
                            <div>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    dateFormat="MMMM d"
                                    className="select-button form-control form-control-md font-weight-bold"
                                    placeholderText="Select Date Range"
                                />
                            </div>
                            {/* <div>
                                <Input
                                    type="week"
                                    name="week"
                                    id="exampleWeek"
                                    placeholder="date week"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                    className="select-button form-control form-control-md"
                                />
                            </div> */}
                            {props.title !== 'Portfolio Overview' && (
                                <div className="float-right ml-2">
                                    <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                        <i className="uil uil-pen mr-1"></i>Explore
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Header;
