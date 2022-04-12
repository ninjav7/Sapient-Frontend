import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { servicePost } from '../../helpers/api';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
} from '../../services/Network';
import axios from 'axios';

const General = () => {
    const [buildingId, setBuildingId] = useState(1);
    const [buildingData, setBuildingData] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [generalDateTime, setGeneralDateTime] = useState({});
    const [checked, setChecked] = useState(generalDateTime.time_format);
    const [generalOperatingHours, setGeneralOperatingHours] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Building Details
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios.post(`${BaseUrl}${generalBuildingDetail}/${buildingId}`, {}, { headers }).then((res) => {
            setBuildingData(res.data);
            setChecked(res.data.active);
            console.log(res.data);
        });
    }, []);

    // Building Address
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(`${BaseUrl}${generalBuildingAddress}/${buildingId}`, {}, { headers })
            .then((res) => {
                setBuildingAddress(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
    }, []);

    // General Date & Time
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(`${BaseUrl}${generalDateTime}/${buildingId}`, {}, { headers })
            .then((res) => {
                setGeneralDateTime(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
    }, []);

    // General Operating Hours
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(`${BaseUrl}${generalOperatingHours}/${buildingId}`, {}, { headers })
            .then((res) => {
                setGeneralOperatingHours(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        General Building Settings
                    </span>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Building Details
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-3">
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Active</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Non-admin users can only view active buildings.
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <Switch
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Building Name</h6>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                A human-friendly display name for this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="buildingName"
                                                id="buildingName"
                                                placeholder="Enter Building Name"
                                                className="single-line-style font-weight-bold"
                                                defaultValue={buildingData.building_name}
                                                value={buildingData.building_name}
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Type</h6>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                The primary use/type of this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold">
                                                <option>Office Building</option>
                                                <option>Residential Building</option>
                                            </Input>
                                            {/* <Input
                                                type="select"
                                                name="buildingType"
                                                id="buildingType"
                                                className="font-weight-bold"
                                                placeholder="Please select building type"
                                                defaultValue={buildingData.building_type}
                                                onChange={(e) => {
                                                    handleChange('building_type', e.target.value);
                                                }}>
                                                {buildingType.map((building, index) => {
                                                    return (
                                                        <option value={building._id} key={building._id}>
                                                            {building.name}
                                                        </option>
                                                    );
                                                })}
                                            </Input> */}
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Square Footage</h6>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                The total square footage of this building
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="text"
                                                id="exampleNumber"
                                                placeholder="Enter value"
                                                // defaultValue={(24253).toLocaleString(undefined, {
                                                //     maximumFractionDigits: 2,
                                                // })}
                                                value={buildingData.building_size}
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
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Address
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-1">
                                    <FormGroup>
                                        <Label for="userAddress1" className="card-title">
                                            Street Address
                                        </Label>
                                        <Input
                                            type="text"
                                            name="address1"
                                            id="userAddress1"
                                            placeholder="Address 1"
                                            defaultValue=""
                                            value={buildingAddress.street_address}
                                            className="font-weight-bold"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="userAddress2" className="card-title">
                                            Address 2 (optional)
                                        </Label>
                                        <Input
                                            type="text"
                                            name="address2"
                                            id="userAddress2"
                                            placeholder="Address 2"
                                            className="font-weight-bold"
                                            value={buildingAddress.address_2}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="grid-style-2">
                                    <FormGroup>
                                        <Label for="userCity" className="card-title">
                                            City
                                        </Label>
                                        <Input
                                            type="text"
                                            name="city"
                                            id="userCity"
                                            placeholder="Enter your city"
                                            defaultValue=""
                                            className="font-weight-bold"
                                            value={buildingAddress.city}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="userState" className="card-title">
                                            State
                                        </Label>
                                        <Input type="select" name="state" id="userState" className="font-weight-bold">
                                            <option>Oregon</option>
                                            <option>Washington</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="useZipCode" className="card-title">
                                            Zip
                                        </Label>
                                        <Input
                                            type="number"
                                            name="zip"
                                            id="useZipCode"
                                            placeholder="Enter zip code"
                                            defaultValue={24253}
                                            value={buildingAddress.zip_code}
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
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Date & Time
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-4">
                                    <div className="single-line-style">
                                        <h6 className="card-title">Timezone</h6>
                                    </div>
                                    <div className="single-line-style">
                                        <h6 className="card-title">{generalDateTime.timezone}</h6>
                                    </div>
                                    <div className="single-line-style">
                                        <h6 className="card-title">Use 24-hour Clock</h6>
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
                                            onChange={() => setChecked(!checked)}
                                            checked={generalDateTime.time_format}
                                            onColor={'#2955E7'}
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
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Operating Hours
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <div>
                                    {/* Monday */}
                                    <div className="operate-hour-style">
                                        <Switch
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Mon
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Tue
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Wed
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Thu
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Fri
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Sat
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={true}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                        <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                            Sun
                                        </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            className="time-picker-style-disabled time-picker-text-style-disabled"
                                        />
                                        <div className="spacing"> to </div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setStartDate(date)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            timeCaption="Time"
                                            dateFormat="h:mm"
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
