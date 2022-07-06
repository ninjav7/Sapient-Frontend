import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
    getBuildings,
    deleteBuilding,
} from '../../services/Network';
import axios from 'axios';
import moment from 'moment';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';

const General = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [isEditing, setIsEditing] = useState(false);
    const [buildingData, setBuildingData] = useState({
        building_id: '628dd795f28141b8a69f38bf',
        active: true,
        building_name: 'NYPL Building',
        building_type: 'Residential Building',
        building_size: 2000,
        street_address: 'test',
        address_2: 'test',
        city: 'toranto',
        state: 'Washington',
        zip_code: 66777,
        timezone: 'PDT (UTC-7)',
        time_format: false,
        operating_hours: {
            mon: {
                stat: true,
                time_range: {
                    frm: '00:00',
                    to: '00:00',
                },
            },
            tue: {
                stat: false,
                time_range: '',
            },
            wed: {
                stat: false,
                time_range: '',
            },
            thu: {
                stat: false,
                time_range: '',
            },
            fri: {
                stat: false,
                time_range: '',
            },
            sat: {
                stat: false,
                time_range: '',
            },
            sun: {
                stat: false,
                time_range: '',
            },
        },
    });
    const [operatingHours, setOperatingHours] = useState([]);
    const [allbuildingData, setAllBuildingData] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [generalDateTimeData, setGeneralDateTimeData] = useState({});
    const [checked, setChecked] = useState(generalDateTimeData.time_format);
    const [generalOperatingData, setGeneralOperatingData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(`January 31 1980 12:50`));
    const [value, onChange] = useState('10:00');
    const [render, setRender] = useState(false);
    const [activeToggle, setactiveToggle] = useState(false);
    const [weekToggle, setWeekToggle] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
    });
    const [timeToggle, setTimeToggle] = useState(false);

    const [inputField, setInputField] = useState({
        kWh: 0,
        total_paid: 0,
    });

    useEffect(() => {
        const fetchBuildingData = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${getBuildings}`, { headers }).then((res) => {
                let response = res.data;
                let data = {};
                if (bldgId) {
                    data = response.find((el) => el.building_id === bldgId);
                    if (data === undefined) {
                        return;
                    }
                    setInputField({
                        ...inputField,
                        active: data.active,
                        name: data.building_name,
                        square_footage: data.building_size,
                        typee: data.building_type,
                        street_address: data.street_address,
                        address_2: data.address_2,
                        city: data.city,
                        state: data.state,
                        zip_code: data.zip_code,
                        timezone: data.timezone,
                        time_format: data.time_format,
                        operating_hours: data.operating_hours,
                    });
                    setactiveToggle(data.active);
                    setTimeToggle(data.time_format);
                    console.log(buildingData);
                    const { mon, tue, wed, thu, fri, sat, sun } = data?.operating_hours;

                    setWeekToggle({
                        mon: mon['stat'],
                        tue: tue['stat'],
                        wed: wed['stat'],
                        thu: thu['stat'],
                        fri: fri['stat'],
                        sat: sat['stat'],
                        sun: sun['stat'],
                    });
                }
                setBuildingData(data);
            });
        };
        fetchBuildingData();
    }, [bldgId]);

    useEffect(() => {
        const fetchBuildingData = async () => {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${getBuildings}`, { headers }).then((res) => {
                let response = res.data;
                let data = {};
                if (bldgId) {
                    data = response.find((el) => el.building_id === bldgId);
                    if (data === undefined) {
                        return;
                    }
                    setInputField({
                        ...inputField,
                        active: data.active,
                        name: data.building_name,
                        square_footage: data.building_size,
                        typee: data.building_type,
                        street_address: data.street_address,
                        address_2: data.address_2,
                        city: data.city,
                        state: data.state,
                        zip_code: data.zip_code,
                        timezone: data.timezone,
                        time_format: data.time_format,
                        operating_hours: data.operating_hours,
                    });
                    setactiveToggle(data.active);
                    setTimeToggle(data.time_format);
                    console.log(buildingData);
                    const { mon, tue, wed, thu, fri, sat, sun } = data?.operating_hours;

                    setWeekToggle({
                        mon: mon['stat'],
                        tue: tue['stat'],
                        wed: wed['stat'],
                        thu: thu['stat'],
                        fri: fri['stat'],
                        sat: sat['stat'],
                        sun: sun['stat'],
                    });
                }
                setBuildingData(data);
            });
        };
        fetchBuildingData();
    }, [render]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    // {
                    //     label:'Account Settings',
                    //     path:'/settings/account',
                    //     active:false,
                    // },
                    {
                        label: 'General',
                        path: '/settings/general',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const sampleOperatingHour = {
        mon: {
            stat: false,
            timeRange: {
                frm: '16:23',
                to: '16:24',
            },
        },
        tue: {
            stat: false,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
        wed: {
            stat: true,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
        thu: {
            stat: false,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
        fri: {
            stat: true,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
        sat: {
            stat: false,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
        sun: {
            stat: false,
            timeRange: {
                frm: '16:23',
                to: '16:25',
            },
        },
    };

    const inputsBuildingHandler = (e) => {
        console.log(e.target.name);
        setInputField({ [e.target.name]: e.target.value });
    };

    const EditBuildingHandler = (e) => {
        console.log('helloo');
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.patch(`${BaseUrl}${generalBuildingDetail}/${bldgId}`, inputField, { headers }).then((res) => {
            console.log(res.data);
            // handleClose();
            setRender(!render);
        });
    };

    const inputsAddressHandler = (e) => {
        setInputField({ [e.target.name]: e.target.value });
    };

    const EditAddressHandler = (e) => {
        console.log('helloo');
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.patch(`${BaseUrl}${generalBuildingAddress}/${bldgId}`, inputField, { headers }).then((res) => {
            console.log(res.data);
            // handleClose();
            setRender(!render);
        });
    };

    const dateHandler = (operating_hours, day) => {
        let days = '';
        let timeFrom = '';
        let timeTo = '';
        let stat = '';
        if (operating_hours) {
            days = operating_hours[day];
            timeFrom = days['time_range'].frm;
            timeTo = days['time_range'].to;
            stat = days['stat'];
        }
        // ${operating_hours.mon.time_range.from}
        // const days = operating_hours[day];
        // // console.log(days);
        // const time = '15:02'
        return {
            frm: new Date(`January 31 1980 ${timeFrom}`),
            to: new Date(`January 31 1980 ${timeTo}`),
            stat,
        };
    };

    const inputsActiveToggleHandler = (e) => {
        setactiveToggle(!activeToggle);
        console.log('helloo');
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.patch(`${BaseUrl}${generalBuildingDetail}/${bldgId}`, { active: e }, { headers }).then((res) => {
            console.log(res.data);
            // handleClose();

            setRender(!render);
        });
    };

    const inputsDateHandler = (e) => {
        setTimeToggle(!timeToggle);
        console.log('helloo');
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.patch(`${BaseUrl}${generalDateTime}/${bldgId}`, { time_format: e }, { headers }).then((res) => {
            console.log(res.data);
            // handleClose();

            setRender(!render);
        });
    };

    const deleteBuildingHandler = () => {
        var answer = window.confirm("'Are you sure wants o delete!!!'");
        if (answer) {
            //some code
            console.log("'Are you sure wants o delete!!!'");
            console.log('helloo');
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            axios.delete(`${BaseUrl}${deleteBuilding}/${bldgId}`, { headers }).then((res) => {
                console.log(res.data);
                setRender(!render);
            });
        }
    };

    const operatingHoursChangeHandler = (date, day, type1, type2) => {
        // const currentDtae = dateHandler(inputField.operating_hours, day);
        // const time2 = moment(currentDtae[type2]).format('HH:MM');
        const time1 = moment(date).format('HH:MM');
        console.log('inputField', inputField);
        const data = {
            [day]: {
                time_range: {
                    [type1]: time1,
                },
            },
        };
        dateChangeHandler({ operating_hours: data });
    };

    const checkDateTimeHandler = (day, value) => {
        setWeekToggle({
            ...weekToggle,
            [day]: value,
        });
        const data = {
            [day]: {
                stat: value,
            },
        };
        dateChangeHandler({ operating_hours: data });
    };

    const dateChangeHandler = (value) => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.patch(`${BaseUrl}${generalOperatingHours}/${bldgId}`, value, { headers }).then((res) => {
            console.log(res.data);
            setRender(!render);
        });
    };

    // update section end
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col lg={8}>
                    <div className="building-heading-container">
                        <div className="heading-style" style={{ marginLeft: '20px' }}>
                            General Building Settings
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-default buildings-cancel-style"
                                onClick={() => {
                                    setIsEditing(false);
                                }}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary buildings-save-style ml-3"
                                onClick={() => {
                                    setIsEditing(false);
                                }}>
                                Save
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="building-section-title" style={{ margin: '2px' }}>
                                Building Details
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-3">
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="building-content-title">Active</h6>
                                            <h6 className="building-content-subtitle mb-2" htmlFor="customSwitches">
                                                Non-admin users can only view active buildings.
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <Switch
                                            onChange={inputsActiveToggleHandler}
                                            checked={activeToggle}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="building-content-title">Building Name</h6>
                                            <h6 className="building-content-subtitle mb-2">
                                                A human-friendly display name for this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="name"
                                                id="buildingName"
                                                onChange={inputsBuildingHandler}
                                                onBlur={EditBuildingHandler}
                                                placeholder="Enter Building Name"
                                                className="single-line-style font-weight-bold"
                                                value={inputField.name}
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="building-content-title">Type</h6>
                                            <h6 className="building-content-subtitle mb-2">
                                                The primary use/type of this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="select"
                                                name="typee"
                                                id="exampleSelect"
                                                onChange={inputsBuildingHandler}
                                                onBlur={EditBuildingHandler}
                                                value={inputField.typee}
                                                className="font-weight-bold">
                                                <option>Office Building</option>
                                                <option>Residential Building</option>
                                            </Input>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="building-content-title">Square Footage</h6>
                                            <h6 className="building-content-subtitle mb-2">
                                                The total square footage of this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="square_footage"
                                                id="exampleNumber"
                                                placeholder="Enter value"
                                                onChange={inputsBuildingHandler}
                                                // defaultValue={(24253).toLocaleString(undefined, {
                                                //     maximumFractionDigits: 2,
                                                // })}
                                                onBlur={EditBuildingHandler}
                                                value={inputField.square_footage}
                                                defaultValue={buildingData.building_size}
                                                className="font-weight-bold"
                                            />
                                        </div>
                                    </FormGroup>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="building-section-title" style={{ margin: '2px' }}>
                                Address
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-1">
                                    <FormGroup>
                                        <Label for="userAddress1" className="building-content-title">
                                            Street Address
                                        </Label>
                                        <Input
                                            type="text"
                                            name="street_address"
                                            id="userAddress1"
                                            placeholder="Address 1"
                                            onChange={inputsAddressHandler}
                                            onBlur={EditAddressHandler}
                                            className="font-weight-bold"
                                            value={inputField.street_address}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="userAddress2" className="building-content-title">
                                            Address 2 (optional)
                                        </Label>
                                        <Input
                                            type="text"
                                            name="address_2"
                                            id="userAddress2"
                                            placeholder="Address 2"
                                            className="font-weight-bold"
                                            onChange={inputsAddressHandler}
                                            onBlur={EditAddressHandler}
                                            value={inputField.address_2}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="grid-style-2">
                                    <FormGroup>
                                        <Label for="userCity" className="building-content-title">
                                            City
                                        </Label>
                                        <Input
                                            type="text"
                                            name="city"
                                            id="userCity"
                                            placeholder="Enter your city"
                                            className="font-weight-bold"
                                            onChange={inputsAddressHandler}
                                            onBlur={EditAddressHandler}
                                            value={inputField.city}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="userState" className="building-content-title">
                                            State
                                        </Label>
                                        <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            defaultChecked={buildingData.state}
                                            onChange={inputsAddressHandler}
                                            onBlur={EditAddressHandler}
                                            className="font-weight-bold">
                                            <option>Oregon</option>
                                            <option>Washington</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="useZipCode" className="building-content-title">
                                            Zip
                                        </Label>
                                        <Input
                                            type="number"
                                            name="zip_code"
                                            id="useZipCode"
                                            placeholder="Enter zip code"
                                            value={inputField.zip_code}
                                            onChange={inputsAddressHandler}
                                            onBlur={EditAddressHandler}
                                            className="font-weight-bold"
                                        />
                                    </FormGroup>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="building-section-title" style={{ margin: '2px' }}>
                                Date & Time
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-4">
                                    <div className="single-line-style">
                                        <h6 className="building-content-title">Timezone</h6>
                                    </div>
                                    <div className="single-line-style">
                                        <h6 className="building-content-title">{inputField.timezone}</h6>
                                    </div>
                                    <div className="single-line-style">
                                        <h6 className="building-content-title">Use 24-hour Clock</h6>
                                    </div>
                                    <div>
                                        {/* <div className="custom-control custom-switch switch-style">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="24HourClock"
                                                readOnly
                                            />
                                            <label className="custom-control-label" htmlFor="24HourClock" />
                                        </div> */}
                                        <Switch
                                            onChange={inputsDateHandler}
                                            checked={timeToggle}
                                            onColor={'#2955E7'}
                                            name="time_format"
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                    </div>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="building-section-title" style={{ margin: '2px' }}>
                                Operating Hours
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <div>
                                    {/* Monday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('mon', e)}
                                            checked={weekToggle['mon']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Mon
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'mon').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'mon', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'mon').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'mon', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Tuesday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('tue', e)}
                                            checked={weekToggle['tue']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Tue
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'tue').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'tue', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'tue').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'tue', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Wednesday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('wed', e)}
                                            checked={weekToggle['wed']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Wed
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'wed').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'wed', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'wed').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'wed', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Thursday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('thu', e)}
                                            checked={weekToggle['thu']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Thu
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'thu').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'thu', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'thu').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'thu', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Friday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('fri', e)}
                                            checked={weekToggle['fri']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Fri
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'fri').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'fri', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'fri').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'fri', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Saturday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('sat', e)}
                                            checked={weekToggle['sat']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Sat
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'sat').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'sat', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'sat').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'sat', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                    </div>

                                    {/* Sunday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={(e) => checkDateTimeHandler('sun', e)}
                                            checked={weekToggle['sun']}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Sun
                                        </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'sun').frm}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'sun', 'frm', 'to')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style-disabled time-picker-text-style-disabled"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={dateHandler(inputField.operating_hours, 'sun').to}
                                            onChange={(date) => operatingHoursChangeHandler(date, 'sun', 'to', 'frm')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style-disabled time-picker-text-style-disabled"
                                        />
                                    </div>
                                </div>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Danger Zone
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <button
                                        type="button"
                                        onClick={deleteBuildingHandler}
                                        className="btn btn-md btn-danger font-weight-bold trash-button-style">
                                        <i className="uil uil-trash mr-2"></i>Delete Building
                                    </button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default General;
