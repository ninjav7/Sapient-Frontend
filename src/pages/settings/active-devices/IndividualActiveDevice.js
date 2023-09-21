import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { DateRangeStore } from '../../../store/DateRangeStore';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DeviceChartModel from '../../../pages/chartModal/DeviceChartModel';
import { apiRequestBody } from '../../../helpers/helpers';
import { useAtom } from 'jotai';
import { buildingData, userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import { getLocationData } from '../passive-devices/services';
import Select from '../../../sharedComponents/form/select';
import { ReactComponent as SearchSVG } from '../../../assets/icon/search.svg';
import { ReactComponent as ChartSVG } from '../../../assets/icon/chart.svg';
import { ReactComponent as AttachedSVG } from '../../../assets/icon/active-devices/attached.svg';
import { ReactComponent as SocketSVG } from '../../../assets/icon/active-devices/socket.svg';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import { Badge } from '../../../sharedComponents/badge';
import {
    getActiveDeviceSensors,
    getSensorData,
    getSensorEquipmentLinked,
    getSingleActiveDevice,
    updateActiveDeviceService,
} from './services';
import UpdateSocket from './UpdateSocket';
import './style.css';
import './styles.scss';
import '../passive-devices/styles.scss';
import { UserStore } from '../../../store/UserStore';
import '../../../sharedComponents/breaker/Breaker.scss';
import colorPalette from '../../../assets/scss/_colors.scss';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

const IndividualActiveDevice = () => {
    const history = useHistory();
    const [userPermission] = useAtom(userPermissionData);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);

    // Equipment states
    const [showSocketModal, setSocketModalState] = useState(false);
    const closeSocketModal = () => setSocketModalState(false);
    const openSocketModal = () => setSocketModalState(true);

    const { deviceId } = useParams();
    const [sensorId, setSensorId] = useState('');

    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const [locationData, setLocationData] = useState([]);
    const [locationError, setLocationError] = useState(null);
    const [isLocationFetched, setIsLocationFetched] = useState(true);
    const [activeData, setActiveData] = useState({});
    const [activeLocationId, setActiveLocationId] = useState('');
    const [sensors, setSensors] = useState([]);
    const [isFetchingSensorData, setIsFetchingSensorData] = useState(true);
    const [isSensorChartLoading, setIsSensorChartLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sensorData, setSensorData] = useState({});
    const [selectedSensor, setSelectedSensor] = useState('');
    const [selectedEquipType, setSelectedEquipType] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchSocket, setSearchSocket] = useState('');
    const [equipTypeError, setEquipTypeError] = useState(null);

    const handleSocketChange = (e) => {
        setSearchSocket(e.target.value);
    };

    const filtered = !searchSocket
        ? sensors
        : sensors.filter((sensor) => {
              return (
                  sensor.equipment_type_name.toLowerCase().includes(searchSocket.toLowerCase()) ||
                  sensor.equipment.toLowerCase().includes(searchSocket.toLowerCase())
              );
          });

    const [seriesData, setSeriesData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);

    const CONVERSION_ALLOWED_UNITS = ['power'];

    const UNIT_DIVIDER = 1000;

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy Consumed (Wh)', unit: 'Wh', Consumption: 'Energy Consumption' },
        {
            value: 'totalconsumedenergy',
            label: 'Total Consumed Energy (Wh)',
            unit: 'Wh',
            Consumption: 'Total Consumed Energy',
        },
        { value: 'mV', label: 'Voltage (mV)', unit: 'mV', Consumption: 'Voltage' },
        { value: 'mAh', label: 'Current (mA)', unit: 'mA', Consumption: 'Current' },
        { value: 'power', label: 'Real Power (W)', unit: 'W', Consumption: 'Real Power' },
    ]);

    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);

    const getRequiredConsumptionLabel = (value) => {
        let label = '';

        metric.map((m) => {
            if (m.value === value) {
                label = m.label;
            }

            return m;
        });

        return label;
    };

    const handleChartShow = (id) => {
        setSensorId(id);
        let obj = sensors.find((o) => o.id === id);
        setSensorData(obj);
        fetchSensorChartData(id);
        setShowChart(true);
    };

    const fetchLocationData = async () => {
        setIsLocationFetched(true);
        await getLocationData(`/${bldgId}`)
            .then((res) => {
                let response = res?.data;
                response.sort((a, b) => {
                    return a.location_name.localeCompare(b.location_name);
                });
                let locationList = [];
                response.forEach((el) => {
                    let obj = {
                        label: el?.location_name,
                        value: el?.location_id,
                    };
                    locationList.push(obj);
                });
                setLocationData(locationList);
                setIsLocationFetched(false);
            })
            .catch(() => {
                setIsLocationFetched(false);
            });
    };

    const fetchActiveDevice = async () => {
        let params = `?device_id=${deviceId}&page_size=100&page_no=1&building_id=${bldgId}`;
        await getSingleActiveDevice(params)
            .then((res) => {
                let response = res.data.data[0];
                setActiveData(response);
                setActiveLocationId(response?.location_id);
                localStorage.setItem('identifier', response?.identifier);
            })
            .catch(() => {});
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Smart Plugs',
                    path: `/settings/smart-plugs/${bldgId}`,
                    active: false,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    const fetchActiveSensorsList = async () => {
        setIsFetchingSensorData(true);
        setSensors([]);
        let params = `?device_id=${deviceId}`;
        await getActiveDeviceSensors(params)
            .then((res) => {
                let response = res?.data;
                setSensors(response);
                setIsFetchingSensorData(false);
            })
            .catch(() => {
                setIsFetchingSensorData(false);
            });
    };

    const fetchSensorChartData = async (id) => {
        setIsSensorChartLoading(true);
        const params = `?sensor_id=${id === sensorId ? sensorId : id}&consumption=energy&building_id=${bldgId}`;
        await getSensorData(params, apiRequestBody(startDate, endDate, timeZone))
            .then((res) => {
                setDeviceData([]);
                setSeriesData([]);
                let response = res.data;

                let data = response;

                let exploreData = [];

                let NulledData = [];
                data.map((ele) => {
                    if (ele?.consumption === '') {
                        NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                    } else {
                        if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                            NulledData.push({
                                x: new Date(ele.time_stamp).getTime(),
                                y: ele.consumption / UNIT_DIVIDER,
                            });
                        } else {
                            NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: ele.consumption });
                        }
                    }
                });
                let recordToInsert = {
                    data: NulledData,
                    name: getRequiredConsumptionLabel(selectedConsumption),
                };
                setDeviceData([recordToInsert]);
                setIsSensorChartLoading(false);
            })
            .catch(() => {
                setIsSensorChartLoading(false);
            });
    };

    const linkSensorToEquipment = async (sensorId, currEquipId, newEquipID) => {
        if (currEquipId === newEquipID) {
            setEquipTypeError({
                text: 'Please update Equipment Type.',
            });
            return;
        }
        setIsUpdating(true);
        const params = `?sensor_id=${sensorId}&equipment_type_id=${newEquipID}`;

        await getSensorEquipmentLinked(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message ? response?.message : 'Unable to Save.';
                        s.notificationType = 'error';
                    });
                }
                setIsUpdating(false);
                closeSocketModal();
                setEquipTypeError(null);
                fetchActiveSensorsList();
            })
            .catch(() => {
                setIsUpdating(false);
            });
    };

    const redirectToActivePage = () => {
        history.push({ pathname: `/settings/smart-plugs/${bldgId}` });
    };

    const updateActiveDevice = async () => {
        if (activeLocationId === activeData?.location_id) {
            setLocationError({
                text: 'Please update Location.',
            });
            return;
        }

        if (!activeData?.equipments_id) return;
        setIsProcessing(true);
        const params = `?device_id=${activeData?.equipments_id}`;
        const payload = { location_id: activeLocationId };
        await updateActiveDeviceService(params, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to update Smart Plug.'
                            : 'Unable to update Smart Plug due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                setIsProcessing(false);
                setLocationError(null);
                fetchActiveDevice();
            })
            .catch(() => {
                setIsProcessing(false);
                setLocationError(null);
            });
    };

    useEffect(() => {
        fetchActiveDevice();
        fetchActiveSensorsList();
        fetchLocationData();
    }, [deviceId]);

    useEffect(() => {
        if (!showChart) setConsumption('energy');
    }, [showChart]);

    useEffect(() => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Smart Plugs',
                    path: `/settings/smart-plugs/${bldgId}`,
                    active: false,
                },
                {
                    label: activeData?.identifier,
                    path: '/settings/smart-plugs/single',
                    active: true,
                },
            ];
            bs.items = newList;
        });
    }, [activeData]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="passive-header-wrapper d-flex justify-content-between">
                        <div className="d-flex flex-column">
                            <Typography.Subheader size={Typography.Sizes.sm} className="font-weight-bold">
                                {`Smart Plug`}
                            </Typography.Subheader>
                            <div className="d-flex">
                                <Typography.Header size={Typography.Sizes.md} className="mr-2">
                                    {activeData?.model === 'KP115' && 'Smart Mini Plug'}
                                    {activeData?.model === 'HS300' && 'Power Strip'}
                                </Typography.Header>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className="d-flex align-items-center mt-1">
                                    {activeData?.identifier}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={redirectToActivePage}
                                />
                            </div>
                            <div>
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
                                    <Button
                                        label={isProcessing ? 'Saving' : 'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        onClick={updateActiveDevice}
                                        className="ml-2"
                                        disabled={isProcessing || activeLocationId === activeData?.location_id}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="passive-container">
                <Col lg={4}>
                    <Typography.Subheader size={Typography.Sizes.md}>Device Details</Typography.Subheader>

                    <Brick sizeInRem={1.5} />

                    <div>
                        <Typography.Subheader size={Typography.Sizes.sm}>Installed Location</Typography.Subheader>
                        <Brick sizeInRem={0.25} />
                        {isLocationFetched || isProcessing ? (
                            <Skeleton
                                baseColor={colorPalette.primaryGray150}
                                highlightColor={colorPalette.baseBackground}
                                count={1}
                                height={35}
                            />
                        ) : (
                            <Select
                                placeholder="Select Location"
                                options={locationData}
                                currentValue={locationData.filter((option) => option.value === activeLocationId)}
                                onChange={(e) => {
                                    setActiveLocationId(e.value);
                                    setLocationError(null);
                                }}
                                isSearchable={true}
                                disabled={
                                    !(
                                        userPermission?.user_role === 'admin' ||
                                        userPermission?.permissions?.permissions?.advanced_passive_device_permission
                                            ?.edit
                                    )
                                }
                                error={locationError}
                            />
                        )}
                        <Brick sizeInRem={0.25} />
                        {!locationError && (
                            <Typography.Body size={Typography.Sizes.sm}>
                                Location this device is installed.
                            </Typography.Body>
                        )}
                    </div>

                    <Brick sizeInRem={1.5} />

                    <div className="device-container">
                        <div>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Identifier</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {activeData?.identifier}
                                </Typography.Subheader>
                            </div>
                            <Brick sizeInRem={1} />
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Firmware Version</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>v1.2</Typography.Subheader>
                            </div>
                        </div>

                        <div>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Device Model</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {activeData?.model}
                                </Typography.Subheader>
                            </div>
                            <Brick sizeInRem={1} />
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Device Version</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>v2</Typography.Subheader>
                            </div>
                        </div>
                    </div>

                    <Brick sizeInRem={1.5} />

                    <div
                        className={`socket-container-style d-flex ${
                            sensors.length === 1 ? 'justify-content-center' : 'justify-content-between'
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
                </Col>

                <Col lg={8}>
                    <Typography.Subheader
                        size={Typography.Sizes.md}>{`Sockets (${sensors.length})`}</Typography.Subheader>
                    <Brick sizeInRem={0.5} />
                    <div className="active-sensor-header">
                        <div className="search-container mr-2">
                            <SearchSVG className="mb-1" />
                            <input
                                className="search-box ml-2"
                                type="search"
                                name="search"
                                placeholder="Search"
                                value={searchSocket}
                                onChange={handleSocketChange}
                            />
                        </div>
                    </div>

                    <Brick sizeInRem={0.25} />

                    {isFetchingSensorData ? (
                        <div>
                            <Skeleton
                                baseColor={colorPalette.primaryGray150}
                                highlightColor={colorPalette.baseBackground}
                                count={8}
                                height={40}
                            />
                        </div>
                    ) : (
                        <>
                            {filtered.map((record, index) => {
                                return (
                                    <>
                                        <Brick sizeInRem={0.75} />
                                        <div
                                            className={`d-flex justify-content-between align-items-center sensor-container ${
                                                (record?.equipment_id === '' && record?.breaker_id === '') ||
                                                record?.name.toLowerCase() === 'unlabeled'
                                                    ? 'sensor-unattach'
                                                    : ''
                                            }`}>
                                            <div className="d-flex align-items-center mouse-pointer">
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className="sensor-index mr-4">
                                                    {index + 1}
                                                </Typography.Subheader>
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className={`mr-2 ${
                                                        (record?.equipment_type_name === '' &&
                                                            record?.equipment === '') ||
                                                        record?.name.toLowerCase() === 'unlabeled'
                                                            ? 'sensor-index'
                                                            : ''
                                                    }`}>
                                                    {record?.equipment_type_name}
                                                </Typography.Subheader>
                                                {record?.equipment_id && (
                                                    <Badge text={record?.equipment} className="sensor-badge-style" />
                                                )}
                                            </div>
                                            <div className="d-flex">
                                                <Button
                                                    className="breaker-action-btn"
                                                    onClick={() => handleChartShow(record?.id)}
                                                    type={Button.Type.secondaryGrey}
                                                    label=""
                                                    icon={<ChartSVG width={16} />}
                                                />

                                                <Button
                                                    className="breaker-action-btn ml-2"
                                                    onClick={() => {
                                                        setSelectedEquipType(record?.equipment_type_id);
                                                        setSelectedSensor(record?.id);
                                                        openSocketModal();
                                                    }}
                                                    type={Button.Type.secondaryGrey}
                                                    label=""
                                                    icon={<PenSVG width={15} />}
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </>
                    )}
                </Col>
            </Row>

            <DeviceChartModel
                showChart={showChart}
                handleChartClose={handleChartClose}
                sensorData={sensorData}
                seriesData={seriesData}
                setSeriesData={setSeriesData}
                deviceData={deviceData}
                setDeviceData={setDeviceData}
                CONVERSION_ALLOWED_UNITS={CONVERSION_ALLOWED_UNITS}
                UNIT_DIVIDER={UNIT_DIVIDER}
                metric={metric}
                setMetric={setMetric}
                selectedConsumption={selectedConsumption}
                setConsumption={setConsumption}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedConsumptionLabel={selectedConsumptionLabel}
                setSelectedConsumptionLabel={setSelectedConsumptionLabel}
                getRequiredConsumptionLabel={getRequiredConsumptionLabel}
                isSensorChartLoading={isSensorChartLoading}
                setIsSensorChartLoading={setIsSensorChartLoading}
                timeZone={timeZone}
                daysCount={daysCount}
                deviceType="active"
            />

            <UpdateSocket
                bldgId={bldgId}
                showSocketModal={showSocketModal}
                closeSocketModal={closeSocketModal}
                selectedEquipType={selectedEquipType}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
                linkSensorToEquipment={linkSensorToEquipment}
                isUpdating={isUpdating}
                equipTypeError={equipTypeError}
                setEquipTypeError={setEquipTypeError}
            />
        </React.Fragment>
    );
};

export default IndividualActiveDevice;
