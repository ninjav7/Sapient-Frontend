import React, { useState } from 'react';
import { Row, Col, Label, FormGroup, Input } from 'reactstrap';
import '../pages/portfolio/style.css';

const Header = (props) => {
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };

    const [activeTab, setActiveTab] = useState(TABS.Tab3);

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
                        <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                            <div>
                                <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                    className="select-button form-control form-control-md">
                                    <option className="mb-0">Last 7 Days</option>
                                    <option>Last 5 Days</option>
                                    <option>Last 3 Days</option>
                                    <option>Last 1 Day</option>
                                </Input>
                            </div>
                            <div>
                                <Input
                                    type="week"
                                    name="week"
                                    id="exampleWeek"
                                    placeholder="date week"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                    className="select-button form-control form-control-md"
                                />
                            </div>
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
