import React, { useEffect, useRef, useState } from 'react';
import 'moment-timezone';
import { useHistory } from 'react-router-dom';
import { Row, Col, Spinner } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';

import Header from '../../components/Header';
import Button from '../../sharedComponents/button/Button';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';

import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { buildingData } from '../../store/globalState';

import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { dateTimeFormatForHighChart, formatXaxisForHighCharts } from '../../helpers/helpers';
import { defaultMetrics } from './constants';
import { handleDataConversion } from './helper';

import { fetchEnergyConsumptionBySpace, fetchSpaceMetadata } from './services';

import MetadataContainer from './MetadataContainer/index';
import EnergyMetadataContainer from './EnergyMetadataContainer/index';
import { ReactComponent as RightArrow } from '../../assets/icon/arrow-space-details.svg';

import '../../sharedComponents/typography/style.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '../settings/passive-devices/styles.scss';
import './styles.scss';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import { defaultDropdownSearch } from '../../sharedComponents/form/select/helpers';
import { getAllFloorsList, getAllSpaceTypes, getAllSpacesList, updateSpaceService } from '../settings/layout/services';
import { TagsInput } from 'react-tag-input-component';
import _ from 'lodash';

const SpaceDetails = () => {
    const history = useHistory();
    const { spaceId, bldgId } = useParams();

    const [buildingListData] = useAtom(buildingData);

    const metric = defaultMetrics;

    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const notifyUser = (notifyType, notifyMessage) => {
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = notifyMessage;
            s.notificationType = notifyType;
        });
    };

    const [chartDataFetching, setChartDataFetching] = useState(false);
    const [chartData, setChartData] = useState([]);

    const [metadataFetching, setMetadataFetching] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [metadataToUpdate, setMetadataToUpdate] = useState({});
    const [metadataUpdating, setMetadataUpdating] = useState(false);

    const [selectedTab, setSelectedTab] = useState(1);
    const [selectedConsumption, setConsumption] = useState(metric[0]?.value);
    const [spaceTypes, setSpaceTypes] = useState([]);

    const [errorObj, setErrorObj] = useState({});

    const [modal, setModal] = useState(false);
    const [moveSpacePopup, setMoveSpacePopup] = useState(false);
    const [currentParent, setCurrentParent] = useState('');

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);
    const openMoveSpacePopup = () => setMoveSpacePopup(true);
    const closeMoveSpacePopup = () => setMoveSpacePopup(false);
    const [floorsList, setFloorsList] = useState([]);
    const [spacesList, setSpacesList] = useState([]);
    const [selectedFloorId, setSelectedFloorId] = useState(null);
    const [spaceObj, setSpaceObj] = useState({});

    const sortedLayoutData = (dataList) => {
        const sortedList = _.sortBy(dataList, (obj) => {
            const name = obj?.name.toLowerCase();
            const match = name.match(/(\D+)(\d+)/);

            if (match) {
                const [, prefix, number] = match;
                return [prefix, _.padStart(number, 5, '0')];
            }
            return name;
        });

        return sortedList;
    };

    const fetchAllFloorData = async () => {
        setFloorsList([]);
        setSpacesList([]);

        const params = `?building_id=${bldgId}`;

        try {
            const res = await getAllFloorsList(params);

            const response = res?.data;
            if (response?.success) {
                if (response?.data.length !== 0) setFloorsList(sortedLayoutData(response?.data));
            } else {
                notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
            }
        } catch (error) {
            notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
        }
    };

    const fetchAllSpaceData = async () => {
        setSpacesList([]);

        const params = `?floor_id=${selectedFloorId}&building_id=${bldgId}`;

        try {
            const res = await getAllSpacesList(params);
            const response = res?.data;

            if (response?.success) {
                const spaces = response?.data;

                if (Array.isArray(spaces) && spaces.length === 0)
                    throw new Error('zero elements in response.data array');

                setSpacesList(sortedLayoutData(spaces));

                const spaceObjFound = spaces.find((space) => space._id === metadata.space_id);

                console.log(spaceObjFound);
                setSpaceObj(spaceObjFound);
            } else {
                notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
            }
        } catch (error) {
            notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
        }
    };

    const fetchSpaceTypes = async () => {
        const params = `?ordered_by=name&sort_by=ace`;

        try {
            await getAllSpaceTypes(params).then((res) => {
                const response = res?.data;

                if (response?.success) {
                    if (response?.data.length !== 0) {
                        const mappedSpaceTypes = response?.data.map((el) => {
                            return {
                                label: el?.name,
                                value: el?.id,
                            };
                        });

                        setSpaceTypes(mappedSpaceTypes);
                    }
                }
            });
        } catch {
            setSpaceTypes([]);
        }
    };

    const fetchChartData = async () => {
        setChartDataFetching(true);
        setChartData([]);

        try {
            const query = { spaceId, bldgId, dateFrom: startDate, dateTo: endDate, timeZone };

            const resSpace = await fetchEnergyConsumptionBySpace(query);

            if (!Array.isArray(resSpace)) return;

            const spaceObj = resSpace[0];

            if (!Array.isArray(spaceObj?.total_data)) return;

            const mappedSpaceData = spaceObj.total_data.map((consumptionData) => ({
                x: new Date(consumptionData?.time_stamp).getTime(),
                y: handleDataConversion(consumptionData?.consumption, selectedConsumption),
            }));

            const spaceRecord = {
                name: spaceObj.space_name,
                data: mappedSpaceData,
            };

            setChartData([spaceRecord]);
        } catch (e) {
            setChartData([]);
        }

        setChartDataFetching(false);
    };

    const fetchMetadata = async () => {
        setMetadataFetching(true);
        setMetadata({});
        setMetadataToUpdate({});

        try {
            const query = { bldgId, dateFrom: startDate, dateTo: endDate, timeZone };

            const res = await fetchSpaceMetadata(query, spaceId);

            if (res) {
                setMetadata(res);
                setMetadataToUpdate(res);
                setSelectedFloorId(res.floor_id);
            }
        } catch {
            setMetadata({});
            setMetadataToUpdate({});
        }

        setMetadataFetching(false);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/spaces/space/overview',
                    active: true,
                },
            ];
            bs.items = newList;
        });

        ComponentStore.update((s) => {
            s.parent = 'spaces-building';
        });
    };

    useEffect(() => {
        if (!spaceId || !selectedConsumption || !bldgId || !startDate || !endDate) return;

        fetchSpaceTypes();
        fetchChartData();
        fetchMetadata();
        fetchAllFloorData();
    }, [spaceId, startDate, endDate, selectedConsumption, bldgId]);

    useEffect(() => {
        if (!selectedFloorId) return;

        fetchAllSpaceData();
    }, [selectedFloorId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        let time_zone = 'US/Eastern';

        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);

            if (bldgObj?.building_id) {
                if (bldgObj?.timezone) time_zone = bldgObj?.timezone;
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
            }
        }
    }, [startDate, endDate, bldgId]);

    const chartProps = {
        tooltip: {
            xDateFormat: dateTimeFormatForHighChart(userPrefDateFormat, userPrefTimeFormat),
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: formatXaxisForHighCharts(daysCount, userPrefDateFormat, userPrefTimeFormat),
            },
            gridLineWidth: null,
            alternateGridColor: null,
        },
        yAxis: {
            gridLineWidth: 1,
        },
    };

    const selectedMetricsTab = () => setSelectedTab(0);
    const selectedConfiguresTab = () => setSelectedTab(1);
    const dynamicActiveClassTab = (selectedIdTab) => (selectedTab === selectedIdTab ? 'active-tab-style' : '');
    const handleSelect = (e) => setConsumption(e.value);
    const spaceName = metadata?.space_name && metadata.space_name;

    const handleChange = (key, value) => {
        let obj = Object.assign({}, metadataToUpdate);
        obj[key] = value;
        setMetadataToUpdate(obj);
    };

    const fetchEditSpace = async () => {
        setMetadataUpdating(true);

        const params = `?space_id=${metadataToUpdate?.space_id}`;

        const payload = {
            building_id: bldgId,
            name: metadataToUpdate?.space_name,
            type_id: metadataToUpdate?.space_type_id,
            parents: metadataToUpdate?.parents, // does not exist
            parent_space: metadataToUpdate?.parent_space, // does not exist
        };

        try {
            const res = await updateSpaceService(params, payload);
            const response = res?.data;
            if (response?.success) {
                notifyUser(Notification.Types.success, `Space updated successfully.`);
            } else {
                notifyUser(Notification.Types.error, response?.message);
            }
        } catch {
            notifyUser(Notification.Types.error, `Failed to update Space.`);
        }

        setMetadataUpdating(false);
    };

    const handleEditSpace = () => {
        if (!bldgId || !metadataToUpdate?.space_id) return;

        let alertObj = Object.assign({}, errorObj);

        if (!metadataToUpdate?.space_name || metadataToUpdate?.space_name === '')
            alertObj.space_name = `Please enter Space name. It cannot be empty.`;
        if (!metadataToUpdate?.space_type_id || metadataToUpdate?.space_type_id === '')
            alertObj.space_type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.space_name && !alertObj.space_type_id) fetchEditSpace();
    };

    const getCurrentParent = () => {
        console.log(spaceObj);

        if (spaceObj?.parent_space) {
            const parent = spacesList.find((space) => space._id === spaceObj.parent_space);
            setCurrentParent(parent?.name);
            return;
        } else if (spaceObj?.parents) {
            const parent = floorsList.find((space) => space.floor_id === spaceObj.parents);
            setCurrentParent(parent?.name);
            return;
        }

        setCurrentParent('');
    };

    useEffect(() => {
        if (
            !metadata ||
            !spacesList.length > 0 ||
            !floorsList > 0 ||
            !Object.keys(spaceObj).length > 0 ||
            !selectedFloorId
        )
            return;

        getCurrentParent();
    }, [metadata, spacesList, floorsList, spaceObj, selectedFloorId]);

    return (
        <div>
            <div>
                <Row>
                    <Col lg={12}>
                        <div className="passive-header-wrapper d-flex justify-content-between upper-content-container">
                            <div className="d-flex flex-column justify-content-between">
                                <div className="space-tree-info">
                                    <Typography.Subheader size={Typography.Sizes.sm}>Spaces</Typography.Subheader>
                                    <RightArrow className="ml-2 mr-2 w-16 h-16" />
                                    <Typography.Subheader size={Typography.Sizes.sm}>{spaceName}</Typography.Subheader>
                                </div>
                                <Typography.Header size={Typography.Sizes.md}>{spaceName}</Typography.Header>
                                <div className="d-flex justify-content-start mouse-pointer ">
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className={`typography-wrapper mr-4 ${dynamicActiveClassTab(0)}`}
                                        onClick={selectedMetricsTab}>
                                        Metrics
                                    </Typography.Subheader>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className={`typography-wrapper ${dynamicActiveClassTab(1)}`}
                                        onClick={selectedConfiguresTab}>
                                        Configure
                                    </Typography.Subheader>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div>
                                    <Button
                                        label="Close"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() => history.push(`/spaces/building/overview/${bldgId}`)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {selectedTab === 0 && (
                    <div className="lower-content-container">
                        <Row>
                            <Col xl={3}>
                                <EnergyMetadataContainer metadata={metadata} isFetching={metadataFetching} />

                                <Brick sizeInRem={1} />

                                <MetadataContainer metadata={metadata} isFetching={metadataFetching} />

                                <Brick sizeInRem={1} />
                            </Col>

                            <Col xl={9}>
                                <div className="select-by">
                                    <div className="d-flex">
                                        <div className="mr-2 mw-100">
                                            <Select
                                                defaultValue={selectedConsumption}
                                                options={metric}
                                                onChange={handleSelect}
                                            />
                                        </div>
                                        <Header type="page" />
                                    </div>
                                </div>

                                {chartDataFetching ? (
                                    <div className="line-chart-wrapper">
                                        <div className="line-chart-loader">
                                            <Spinner color="primary" />
                                        </div>
                                    </div>
                                ) : (
                                    <LineChart
                                        title={''}
                                        subTitle={''}
                                        tooltipUnit={metric[0]?.unit}
                                        tooltipLabel={metric[0]?.consumption}
                                        data={chartData}
                                        chartProps={chartProps}
                                    />
                                )}
                            </Col>
                        </Row>
                    </div>
                )}

                {selectedTab === 1 && (
                    <div>
                        <Brick sizeInRem={1.25} />

                        <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                            Space Details
                        </Typography.Header>

                        <Brick sizeInRem={1.25} />

                        <Row>
                            <Col xl={8}>
                                <div className="d-flex justify-content-between">
                                    <div className="w-100">
                                        <Typography.Body size={Typography.Sizes.md}>Space Name</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            placeholder="Enter Name"
                                            labelSize={Typography.Sizes.md}
                                            value={metadataToUpdate?.space_name ?? ''}
                                            onChange={(e) => {
                                                handleChange('space_name', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div className="w-100 ml-3">
                                        <Typography.Body size={Typography.Sizes.md}>Space Type</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <Select
                                            name="select"
                                            placeholder="Select Type"
                                            options={spaceTypes}
                                            currentValue={spaceTypes.filter(
                                                (option) => option.value === metadataToUpdate?.space_type_id
                                            )}
                                            isSearchable={true}
                                            onChange={(e) => {
                                                handleChange('space_type_id', e.value);
                                            }}
                                            customSearchCallback={({ data, query }) =>
                                                defaultDropdownSearch(data, query?.value)
                                            }
                                            menuPlacement="bottom"
                                        />
                                    </div>
                                </div>

                                <Brick sizeInRem={1.25} />

                                <div className="d-flex justify-content-between">
                                    <div className="w-100">
                                        <Typography.Body size={Typography.Sizes.md}>{`Square Footage`}</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            placeholder="Enter Square Footage"
                                            labelSize={Typography.Sizes.md}
                                            value={metadata?.square_footage ?? ''}
                                            onChange={(e) => {
                                                handleChange('square_footage', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div className="w-100 ml-3">
                                        <div>
                                            <Typography.Body size={Typography.Sizes.md}>{`Tags`}</Typography.Body>
                                            <Brick sizeInRem={0.25} />
                                            <TagsInput
                                                classNames="h-5"
                                                placeholder="Tags"
                                                value={metadataToUpdate?.tag ?? []}
                                                onChange={(value) => {
                                                    handleChange('tag', value);
                                                }}
                                                placeHolder="Add Tag"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col xl={4}>
                                <div className="w-100 box-parent">
                                    <div className="box-parent-header">
                                        <Typography.Header size={Typography.Sizes.sm}>Parent</Typography.Header>
                                    </div>

                                    <div className="box-parent-input">
                                        <InputTooltip
                                            labelSize={Typography.Sizes.md}
                                            value={currentParent}
                                            disabled={true}
                                            className="w-100"
                                        />
                                        <Button
                                            label={'Move'}
                                            size={Button.Sizes.md}
                                            type={Button.Type.primary}
                                            onClick={() => {
                                                closeModal();
                                                openMoveSpacePopup();
                                            }}
                                            className="ml-2"
                                        />
                                    </div>

                                    <div className="box-parent-buttons">
                                        <Button
                                            label={metadataUpdating ? 'Updating' : 'Update'}
                                            size={Button.Sizes.md}
                                            type={Button.Type.primary}
                                            onClick={handleEditSpace}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpaceDetails;
