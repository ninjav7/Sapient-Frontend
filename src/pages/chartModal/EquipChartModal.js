import React, { useEffect, useState } from 'react';
import { Row, Col, FormGroup } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ReactComponent as ArrowUpRightFromSquare } from '../../assets/icon/arrowUpRightFromSquare.svg';
import { fetchExploreEquipmentChart } from '../explore/services';
import {
    updateListSensor,
    updateEquipmentDetails,
    getEquipmentDetails,
    updateExploreEquipmentYTDUsage,
    getMetadataRequest,
} from './services';
import { useHistory, Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import moment from 'moment';
import 'moment-timezone';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from '../../components/Header';
import { formatConsumptionValue } from '../../helpers/explorehelpers';
import Button from '../../sharedComponents/button/Button';
import './style.css';
import '../../sharedComponents/typography/style.scss';
import { apiRequestBody, compareObjData } from '../../helpers/helpers';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { fetchDateRange } from '../../helpers/formattedChartData';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import { ReactComponent as AttachedSVG } from '../../assets/icon/active-devices/attached.svg';
import { ReactComponent as SocketSVG } from '../../assets/icon/active-devices/socket.svg';
import './styles.scss';
import '../settings/passive-devices/styles.scss';
import { UserStore } from '../../store/UserStore';

const EquipChartModal = ({
    showEquipmentChart,
    handleChartClose,
    fetchEquipmentData,
    equipmentFilter,
    selectedTab,
    setSelectedTab,
    activePage,
}) => {
    const [userPermission] = useAtom(userPermissionData);

    const history = useHistory();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

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
    const [isYtdDataFetching, setIsYtdDataFetching] = useState(false);
    const [ytdData, setYtdData] = useState({});
    const [sensors, setSensors] = useState([]);
    const [isModified, setModification] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [equipData, setEquipData] = useState({});
    const [originalEquipData, setOriginalEquipData] = useState({});
    const [equipBreakerLink, setEquipBreakerLink] = useState([]);
    const [closeFlag, setCloseFlag] = useState(false);

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };
    const handleConsumptionChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedConsumptionLabel(obj.Consumption);
    };

    const handleDataChange = (key, value) => {
        let obj = Object.assign({}, equipData);
        obj[key] = value;
        setEquipData(obj);
    };

    const handleEquipmentUpdate = async () => {
        setProcessing(true);
        let obj = {};

        if (originalEquipData?.equipments_name !== equipData?.equipments_name) obj.name = equipData?.equipments_name;

        if (originalEquipData?.location_id !== equipData?.location_id) obj.space_id = equipData?.location_id;

        if (originalEquipData?.equipments_type_id !== equipData?.equipments_type_id) {
            obj.equipment_type = equipData?.equipments_type_id;
            obj.end_use = equipData?.end_use_id;
        }

        if (originalEquipData?.end_use_id !== equipData?.end_use_id) obj.end_use = equipData?.end_use_id;

        if (originalEquipData?.note !== equipData?.note) obj.note = equipData?.note;

        if (!compareObjData(originalEquipData?.tags, equipData?.tags)) obj.tag = equipData?.tags;

        const params = `?equipment_id=${equipData?.equipments_id}`;
        await updateEquipmentDetails(params, obj)
            .then((res) => {
                const response = res?.data;
                if (activePage === 'explore') setSelectedTab(0);
                if (activePage === 'equipment') setSelectedTab(1);
                if (activePage === 'buildingOverview') setSelectedTab(0);
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Equipment updated Successfully!';
                        s.notificationType = 'success';
                    });
                    const arr = apiRequestBody(startDate, endDate, timeZone);
                    setEquipData({});
                    setOriginalEquipData({});
                    setModification(false);
                    setProcessing(false);
                    handleChartClose();
                    fetchEquipmentData(arr);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? 'Unable to update Equipment.'
                            : res
                            ? 'Unable to update Equipment.'
                            : 'Unable to update Equipment due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                    setProcessing(false);
                }
            })
            .catch((error) => {
                setProcessing(false);
            });
    };

    const handleCloseWithoutSave = () => {
        setOriginalEquipData({});
        setEquipData({});
        setCloseFlag(true);
        setModification(false);
        setSelectedUnit(metric[0].unit);
        setConsumption(metric[0].value);
        setDeviceData([]);
        setSelectedConsumptionLabel(metric[0].Consumption);
        setOriginalEquipData({});
        if (activePage === 'explore') {
            setSelectedTab(0);
        }
        if (activePage === 'equipment') {
            setSelectedTab(1);
        }
        if (activePage === 'buildingOverview') {
            setSelectedTab(0);
        }
        setProcessing(false);
        handleChartClose();
    };

    const fetchEquipmentChart = async (equipId, equiName) => {
        setIsEquipDataFetched(true);
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=${
            selectedConsumption === 'rmsCurrentMilliAmps' && equipData?.device_type === 'active'
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
            return `/settings/active-devices/single/${bldgId}/${equipDeviceId}`;
        }

        if (deviceType === 'passive-device') {
            return `/settings/smart-meters/single/${bldgId}/${equipDeviceId}`;
        }
    };

    const redirectToConfigDevicePage = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return;
        }

        if (deviceType === 'active-device') {
            history.push({ pathname: `/settings/active-devices/single/${bldgId}/${equipDeviceId}` });
        }

        if (deviceType === 'passive-device') {
            history.push({ pathname: `/settings/smart-meters/single/${bldgId}/${equipDeviceId}` });
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

    const fetchEquipmentDetails = async (equipId) => {
        const params = `/${equipId}`;
        await getEquipmentDetails(params)
            .then((res) => {
                const response = res?.data?.data;

                if (response) {
                    setOriginalEquipData(response);
                    setEquipData(response);
                    setEquipBreakerLink(response?.breaker_link);
                }
            })
            .catch((error) => {});
    };

    useEffect(() => {
        if (!equipmentFilter?.equipment_id) return;

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
        if (equipData.length === 0) {
            return;
        }
        const fetchActiveDeviceSensorData = async () => {
            if (equipData !== null) {
                if (
                    equipData?.device_type === 'passive' ||
                    equipData?.device_id === '' ||
                    equipData?.device_id === undefined
                ) {
                    return;
                }
            }
            let params = `?device_id=${equipData.device_id}`;
            await updateListSensor(params)
                .then((res) => {
                    let response = res.data;
                    setSensors(response);
                })
                .catch((error) => {});
        };

        if (equipData !== null) {
            if (equipData?.device_type !== 'passive') {
                fetchActiveDeviceSensorData();
            }
        }
    }, [equipData]);

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
        if (equipData) setModification(compareObjData(equipData, originalEquipData));
    }, [equipData]);

    return (
        <div>
            <Modal
                show={showEquipmentChart}
                onHide={handleChartClose}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}>
                <div>
                    <Row>
                        <Col lg={12}>
                            <div
                                className="passive-header-wrapper d-flex justify-content-between"
                                style={{ background: 'none' }}>
                                <div className="d-flex flex-column justify-content-between">
                                    <Typography.Subheader size={Typography.Sizes.sm}>
                                        {originalEquipData?.location}
                                    </Typography.Subheader>
                                    <Typography.Header size={Typography.Sizes.md}>
                                        {originalEquipData?.equipments_name}
                                    </Typography.Header>
                                    <div className="d-flex justify-content-start mouse-pointer ">
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            className={`typography-wrapper mr-4 ${
                                                selectedTab === 0 ? 'active-tab-style' : ''
                                            }`}
                                            onClick={() => setSelectedTab(0)}>
                                            Metrics
                                        </Typography.Subheader>
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            className={`typography-wrapper ${
                                                selectedTab === 1 ? 'active-tab-style' : ''
                                            }`}
                                            onClick={() => setSelectedTab(1)}>
                                            Configure
                                        </Typography.Subheader>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    {equipData?.device_type === 'active' && (
                                        <div>
                                            <Button
                                                label="Turn Off"
                                                size={Button.Sizes.md}
                                                type={Button.Type.primaryDistructive}
                                                className="mr-4"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Button
                                            label="Cancel"
                                            size={Button.Sizes.md}
                                            type={Button.Type.secondaryGrey}
                                            onClick={handleCloseWithoutSave}
                                        />
                                    </div>

                                    {selectedTab === 1 && (
                                        <div>
                                            <Button
                                                label={isProcessing ? 'Saving' : 'Save'}
                                                size={Button.Sizes.md}
                                                type={Button.Type.primary}
                                                onClick={handleEquipmentUpdate}
                                                disabled={
                                                    isModified ||
                                                    isProcessing ||
                                                    !(
                                                        userPermission?.user_role === 'admin' ||
                                                        userPermission?.permissions?.permissions
                                                            ?.account_buildings_permission?.edit
                                                    )
                                                }
                                                className="ml-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="p-4 pt=0">
                        {selectedTab === 0 && (
                            <Row>
                                <Col xl={4}>
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
                                                    <span className="mr-1 ytd-value">
                                                        {ytdData?.ytd_peak?.power
                                                            ? formatConsumptionValue(
                                                                  ytdData?.ytd_peak?.power / 1000000,
                                                                  2
                                                              )
                                                            : 0}
                                                    </span>

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

                                <Col xl={8}>
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
                                                            equipData?.device_type === 'passive'
                                                                ? equipBreakerLink?.length === 0
                                                                    ? 'none'
                                                                    : ''
                                                                : equipData !== null
                                                                ? equipData.device_id === ''
                                                                    ? 'none'
                                                                    : ''
                                                                : 'none',
                                                    }}
                                                    target="_blank"
                                                    to={redirectToConfigDevicePageLink(
                                                        equipData?.device_id,
                                                        equipData?.device_type === 'passive'
                                                            ? 'passive-device'
                                                            : equipData?.device_type === 'active'
                                                            ? 'active-device'
                                                            : ''
                                                    )}>
                                                    <span
                                                        className="buttonhover"
                                                        style={{ fontWeight: 'normal', textDecoration: 'underline' }}>
                                                        {equipData?.device_mac}
                                                        &nbsp;
                                                        <ArrowUpRightFromSquare style={{ color: 'base-black' }} />
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
                            <div>
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
                                                    value={equipData?.equipments_name}
                                                    onChange={(e) => {
                                                        handleDataChange('equipments_name', e.target.value);
                                                    }}
                                                    disabled={
                                                        !(
                                                            userPermission?.user_role === 'admin' ||
                                                            userPermission?.permissions?.permissions
                                                                ?.account_buildings_permission?.edit
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="w-100 ml-2">
                                                <Typography.Body size={Typography.Sizes.md}>
                                                    Equipment Type
                                                </Typography.Body>
                                                <Brick sizeInRem={0.25} />
                                                <Select
                                                    placeholder="Select Equipment Type"
                                                    options={equipmentTypeData}
                                                    currentValue={equipmentTypeData.filter(
                                                        (option) => option.value === equipData?.equipments_type_id
                                                    )}
                                                    onChange={(e) => {
                                                        handleDataChange('equipments_type_id', e.value);
                                                    }}
                                                    isSearchable={true}
                                                    disabled={
                                                        !(
                                                            userPermission?.user_role === 'admin' ||
                                                            userPermission?.permissions?.permissions
                                                                ?.account_buildings_permission?.edit
                                                        )
                                                    }
                                                />
                                            </div>

                                            {equipData?.device_type !== 'active' && (
                                                <div className="w-100 ml-2">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        End Use Category
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select Role"
                                                        options={endUse}
                                                        currentValue={endUse.filter(
                                                            (option) => option.value === equipData?.end_use_id
                                                        )}
                                                        onChange={(e) => {
                                                            handleDataChange('end_use_id', e.value);
                                                        }}
                                                        isSearchable={true}
                                                        disabled={
                                                            !(
                                                                userPermission?.user_role === 'admin' ||
                                                                userPermission?.permissions?.permissions
                                                                    ?.account_buildings_permission?.edit
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
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
                                                    (option) => option.value === equipData?.location_id
                                                )}
                                                onChange={(e) => {
                                                    handleDataChange('location_id', e.value);
                                                }}
                                                isSearchable={true}
                                                disabled={
                                                    !(
                                                        userPermission?.user_role === 'admin' ||
                                                        userPermission?.permissions?.permissions
                                                            ?.account_buildings_permission?.edit
                                                    )
                                                }
                                            />

                                            <Brick sizeInRem={0.25} />
                                            <Typography.Body size={Typography.Sizes.sm}>
                                                Location this equipment is installed in.
                                            </Typography.Body>
                                        </div>

                                        <Brick sizeInRem={1} />

                                        {equipData?.deviceType === 'active' && (
                                            <>
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
                                                        isSearchable={false}
                                                        disabled={
                                                            !(
                                                                userPermission?.user_role === 'admin' ||
                                                                userPermission?.permissions?.permissions
                                                                    ?.account_buildings_permission?.edit
                                                            )
                                                        }
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        The rule applied to this equipment to control when it is on.
                                                    </Typography.Body>
                                                </div>
                                                <Brick sizeInRem={1} />
                                            </>
                                        )}

                                        <div className="w-100">
                                            <Typography.Body size={Typography.Sizes.md}>Tags</Typography.Body>
                                            <Brick sizeInRem={0.25} />
                                            <TagsInput
                                                value={equipData?.tags ? equipData?.tags : []}
                                                onChange={(value) => {
                                                    handleDataChange('tags', value);
                                                }}
                                                name="tag"
                                                placeHolder="+ Add Tag"
                                                disabled={
                                                    !(
                                                        userPermission?.user_role === 'admin' ||
                                                        userPermission?.permissions?.permissions
                                                            ?.account_buildings_permission?.edit
                                                    )
                                                }
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
                                                value={equipData?.note}
                                                onChange={(e) => {
                                                    handleDataChange('note', e.target.value);
                                                }}
                                                inputClassName="pt-2"
                                                disabled={
                                                    !(
                                                        userPermission?.user_role === 'admin' ||
                                                        userPermission?.permissions?.permissions
                                                            ?.account_buildings_permission?.edit
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>

                                    <Col xl={4}>
                                        {(equipData?.device_type === 'passive' || equipData?.device_type === '') && (
                                            <div className="modal-right-container">
                                                <div>
                                                    {equipBreakerLink?.length === 0 ? (
                                                        <div
                                                            className={`breaker-container-style${
                                                                equipData?.device_type === '' ? '-disabled' : ''
                                                            }`}>
                                                            <div className="breaker-number-style">
                                                                <div></div>
                                                            </div>
                                                            <div className="breaker-number-style-single">
                                                                <div className="breaker-offline-style"></div>
                                                            </div>
                                                            <div className="breaker-voltage-style">
                                                                <div></div>
                                                                <div></div>
                                                            </div>
                                                            <div className="breaker-number-style">
                                                                <div className="breaker-socket1-style-disbaled"></div>
                                                                <div className="breaker-socket-single-style-disabled"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {equipBreakerLink?.length === 1 && (
                                                                <div
                                                                    className={`breaker-container-style${
                                                                        equipData?.device_type === '' ? '-disabled' : ''
                                                                    }`}>
                                                                    <div className="breaker-number-style-single">
                                                                        <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                    </div>
                                                                    <div className="breaker-number-style-single">
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[0]?.sensor_id === ''
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
                                                                        <div className="breaker-socket-single-style-disabled"></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {equipBreakerLink?.length === 2 && (
                                                                <div
                                                                    className={`breaker-container-style${
                                                                        equipData?.device_type === '' ? '-disabled' : ''
                                                                    }`}>
                                                                    <div className="breaker-number-style">
                                                                        <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                        <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                    </div>
                                                                    <div className="breaker-number-style">
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[0]?.sensor_id === ''
                                                                                    ? 'breaker-offline-style'
                                                                                    : 'breaker-online-style'
                                                                            }></div>
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[1]?.sensor_id === ''
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
                                                                        <div className="breaker-socket-double-style-disabled"></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {equipBreakerLink?.length === 3 && (
                                                                <div
                                                                    className={`breaker-container-style${
                                                                        equipData?.device_type === '' ? '-disabled' : ''
                                                                    }`}>
                                                                    <div className="breaker-number-style">
                                                                        <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                        <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                        <div>{equipBreakerLink[2]?.breaker_number}</div>
                                                                    </div>
                                                                    <div className="breaker-number-style">
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[0]?.sensor_id === ''
                                                                                    ? 'breaker-offline-style'
                                                                                    : 'breaker-online-style'
                                                                            }></div>
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[1]?.sensor_id === ''
                                                                                    ? 'breaker-offline-style'
                                                                                    : 'breaker-online-style'
                                                                            }></div>
                                                                        <div
                                                                            className={
                                                                                equipBreakerLink[2]?.sensor_id === ''
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
                                                                        <div
                                                                            className={`breaker-socket-triple-style${
                                                                                equipData?.device_type === ''
                                                                                    ? '-disabled'
                                                                                    : ''
                                                                            }`}></div>
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
                                                                    equipData?.device_id,
                                                                    'passive-device'
                                                                );
                                                            }}
                                                            disabled={
                                                                equipData?.device_type === '' ||
                                                                equipBreakerLink?.length === 0
                                                            }
                                                        />
                                                    </div>

                                                    {equipBreakerLink?.length === 0 ? (
                                                        <></>
                                                    ) : (
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
                                                                        className="equip-breaker-value justify-content-between box float-left">
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
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {equipData?.device_type === 'active' && (
                                            <div className="modal-right-container">
                                                <div className="equip-type-socket">
                                                    <div
                                                        className={`socket-container-style p-2 d-flex ${
                                                            sensors.length === 1
                                                                ? 'justify-content-center'
                                                                : 'justify-content-between'
                                                        }`}>
                                                        {sensors.map((record, index) => {
                                                            return (
                                                                <div className="d-flex align-items-center">
                                                                    {record?.name.toLowerCase() === 'unlabeled' ? (
                                                                        <div>
                                                                            <SocketSVG />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="attached-device-socket">
                                                                            <AttachedSVG className="m-2" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <Brick sizeInRem={1.5} />

                                                <div className="modal-right-card">
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
                                                                equipData?.device_id,
                                                                'active-device'
                                                            );
                                                        }}
                                                        className="m-0"
                                                        disabled={
                                                            equipData !== null
                                                                ? equipData?.device_id === ''
                                                                    ? true
                                                                    : false
                                                                : true
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    {equipData !== null
                                                        ? equipData.status === 'Online' && (
                                                              <div className="icon-bg-pop-styling">
                                                                  ONLINE
                                                                  <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                              </div>
                                                          )
                                                        : ''}
                                                    {equipData !== null
                                                        ? equipData.status === 'Offline' && (
                                                              <div className="icon-bg-pop-styling-slash">
                                                                  OFFLINE
                                                                  <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                              </div>
                                                          )
                                                        : ''}
                                                </div>

                                                <Brick sizeInRem={1.5} />

                                                <div className="d-flex justify-content-start">
                                                    <div className="single-line-style mr-4">
                                                        <Typography.Subheader
                                                            size={Typography.Sizes.sm}
                                                            Type={Typography.Types.Light}
                                                            className="card-title">
                                                            Device ID
                                                        </Typography.Subheader>
                                                        <Typography.Subheader
                                                            size={Typography.Sizes.md}
                                                            Type={Typography.Types.Light}
                                                            className="card-subtitle mb-2 text-muted">
                                                            {equipData?.device_mac}
                                                        </Typography.Subheader>
                                                    </div>
                                                    <div className="single-line-style">
                                                        <Typography.Subheader
                                                            size={Typography.Sizes.sm}
                                                            Type={Typography.Types.Light}
                                                            className="card-title">
                                                            Device Type
                                                        </Typography.Subheader>
                                                        <Typography.Subheader
                                                            size={Typography.Sizes.md}
                                                            Type={Typography.Types.Light}
                                                            className="card-subtitle mb-2 text-muted">
                                                            {equipData?.device_type}
                                                        </Typography.Subheader>
                                                    </div>
                                                </div>

                                                {equipData?.location && (
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
                                                                {equipData?.location}
                                                            </Typography.Subheader>
                                                        </div>
                                                    </FormGroup>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EquipChartModal;
