import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
} from 'reactstrap';
import Switch from 'react-switch';
import LineChart from '../charts/LineChart';
import './style.css';

const EditPlugRule = ({
    showEditRule,
    handleEditRuleClose,
    currentData,
    setCurrentData,
    handleCurrentDataChange,
    updatePlugRuleData,
}) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const socketData = [
        {
            equip_type: 'Monitor',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Desktop PC',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Floor Lamp',
            location: 'Floor 1 > 152',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
        {
            equip_type: 'Monitor',
            location: 'Floor 1 > 153',
            assigned_rule: 'None',
            tags: '-',
            last_date: '<5 minutes ago',
        },
    ];

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        toolbar: {
            show: true,
        },
        colors: ['#87AADE'],
        stroke: {
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        stroke: {
            width: [2, 2],
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            },
        },
        tooltip: {
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            x: {
                show: true,
                format: 'dd/MMM',
            },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value + ' K';
                },
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'dd/MMM - hh:mm TT',
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' K';
                    }
                    return val;
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    const [lineChartData, setLineChartData] = useState([
        {
            data: [
                {
                    x: 'May 13',
                    y: '0.07',
                },
                {
                    x: 'May 26',
                    y: '0.01',
                },
                {
                    x: 'May 27',
                    y: '123.45',
                },
                {
                    x: 'May 28',
                    y: '7.20',
                },
                {
                    x: 'Jun 3',
                    y: '0.07',
                },
                {
                    x: 'Jun 4',
                    y: '21.60',
                },
                {
                    x: 'Jun 5',
                    y: '25.20',
                },
                {
                    x: 'Jun 6',
                    y: '21.75',
                },
                {
                    x: 'Jun 8',
                    y: '820.01',
                },
            ],
        },
    ]);

    const handleSwitchChange = () => {
        let obj = currentData;
        obj.is_active = !currentData.is_active;
        handleCurrentDataChange('is_active', obj.is_active);
    };

    return (
        <>
            <Modal
                show={showEditRule}
                onHide={handleEditRuleClose}
                dialogClassName="plug-edit-model-styling"
                backdrop="static"
                keyboard={false}>
                <div>
                    <div className="plugrule-container-bgrd">
                        <div className="single-plugrule-container">
                            <div className="plugrule-page-header">
                                <div>
                                    <div className="mb-1">
                                        <span className="plugrule-device-style">Plug Rule</span>
                                    </div>
                                    <div>
                                        <span className="plugrule-device-name">{currentData.name}</span>
                                    </div>
                                </div>
                                <div className="plug-rule-right-flex">
                                    <div className="plug-rule-switch-header">
                                        <Switch
                                            onChange={() => {
                                                handleSwitchChange();
                                            }}
                                            checked={!currentData.is_active}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={20}
                                            width={36}
                                        />
                                        <span className="ml-2 plug-rule-switch-font">Not Active</span>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-default plugrule-cancel-style"
                                            onClick={handleEditRuleClose}>
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary plugrule-save-style ml-2"
                                            onClick={() => {
                                                updatePlugRuleData();
                                                handleEditRuleClose();
                                            }}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 single-passive-tabs-style">
                                <span
                                    className={
                                        selectedTab === 0
                                            ? 'mr-3 single-plugrule-tab-active'
                                            : 'mr-3 single-plugrule-tab'
                                    }
                                    onClick={() => setSelectedTab(0)}>
                                    Rule Details
                                </span>
                                <span
                                    className={
                                        selectedTab === 1
                                            ? 'mr-3 single-plugrule-tab-active'
                                            : 'mr-3 single-plugrule-tab'
                                    }
                                    onClick={() => setSelectedTab(1)}>
                                    Sockets (4)
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedTab === 0 && (
                        <div>
                            <div className="container plug-rule-body-style">
                                <div className="row">
                                    <div className="col-4">
                                        <h5 className="plug-rule-title">Details</h5>
                                        <span className="plug-rule-subtitle">
                                            Set filters to choose equipment for this rule.
                                        </span>
                                        <div className="mt-2">
                                            <div>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label className="device-label-style">Name</Form.Label>
                                                    <Form.Control
                                                        type="textarea"
                                                        placeholder="Enter Rule Name"
                                                        className="passive-location-style font-weight-bold"
                                                        value={currentData.name}
                                                        onChange={(e) => {
                                                            handleCurrentDataChange('name', e.target.value);
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label className="device-label-style">Description</Form.Label>
                                                    <Input
                                                        type="textarea"
                                                        name="text"
                                                        id="exampleText"
                                                        rows="4"
                                                        placeholder="Enter Description of Rule"
                                                        value={currentData.description}
                                                        className="font-weight-bold"
                                                        onChange={(e) => {
                                                            handleCurrentDataChange('description', e.target.value);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <h5 className="plug-rule-title">Schedule</h5>
                                        <span className="plug-rule-subtitle">
                                            Choose actions and times for this rule.
                                        </span>

                                        <div className="plugrule-schedule-container mt-2"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="plugrule-demand-chart-container">
                                <div className="plugrule-chart-header m-3">
                                    <div>
                                        <h5 className="plugrule-chart-title mb-1">Average Energy Demand</h5>
                                        <p className="plugrule-chart-subtitle">Last 2 Weeks</p>
                                    </div>
                                    <div>
                                        <p className="plugrule-chart-subtitle mb-1">Estimated Energy Savings</p>
                                        <h5 className="plugrule-chart-title float-right">1,722 kWh</h5>
                                    </div>
                                </div>
                                <div className="total-eng-consumtn">
                                    <LineChart options={lineChartOptions} series={lineChartData} height={200} />
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedTab === 1 && (
                        <div>
                            <div className="container plug-rule-body-style">
                                <div className="row">
                                    <div className="socket-filters-flex">
                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title ml-2">
                                                    Show
                                                </Form.Label>
                                                <br />
                                                <div className="btn-group ml-2" role="group" aria-label="Basic example">
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-light d-offline custom-active-btn"
                                                            style={{
                                                                borderTopRightRadius: '0px',
                                                                borderBottomRightRadius: '0px',
                                                            }}>
                                                            All
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-white d-inline custom-inactive-btn"
                                                            style={{ borderRadius: '0px' }}>
                                                            Selected
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-white d-inline custom-inactive-btn"
                                                            style={{
                                                                borderTopLeftRadius: '0px',
                                                                borderBottomLeftRadius: '0px',
                                                            }}>
                                                            Unselected
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Equipment Type
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>All</option>
                                                    <option>Option 1</option>
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Location
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>Filtered</option>
                                                    <option>Option 1</option>
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Tags
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>All</option>
                                                    <option>Option 1</option>
                                                </Input>
                                            </Form.Group>
                                        </div>

                                        <div>
                                            <Form.Group>
                                                <Form.Label for="userState" className="card-title">
                                                    Assigned Rule
                                                </Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold socket-filter-width">
                                                    <option>All</option>
                                                    <option>Option 1</option>
                                                </Input>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <Table className="mb-0 bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Equipment Type</th>
                                                <th>Location</th>
                                                <th>Assigned Rule</th>
                                                <th>Tags</th>
                                                <th>Last Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {socketData.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="font-weight-bold panel-name">
                                                            <div className="plug-equip-container">
                                                                {record.equip_type}
                                                            </div>
                                                        </td>

                                                        <td className="font-weight-bold">{record.location}</td>
                                                        <td className="font-weight-bold">{record.assigned_rule}</td>
                                                        <td className="font-weight-bold">{record.tags}</td>
                                                        <td className="font-weight-bold">{record.last_date}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default EditPlugRule;
