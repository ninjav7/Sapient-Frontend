import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import ButtonSC from '../../sharedComponents/button/Button';
import { getPlugRulesTableCSVExport } from '../../utils/tablesExport';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { ReactComponent as PlusSVG } from '../../assets/icon/plus.svg';
import { Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { fetchPlugRules, updatePlugRuleRequest, createPlugRuleRequest } from '../../services/plugRules';
import axios from 'axios';
import { useAtom } from 'jotai';
import { BaseUrl, assignSensorsToRule } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import './style.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { buildingData } from '../../store/globalState';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';
import _ from 'lodash';
import Select from '../../sharedComponents/form/select';
import Textarea from '../../sharedComponents/form/textarea/Textarea';
import Input from '../../sharedComponents/form/input/Input';
import { fetchBuildingsList } from '../../services/buildings';

import { ReactComponent as InactiveSVG } from '../../assets/icon/ban.svg';
import { ReactComponent as ActiveSVG } from '../../assets/icon/circle-check.svg';

const buttonGroupFilterOptions = [
    { label: 'All' },
    { label: 'Active', icon: <ActiveSVG className="bg-grey" /> },
    { label: 'Inactive', icon: <InactiveSVG className="bg-grey" /> },
];
const PlugRuleTable = ({ plugRuleData, skeletonLoading }) => {
    const history = useHistory();

    const redirectToPlugRulePage = (ruleId) => {
        history.push({
            pathname: `/control/plug-rules/${ruleId}`,
        });
    };
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Description</th>
                            <th>Days</th>
                            <th>Socket Count</th>
                            <th></th>
                        </tr>
                    </thead>
                    {skeletonLoading ? (
                        <tbody>
                            <SkeletonTheme color="#202020" height={35}>
                                <tr>
                                    <th>
                                        <Skeleton count={5} />
                                    </th>

                                    <th>
                                        <Skeleton count={5} />
                                    </th>

                                    <th>
                                        <Skeleton count={5} />
                                    </th>

                                    <th>
                                        <Skeleton count={5} />
                                    </th>
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {plugRuleData.map((record, index) => {
                                return (
                                    <tr key={index} className="mouse-pointer">
                                        <td
                                            className="font-weight-bold panel-name"
                                            onClick={() => {
                                                redirectToPlugRulePage(record.id);
                                            }}>
                                            {record.name}
                                        </td>
                                        <td className="font-weight-bold">
                                            {record.description === '' ? '-' : record.description}
                                        </td>
                                        <td className="font-weight-bold">{record.days ? record.days : '-'}</td>
                                        <td className="font-weight-bold">{record.sensors_count}</td>
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

const PlugRules = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [search, setSearch] = useState('');

    // Add Rule Model
    const [showAddRule, setShowAddRule] = useState(false);
    const handleAddRuleClose = () => setShowAddRule(false);
    const handleAddRuleShow = () => setShowAddRule(true);
    const { download } = useCSVDownload();

    const activeBuildingId = localStorage.getItem('buildingId');
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [buildingError, setBuildingError] = useState({ text: '' });
    const [pageRefresh, setPageRefresh] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const initialBuildingValue = bldgId !== 'portfolio' ? bldgId : '';
    const [createRuleData, setCreateRuleData] = useState({
        building_id: initialBuildingValue,
        name: '',
        description: '',
    });
    useEffect(() => {
        setCreateRuleData((prev) => {
            return { ...prev, building_id: initialBuildingValue };
        });
    }, [bldgId]);

    const [currentData, setCurrentData] = useState({});

    const [modelRefresh, setModelRefresh] = useState(false);

    const [plugRuleData, setPlugRuleData] = useState([]);
    const [onlinePlugRuleData, setOnlinePlugRuleData] = useState([]);
    const [offlinePlugRuleData, setOfflinePlugRuleData] = useState([]);

    const [rulesToLink, setRulesToLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const [rulesToUnLink, setRulesToUnLink] = useState({
        rule_id: '',
        sensor_id: [],
    });

    const handleCreatePlugRuleChange = (key, value) => {
        let obj = Object.assign({}, createRuleData);
        if (key == 'building_id' && value) {
            setBuildingError({ text: '' });
        }
        if (key == 'name' && value) {
            setNameError(false);
        }
        obj[key] = value;
        setCreateRuleData(obj);
    };

    const savePlugRuleData = async () => {
        const isValid = validatePlugRuleForm();
        if (isValid) {
            let newRuleData = Object.assign({}, createRuleData);
            newRuleData.building_id = [newRuleData.building_id];
            setIsProcessing(true);
            await createPlugRuleRequest(newRuleData)
                .then((res) => {
                    setIsProcessing(false);

                    redirectToPlugRulePage(res.data.plug_rule_id);
                })
                .catch((error) => {
                    setIsProcessing(false);
                });
        }
    };

    const updatePlugRuleData = async () => {
        setIsProcessing(true);
        await updatePlugRuleRequest(createRuleData)
            .then((res) => {
                setIsProcessing(false);
                setPageRefresh(!pageRefresh);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const getBuildingData = async () => {
        await fetchBuildingsList(false).then((res) => {
            let data = res.data;
            const formattedData = formatBuildingListData(data);

            setBuildingListData(formattedData);
        });
    };

    const updateSocketLink = async () => {
        if (rulesToLink.sensor_id.length === 0) {
            return;
        }
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${assignSensorsToRule}`, rulesToLink, {
                    headers: header,
                })
                .then((res) => {});

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    // Building List Data Globally
    const [buildingListData, setBuildingListData] = useState([]);

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Plug Rules',
                    path: '/control/plug-rules',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'control';
        });
    };

    useEffect(() => {
        getBuildingData();
        updateBreadcrumbStore();
    }, []);

    const fetchPlugRuleData = async () => {
        const searchParams = {
            params: {
                rule_search: search,
            },
        };

        let params = '';

        if (activeBuildingId !== 'portfolio' && activeBuildingId !== null) params = `?building_id=${activeBuildingId}`;

        await fetchPlugRules(params, searchParams)
            .then((res) => {
                if (res.status) {
                    setSkeletonLoading(false);
                }
                let response = res.data;
                setPlugRuleData(response.data);
                let onlineData = [];
                let offlineData = [];
                response.data.forEach((record) => {
                    record.is_active ? onlineData.push(record) : offlineData.push(record);
                });
                setOnlinePlugRuleData(onlineData);
                setOfflinePlugRuleData(offlineData);
            })
            .catch((e) => {
                setPlugRuleData([]);
                setOnlinePlugRuleData([]);
                setOfflinePlugRuleData([]);
            });
    };

    const handleDownloadCsv = async () => {
        download('Plug_Rules', getPlugRulesTableCSVExport(dataForCSV(), headerProps));
    };

    useEffect(() => {
        fetchPlugRuleData();
    }, [activeBuildingId, search]);

    const history = useHistory();

    const redirectToPlugRulePage = (ruleId) => {
        history.push({
            pathname: `/control/plug-rules/${ruleId}`,
        });
    };

    const formatBuildingListData = (data) => {
        return data.map((el) => {
            return { value: el.building_id, label: el.building_name };
        });
    };

    const validatePlugRuleForm = () => {
        let valid = true;
        if (!createRuleData.name.length) {
            setNameError(true);
            valid = false;
        }
        if (!createRuleData.building_id.length) {
            setBuildingError({ text: 'please select building' });
            valid = false;
        }
        return valid;
    };

    const handleCreatePlugRule = () => {
        setShowAddRule(true);
    };
    const buildingIdProps = {
        label: 'Choose building',
        defaultValue: createRuleData.building_id || localStorage.getItem('buildingId'),
        onChange: (event) => {
            handleCreatePlugRuleChange('building_id', event.value);
        },
        options: buildingListData,
    };

    if (buildingError?.text?.length) {
        buildingIdProps.error = buildingError;
    }

    const formatRows = (data) =>
        data?.map((row) => {
            const newRow = { ...row };

            const sortedDays = ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun'];

            newRow.name = (
                <ButtonSC
                    className={'p-0'}
                    type={ButtonSC.Type.link}
                    label={row.name}
                    onClick={() => redirectToPlugRulePage(row.id)}
                />
            );

            newRow.description = (
                <Typography.Body size={Typography.Sizes.md}>{newRow.description || '-'}</Typography.Body>
            );

            newRow.days = (
                <Typography.Body size={Typography.Sizes.md}>
                    {_.uniq(
                        newRow.action.reduce((acc, actionItem) => {
                            actionItem.action_day &&
                                actionItem.action_day.forEach((item) => {
                                    acc.push(item);
                                });

                            return acc;
                        }, [])
                    )
                        .sort(function (a, b) {
                            return sortedDays.indexOf(a) - sortedDays.indexOf(b);
                        })
                        .map((data) => <span className="text-capitalize"> {data} </span>) || '-'}
                </Typography.Body>
            );

            newRow.sensors_count = (
                <Typography.Body size={Typography.Sizes.md}>{newRow.sensors_count || 0}</Typography.Body>
            );

            return newRow;
        });

    const renderStatus = (row) => {
        return (
            <>
                {row.is_active ? (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="active-container justify-content-center">
                        <ActiveSVG style={{ marginTop: '0.125rem' }} />
                        Active
                    </Typography.Subheader>
                ) : (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="inactive-container justify-content-center">
                        <InactiveSVG style={{ marginTop: '0.125rem' }} />
                        Inactive
                    </Typography.Subheader>
                )}
            </>
        );
    };

    const headerProps = [
        { name: 'Name', accessor: 'name' },
        { name: 'Description', accessor: 'description' },
        { name: 'Status', accessor: 'status', callbackValue: renderStatus },
        { name: 'Days', accessor: 'days' },
        { name: 'Socket Count', accessor: 'sensors_count' },
    ];

    const dataForCSV = () => {
        let newPlugRuleData = [];

        if (selectedTab === 0) {
            newPlugRuleData = plugRuleData;
        }

        if (selectedTab === 1) {
            newPlugRuleData = onlinePlugRuleData;
        }

        if (selectedTab === 2) {
            newPlugRuleData = offlinePlugRuleData;
        }
        return newPlugRuleData;
    };
    const currentRow = () => {
        let newPlugRuleData = [];

        if (selectedTab === 0) {
            newPlugRuleData = formatRows(plugRuleData);
        }

        if (selectedTab === 1) {
            newPlugRuleData = formatRows(onlinePlugRuleData);
        }

        if (selectedTab === 2) {
            newPlugRuleData = formatRows(offlinePlugRuleData);
        }
        return newPlugRuleData;
    };

    return (
        <React.Fragment>
            <div className="plug-rules-header">
                <div className="plug-left-header">
                    <div className="plug-blg-name">
                        {localStorage.getItem('buildingName') === 'null' ? '' : localStorage.getItem('buildingName')}
                    </div>
                    <div className="plug-heading">Plug Rules</div>
                </div>
                <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                    <div>
                        <button
                            type="button"
                            className="btn btn-md btn-primary font-weight-bold"
                            onClick={() => {
                                handleCreatePlugRule();
                            }}>
                            <PlusSVG className="mr-2" />
                            Add Rule
                        </button>
                    </div>
                </div>
            </div>
            <div className="plug-rules-body">
                <Row>
                    <Col lg={12}>
                        <Brick sizeInRem={2} />
                        {skeletonLoading ? (
                            <SkeletonTheme color="#202020" height={35}>
                                <table cellPadding={5} className="table">
                                    <tr>
                                        <th width={130}>
                                            <Skeleton count={5} />
                                        </th>

                                        <th width={190}>
                                            <Skeleton count={5} />
                                        </th>

                                        <th width={200}>
                                            <Skeleton count={5} />
                                        </th>

                                        <th>
                                            <Skeleton count={5} />
                                        </th>
                                    </tr>
                                </table>
                            </SkeletonTheme>
                        ) : (
                            <DataTableWidget
                                id="plugRulesTable1"
                                onSearch={setSearch}
                                onStatus={setSelectedTab}
                                buttonGroupFilterOptions={buttonGroupFilterOptions}
                                rows={currentRow()}
                                searchResultRows={currentRow()}
                                onDownload={() => handleDownloadCsv()}
                                headers={headerProps}
                            />
                        )}
                    </Col>
                </Row>
            </div>

            {/* Add Rule Model  */}
            <Modal show={showAddRule} onHide={handleAddRuleClose} centered>
                <div className="mt-3 ml-3">
                    <Modal.Title>Add Plug Rule</Modal.Title>
                </div>
                <Modal.Body>
                    <Input
                        label="Name"
                        id="name"
                        placeholder="Enter Rule Name"
                        value={createRuleData.name}
                        onChange={(e) => {
                            handleCreatePlugRuleChange('name', e.target.value);
                        }}
                        error={nameError}
                    />
                    <div className="my-3">{activeBuildingId === 'portfolio' && <Select {...buildingIdProps} />}</div>

                    <Textarea
                        type="textarea"
                        label="Description"
                        name="text"
                        id="description"
                        rows="4"
                        placeholder="Enter Description of Rule"
                        value={createRuleData.description}
                        className="font-weight-bold"
                        onChange={(e) => {
                            handleCreatePlugRuleChange('description', e.target.value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleAddRuleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            savePlugRuleData();
                        }}
                        disabled={isProcessing}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default PlugRules;
