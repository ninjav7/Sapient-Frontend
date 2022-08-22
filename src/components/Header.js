import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Input } from 'reactstrap';
import Datepicker from '../sharedComponents/datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangeStore } from '../store/DateRangeStore';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import '../pages/portfolio/style.scss';
import Select from '../sharedComponents/form/select';
import DatePicker, { DateObject, getAllDatesInRange } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { Button, Grid } from '@mui/material';

const Header = (props) => {
    const datePickerRef = useRef();

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    const [localDateRange, setLocalDateRange] = useState([new Date(), new Date()]);
    const [localStartDate, localEndDate] = localDateRange;

    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 4 Weeks',
            value: 28,
        },
        {
            label: 'Last 3 Months',
            value: 90,
        },
        {
            label: 'Last 12 Months',
            value: 365,
        },
        {
            label: 'Month to Date',
            value: 30,
        },
        {
            label: 'Quarter to Date',
            value: 120,
        },
        {
            label: 'Year to Date',
            value: 365,
        },
    ];

    useEffect(() => {
        console.log('Sudhanshu => ', localDateRange);
    });

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            localStorage.setItem('dateFilter', date);
            if (date !== 0) {
                endCustomDate.setDate(endCustomDate.getDate() - 1);
            }
            startCustomDate.setDate(startCustomDate.getDate() - date);
            setDateRange([startCustomDate, endCustomDate]);
            setLocalDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        const setCustomDate = (date) => {
            let startCustomDate = date[0];
            let endCustomDate = date[1];
            let dt = new Date();
            DateRangeStore.update((s) => {
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateRange);
    }, [dateRange]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">{props.title}</span>

                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div>
                            <Select
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="header-datefilter-select date-selector-width"
                                options={customDaySelect}
                                defaultValue={dateFilter}
                                onChange={({ value }) => {
                                    setDateFilter(value);
                                }}
                            />

                            {/* <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                }}
                                defaultValue={dateFilter}>
                                {customDaySelect.map((el, index) => {
                                    return <option value={el.value}>{el.label}</option>;
                                })}
                            </Input> */}
                        </div>

                        <div className="select-button">
                            <Grid container alignItems="center" justifyContent="space-between" px={1}>
                                <Grid item>
                                    <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '1.3em' }} />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        numberOfMonths={2}
                                        onChange={(dateObjects) => {
                                            setLocalDateRange(dateObjects);
                                        }}
                                        value={dateRange}
                                        ref={datePickerRef}
                                        range
                                        render={
                                            <Button
                                                variant="text"
                                                w="100%"
                                                border={2}
                                                onClick={() => datePickerRef.current.openCalendar()}>
                                                {`${dateRange[0]?.toDateString()} - ${dateRange[1]?.toDateString()}`}
                                            </Button>
                                        }
                                        children={
                                            <>
                                                <Grid
                                                    container
                                                    justifyContent="space-around"
                                                    p={2}
                                                    pl={0}
                                                    borderTop={1}>
                                                    <Grid item sm={7} md={7} lg={7}>
                                                        <Grid container spacing={2}>
                                                            {/* Date Selector 1 */}
                                                            <Grid item md={6} sm={6} lg={6} xs={6}>
                                                                <DatePicker
                                                                    value={localDateRange[0]}
                                                                    render={
                                                                        <Button variant="outlined">
                                                                            {localDateRange[0] &&
                                                                                `${localDateRange[0]}`}
                                                                        </Button>
                                                                    }
                                                                    readOnly
                                                                />
                                                            </Grid>
                                                            {/* Date Selector 2 */}
                                                            <Grid item md={6} sm={6} lg={4} xs={6}>
                                                                <DatePicker
                                                                    value={localDateRange[1]}
                                                                    render={
                                                                        <Button variant="outlined" w="100%" border={2}>
                                                                            {localDateRange[1] &&
                                                                                `${localDateRange[1]}`}
                                                                        </Button>
                                                                    }
                                                                    readOnly
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    {/* Cancel */}
                                                    <Grid item sm={2} md={2} lg={2}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => datePickerRef.current.closeCalendar()}>
                                                            Cancel
                                                        </Button>
                                                    </Grid>
                                                    {/* Apply */}
                                                    <Grid item sm={2} md={2} lg={2}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                // let range = localDateRange;
                                                                setDateRange(localDateRange);
                                                                datePickerRef.current.closeCalendar();
                                                            }}>
                                                            Apply
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        {/* <div className="">
                            <Datepicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                maxDate={new Date()}
                                dateFormat="MMMM d"
                                className="header-datefilter-datepicker"
                                placeholderText="Select Date Range"
                            />
                        </div> */}

                        {props.title !== 'Portfolio Overview' && props.title !== 'Compare Buildings' && (
                            <></>
                            // <div className="float-right ml-2">
                            //     <Link
                            //         to={{
                            //             pathname: `/explore/page`,
                            //         }}>
                            //         <button type="button" className="btn btn-md btn-primary font-weight-bold">
                            //             <i className="uil uil-pen mr-1"></i>Explore
                            //         </button>
                            //     </Link>
                            // </div>
                        )}
                    </div>
                    {/* )} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Header;
