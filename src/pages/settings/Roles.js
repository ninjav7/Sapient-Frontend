import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import './style.css';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, getPermissionRole } from '../../services/Network';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const RoleTable = ({ roleDataList }) => {
    console.log(roleDataList);
    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Roles',
                        path: '/settings/roles',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Permissions</th>
                            <th>Total Users</th>
                        </tr>
                    </thead>
                    {roleDataList?.length === 0 ? (
                        <tbody>
                            <SkeletonTheme color="#202020" height={35}>
                                <tr>
                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {roleDataList.map((record, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">
                                            <Link to={`/settings/roles/${record?._id}`}>
                                                <a className="buildings-name">{record.name}</a>
                                            </Link>
                                        </th>
                                        <td className="font-weight-bold">-</td>
                                        <td className="font-weight-bold">-</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </Table>
            </CardBody>
        </Card>
    );
};

const Roles = () => {
    // Modal states
    const history = useHistory();
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [roleDataList, setRoleDataList] = useState([]);

    const getPermissionRoleFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios.get(`${BaseUrl}${getPermissionRole}`, { headers: header }).then((res) => {
            setRoleDataList(res.data.data);
        });
    };

    useEffect(() => {
        getPermissionRoleFunc();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <span className="heading-style">Roles</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    history.push('/settings/roles/config');
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Role
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2 ml-2">
                <Col xl={3}>
                    <div className="">
                        <div className="active-sensor-header">
                            <div className="search-container mr-2">
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                <input
                                    className="search-box ml-2"
                                    type="search"
                                    name="search"
                                    placeholder="Search..."
                                    // value={searchSensor}
                                    // onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <RoleTable roleDataList={roleDataList} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Roles;
