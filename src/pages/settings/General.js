import React from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import './style.css';

const General = () => {
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
                                        <div className="custom-control custom-switch custom-switch-lg singleline-toggle-switch">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitches"
                                                readOnly
                                            />
                                            <label className="custom-control-label" htmlFor="customSwitches" />
                                        </div>
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
                                                defaultValue={'123 Main St. Portand, OR'}
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
                                                defaultValue={(24253).toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}
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
                                            defaultValue="123 Main St."
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
                                            defaultValue="Portland"
                                            className="font-weight-bold"
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
                                        <h6 className="card-title">PST (UTC-8)</h6>
                                    </div>
                                    <div className="single-line-style">
                                        <h6 className="card-title">Use 24-hour Clock</h6>
                                    </div>
                                    <div>
                                        <div className="custom-control custom-switch switch-style">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="24HourClock"
                                                readOnly
                                            />
                                            <label className="custom-control-label" htmlFor="24HourClock" />
                                        </div>
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
                                <Col lg={6}>
                                    <div>
                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="monday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="monday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Mon
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="tuesday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="tuesday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Tue
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="wednesday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="wednesday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Wed
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="thursday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="thursday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Thu
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="friday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="friday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Fri
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="saturday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="saturday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Sat
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="operate-hour-style">
                                            <div className="custom-control custom-switch switch-style">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="sunday"
                                                    readOnly
                                                />
                                                <label className="custom-control-label" htmlFor="sunday" />
                                            </div>
                                            <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                Sun
                                            </div>
                                            <div className="time-style">
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="spacing"> to </div>
                                                <div className="time-button-style">
                                                    <Flatpickr
                                                        value={new Date()}
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        onChange={(date) => {
                                                            console.log(date);
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
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
