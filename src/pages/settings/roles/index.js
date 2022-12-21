import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import '../style.css';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, getPermissionRole } from '../../../services/Network';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';

const RoleTable = ({ roleDataList, permissionData, setProcessing }) => {
    const [userPermission] = useAtom(userPermissionData);

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
            <Table className="mt-4 mb-0 bordered table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Permissions</th>
                        <th>Total Users</th>
                    </tr>
                </thead>
                {setProcessing ? (
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
                    <>
                        {permissionData ? (
                            <tbody>
                                {roleDataList.map((record, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">
                                                {/* {userPermission?.permissions?.permissions?.account_roles_permission
                                                ?.edit && ( */}
                                                <Link to={`/settings/roles/${record?._id}`}>
                                                    <a className="buildings-name">{record.name}</a>
                                                </Link>
                                                {/* )}
                                            {!userPermission?.permissions?.permissions?.account_roles_permission
                                                ?.edit && <a className="buildings-name">{record.name}</a>} */}
                                            </th>
                                            <td className="font-weight-bold">-</td>
                                            <td className="font-weight-bold">{record.permissions_users}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ) : (
                            <span style={{ marginTop: '10px' }}>You don't have the permission to this page</span>
                        )}
                    </>
                )}
            </Table>
        </Card>
    );
};

const Roles = () => {
    // Modal states
    const history = useHistory();
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [roleDataList, setRoleDataList] = useState([]);
    const [userPermission] = useAtom(userPermissionData);
    const [permissionNameSearch, setPermissionNameSearch] = useState('');
    const [permissionData, setPermissionData] = useState(false);
    const [setProcessing, setSetProcessing] = useState(false);

    const getPermissionRoleFunc = async () => {
        setSetProcessing(true);
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?permission_name=${permissionNameSearch}`;
            await axios.get(`${BaseUrl}${getPermissionRole}${params}`, { headers: header }).then((res) => {
                setRoleDataList(res.data.data);
                setPermissionData(true);
                setSetProcessing(false);
            });
        } catch (err) {
            setSetProcessing(false);
        }
    };

    useEffect(() => {
        getPermissionRoleFunc();
    }, [permissionNameSearch]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Roles</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_roles_permission?.create ? (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        history.push('/settings/roles/config');
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>Add Role
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
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
                                    value={permissionNameSearch}
                                    onChange={(e) => {
                                        setPermissionNameSearch(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <RoleTable
                        roleDataList={roleDataList}
                        permissionData={permissionData}
                        setProcessing={setProcessing}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Roles;
