import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import axios from 'axios';
import {
    BaseUrl,
    generalEquipments,
    getLocation,
    equipmentType,
    createEquipment,
    getEndUseId,
    updateEquipment,
    listSensor,
    searchEquipment,
    deleteEquipment,
    lastUsedEquimentDevice,
} from '../../services/Network';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { ComponentStore } from '../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
import { Search } from 'react-feather';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect } from 'react-multi-select-component';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import { faEllipsisVertical, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    allEquipmentDataGlobal,
    equipmentData,
    equipmentDataGlobal,
    equipmentId,
    toggleRecord,
} from '../../store/globalState';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import EquipChartModal from '../explore/EquipChartModal';
import './style.css';

const EquipmentTable = ({
    equipmentData,
    isEquipDataFetched,
    equipmentTypeData,
    endUse,
    fetchEquipmentData,
    selectedOptions,
    equipmentDataWithFilter,
    locationData,
    nextPageData,
    previousPageData,
    paginationData,
    pageSize,
    setPageSize,
    setIsDelete,
    setIsEdit,
    setEquipmentFilter,
    handleChartOpen,
    setEquipmentIdData,
}) => {
    const [nameOrder, setNameOrder] = useState(false);
    const [equipTypeOrder, setEquipTypeOrder] = useState(false);
    const [locationOrder, setLocationOrder] = useState(false);
    const [TagsOrder, setTagsOrder] = useState(false);
    const [sensorOrder, setSensorOrder] = useState(false);
    const [lastDataOrder, setLastDataOrder] = useState(false);
    const [deviceIdOrder, setDeviceIdOrder] = useState(false);

    const [equpimentDataNow] = useAtom(equipmentDataGlobal);

    const [userPermission] = useAtom(userPermissionData);

    const handleColumnSort = (order, columnName) => {
        if (columnName === 'equipments_name') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'equipments_type') {
            setNameOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'tags') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setNameOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'location') {
            setEquipTypeOrder(false);
            setNameOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'sensor_number') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setNameOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'device_mac') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setNameOrder(false);
        }
        // if (columnName === 'hardware_version') {
        //     setEquipTypeOrder(false);
        //     setLocationOrder(false);
        //     setTagsOrder(false);
        //     setSensorOrder(false);
        //     setLastDataOrder(false);
        //     setDeviceIdOrder(false);
        // }
        equipmentDataWithFilter(order, columnName);
    };

    const [equipData, setEquipData] = useState(null);

    return (
        <>
            <Card>
                <CardBody>
                    {userPermission?.user_role === 'admin' ||
                    (userPermission &&
                        userPermission?.permissions?.permissions?.building_equipment_permission?.view) ? (
                        <>
                            <Table className="mb-0 bordered table-hover">
                                <thead>
                                    <tr className="mouse-pointer">
                                        {selectedOptions.some((record) => record.value === 'status') && <th>Status</th>}
                                        {selectedOptions.some((record) => record.value === 'name') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setNameOrder(!nameOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Name</div>
                                                    {nameOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'equipments_name')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'equipments_name')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'equip_type') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setEquipTypeOrder(!equipTypeOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Equipment Type</div>
                                                    {equipTypeOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'equipments_type')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'equipments_type')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'location') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setLocationOrder(!locationOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Location</div>
                                                    {locationOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'location')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'location')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'tags') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setTagsOrder(!TagsOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Tags</div>
                                                    {TagsOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'tags')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'tags')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'sensor_number') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setSensorOrder(!sensorOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Sensor Number</div>
                                                    {sensorOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'sensor_number')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'sensor_number')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'last_data') && (
                                            <th className="active-device-header">
                                                <div className="active-device-flex">
                                                    <div>Last Data</div>
                                                </div>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'device_id') && (
                                            <th
                                                className="active-device-header"
                                                onClick={() => setDeviceIdOrder(!deviceIdOrder)}>
                                                <div className="active-device-flex">
                                                    <div>Device ID</div>
                                                    {deviceIdOrder ? (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('ace', 'device_mac')}>
                                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="ml-2"
                                                            onClick={() => handleColumnSort('dce', 'device_mac')}>
                                                            <FontAwesomeIcon
                                                                icon={faAngleDown}
                                                                color="grey"
                                                                size="md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        <th className="active-device-header">
                                            <div className="active-device-flex">
                                                <div>Actions</div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                {isEquipDataFetched ? (
                                    <tbody>
                                        <SkeletonTheme color="#202020" height={35}>
                                            <tr>
                                                <td>
                                                    <Skeleton count={10} />
                                                </td>

                                                <td>
                                                    <Skeleton count={10} />
                                                </td>

                                                <td>
                                                    <Skeleton count={10} />
                                                </td>

                                                <td>
                                                    <Skeleton count={10} />
                                                </td>

                                                <td>
                                                    <Skeleton count={10} />
                                                </td>

                                                <td>
                                                    <Skeleton count={10} />
                                                </td>
                                                <td>
                                                    <Skeleton count={10} />
                                                </td>
                                                <td>
                                                    <Skeleton count={10} />
                                                </td>
                                                <td>
                                                    <Skeleton count={10} />
                                                </td>
                                            </tr>
                                        </SkeletonTheme>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {equipmentData.map((record, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    onClick={() => {
                                                        setEquipData(record);
                                                        // setFormValidation(false);
                                                    }}
                                                    className="mouse-pointer">
                                                    {selectedOptions.some((record) => record.value === 'status') && (
                                                        <td className="text-center">
                                                            <div>
                                                                {record.status === 'Online' && (
                                                                    <div className="icon-bg-styling">
                                                                        <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                                    </div>
                                                                )}
                                                                {record.status === 'Offline' && (
                                                                    <div className="icon-bg-styling-slash">
                                                                        <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {selectedOptions.some((record) => record.value === 'name') && (
                                                        <td className="font-weight-bold">
                                                            {!(record.equipments_name === '')
                                                                ? record.equipments_name
                                                                : '-'}
                                                        </td>
                                                    )}
                                                    {selectedOptions.some(
                                                        (record) => record.value === 'equip_type'
                                                    ) && <td className="font-weight-bold">{record.equipments_type}</td>}
                                                    {selectedOptions.some((record) => record.value === 'location') && (
                                                        <td>
                                                            {record.location === ''
                                                                ? ' - '
                                                                : record.location}
                                                        </td>
                                                    )}
                                                    {selectedOptions.some((record) => record.value === 'tags') && (
                                                        <td>
                                                            {
                                                                <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                                    {record.tags.length === 0
                                                                        ? 'None'
                                                                        : `${`${record.tags[0]} + ${
                                                                              record?.tags?.length - 1
                                                                          }`} `}
                                                                </div>
                                                            }
                                                        </td>
                                                    )}
                                                    {selectedOptions.some(
                                                        (record) => record.value === 'sensor_number'
                                                    ) && (
                                                        <td>
                                                            {record.sensor_number === 0 ? '-' : record.sensor_number}
                                                        </td>
                                                    )}
                                                    {selectedOptions.some((record) => record.value === 'last_data') && (
                                                        <td>
                                                            {record.last_data === ''
                                                                ? '-'
                                                                : moment(record?.last_data).fromNow()}
                                                        </td>
                                                    )}
                                                    {selectedOptions.some((record) => record.value === 'device_id') && (
                                                        <td className="font-weight-bold">{record.device_mac}</td>
                                                    )}
                                                    <td>
                                                        <Dropdown className="float-end" align="end">
                                                            <div>
                                                                <Dropdown.Toggle
                                                                    as="a"
                                                                    className="cursor-pointer arrow-none text-muted">
                                                                    <div className="triple-dot-style">
                                                                        <FontAwesomeIcon
                                                                            icon={faEllipsisVertical}
                                                                            color="#1D2939"
                                                                            size="lg"
                                                                        />
                                                                    </div>
                                                                </Dropdown.Toggle>
                                                            </div>
                                                            <Dropdown.Menu>
                                                                <div
                                                                    onClick={() => {
                                                                        setEquipmentFilter({
                                                                            equipment_id: record?.equipments_id,
                                                                            equipment_name: record?.equipments_name,
                                                                        });
                                                                        handleChartOpen();
                                                                    }}>
                                                                    <Dropdown.Item>
                                                                        <FontAwesomeIcon
                                                                            icon={faPen}
                                                                            color="#1D2939"
                                                                            size="lg"
                                                                            className="mr-4"
                                                                        />
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                </div>
                                                                <div
                                                                    onClick={() => {
                                                                        if (record.device_type === 'active') {
                                                                            return;
                                                                        }
                                                                        setEquipmentIdData(record?.equipments_id);
                                                                        setIsDelete(true);
                                                                    }}>
                                                                    <Dropdown.Item
                                                                        disabled={record.device_type === 'active'}>
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            color={
                                                                                record.device_type === 'active'
                                                                                    ? '#ad716c'
                                                                                    : '#d92d20'
                                                                            }
                                                                            size="lg"
                                                                            className="mr-4"
                                                                        />
                                                                        <span
                                                                            className={
                                                                                record.device_type === 'active'
                                                                                    ? 'disable-delete-btn-style'
                                                                                    : 'delete-btn-style'
                                                                            }>
                                                                            Delete
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                </div>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                )}
                            </Table>
                            <div className="page-button-style">
                                <button
                                    type="button"
                                    className="btn btn-md btn-light font-weight-bold mt-4"
                                    disabled={
                                        paginationData.pagination !== undefined
                                            ? paginationData.pagination.previous === null
                                                ? true
                                                : false
                                            : false
                                    }
                                    onClick={() => {
                                        previousPageData(paginationData.pagination.previous);
                                    }}>
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-md btn-light font-weight-bold mt-4"
                                    disabled={
                                        paginationData.pagination !== undefined
                                            ? paginationData.pagination.next === null
                                                ? true
                                                : false
                                            : false
                                    }
                                    onClick={() => {
                                        nextPageData(paginationData.pagination.next);
                                    }}>
                                    Next
                                </button>
                                <div>
                                    <select
                                        value={pageSize}
                                        className="btn btn-md btn-light font-weight-bold mt-4"
                                        onChange={(e) => {
                                            setPageSize(parseInt(e.target.value));
                                        }}>
                                        {[20, 50, 100].map((pageSize) => (
                                            <option key={pageSize} value={pageSize} className="align-options-center">
                                                Show {pageSize} devices
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>You don't have view access</p>
                    )}
                </CardBody>
            </Card>

            {/* {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.building_equipment_permission?.edit ? (
                <div>
                    <EquipmentDeviceChartModel
                        showChart={modal1}
                        handleChartClose={Close1}
                        equipData={equipData}
                        equipmentTypeData={equipmentTypeData}
                        endUse={endUse}
                        fetchEquipmentData={fetchEquipmentData}
                        showWindow={'configure'}
                        deviceType={'active'}
                        // formValidation={formValidation}
                        // setFormValidation={setFormValidation}
                    />
                    <EquipmentDeviceChartModel
                        showChart={modal2}
                        handleChartClose={Close2}
                        equipData={equipData}
                        equipmentTypeData={equipmentTypeData}
                        endUse={endUse}
                        fetchEquipmentData={fetchEquipmentData}
                        showWindow={'configure'}
                        deviceType={'passive'}
                        locationData={locationData}
                        // formValidation={formValidation}
                        // setFormValidation={setFormValidation}
                    />
                </div>
            ) : (
                <></>
            )} */}
        </>
    );
};

const Equipment = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isDelete, setIsDelete] = useState(false);
    const handleDeleteClose = () => setIsDelete(false);

    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(1);

    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const handleChartOpen = () => setShowEquipmentChart(true);
    const handleChartClose = () => setShowEquipmentChart(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isEquipDataFetched, setIsEquipDataFetched] = useState(true);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentData, setGeneralEquipmentData] = useState([]);
    const [DuplicateGeneralEquipmentData, setDuplicateGeneralEquipmentData] = useState([]);
    const [onlineEquipData, setOnlineEquipData] = useState([]);
    const [offlineEquipData, setOfflineEquipData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);

    const [createEqipmentData, setCreateEqipmentData] = useState({
        name: '',
        equipment_type: '',
        end_use: '',
        space_id: '',
    });

    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const tableColumnOptions = [
        { label: 'Status', value: 'status' },
        { label: 'Name', value: 'name' },
        { label: 'Equipment Type', value: 'equip_type' },
        { label: 'Location', value: 'location' },
        { label: 'Tags', value: 'tags' },
        { label: 'Sensor Number', value: 'sensor_number' },
        { label: 'Last Data', value: 'last_data' },
        { label: 'Device Id', value: 'device_id' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    const [equipSearch, setEquipSearch] = useState('');

    const [equipmentTypeDataNow, setEquipmentTypeDataNow] = useState([]);
    const [endUseDataNow, setEndUseDataNow] = useState([]);
    const [locationDataNow, setLocationDataNow] = useState([]);

    const addEquimentType = () => {
        equipmentTypeData.map((item) => {
            setEquipmentTypeDataNow((el) => [
                ...el,
                { value: `${item?.equipment_id}`, label: `${item?.equipment_type}` },
            ]);
        });
    };

    const addEndUseType = () => {
        endUseData.map((item) => {
            setEndUseDataNow((el) => [...el, { value: `${item?.end_user_id}`, label: `${item?.name}` }]);
        });
    };

    const addLocationType = () => {
        locationData.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    useEffect(() => {
        if (equipmentTypeData) {
            addEquimentType();
        }
    }, [equipmentTypeData]);

    useEffect(() => {
        if (equipSearch === '') {
            fetchEquipmentData();
        }
    }, [equipSearch, pageSize]);

    useEffect(() => {
        if (endUseData) {
            addEndUseType();
        }
    }, [endUseData]);

    useEffect(() => {
        if (locationData) {
            addLocationType();
        }
    }, [locationData]);

    const handleSearch = async () => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&equipment_search=${equipSearch}&sort_by=ace&page_size=${pageSize}&page_no=${pageNo}`;
            await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                let response = res.data;
                setGeneralEquipmentData(response.data);
                setIsEquipDataFetched(false);
            });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEqipmentData);
        if (key === 'equipment_type') {
            let endUseObj = equipmentTypeData.find((record) => record?.equipment_id === value);
            obj['end_use'] = endUseObj.end_use_id;
        }
        obj[key] = value;
        setCreateEqipmentData(obj);
    };

    const saveDeviceData = async () => {
        let obj = Object.assign({}, createEqipmentData);
        obj['building_id'] = bldgId;
        try {
            setIsProcessing(true);
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios
                .post(`${BaseUrl}${createEquipment}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    setTimeout(function () {
                        fetchEquipmentData();
                    }, 0);
                    // setFormValidation(false);
                });

            setIsProcessing(false);
            handleClose();
        } catch (error) {
            setIsProcessing(false);
        }
    };

    const equipmentDataWithFilter = async (order, filterBy) => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&sort_by=${order}&page_size=${pageSize}&page_no=${pageNo}`;
            await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setGeneralEquipmentData(responseData.data);
                setDuplicateGeneralEquipmentData(responseData.data);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
            });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const nextPageData = async (path) => {
        try {
            setIsEquipDataFetched(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentData(responseData.data);
                setDuplicateGeneralEquipmentData(responseData.data);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.data.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
                // setFormValidation(false);
            });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const previousPageData = async (path) => {
        try {
            setIsEquipDataFetched(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentData(responseData.data);
                setDuplicateGeneralEquipmentData(responseData.data);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.data.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
                // setFormValidation(false);
            });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const [equpimentDataNow, setEqupimentDataNow] = useAtom(equipmentDataGlobal);
    const [allEqupimentDataNow, setAllEqupimentDataNow] = useAtom(allEquipmentDataGlobal);
    const [searchText, setSearchText] = useState('');

    const fetchEquipmentData = async () => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&equipment_search=${equipSearch}&sort_by=ace&page_size=${pageSize}&page_no=${pageNo}`;
            await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentData(responseData.data);
                setDuplicateGeneralEquipmentData(responseData.data);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.data.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
                // setFormValidation(false);
            });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const addEquimentData = () => {
        generalEquipmentData.map((item) => {
            if (item?.device_type === 'active') {
                setEqupimentDataNow((el) => [...el, item?.equipments_id]);
            }
            setAllEqupimentDataNow((el) => [...el, item?.equipments_id]);
        });
    };

    useEffect(() => {
        addEquimentData();
    }, [generalEquipmentData]);

    useEffect(() => {
        const fetchEndUseData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                    let response = res.data;
                    setEndUseData(response);
                });
            } catch (error) {}
        };

        const fetchEquipTypeData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    response.sort((a, b) => {
                        return a.equipment_type.localeCompare(b.equipment_type);
                    });
                    setEquipmentTypeData(response);
                });
            } catch (error) {}
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    setLocationData(res.data);
                });
            } catch (error) {}
        };

        //fetchEquipmentData();
        fetchEndUseData();
        // fetchOnlineEquipData();
        // fetchOfflineEquipData();
        fetchEquipTypeData();
        fetchLocationData();
    }, [bldgId, pageSize]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment',
                        path: '/settings/equipment',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        let arr = [
            { label: 'Status', value: 'status' },
            { label: 'Name', value: 'name' },
            { label: 'Equipment Type', value: 'equip_type' },
            { label: 'Location', value: 'location' },
            { label: 'Tags', value: 'tags' },
            { label: 'Sensor Number', value: 'sensor_number' },
            { label: 'Last Data', value: 'last_data' },
            { label: 'Device Id', value: 'device_id' },
        ];
        setSelectedOptions(arr);
        updateBreadcrumbStore();
    }, []);

    const [userPermission] = useAtom(userPermissionData);

    const [processdelete, setProcessdelete] = useState(false);
    const [equipmentIdData, setEquipmentIdData] = useState('');

    const deleteEquipmentFunc = async () => {
        setProcessdelete(true);
        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?equipment_id=${equipmentIdData}&building_id=${bldgId}`;
        await axios.delete(`${BaseUrl}${deleteEquipment}${params}`, { headers }).then(() => {
            setProcessdelete(false);
            fetchEquipmentData();
            setIsDelete(false);
        });
    };

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Equipment</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.building_equipment_permission?.create ? (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        handleShow();
                                        setCreateEqipmentData({
                                            name: '',
                                            equipment_type: '',
                                            end_use: '',
                                            space_id: '',
                                        });
                                        // setFormValidation(false);
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>Add Equipment
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            onChange={(e) => {
                                setEquipSearch(e.target.value);
                            }}
                        />
                        <button class="input-group-text border-0" id="search-addon" onClick={handleSearch}>
                            <Search className="icon-sm" />
                        </button>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="btn-group ml-2" role="group" aria-label="Basic example">
                        <div>
                            <button
                                type="button"
                                className={
                                    selectedTab === 0
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                onClick={() => setSelectedTab(0)}>
                                All Statuses
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 1
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderRadius: '0px' }}
                                onClick={() => setSelectedTab(1)}>
                                <i className="uil uil-wifi mr-1"></i>Online
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 2
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                                onClick={() => setSelectedTab(2)}>
                                <i className="uil uil-wifi-slash mr-1"></i>Offline
                            </button>
                        </div>
                    </div>

                    {/* ---------------------------------------------------------------------- */}
                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    {selectedTab === 0 && (
                        <EquipmentTable
                            equipmentData={generalEquipmentData}
                            isEquipDataFetched={isEquipDataFetched}
                            equipmentTypeData={equipmentTypeData}
                            endUse={endUseData}
                            fetchEquipmentData={fetchEquipmentData}
                            selectedOptions={selectedOptions}
                            equipmentDataWithFilter={equipmentDataWithFilter}
                            locationData={locationData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsDelete={setIsDelete}
                            setEquipmentFilter={setEquipmentFilter}
                            handleChartOpen={handleChartOpen}
                            setEquipmentIdData={setEquipmentIdData}
                            // formValidation={formValidation}
                            // setFormValidation={setFormValidation}
                        />
                    )}
                    {selectedTab === 1 && (
                        <EquipmentTable
                            equipmentData={onlineEquipData}
                            isEquipDataFetched={isEquipDataFetched}
                            equipmentTypeData={equipmentTypeData}
                            endUse={endUseData}
                            fetchEquipmentData={fetchEquipmentData}
                            selectedOptions={selectedOptions}
                            equipmentDataWithFilter={equipmentDataWithFilter}
                            locationData={locationData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsDelete={setIsDelete}
                            setEquipmentFilter={setEquipmentFilter}
                            handleChartOpen={handleChartOpen}
                            setEquipmentIdData={setEquipmentIdData}
                            // formValidation={formValidation}
                            // setFormValidation={setFormValidation}
                        />
                    )}
                    {selectedTab === 2 && (
                        <EquipmentTable
                            equipmentData={offlineEquipData}
                            isEquipDataFetched={isEquipDataFetched}
                            equipmentTypeData={equipmentTypeData}
                            endUse={endUseData}
                            fetchEquipmentData={fetchEquipmentData}
                            selectedOptions={selectedOptions}
                            equipmentDataWithFilter={equipmentDataWithFilter}
                            locationData={locationData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsDelete={setIsDelete}
                            setEquipmentFilter={setEquipmentFilter}
                            handleChartOpen={handleChartOpen}
                            setEquipmentIdData={setEquipmentIdData}
                            // formValidation={formValidation}
                            // setFormValidation={setFormValidation}
                        />
                    )}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                value={createEqipmentData?.name}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            <Select
                                id="exampleSelect"
                                placeholder="Select Equipment Type"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Equipment Type'}
                                options={equipmentTypeDataNow}
                                value={equipmentTypeDataNow.filter(
                                    (option) => option.value === createEqipmentData?.equipment_type
                                )}
                                onChange={(e) => {
                                    handleChange('equipment_type', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>End Use Category</Form.Label>
                            <Select
                                id="endUseSelect"
                                placeholder="Selected End Use"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Selected End Use'}
                                options={endUseDataNow}
                                value={endUseDataNow.filter((option) => option.value === createEqipmentData?.end_use)}
                                onChange={(e) => {
                                    handleChange('end_use', e.value);
                                }}
                                className="basic-single font-weight-bold"
                                isDisabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Location</Form.Label>
                            <Select
                                id="exampleSelect"
                                placeholder="Select Equipment Location"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Equipment Location'}
                                options={locationDataNow}
                                value={locationDataNow.filter(
                                    (option) => option.value === createEqipmentData?.space_id
                                )}
                                onChange={(e) => {
                                    handleChange('space_id', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
                        <Button
                            style={{ width: '50%', backgroundColor: '#fff', border: '1px solid black', color: '#000' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            style={{ width: '50%', backgroundColor: '#444CE7', border: 'none' }}
                            onClick={() => {
                                saveDeviceData();
                            }}
                            // disabled={!formValidation}
                        >
                            {isProcessing ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal size="sm" show={isDelete} onHide={handleDeleteClose} centered>
                <Modal.Header>
                    <Modal.Title>Delete Equpiment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <span style={{ fontSize: '15px' }}>Are you sure you want to delete the Equipment?</span>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}>
                    <Button
                        style={{ width: '50%', backgroundColor: '#ffffff', borderColor: '#000000', color: '#000000' }}
                        onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={processdelete}
                        style={{ width: '50%', backgroundColor: '#b42318', borderColor: '#b42318' }}
                        onClick={() => {
                            deleteEquipmentFunc();
                        }}>
                        {processdelete ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <EquipChartModal
                showEquipmentChart={showEquipmentChart}
                handleChartClose={handleChartClose}
                equipmentFilter={equipmentFilter}
                fetchEquipmentData={fetchEquipmentData}
                selectedTab={selectedModalTab}
                setSelectedTab={setSelectedModalTab}
                activePage="equipment"
            />
        </React.Fragment>
    );
};

export default Equipment;
