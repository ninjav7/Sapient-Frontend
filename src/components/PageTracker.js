import React, { useState } from 'react';
import { List } from 'react-feather';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Card, CardBody, Table } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import './style.css';

const PageTracker = () => {
    const [value, setValue] = useState('');

    return (
        <>
            <div className="page-tracker-container">
                <div className="tracker-dropdown">
                    <DropdownButton
                        id="bts-button-styling"
                        title="123 Main St. Portland, O"
                        className="bts-btn-style"
                        variant="secondary">
                        <div className="content-font-style">
                            <div>
                                <FormControl
                                    className="mx-3 my-2 w-auto"
                                    placeholder="Filter Buildings"
                                    onChange={(e) => setValue(e.target.value)}
                                    value={value}
                                />
                            </div>

                            <div>
                                <Dropdown.Item href="#/action-1">Portfolio</Dropdown.Item>
                            </div>

                            <div>
                                <Dropdown.Header style={{ fontSize: '11px' }}>RECENT</Dropdown.Header>
                                <Dropdown.Item href="#/action-1">123 Main St. Portland, O</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">15 University Bivd. Hartford, CT</Dropdown.Item>

                                <Dropdown.Header style={{ fontSize: '11px' }}>ALL BUILDINGS</Dropdown.Header>
                                <Dropdown.Item href="#/action-1">123 Main St. Portland, OR</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">15 University Bivd. Hartford, CT</Dropdown.Item>
                                <Dropdown.Item href="#/action-1">6223 Syncamore Ave. Pittsburgh, PA</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">246 Blackburn Rd. Philadelphia, PA</Dropdown.Item>
                            </div>
                        </div>
                    </DropdownButton>
                </div>
                <div class="vl"></div>
                {/* <div className='route-tracker'>Portfolio Overview</div> */}
            </div>
        </>
    );
};

export default PageTracker;
