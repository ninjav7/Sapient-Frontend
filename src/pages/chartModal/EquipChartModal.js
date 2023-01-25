import React, { useEffect, useState } from 'react';
import { Row, Col, Input, FormGroup, Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faArrowUpRightFromSquare, faPowerOff } from '@fortawesome/pro-regular-svg-icons';
import { fetchExploreEquipmentChart } from '../explore/services';
import {
    updateListSensor,
    updateEquipmentDetails,
    getEquipmentDetails,
    updateExploreEquipmentYTDUsage,
    getMetadataRequest,
} from './services';
import { Cookies } from 'react-cookie';
import { useHistory, Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import moment from 'moment';
import 'moment-timezone';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import SocketLogo from '../../assets/images/active-devices/Sockets.svg';
import DoubleBreakerUninked from '../../assets/images/equip-modal/Double_Breaker_Unlinked.svg';
import UnionLogo from '../../assets/images/active-devices/Union.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from '../../components/Header';
import { formatConsumptionValue } from '../../helpers/explorehelpers';
import Button from '../../sharedComponents/button/Button';
import './style.css';
import '../../sharedComponents/typography/style.scss';
import { apiRequestBody } from '../../helpers/helpers';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { fetchDateRange } from '../../helpers/formattedChartData';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import colorPalette from '../../assets/scss/_colors.scss';

const EquipChartModal = ({
    showEquipmentChart,
    handleChartClose,
    fetchEquipmentData,
    equipmentFilter,
    selectedTab,
    setSelectedTab,
    activePage,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [userPermission] = useAtom(userPermissionData);

    const history = useHistory();

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const [isEquipDataFetched, setIsEquipDataFetched] = useState(false);

    const metric = [
        { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
        { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
        { value: 'rmsCurrentMilliAmps', label: 'Current (A)', unit: 'A', Consumption: 'Current' },
    ];

    const rulesAlert = [
        { value: 'desktop-pc', label: 'Desktop PC' },
        { value: 'refigerator', label: 'Refigerator' },
    ];

    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [endUse, setEndUse] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [isYtdDataFetching, setIsYtdDataFetching] = useState(false);
    const [ytdData, setYtdData] = useState({});
    const [selected, setSelected] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [updateEqipmentData, setUpdateEqipmentData] = useState({});
    const [isDataChanged, setDataChanged] = useState(false);
    const [defaultEquipData, setDefaultEquipData] = useState({});
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [equipmentData, setEquipmentData] = useState({});
    const [equipBreakerLink, setEquipBreakerLink] = useState([]);
    const [equipResult, setEquipResult] = useState({});

    const [location, setLocation] = useState('');
    const [equipType, setEquipType] = useState('');
    const [closeFlag, setCloseFlag] = useState(false);
    const [equipmentTypeDataNow, setEquipmentTypeDataNow] = useState([]);

    const addEquimentType = () => {
        equipmentTypeData.map((item) => {
            setEquipmentTypeDataNow((el) => [
                ...el,
                { value: `${item?.equipment_id}`, label: `${item?.equipment_type}` },
            ]);
        });
    };

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };
    const handleConsumptionChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedConsumptionLabel(obj.Consumption);
    };

    const validateDataChange = (key, value) => {
        if (key === 'name') {
            if (defaultEquipData?.equipments_name === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'end_use') {
            if (defaultEquipData?.end_use_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'space_id') {
            if (defaultEquipData?.location_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'note') {
            if (defaultEquipData?.note === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'equipment_type') {
            if (defaultEquipData?.equipments_type_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'tags') {
            if (defaultEquipData?.tags === value) {
                setDataChanged(false);
                return;
            }
        }
        setDataChanged(true);
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, updateEqipmentData);
        let equipObj = Object.assign({}, equipmentData);
        obj[key] = value;
        validateDataChange(key, value);
        if (key === 'space_id') {
            setLocation(value);
        }
        if (key === 'equipment_type') {
            setEquipType(value);
        }
        if (key === 'end_use') {
            equipObj['end_use_id'] = value;
            setEquipmentData(equipObj);
        }
        if (key === 'tags') {
            setSelected(value);
        }
        setUpdateEqipmentData(obj);
    };

    const handleEquipTypeChange = (key, value, deviceType) => {
        let obj = Object.assign({}, updateEqipmentData);
        let equipObj = Object.assign({}, equipmentData);

        if (deviceType === 'passive') {
            let data = equipmentTypeData.find((record) => record?.equipment_id === value);
            obj['end_use'] = data?.end_use_id;
            equipObj['end_use_id'] = data?.end_use_id;
            setEquipmentData(equipObj);
            setEquipType(value);
        }

        if (deviceType === 'active') {
            setEquipType(value);
        }

        obj[key] = value;
        validateDataChange(key, value);
        setUpdateEqipmentData(obj);
    };

    const handleSave = async () => {
        let obj = Object.assign({}, updateEqipmentData);
        if (obj.tags) {
            obj.tag = obj.tags;
            delete obj.tags;
        }

        let params = `?equipment_id=${equipmentData?.equipments_id}`;
        await updateEquipmentDetails(obj, params)
            .then((res) => {
                let arr = apiRequestBody(startDate, endDate, timeZone);
                setSelectedTab(0);
                setEquipResult({});
                setEquipmentData({});
                setUpdateEqipmentData({});
                setDataChanged(false);
                if (activePage === 'explore') {
                    setSelectedTab(0);
                }
                if (activePage === 'equipment') {
                    setSelectedTab(1);
                }
                if (activePage === 'buildingOverview') {
                    setSelectedTab(0);
                }
                handleChartClose();
                fetchEquipmentData(arr);
            })
            .catch((error) => {});
    };

    const handleCloseWithoutSave = () => {
        let arr = apiRequestBody(startDate, endDate, timeZone);
        setEquipResult({});
        setEquipmentData({});
        setCloseFlag(true);
        setDataChanged(false);
        setSelectedUnit(metric[0].unit);
        setConsumption(metric[0].value);
        setDeviceData([]);
        setSeriesData([]);
        setSelectedConsumptionLabel(metric[0].Consumption);
        setUpdateEqipmentData({});
        if (activePage === 'explore') {
            setSelectedTab(0);
        }
        if (activePage === 'equipment') {
            setSelectedTab(1);
        }
        if (activePage === 'buildingOverview') {
            setSelectedTab(0);
        }
        handleChartClose();
    };

    const fetchEquipmentChart = async (equipId, equiName) => {
        setIsEquipDataFetched(true);
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=${
            selectedConsumption === 'rmsCurrentMilliAmps' && equipmentData?.device_type === 'active'
                ? 'mAh'
                : selectedConsumption
        }&divisible_by=1000${selectedConsumption === 'rmsCurrentMilliAmps' ? '&detailed=true' : ''}`;
        await fetchExploreEquipmentChart(payload, params)
            .then((res) => {
                let response = res.data;

                if (selectedConsumption === 'rmsCurrentMilliAmps') {
                    let exploreData = [];

                    let data = response.data;
                    for (let i = 0; i < data.length; i++) {
                        let NulledData = [];
                        data[i].data.map((ele) => {
                            if (ele.consumption === '') {
                                NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: null });
                            } else {
                                NulledData.push({
                                    x: new Date(ele.time_stamp).getTime(),
                                    y: ele.consumption,
                                });
                            }
                        });
                        let recordToInsert = {
                            name: `Sensor ${data[i].index_alias}`,
                            data: NulledData,
                        };

                        exploreData.push(recordToInsert);
                    }
                    setDeviceData(exploreData);
                    setSeriesData(exploreData);
                    setIsEquipDataFetched(false);
                } else {
                    let data = response.data.map((_data) => {
                        _data[1] = parseInt(_data[1]);
                        return _data;
                    });
                    let exploreData = [];
                    let NulledData = [];
                    data.map((ele) => {
                        if (ele?.consumption === '') {
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                        } else {
                            NulledData.push({
                                x: new Date(ele?.time_stamp).getTime(),
                                y: ele?.consumption,
                            });
                        }
                    });
                    let recordToInsert = {
                        name: equiName,
                        data: NulledData,
                    };
                    exploreData.push(recordToInsert);
                    setDeviceData(exploreData);
                    setIsEquipDataFetched(false);
                }
            })
            .catch((error) => {});
        setIsEquipDataFetched(false);
    };

    const redirectToConfigDevicePageLink = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return '';
        }

        if (deviceType === 'active-device') {
            return `/settings/active-devices/single/${equipDeviceId}`;
        }

        if (deviceType === 'passive-device') {
            return `/settings/smart-meters/single/${equipDeviceId}`;
        }
    };

    const redirectToConfigDevicePage = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return;
        }

        if (deviceType === 'active-device') {
            history.push({ pathname: `/settings/active-devices/single/${equipDeviceId}` });
        }

        if (deviceType === 'passive-device') {
            history.push({ pathname: `/settings/smart-meters/single/${equipDeviceId}` });
        }
    };

    const fetchEquipmentYTDUsageData = async (equipId) => {
        setIsYtdDataFetching(true);
        let params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=energy`;
        let payload = apiRequestBody(startDate, endDate, timeZone);
        await updateExploreEquipmentYTDUsage(payload, params)
            .then((res) => {
                let response = res.data.data;
                setYtdData(response[0]);
                setIsYtdDataFetching(false);
            })
            .catch((error) => {
                setIsYtdDataFetching(false);
            });
    };

    useEffect(() => {
        if (!equipmentFilter?.equipment_id) {
            return;
        }

        const fetchEquipmentDetails = async (equipId) => {
            let params = `/${equipId}`;
            await getEquipmentDetails(params)
                .then((res) => {
                    let response = res.data.data;
                    setLocation(response?.location_id);
                    setEquipType(response?.equipments_type_id);

                    setEquipBreakerLink(response?.breaker_link);
                    setDefaultEquipData(response);
                    setEquipmentData(response);
                })
                .catch((error) => {});
        };

        const fetchMetadata = async () => {
            await getMetadataRequest(bldgId)
                .then((res) => {
                    const { end_uses, equipment_type, location } = res?.data;

                    const endUseData = end_uses.map((el) => {
                        return {
                            label: el?.name,
                            value: el?.end_use_id,
                        };
                    });

                    const locationData = location.map((el) => {
                        return {
                            label: el?.location_name,
                            value: el?.location_id,
                        };
                    });

                    const equipTypeData = equipment_type.map((el) => {
                        return {
                            label: el?.equipment_type,
                            value: el?.equipment_id,
                        };
                    });

                    setEquipmentTypeData(equipTypeData);
                    setEndUse(endUseData);
                    setLocationData(locationData);
                })
                .finally(() => {});
        };
        fetchEquipmentChart(equipmentFilter?.equipment_id, equipmentFilter?.equipment_name);
        fetchEquipmentYTDUsageData(equipmentFilter?.equipment_id);
        fetchEquipmentDetails(equipmentFilter?.equipment_id);
        fetchMetadata();
    }, [equipmentFilter]);

    useEffect(() => {
        if (equipmentTypeData.length === 0 || Object.keys(equipmentData).length === 0) {
            return;
        }
        let res = equipmentTypeData.find(({ equipment_type }) => equipment_type === equipmentData?.equipments_type);
        setEquipResult(res);
    }, [equipmentTypeData, equipmentData]);

    useEffect(() => {
        if (equipmentData.length === 0) {
            return;
        }
        const fetchActiveDeviceSensorData = async () => {
            if (equipmentData !== null) {
                if (
                    equipmentData?.device_type === 'passive' ||
                    equipmentData?.device_id === '' ||
                    equipmentData?.device_id === undefined
                ) {
                    return;
                }
            }
            let params = `?device_id=${equipmentData.device_id}`;
            await updateListSensor(params)
                .then((res) => {
                    let response = res.data;
                    setSensors(response);
                })
                .catch((error) => {});
        };

        if (equipmentData !== null) {
            if (equipmentData?.device_type !== 'passive') {
                fetchActiveDeviceSensorData();
            }
        }
    }, [equipmentData]);

    useEffect(() => {
        if (!equipmentFilter?.equipment_id) {
            return;
        }
        if (startDate === null) {
            return;
        }

        if (endDate === null) {
            return;
        }
        if (closeFlag !== true) {
            fetchEquipmentChart(equipmentFilter?.equipment_id, equipmentFilter?.equipment_name);
            fetchEquipmentYTDUsageData(equipmentFilter?.equipment_id);
        } else {
            setCloseFlag(false);
        }
    }, [startDate, endDate, selectedConsumption]);

    useEffect(() => {
        if (equipmentTypeData) {
            addEquimentType();
        }
    }, [equipmentTypeData]);

    return (
        <div>
            <Modal
                show={showEquipmentChart}
                onHide={handleChartClose}
                dialogClassName="modal-container-style"
                centered
                backdrop="static"
                keyboard={false}>
                <>
                    <Modal.Body className="p-4">
                        {equipmentData?.device_type === 'active' ? (
                            <>
                                <Row>
                                    <Col lg={12}>
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            Type={Typography.Types.Light}
                                            className="text-muted">
                                            {equipmentData?.location}
                                        </Typography.Subheader>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>
                                        <div>
                                            <Typography.Header size={Typography.Sizes.md}>
                                                {equipmentData?.equipments_name}
                                            </Typography.Header>
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className="equip-button-wrapper">
                                            <div>
                                                {userPermission?.user_role === 'admin' ||
                                                userPermission?.permissions?.permissions?.account_buildings_permission
                                                    ?.edit ? (
                                                    <Button
                                                        label="Turn Off"
                                                        icon={
                                                            <FontAwesomeIcon
                                                                icon={faPowerOff}
                                                                size="lg"
                                                                style={{ color: 'red' }}
                                                            />
                                                        }
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.primaryDistructive}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>

                                            <div>
                                                <Button
                                                    label="Cancel"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryGrey}
                                                    className="mr-4 ml-4"
                                                    onClick={() => {
                                                        handleCloseWithoutSave();
                                                    }}
                                                />
                                            </div>
                                            {selectedTab === 1 ? (
                                                <div>
                                                    {userPermission?.user_role === 'admin' ||
                                                    userPermission?.permissions?.permissions
                                                        ?.account_buildings_permission?.edit ? (
                                                        <Button
                                                            label="Save"
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.primary}
                                                            onClick={() => {
                                                                handleSave();
                                                            }}
                                                            disabled={!isDataChanged}
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            ''
                        )}

                        {equipmentData?.device_type === 'passive' ? (
                            <>
                                <Row>
                                    <Col lg={12}>
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            Type={Typography.Types.Light}
                                            className="text-muted">
                                            {equipmentData?.location}
                                        </Typography.Subheader>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={9}>
                                        <div>
                                            <Typography.Header size={Typography.Sizes.md}>
                                                {equipmentData?.equipments_name}
                                            </Typography.Header>
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="equip-button-wrapper">
                                            <div>
                                                <Button
                                                    label="Cancel"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryGrey}
                                                    onClick={() => {
                                                        handleCloseWithoutSave();
                                                    }}
                                                />
                                            </div>
                                            {selectedTab === 1 ? (
                                                <div>
                                                    {userPermission?.user_role === 'admin' ||
                                                    userPermission?.permissions?.permissions
                                                        ?.account_buildings_permission?.edit ? (
                                                        <Button
                                                            label="Save"
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.primary}
                                                            className="ml-4"
                                                            onClick={() => {
                                                                handleSave();
                                                            }}
                                                            disabled={!isDataChanged}
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            ''
                        )}

                        {equipmentData?.device_type === '' ? (
                            <>
                                <Row>
                                    <Col lg={12}>
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            Type={Typography.Types.Light}
                                            className="text-muted">
                                            {equipmentData?.location}
                                        </Typography.Subheader>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={9}>
                                        <div>
                                            <Typography.Header size={Typography.Sizes.md}>
                                                {equipmentData?.equipments_name}
                                            </Typography.Header>
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="equip-button-wrapper">
                                            <div>
                                                <Button
                                                    label="Cancel"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryGrey}
                                                    onClick={() => {
                                                        handleCloseWithoutSave();
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                {userPermission?.user_role === 'admin' ||
                                                userPermission?.permissions?.permissions?.account_buildings_permission
                                                    ?.edit ? (
                                                    <Button
                                                        label="Save"
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.primary}
                                                        className="ml-4"
                                                        onClick={() => {
                                                            handleSave();
                                                        }}
                                                        disabled={!isDataChanged}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            ''
                        )}

                        <Row className="mt-2 mouse-pointer">
                            <Col lg={1}>
                                <span>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        Type={Typography.Types.Light}
                                        className={
                                            selectedTab === 0 ? 'mr-3 ml-2 equip-tab-active' : 'mr-3 ml-2 equip-tab'
                                        }
                                        onClick={() => setSelectedTab(0)}>
                                        Metrics
                                    </Typography.Subheader>
                                </span>
                            </Col>
                            <Col lg={1}>
                                <span>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        Type={Typography.Types.Light}
                                        className={
                                            selectedTab === 1 ? 'mr-3 ml-2 equip-tab-active' : 'mr-3 ml-2 equip-tab'
                                        }
                                        onClick={() => setSelectedTab(1)}>
                                        Configure
                                    </Typography.Subheader>
                                </span>
                            </Col>
                            <Col lg={10}></Col>
                        </Row>

                        {selectedTab === 0 && (
                            <Row className="mt-4">
                                <Col lg={4}>
                                    <div className="ytd-container">
                                        <div>
                                            <div className="ytd-heading">
                                                {`Total Consumption (${moment(startDate).format('MMM D')} to ${moment(
                                                    endDate
                                                ).format('MMM D')})`}
                                            </div>
                                            {isYtdDataFetching ? (
                                                <Skeleton count={1} />
                                            ) : (
                                                <div className="ytd-flex">
                                                    <span className="mr-1 ytd-value">
                                                        {ytdData?.ytd?.ytd
                                                            ? formatConsumptionValue(ytdData?.ytd?.ytd / 1000, 0)
                                                            : 0}
                                                    </span>
                                                    <span className="ytd-unit">kWh</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="ytd-heading">
                                                {`Peak kW (${moment(startDate).format('MMM D')} to ${moment(
                                                    endDate
                                                ).format('MMM D')})`}
                                            </div>
                                            {isYtdDataFetching ? (
                                                <Skeleton count={1} />
                                            ) : (
                                                <div className="ytd-flex">
                                                    {equipmentData?.device_type === 'active' ? (
                                                        <span className="mr-1 ytd-value">
                                                            {ytdData?.ytd_peak?.power
                                                                ? formatConsumptionValue(
                                                                      ytdData?.ytd_peak?.power / 1000,
                                                                      1
                                                                  )
                                                                : 0}
                                                        </span>
                                                    ) : (
                                                        <span className="mr-1 ytd-value">
                                                            {ytdData?.ytd_peak?.power
                                                                ? formatConsumptionValue(
                                                                      ytdData?.ytd_peak?.power / 1000000,
                                                                      1
                                                                  )
                                                                : 0}
                                                        </span>
                                                    )}

                                                    {ytdData?.ytd_peak?.time_stamp ? (
                                                        <span className="ytd-unit">
                                                            {`kW @ ${moment
                                                                .utc(ytdData?.ytd_peak?.time_stamp)
                                                                .clone()
                                                                .tz(timeZone)
                                                                .format('MM/DD  H:mm')}`}
                                                        </span>
                                                    ) : (
                                                        <span className="ytd-unit">kW</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                <Col lg={8}>
                                    <div className="equip-model">
                                        <div className="pt-3">
                                            <Typography.Subheader
                                                size={Typography.Sizes.md}
                                                Type={Typography.Types.Light}
                                                className="ytd-heading">
                                                Device : &nbsp;
                                                <Link
                                                    style={{
                                                        pointerEvents:
                                                            equipmentData?.device_type === 'passive'
                                                                ? equipBreakerLink?.length === 0
                                                                    ? 'none'
                                                                    : ''
                                                                : equipmentData !== null
                                                                ? equipmentData.device_id === ''
                                                                    ? 'none'
                                                                    : ''
                                                                : 'none',
                                                    }}
                                                    target="_blank"
                                                    to={redirectToConfigDevicePageLink(
                                                        equipmentData?.device_id,
                                                        equipmentData?.device_type === 'passive'
                                                            ? 'passive-device'
                                                            : equipmentData?.device_type === 'active'
                                                            ? 'active-device'
                                                            : ''
                                                    )}>
                                                    <span
                                                        className="buttonhover"
                                                        style={{ fontWeight: 'normal', textDecoration: 'underline' }}>
                                                        {equipmentData?.device_mac}
                                                        &nbsp;
                                                        <FontAwesomeIcon
                                                            icon={faArrowUpRightFromSquare}
                                                            size="md"
                                                            style={{ color: 'base-black' }}
                                                        />
                                                    </span>
                                                </Link>
                                            </Typography.Subheader>
                                        </div>
                                        <div className="d-flex">
                                            <div className="mr-2">
                                                <Select
                                                    defaultValue={selectedConsumption}
                                                    options={metric}
                                                    onChange={(e) => {
                                                        if (e.value === 'passive-power') {
                                                            return;
                                                        }
                                                        setConsumption(e.value);
                                                        handleUnitChange(e.value);
                                                        handleConsumptionChange(e.value);
                                                    }}
                                                />
                                            </div>
                                            <Header type="modal" />
                                        </div>
                                    </div>

                                    {isEquipDataFetched ? (
                                        <></>
                                    ) : (
                                        <div>
                                            <LineChart
                                                title={''}
                                                subTitle={''}
                                                tooltipUnit={selectedUnit}
                                                tooltipLabel={selectedConsumptionLabel}
                                                data={deviceData}
                                                dateRange={fetchDateRange(startDate, endDate)}
                                            />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        )}

                        {selectedTab === 1 && (
                            <>
                                {equipmentData?.device_type === 'passive' && (
                                    <>
                                        <Brick sizeInRem={1} />

                                        <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                                            Equipment Details
                                        </Typography.Header>

                                        <Brick sizeInRem={1} />

                                        <Row>
                                            <Col xl={8}>
                                                <div className="d-flex justify-content-between">
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Name
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <InputTooltip
                                                            placeholder="Enter Equipment Name"
                                                            labelSize={Typography.Sizes.md}
                                                            value={equipmentData?.equipments_name}
                                                            onChange={(e) => {
                                                                handleChange('name', e.target.value);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="w-100 ml-2">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Type
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            placeholder="Select Role"
                                                            options={equipmentTypeData}
                                                            currentValue={equipmentTypeData.filter(
                                                                (option) => option.value === equipType
                                                            )}
                                                            onChange={(e) => {
                                                                handleEquipTypeChange(
                                                                    'equipment_type',
                                                                    e.target.value,
                                                                    'passive'
                                                                );
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>

                                                    <div className="w-100 ml-2">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            End Use Category
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            placeholder="Select Role"
                                                            options={endUse}
                                                            currentValue={endUse.filter(
                                                                (option) => option.value === equipmentData?.end_use_id
                                                            )}
                                                            onChange={(e) => {
                                                                handleChange('end_use', e.target.value);
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div>
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Equipment Location
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select Location"
                                                        options={locationData}
                                                        currentValue={locationData.filter(
                                                            (option) => option.value === location
                                                        )}
                                                        onChange={(e) => {
                                                            handleChange('space_id', e.value);
                                                        }}
                                                        isSearchable={true}
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        Location this equipment is installed in.
                                                    </Typography.Body>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Tags</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <TagsInput
                                                        value={equipmentData !== null ? equipmentData?.tags : ''}
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
                                                        name="tag"
                                                        placeHolder="+ Add Tag"
                                                    />
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Notes</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Textarea
                                                        type="textarea"
                                                        rows="4"
                                                        placeholder="Enter a Note..."
                                                        value={equipmentData?.note}
                                                        onChange={(e) => {
                                                            console.log('SSR e => ', e.target.value);
                                                            handleChange('note', e.target.value);
                                                        }}
                                                        inputClassName="pt-2"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xl={4}>
                                                <div className="modal-right-container">
                                                    <div className="equip-panel-info pt-0">
                                                        {equipBreakerLink?.length === 0 ? (
                                                            <div className="equip-breaker-style">
                                                                <img
                                                                    src={DoubleBreakerUninked}
                                                                    alt="DoubleBreakerUninked"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {equipBreakerLink?.length === 1 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style-single">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style-single">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-single-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {equipBreakerLink?.length === 2 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[1]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[0]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-double-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {equipBreakerLink?.length === 3 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[1]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[2]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[0]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[2]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-triple-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                        <Brick sizeInRem={1} />

                                                        <div className="d-flex justify-content-between">
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.lg}
                                                                Type={Typography.Types.Light}
                                                                className="modal-right-card-title">
                                                                Energy Monitoring
                                                            </Typography.Subheader>
                                                            <Button
                                                                label="View"
                                                                size={Button.Sizes.md}
                                                                type={Button.Type.secondaryGrey}
                                                                onClick={() => {
                                                                    redirectToConfigDevicePage(
                                                                        equipmentData?.device_id,
                                                                        'passive-device'
                                                                    );
                                                                }}
                                                                disabled={equipBreakerLink?.length === 0 ? true : false}
                                                            />
                                                        </div>
                                                        <div className="equip-breaker-container">
                                                            <div className="equip-breaker-detail">
                                                                <div className="phase-style">
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.sm}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-header mb-1">
                                                                        Phases
                                                                    </Typography.Subheader>
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.md}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-value float-left">
                                                                        {equipBreakerLink[0]?.breaker_type}
                                                                    </Typography.Subheader>
                                                                </div>
                                                                <div className="installed-style">
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.sm}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-header mb-1">
                                                                        Installed at
                                                                    </Typography.Subheader>
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.md}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-value box float-left">
                                                                        {equipBreakerLink?.length === 1 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                        > Breaker ${equipBreakerLink[0]?.breaker_number}`}
                                                                        {equipBreakerLink?.length === 2 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                        > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}`}
                                                                        {equipBreakerLink?.length === 3 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                        > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}, ${equipBreakerLink[2]?.breaker_number}`}
                                                                    </Typography.Subheader>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {equipmentData?.device_type === '' && (
                                    <>
                                        <Brick sizeInRem={1} />

                                        <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                                            Equipment Details
                                        </Typography.Header>

                                        <Brick sizeInRem={1} />

                                        <Row>
                                            <Col xl={8}>
                                                <div className="d-flex justify-content-between">
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Name
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <InputTooltip
                                                            placeholder="Enter Equipment Name"
                                                            labelSize={Typography.Sizes.md}
                                                            value={equipmentData?.equipments_name}
                                                            onChange={(e) => {
                                                                handleChange('name', e.target.value);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="w-100 ml-2">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Type
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            placeholder="Select Role"
                                                            options={equipmentTypeData}
                                                            currentValue={equipmentTypeData.filter(
                                                                (option) => option.value === equipType
                                                            )}
                                                            onChange={(e) => {
                                                                handleEquipTypeChange(
                                                                    'equipment_type',
                                                                    e.target.value,
                                                                    'passive'
                                                                );
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>

                                                    <div className="w-100 ml-2">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            End Use Category
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            placeholder="Select Role"
                                                            options={endUse}
                                                            currentValue={endUse.filter(
                                                                (option) => option.value === equipmentData?.end_use_id
                                                            )}
                                                            onChange={(e) => {
                                                                handleChange('end_use', e.target.value);
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div>
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Equipment Location
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select Location"
                                                        options={locationData}
                                                        currentValue={locationData.filter(
                                                            (option) => option.value === location
                                                        )}
                                                        onChange={(e) => {
                                                            handleChange('space_id', e.value);
                                                        }}
                                                        isSearchable={true}
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        Location this equipment is installed in.
                                                    </Typography.Body>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Tags</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <TagsInput
                                                        value={equipmentData !== null ? equipmentData?.tags : ''}
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
                                                        name="tag"
                                                        placeHolder="+ Add Tag"
                                                    />
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Notes</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Textarea
                                                        type="textarea"
                                                        rows="4"
                                                        placeholder="Enter a Note..."
                                                        value={equipmentData?.note}
                                                        onChange={(e) => {
                                                            console.log('SSR e => ', e.target.value);
                                                            handleChange('note', e.target.value);
                                                        }}
                                                        inputClassName="pt-2"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xl={4}>
                                                <div className="modal-right-container">
                                                    <div className="equip-panel-info pt-0">
                                                        {equipBreakerLink?.length === 0 ? (
                                                            <div className="equip-breaker-style">
                                                                <img
                                                                    src={DoubleBreakerUninked}
                                                                    alt="DoubleBreakerUninked"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {equipBreakerLink?.length === 1 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style-single">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style-single">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-single-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {equipBreakerLink?.length === 2 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[1]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[0]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-double-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {equipBreakerLink?.length === 3 && (
                                                                    <div className="breaker-container-style">
                                                                        <div className="breaker-number-style">
                                                                            <div>
                                                                                {equipBreakerLink[0]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[1]?.breaker_number}
                                                                            </div>
                                                                            <div>
                                                                                {equipBreakerLink[2]?.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[0]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[1]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                            <div
                                                                                className={
                                                                                    equipBreakerLink[2]?.sensor_id ===
                                                                                    ''
                                                                                        ? 'breaker-offline-style'
                                                                                        : 'breaker-online-style'
                                                                                }></div>
                                                                        </div>
                                                                        <div className="breaker-voltage-style">
                                                                            <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                            <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                        </div>
                                                                        <div className="breaker-number-style">
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket1-style"></div>
                                                                            <div className="breaker-socket-triple-style"></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                        <Brick sizeInRem={1} />

                                                        <div className="d-flex justify-content-between">
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.lg}
                                                                Type={Typography.Types.Light}
                                                                className="modal-right-card-title">
                                                                Energy Monitoring
                                                            </Typography.Subheader>
                                                            <Button
                                                                label="View"
                                                                size={Button.Sizes.md}
                                                                type={Button.Type.secondaryGrey}
                                                                onClick={() => {
                                                                    redirectToConfigDevicePage(
                                                                        equipmentData?.device_id,
                                                                        'passive-device'
                                                                    );
                                                                }}
                                                                disabled={equipBreakerLink?.length === 0 ? true : false}
                                                            />
                                                        </div>
                                                        <div className="equip-breaker-container">
                                                            <div className="equip-breaker-detail">
                                                                <div className="phase-style">
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.sm}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-header mb-1">
                                                                        Phases
                                                                    </Typography.Subheader>
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.md}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-value float-left">
                                                                        {equipBreakerLink[0]?.breaker_type}
                                                                    </Typography.Subheader>
                                                                </div>
                                                                <div className="installed-style">
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.sm}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-header mb-1">
                                                                        Installed at
                                                                    </Typography.Subheader>
                                                                    <Typography.Subheader
                                                                        size={Typography.Sizes.md}
                                                                        Type={Typography.Types.Light}
                                                                        className="equip-breaker-value box float-left">
                                                                        {equipBreakerLink?.length === 1 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                     > Breaker ${equipBreakerLink[0]?.breaker_number}`}
                                                                        {equipBreakerLink?.length === 2 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                     > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}`}
                                                                        {equipBreakerLink?.length === 3 &&
                                                                            `${equipBreakerLink[0]?.panel_name} 
                                                                     > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}, ${equipBreakerLink[2]?.breaker_number}`}
                                                                    </Typography.Subheader>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {equipmentData?.device_type === 'active' && (
                                    <>
                                        <Brick sizeInRem={1} />

                                        <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                                            Equipment Details
                                        </Typography.Header>

                                        <Brick sizeInRem={1} />

                                        <Row>
                                            <Col xl={8}>
                                                <div className="d-flex justify-content-between">
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Name
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <InputTooltip
                                                            placeholder="Enter Equipment Name"
                                                            labelSize={Typography.Sizes.md}
                                                            value={equipmentData?.equipments_name}
                                                            onChange={(e) => {
                                                                handleChange('name', e.target.value);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="w-100 ml-2">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Type
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            placeholder="Select Role"
                                                            options={equipmentTypeData}
                                                            currentValue={equipmentTypeData.filter(
                                                                (option) => option.value === equipType
                                                            )}
                                                            onChange={(e) => {
                                                                handleEquipTypeChange(
                                                                    'equipment_type',
                                                                    e.target.value,
                                                                    'active'
                                                                );
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div>
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Equipment Location
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select Location"
                                                        options={locationData}
                                                        currentValue={locationData.filter(
                                                            (option) => option.value === equipmentData.location
                                                        )}
                                                        onChange={(e) => {
                                                            handleChange('space_id', e.value);
                                                        }}
                                                        isSearchable={true}
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        Location this equipment is installed in.
                                                    </Typography.Body>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div>
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Applied Rule
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select Location"
                                                        options={rulesAlert}
                                                        currentValue={rulesAlert.filter(
                                                            (option) => option.value === 'desktop-pc'
                                                        )}
                                                        isSearchable={true}
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        The rule applied to this equipment to control when it is on.
                                                    </Typography.Body>
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Tags</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <TagsInput
                                                        value={equipmentData !== null ? equipmentData?.tags : ''}
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
                                                        name="tag"
                                                        placeHolder="+ Add Tag"
                                                    />
                                                </div>

                                                <Brick sizeInRem={1} />

                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>Notes</Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Textarea
                                                        type="textarea"
                                                        rows="4"
                                                        placeholder="Enter a Note..."
                                                        value={equipmentData?.note}
                                                        onChange={(e) => {
                                                            handleChange('note', e.target.value);
                                                        }}
                                                        inputClassName="pt-2"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xl={4}>
                                                <div className="modal-right-container">
                                                    <div className="equip-socket-container">
                                                        <div className="mt-2 sockets-slots-container">
                                                            {sensors.map((record, index) => {
                                                                return (
                                                                    <>
                                                                        {record.status && (
                                                                            <div>
                                                                                <div className="power-off-style-equip">
                                                                                    <FontAwesomeIcon
                                                                                        icon={faPowerOff}
                                                                                        size="lg"
                                                                                        color="#3C6DF5"
                                                                                    />
                                                                                </div>
                                                                                {record.equipment_type_id === '' ? (
                                                                                    <div className="socket-rect">
                                                                                        <img
                                                                                            src={SocketLogo}
                                                                                            alt="Socket"
                                                                                        />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="online-socket-container-equip">
                                                                                        <img
                                                                                            src={UnionLogo}
                                                                                            alt="Union"
                                                                                            className="union-icon-style"
                                                                                            width="35vw"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {!record.status && (
                                                                            <div>
                                                                                <div className="power-off-style-equip">
                                                                                    <FontAwesomeIcon
                                                                                        icon={faPowerOff}
                                                                                        size="lg"
                                                                                        color="#EAECF0"
                                                                                    />
                                                                                </div>
                                                                                {record.equipment_type_id === '' ? (
                                                                                    <div className="socket-rect">
                                                                                        <img
                                                                                            src={SocketLogo}
                                                                                            alt="Socket"
                                                                                        />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="online-socket-container-equip">
                                                                                        <img
                                                                                            src={UnionLogo}
                                                                                            alt="Union"
                                                                                            className="union-icon-style"
                                                                                            width="35vw"
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="modal-right-card mt-2">
                                                        <Typography.Subheader
                                                            size={Typography.Sizes.lg}
                                                            Type={Typography.Types.Light}
                                                            className="modal-right-card-title">
                                                            Power Strip - Socket 2
                                                        </Typography.Subheader>

                                                        <Button
                                                            label="View Devices"
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.secondaryGrey}
                                                            onClick={() => {
                                                                redirectToConfigDevicePage(
                                                                    equipmentData?.device_id,
                                                                    'active-device'
                                                                );
                                                            }}
                                                            disabled={
                                                                equipmentData !== null
                                                                    ? equipmentData.device_id === ''
                                                                        ? true
                                                                        : false
                                                                    : true
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        {equipmentData !== null
                                                            ? equipmentData.status === 'Online' && (
                                                                  <div className="icon-bg-pop-styling">
                                                                      ONLINE{' '}
                                                                      <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                                  </div>
                                                              )
                                                            : ''}
                                                        {equipmentData !== null
                                                            ? equipmentData.status === 'Offline' && (
                                                                  <div className="icon-bg-pop-styling-slash">
                                                                      OFFLINE{' '}
                                                                      <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                                  </div>
                                                              )
                                                            : ''}
                                                    </div>
                                                    <div className="mt-4 modal-right-group">
                                                        <FormGroup>
                                                            <div className="single-line-style">
                                                                <Typography.Subheader
                                                                    size={Typography.Sizes.sm}
                                                                    Type={Typography.Types.Light}
                                                                    className="card-title">
                                                                    MAC Address
                                                                </Typography.Subheader>
                                                                <Typography.Subheader
                                                                    size={Typography.Sizes.md}
                                                                    Type={Typography.Types.Light}
                                                                    className="card-subtitle mb-2 text-muted">
                                                                    {equipmentData !== null
                                                                        ? equipmentData.device_mac
                                                                        : ''}
                                                                </Typography.Subheader>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <div className="single-line-style">
                                                                <Typography.Subheader
                                                                    size={Typography.Sizes.sm}
                                                                    Type={Typography.Types.Light}
                                                                    className="card-title">
                                                                    Device type
                                                                </Typography.Subheader>
                                                                <Typography.Subheader
                                                                    size={Typography.Sizes.md}
                                                                    Type={Typography.Types.Light}
                                                                    className="card-subtitle mb-2 text-muted">
                                                                    {equipmentData !== null
                                                                        ? equipmentData?.device_type
                                                                        : ''}
                                                                </Typography.Subheader>
                                                            </div>
                                                        </FormGroup>
                                                    </div>
                                                    <FormGroup>
                                                        <div className="single-line-style">
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.sm}
                                                                Type={Typography.Types.Light}
                                                                className="card-title">
                                                                Installed at
                                                            </Typography.Subheader>
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                Type={Typography.Types.Light}
                                                                className="card-subtitle mb-2 text-muted">
                                                                {equipmentData !== null ? equipmentData.location : ''}
                                                            </Typography.Subheader>
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </>
                        )}
                    </Modal.Body>
                </>
            </Modal>
        </div>
    );
};

export default EquipChartModal;
