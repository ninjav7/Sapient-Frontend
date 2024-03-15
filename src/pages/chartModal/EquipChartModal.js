import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import moment from 'moment';
import 'moment-timezone';
import { useHistory, Link } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Row, Col, FormGroup, Spinner, Modal, UncontrolledTooltip } from 'reactstrap';

import Header from '../../components/Header';
import Button from '../../sharedComponents/button/Button';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import Textarea from '../../sharedComponents/form/textarea/Textarea';

import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { userPermissionData } from '../../store/globalState';

import {
    handleAPIRequestBody,
    compareObjData,
    dateTimeFormatForHighChart,
    formatXaxisForHighCharts,
    handleAPIRequestParams,
} from '../../helpers/helpers';
import { metricsWithMultipleSensors, rulesAlert } from './constants';
import { handleDataConversion, renderEquipChartMetrics } from './helper';
import { formatConsumptionValue } from '../../helpers/explorehelpers';
import { defaultDropdownSearch } from '../../sharedComponents/form/select/helpers';

import { ReactComponent as AttachedSVG } from '../../assets/icon/active-devices/attached.svg';
import { ReactComponent as SocketSVG } from '../../assets/icon/active-devices/socket.svg';
import { ReactComponent as DangerAlertSVG } from '../../assets/icon/alert-danger.svg';
import { ReactComponent as TooltipIcon } from '../../sharedComponents/assets/icons/tooltip.svg';
import { ReactComponent as ArrowUpRightFromSquare } from '../../assets/icon/arrowUpRightFromSquare.svg';

import {
    updateListSensor,
    updateEquipmentDetails,
    getEquipmentDetails,
    getMetadataRequest,
    fetchEquipmentKPIs,
    updateExploreEquipmentYTDUsage,
} from './services';
import { fetchEquipmentChartDataV2, fetchExploreEquipmentChart } from '../explore/services';

import './style.css';
import '../../sharedComponents/typography/style.scss';
import colorPalette from '../../assets/scss/_colors.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '../settings/passive-devices/styles.scss';
import './styles.scss';

const MachineHealthContainer = (props) => {
    const { equipMetaData = {}, isFetching = false, equipDataObj = {} } = props;

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;

    const isMultipleSensorAttachedToEquipment =
        equipDataObj?.device_type === 'passive' && equipDataObj?.breaker_link && equipDataObj?.breaker_link?.length > 1;

    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md}>Machine Health</Typography.Subheader>
            <Brick sizeInRem={0.5} />
            <div className="d-flex flex-column w-auto h-auto metadata-container">
                {isFetching ? (
                    <SkeletonTheme
                        baseColor={colorPalette.primaryGray150}
                        highlightColor={colorPalette.baseBackground}
                        borderRadius={10}
                        height={15}>
                        <Skeleton count={10} className="mb-2" />
                    </SkeletonTheme>
                ) : (
                    <div>
                        <Typography.Subheader size={Typography.Sizes.lg}>
                            {`Current Period (${moment(startDate).format(dateFormat)} to ${moment(endDate).format(
                                dateFormat
                            )})`}
                        </Typography.Subheader>

                        <Brick sizeInRem={0.25} />

                        <div style={{ gap: '0.5rem' }}>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Running Minutes:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.running_minutes
                                        ? formatConsumptionValue(Math.round(equipMetaData?.running_minutes))
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Total Minutes:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.total_minutes
                                        ? formatConsumptionValue(Math.round(equipMetaData?.total_minutes))
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Percent Runtime:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.percent_runtime
                                        ? `${formatConsumptionValue(equipMetaData?.percent_runtime, 2)} %`
                                        : '-'}
                                </Typography.Subheader>
                            </div>
                        </div>

                        <Brick sizeInRem={0.75} />

                        <div style={{ gap: '0.5rem' }}>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Starts:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.starts
                                        ? formatConsumptionValue(Math.round(equipMetaData?.starts))
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Stops:</Typography.Subheader>
                                {equipMetaData?.stops ? formatConsumptionValue(Math.round(equipMetaData?.stops)) : '-'}
                                <Typography.Subheader size={Typography.Sizes.lg}></Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    Average Runtime/Start:
                                </Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.average_runtime_start
                                        ? `${formatConsumptionValue(Math.round(equipMetaData?.average_runtime_start))}`
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Last Start Time:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {equipMetaData?.last_start_time
                                        ? `${moment
                                              .utc(equipMetaData?.last_start_time)
                                              .clone()
                                              .format(
                                                  `${userPrefDateFormat === `DD-MM-YYYY` ? `DD/MM` : `MM/DD`} ${
                                                      userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`
                                                  }`
                                              )}`
                                        : '-'}
                                </Typography.Subheader>
                            </div>
                        </div>

                        {isMultipleSensorAttachedToEquipment && (
                            <>
                                <Brick sizeInRem={0.75} />

                                <div style={{ gap: '0.5rem' }}>
                                    <div>
                                        <Typography.Subheader size={Typography.Sizes.lg}>
                                            Phase Imbalance
                                        </Typography.Subheader>
                                    </div>

                                    <Brick sizeInRem={0.25} />

                                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                                        <Typography.Subheader size={Typography.Sizes.md}>
                                            Average Imbalance Percent:
                                        </Typography.Subheader>
                                        <div className="d-flex" style={{ gap: '0.5rem' }}>
                                            <Typography.Subheader size={Typography.Sizes.lg}>
                                                {equipMetaData?.average_imbalance_percent
                                                    ? `${formatConsumptionValue(
                                                          equipMetaData?.average_imbalance_percent,
                                                          2
                                                      )} %`
                                                    : '-'}
                                            </Typography.Subheader>
                                            {equipMetaData?.average_imbalance_percent > 10 && (
                                                <>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target={'tooltip-imbalance-percent'}>
                                                        {`Phase Imbanace occurs when average percentage of an equipment are unequal. Phase Imbalance above 10% can damange 3-phase motors`}
                                                    </UncontrolledTooltip>
                                                    <DangerAlertSVG
                                                        width={16}
                                                        height={16}
                                                        className="mouse-pointer"
                                                        id={'tooltip-imbalance-percent'}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                                        <Typography.Subheader size={Typography.Sizes.md}>
                                            Average Imbalance Current:
                                        </Typography.Subheader>
                                        <div className="d-flex" style={{ gap: '0.5rem' }}>
                                            <Typography.Subheader size={Typography.Sizes.lg}>
                                                {equipMetaData?.average_imbalance_current
                                                    ? `${formatConsumptionValue(
                                                          equipMetaData?.average_imbalance_current / 1000,
                                                          2
                                                      )} A`
                                                    : '-'}
                                            </Typography.Subheader>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

const EnergyMetaDataContainer = (props) => {
    const { equipMetaData = {}, isFetching = false } = props;

    const { total_energy_consumption, peak_power = {} } = equipMetaData;

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;
    const totalConsumptionValue = total_energy_consumption
        ? formatConsumptionValue(total_energy_consumption / 1000, 0)
        : 0;
    const powerConsumptionValue = peak_power?.avgPower ? formatConsumptionValue(peak_power?.avgPower / 1000000, 2) : 0;

    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md}>Energy</Typography.Subheader>
            <Brick sizeInRem={0.5} />
            <div className="d-flex flex-column w-auto h-auto metadata-container">
                <div>
                    <Typography.Subheader size={Typography.Sizes.lg}>
                        {`Total Consumption (${moment(startDate).format(dateFormat)} to ${moment(endDate).format(
                            dateFormat
                        )})`}
                    </Typography.Subheader>

                    {isFetching ? (
                        <Skeleton count={1} />
                    ) : (
                        <div className="d-flex align-items-baseline" style={{ gap: '0.25rem' }}>
                            <span className="ytd-value">{totalConsumptionValue}</span>
                            <span className="ytd-unit">kWh</span>
                        </div>
                    )}
                </div>
                <div>
                    <Typography.Subheader size={Typography.Sizes.lg}>
                        {`Peak kW (${moment(startDate).format(dateFormat)} to ${moment(endDate).format(dateFormat)})`}
                    </Typography.Subheader>

                    {isFetching ? (
                        <Skeleton count={1} />
                    ) : (
                        <div className="d-flex align-items-baseline" style={{ gap: '0.25rem' }}>
                            <span className="ytd-value">{powerConsumptionValue}</span>

                            {peak_power?.timestamp ? (
                                <span className="ytd-unit">
                                    {`kW @ ${moment
                                        .utc(peak_power?.timestamp)
                                        .clone()
                                        .format(
                                            `${userPrefDateFormat === `DD-MM-YYYY` ? `DD/MM` : `MM/DD`} ${
                                                userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`
                                            }`
                                        )}`}
                                </span>
                            ) : (
                                <span className="ytd-unit">kW</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const EquipChartModal = ({
    showEquipmentChart,
    handleChartClose,
    fetchEquipmentData,
    selectedEquipObj,
    selectedTab,
    setSelectedTab,
    activePage,
}) => {
    const history = useHistory();

    const [userPermission] = useAtom(userPermissionData);
    const isUserAdmin = userPermission?.is_admin ?? false;
    const isSuperUser = userPermission?.is_superuser ?? false;
    const isSuperAdmin = isUserAdmin || isSuperUser;
    const canUserEdit = userPermission?.permissions?.permissions?.building_equipment_permission?.edit ?? false;

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [equipData, setEquipData] = useState({});
    const [originalEquipData, setOriginalEquipData] = useState({});
    const [isEquipDataFetched, setIsEquipDataFetched] = useState(false);

    const metric = renderEquipChartMetrics(originalEquipData);
    const isEquipmentConfigModified = compareObjData(equipData, originalEquipData);

    const [selectedUnit, setSelectedUnit] = useState(metric[0]?.unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0]?.Consumption);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [endUse, setEndUse] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);

    const [equipMetaData, setEquipMetaData] = useState({});
    const [isFetchingMetaData, setFetchingMetaData] = useState(false);

    const [sensors, setSensors] = useState([]);
    const [isProcessing, setProcessing] = useState(false);
    const [selectedConsumption, setConsumption] = useState(metric[0]?.value);
    const [equipBreakerLink, setEquipBreakerLink] = useState([]);

    const handleUnitChange = (value) => {
        const obj = metric.find((record) => record?.value === value);
        setSelectedUnit(obj?.unit);
    };
    const handleConsumptionChange = (value) => {
        const obj = metric.find((record) => record?.value === value);
        setSelectedConsumptionLabel(obj?.Consumption);
    };

    const handleDataChange = (key, value) => {
        let obj = Object.assign({}, equipData);
        obj[key] = value;
        setEquipData(obj);
    };

    const CustomToolTip = ({ id, message = '' }) => {
        return (
            <div>
                <UncontrolledTooltip placement="top" target={`tooltip-for-${id}`}>
                    {message}
                </UncontrolledTooltip>

                <button type="button" className="tooltip-button" id={`tooltip-for-${id}`}>
                    <TooltipIcon className="tooltip-icon" />
                </button>
            </div>
        );
    };

    // Update Equipment
    const handleEquipmentUpdate = async () => {
        setProcessing(true);
        let obj = {};

        if (originalEquipData?.equipments_name !== equipData?.equipments_name) obj.name = equipData?.equipments_name;
        if (originalEquipData?.manufacturer !== equipData?.manufacturer) obj.manufacturer = equipData?.manufacturer;
        if (originalEquipData?.model !== equipData?.model) obj.model = equipData?.model;
        if (originalEquipData?.serial !== equipData?.serial) obj.serial = equipData?.serial;

        if (originalEquipData?.location_id !== equipData?.location_id) obj.space_id = equipData?.location_id;
        if (originalEquipData?.location_served !== equipData?.location_served)
            obj.location_served = equipData?.location_served;

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
                        s.notificationMessage = 'Equipment updated successfully!';
                        s.notificationType = 'success';
                    });
                    const arr = handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime);
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
                }
            })
            .catch((error) => {})
            .finally(() => {
                setProcessing(false);
                handleChartClose();
                setEquipData({});
                setOriginalEquipData({});
            });
    };

    // Close Equipment Modal
    const handleCloseWithoutSave = () => {
        setOriginalEquipData({});
        setEquipData({});
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

    // Fetch Equipment Chart V1 API
    const fetchEquipmentChartV1 = async (equipId, equiName) => {
        setIsEquipDataFetched(true);
        setDeviceData([]);

        const payload = handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime);

        const params = `?building_id=${bldgId}&consumption=${selectedConsumption}&equipment_id=${equipId}&divisible_by=1000`;

        await fetchExploreEquipmentChart(payload, params)
            .then((res) => {
                const response = res?.data;

                if (response?.success) {
                    const { data } = response;

                    if (!data || data.length === 0) return;

                    const newEquipMappedData = data.map((el) => ({
                        x: new Date(el?.time_stamp).getTime(),
                        y: el?.consumption === '' ? null : el?.consumption,
                    }));

                    const recordToInsert = {
                        name: equiName,
                        data: newEquipMappedData,
                    };

                    setDeviceData([recordToInsert]);
                }
            })
            .catch((error) => {})
            .finally(() => {
                setIsEquipDataFetched(false);
            });
    };

    // Fetch Equipment Chart V2 API
    const fetchEquipmentChartV2 = async (equipId, equiName) => {
        if (!equipId || !bldgId || !startDate || !endDate || !selectedConsumption) {
            return;
        }

        setIsEquipDataFetched(true);
        setDeviceData([]);
        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const payload = {
            date_from: encodeURIComponent(dateFrom),
            date_to: encodeURIComponent(dateTo),
            tz_info: encodeURIComponent(timeZone),
        };

        const params = `/${equipId}?building_id=${bldgId}&metric=${selectedConsumption}&date_from=${payload?.date_from}&date_to=${payload?.date_to}&tz_info=${payload?.tz_info}`;

        await fetchEquipmentChartDataV2(params)
            .then((res) => {
                const response = res?.data;

                if (response?.success) {
                    const { data } = response;

                    if (!data || data.length === 0) {
                        return;
                    }

                    const isMultipleSensorData = metricsWithMultipleSensors.includes(selectedConsumption);

                    if (isMultipleSensorData) {
                        const aggregatedSensorData = [];

                        data.forEach((sensorObj) => {
                            const mappedSensorData = sensorObj?.data.map((el) => ({
                                x: new Date(el?.time_stamp).getTime(),
                                y: handleDataConversion(el?.consumption, selectedConsumption),
                            }));

                            aggregatedSensorData.push({
                                name: `Sensor ${sensorObj?.index_alias}`,
                                data: mappedSensorData,
                            });
                        });

                        setDeviceData(aggregatedSensorData);
                    } else {
                        const mappedEquipmentData = data.map((el) => ({
                            x: new Date(el?.time_stamp).getTime(),
                            y: handleDataConversion(el?.consumption, selectedConsumption),
                        }));

                        const equipmentRecord = {
                            name: equiName,
                            data: mappedEquipmentData,
                        };

                        setDeviceData([equipmentRecord]);
                    }
                }
            })
            .catch((error) => {})
            .finally(() => {
                setIsEquipDataFetched(false);
            });
    };

    const redirectToConfigDevicePageLink = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return '';
        }

        if (deviceType === 'smart-plugs') {
            return `/settings/smart-plugs/single/${bldgId}/${equipDeviceId}`;
        }

        if (deviceType === 'smart-meters') {
            return `/settings/smart-meters/single/${bldgId}/${equipDeviceId}`;
        }
    };

    const redirectToConfigDevicePage = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return;
        }

        if (deviceType === 'smart-plugs') {
            history.push({ pathname: `/settings/smart-plugs/single/${bldgId}/${equipDeviceId}` });
        }

        if (deviceType === 'smart-meters') {
            history.push({ pathname: `/settings/smart-meters/single/${bldgId}/${equipDeviceId}` });
        }
    };

    const fetchActiveDeviceSensorData = async (device_id) => {
        if (!device_id) return;

        const params = `?device_id=${device_id}`;

        await updateListSensor(params)
            .then((res) => {
                const response = res?.data;
                if (response) setSensors(response);
            })
            .catch((error) => {});
    };

    const fetchEquipmentDetails = async (equip_id) => {
        if (!equip_id) return;

        const params = `/${equip_id}`;

        await getEquipmentDetails(params)
            .then((res) => {
                const { success: isSuccessful, data } = res?.data;
                if (isSuccessful && data && data?.equipments_id) {
                    setOriginalEquipData(data);
                    setEquipData(data);
                    setEquipBreakerLink(data?.breaker_link);

                    if (data?.device_type === 'active' && data?.device_id) {
                        fetchActiveDeviceSensorData(data?.device_id);
                    }
                }
            })
            .catch((error) => {});
    };

    const fetchEquipmentKPIDataV1 = async (equipId) => {
        if (!equipId) return;

        setFetchingMetaData(true);
        setEquipMetaData({});

        const params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=energy`;
        const payload = handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime);

        await updateExploreEquipmentYTDUsage(payload, params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data && response?.data.length !== 0) {
                        const data = response?.data[0];
                        setEquipMetaData({
                            total_energy_consumption: data?.ytd?.ytd,
                            peak_power: {
                                avgPower: data?.ytd_peak?.power,
                                timestamp: data?.ytd_peak?.time_stamp,
                            },
                        });
                    }
                }
            })
            .catch((err) => {})
            .finally(() => {
                setFetchingMetaData(false);
            });
    };

    const fetchEquipmentKPIDataV2 = async (equip_id) => {
        if (!equip_id) return;

        setFetchingMetaData(true);
        setEquipMetaData({});
        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const params = `?building_id=${bldgId}&date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(
            dateTo
        )}&tz_info=${encodeURIComponent(timeZone)}`;

        await fetchEquipmentKPIs(params, equip_id)
            .then((res) => {
                const { success: isSuccessful, data } = res?.data;
                if (isSuccessful && data) {
                    setEquipMetaData(data);
                }
            })
            .catch((err) => {})
            .finally(() => {
                setFetchingMetaData(false);
            });
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

                const locationDataLocal = location.map((el) => {
                    return {
                        label: el?.location_name,
                        value: el?.location_id,
                    };
                });

                const equipTypeData = equipment_type.map((el) => {
                    return {
                        label: el?.equipment_type,
                        value: el?.equipment_id,
                        end_use_name: el?.end_use_name,
                    };
                });
                const sortedLocationData = locationDataLocal.slice().sort((a, b) => a.label.localeCompare(b.label));

                setEquipmentTypeData(equipTypeData);
                setEndUse(endUseData);
                setLocationData(sortedLocationData);
            })
            .finally(() => {});
    };

    useEffect(() => {
        if (!selectedEquipObj?.equipment_id || !showEquipmentChart) return;

        fetchEquipmentDetails(selectedEquipObj?.equipment_id);
    }, [selectedEquipObj]);

    useEffect(() => {
        if (!selectedEquipObj?.equipment_id || !showEquipmentChart) return;
        if (!selectedConsumption || !bldgId || !startDate || !endDate) return;

        const { equipment_id, equipment_name } = selectedEquipObj;

        fetchMetadata();

        if (selectedEquipObj?.device_type === 'active') {
            fetchEquipmentChartV1(equipment_id, equipment_name);
            fetchEquipmentKPIDataV1(equipment_id);
        } else {
            fetchEquipmentChartV2(equipment_id, equipment_name);
            fetchEquipmentKPIDataV2(equipment_id);
        }
    }, [selectedEquipObj, startDate, endDate, startTime, endTime, selectedConsumption, bldgId]);

    return (
        <div>
            <Modal isOpen={showEquipmentChart} className="modal-fullscreen">
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
                                <div className="d-flex align-items-center">
                                    {/* Commented below code as part of Ticket PLT-1373: Hide "Turn Off" button on equipment modal */}
                                    {/* {equipData?.device_type === 'active' && (
                                        <div>
                                            <Button
                                                label="Turn Off"
                                                size={Button.Sizes.md}
                                                type={Button.Type.primaryDistructive}
                                                className="mr-4"
                                            />
                                        </div>
                                    )} */}

                                    <div>
                                        <Button
                                            label={selectedTab === 1 ? 'Cancel' : 'Close'}
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
                                                    isProcessing ||
                                                    isEquipmentConfigModified ||
                                                    !(isSuperAdmin || canUserEdit)
                                                }
                                                className="ml-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ padding: '2rem' }}>
                        {selectedTab === 0 && (
                            <Row>
                                <Col xl={3}>
                                    <EnergyMetaDataContainer
                                        equipMetaData={equipMetaData}
                                        isFetching={isFetchingMetaData}
                                    />

                                    <Brick sizeInRem={2} />

                                    {originalEquipData?.device_type && originalEquipData?.device_type !== 'active' && (
                                        <MachineHealthContainer
                                            equipMetaData={equipMetaData}
                                            isFetching={isFetchingMetaData}
                                            equipDataObj={originalEquipData}
                                        />
                                    )}
                                </Col>

                                <Col xl={9}>
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
                                                            ? 'smart-meters'
                                                            : equipData?.device_type === 'active'
                                                            ? 'smart-plugs'
                                                            : ''
                                                    )}>
                                                    <span
                                                        className="buttonhover"
                                                        style={{ fontWeight: 'normal', textDecoration: 'underline' }}>
                                                        {equipData?.device_mac}
                                                        &nbsp;
                                                        <ArrowUpRightFromSquare
                                                            style={{ color: 'base-black' }}
                                                            width={20}
                                                            height={20}
                                                            className="mb-1"
                                                        />
                                                    </span>
                                                </Link>
                                            </Typography.Subheader>
                                        </div>
                                        <div className="d-flex">
                                            <div className="mr-2 mw-100">
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
                                        <div className="line-chart-wrapper">
                                            <div className="line-chart-loader">
                                                <Spinner color="primary" />
                                            </div>
                                        </div>
                                    ) : (
                                        <LineChart
                                            title={''}
                                            subTitle={''}
                                            tooltipUnit={selectedUnit}
                                            tooltipLabel={selectedConsumptionLabel}
                                            data={deviceData}
                                            // dateRange={fetchDateRange(startDate, endDate)}
                                            chartProps={{
                                                tooltip: {
                                                    xDateFormat: dateTimeFormatForHighChart(
                                                        userPrefDateFormat,
                                                        userPrefTimeFormat
                                                    ),
                                                },
                                                xAxis: {
                                                    type: 'datetime',
                                                    labels: {
                                                        format: formatXaxisForHighCharts(
                                                            daysCount,
                                                            userPrefDateFormat,
                                                            userPrefTimeFormat
                                                        ),
                                                    },
                                                    gridLineWidth: null,
                                                    alternateGridColor: null,
                                                },
                                                yAxis: {
                                                    gridLineWidth: 1,
                                                },
                                            }}
                                        />
                                    )}
                                </Col>
                            </Row>
                        )}

                        {selectedTab === 1 && (
                            <div>
                                <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                                    Equipment Details
                                </Typography.Header>

                                <Brick sizeInRem={1.25} />

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
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                            </div>

                                            <div className="w-100 ml-2">
                                                <Typography.Body size={Typography.Sizes.md}>
                                                    Equipment Type
                                                </Typography.Body>
                                                <Brick sizeInRem={0.25} />
                                                <Select
                                                    placeholder="Select Equipment Type"
                                                    options={
                                                        equipData?.device_type === 'active'
                                                            ? equipmentTypeData.filter(
                                                                  (el) => el?.end_use_name === 'Plug'
                                                              )
                                                            : equipmentTypeData
                                                    }
                                                    currentValue={equipmentTypeData.filter(
                                                        (option) => option.value === equipData?.equipments_type_id
                                                    )}
                                                    onChange={(e) => {
                                                        handleDataChange('equipments_type_id', e.value);
                                                    }}
                                                    isSearchable={true}
                                                    customSearchCallback={({ data, query }) =>
                                                        defaultDropdownSearch(data, query?.value)
                                                    }
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                            </div>

                                            {equipData?.device_type !== 'active' && (
                                                <div className="w-100 ml-2">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        End Use Category
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        placeholder="Select End Use Category"
                                                        options={endUse}
                                                        currentValue={endUse.filter(
                                                            (option) => option.value === equipData?.end_use_id
                                                        )}
                                                        onChange={(e) => {
                                                            handleDataChange('end_use_id', e.value);
                                                        }}
                                                        isSearchable={true}
                                                        disabled={!(isSuperAdmin || canUserEdit)}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <Brick sizeInRem={1.25} />

                                        <div className="d-flex justify-content-between">
                                            <div className="w-100">
                                                <Typography.Body size={Typography.Sizes.md}>
                                                    Manufacturer
                                                </Typography.Body>
                                                <Brick sizeInRem={0.25} />
                                                <InputTooltip
                                                    placeholder="Enter Manufacturer Name"
                                                    labelSize={Typography.Sizes.md}
                                                    value={equipData?.manufacturer}
                                                    onChange={(e) => {
                                                        handleDataChange('manufacturer', e.target.value);
                                                    }}
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                            </div>

                                            <div className="w-100 ml-2">
                                                <Typography.Body size={Typography.Sizes.md}>Model</Typography.Body>
                                                <Brick sizeInRem={0.25} />
                                                <InputTooltip
                                                    placeholder="Enter Model Name"
                                                    labelSize={Typography.Sizes.md}
                                                    value={equipData?.model}
                                                    onChange={(e) => {
                                                        handleDataChange('model', e.target.value);
                                                    }}
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                            </div>

                                            <div className="w-100 ml-2">
                                                <Typography.Body size={Typography.Sizes.md}>Serial</Typography.Body>
                                                <Brick sizeInRem={0.25} />
                                                <InputTooltip
                                                    placeholder="Enter Serial Number"
                                                    labelSize={Typography.Sizes.md}
                                                    value={equipData?.serial}
                                                    onChange={(e) => {
                                                        handleDataChange('serial', e.target.value);
                                                    }}
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                            </div>
                                        </div>

                                        <Brick sizeInRem={1.25} />

                                        <div className="d-flex">
                                            <div className="w-100">
                                                <div className="d-flex align-items-center">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Equipment Location
                                                    </Typography.Body>
                                                    <CustomToolTip
                                                        id="equip-location"
                                                        message="Location this equipment is installed in."
                                                    />
                                                </div>
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
                                                    customSearchCallback={({ data, query }) =>
                                                        defaultDropdownSearch(data, query?.value)
                                                    }
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                                {equipData?.location_id ? (
                                                    <>
                                                        <Brick sizeInRem={0.25} />
                                                        <Typography.Body
                                                            size={Typography.Sizes.xs}
                                                            className="input-error-label text-primary font-bold float-right mouse-pointer"
                                                            onClick={() => handleDataChange('location_id', '')}>
                                                            {`Reset Equipment Location`}
                                                        </Typography.Body>
                                                    </>
                                                ) : null}
                                            </div>

                                            <div className="w-100 ml-2">
                                                <div className="d-flex align-items-center">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Location Served
                                                    </Typography.Body>
                                                    <CustomToolTip
                                                        id="location-serverd"
                                                        message="The location this equipment serves. This equipment's energy usage will be associated with the selected space."
                                                    />
                                                </div>
                                                <Brick sizeInRem={0.25} />
                                                <Select
                                                    placeholder="Select Location"
                                                    options={locationData}
                                                    currentValue={locationData.filter(
                                                        (option) => option.value === equipData?.location_served
                                                    )}
                                                    onChange={(e) => {
                                                        handleDataChange('location_served', e.value);
                                                    }}
                                                    isSearchable={true}
                                                    customSearchCallback={({ data, query }) =>
                                                        defaultDropdownSearch(data, query?.value)
                                                    }
                                                    disabled={!(isSuperAdmin || canUserEdit)}
                                                />
                                                {equipData?.location_served ? (
                                                    <>
                                                        <Brick sizeInRem={0.25} />
                                                        <Typography.Body
                                                            size={Typography.Sizes.xs}
                                                            className="input-error-label text-primary font-bold float-right mouse-pointer"
                                                            onClick={() => handleDataChange('location_served', '')}>
                                                            {`Reset Location Served`}
                                                        </Typography.Body>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <Brick sizeInRem={1.25} />

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
                                                        customSearchCallback={({ data, query }) =>
                                                            defaultDropdownSearch(data, query?.value)
                                                        }
                                                        disabled={!(isSuperAdmin || canUserEdit)}
                                                    />

                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        The rule applied to this equipment to control when it is on.
                                                    </Typography.Body>
                                                </div>
                                                <Brick sizeInRem={1.25} />
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
                                                disabled={!(isSuperAdmin || canUserEdit)}
                                            />
                                        </div>

                                        <Brick sizeInRem={1.25} />

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
                                                disabled={!(isSuperAdmin || canUserEdit)}
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
                                                                    'smart-meters'
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
                                                        {equipData?.device_model === 'KP115'
                                                            ? `Smart Plug - Socket 1`
                                                            : ``}
                                                    </Typography.Subheader>

                                                    <Button
                                                        label="View Devices"
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.secondaryGrey}
                                                        onClick={() => {
                                                            redirectToConfigDevicePage(
                                                                equipData?.device_id,
                                                                'smart-plugs'
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
