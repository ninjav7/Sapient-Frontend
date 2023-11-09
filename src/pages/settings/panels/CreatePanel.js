import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router-dom';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { BuildingStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';
import { addNewPanel, getLocationData, getPanelsList } from './services';
import { disconnectBreaker, panelType, voltsOption } from './utils';
import colorPalette from '../../../assets/scss/_colors.scss';
import { UserStore } from '../../../store/UserStore';

const CreatePanel = ({ isCreatePanelModalOpen, closeCreatePanelModel }) => {
    const history = useHistory();
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const defaultPanelObj = {
        name: '',
        parent_panel: '',
        space_id: '',
        device_id: '',
        voltage: '',
        phase_config: 1,
        rated_amps: '',
        breaker_count: '',
        panel_type: '',
    };

    const defaultErrorObj = {
        name: null,
        parent_panel: null,
        device_id: null,
        voltage: null,
        rated_amps: null,
        panel_type: null,
    };

    const [panelObj, setPanelObj] = useState(defaultPanelObj);
    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [panelsData, setPanelsData] = useState([]);
    const [locationData, setLocationData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panelObj);
        if (key === 'panel_type') obj.breaker_count = '';
        if (key === 'panel_type' && value === 'disconnect' && obj.voltage === '120/240') obj.voltage = '';
        setErrorObj({ ...errorObj, [key]: null });
        obj[key] = value;
        setPanelObj(obj);
    };

    const savePanelDetails = async () => {
        let alertObj = Object.assign({}, errorObj);

        if (panelObj?.name === '') alertObj.name = 'Please enter Panel name';
        if (panelObj?.rated_amps === '') alertObj.rated_amps = 'Please enter Amperage';
        if (panelObj?.voltage === '') alertObj.voltage = { text: 'Please select Voltage' };
        if (panelObj?.panel_type === '') alertObj.panel_type = { text: 'Please select Panel type' };
        if (panelObj?.breaker_count === '') {
            alertObj.breaker_count =
                panelObj?.panel_type === 'disconnect'
                    ? { text: 'Please select Breakers count' }
                    : 'Please enter Breakers count';
        }

        setErrorObj(alertObj);

        if (
            !alertObj.name &&
            !alertObj.rated_amps &&
            !alertObj.voltage &&
            !alertObj.panel_type &&
            !alertObj.breaker_count
        ) {
            setIsProcessing(true);
            let obj = Object.assign({}, panelObj);
            obj.rated_amps = +panelObj.rated_amps;
            obj.breaker_count = +panelObj.breaker_count;
            let params = `?building_id=${bldgId}`;
            await addNewPanel(params, panelObj)
                .then((res) => {
                    const response = res?.data;

                    if (response?.success) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Panel created Successfully!';
                            s.notificationType = 'success';
                        });
                        const panelId = response?.id;
                        setIsProcessing(false);
                        closeCreatePanelModel();
                        if (panelId !== '') redirectUserToPanelPage(panelObj?.panel_type, panelId);
                        setPanelObj(defaultPanelObj);
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message
                                ? response?.message
                                : res
                                ? 'Unable to create Panel.'
                                : 'Unable to create Panel due to Internal Server Error!.';
                            s.notificationType = 'error';
                        });
                    }
                    setIsProcessing(false);
                })
                .catch(() => {
                    setErrorObj(defaultErrorObj);
                    setIsProcessing(false);
                });
        }
    };

    const fetchLocationData = async () => {
        let response = await getLocationData(`/${bldgId}`);
        if (response?.data.length === 0) {
            setLocationData([]);
            return;
        }
        let data = [];
        response.data.sort((a, b) => {
            return a.location_name.localeCompare(b.location_name);
        });
        response.data.forEach((record) => {
            data.push({
                label: record?.location_name,
                value: record?.location_id,
            });
        });
        setLocationData(data);
    };

    const fetchPanelsData = async () => {
        const params = `?building_id=${bldgId}`;
        const response = await getPanelsList(params);
        if (response?.data?.data.length === 0) {
            setPanelsData([]);
            return;
        }
        let data = [];
        response.data.data.forEach((record) => {
            data.push({
                label: record?.panel_name,
                value: record?.panel_id,
            });
        });
        setPanelsData(data);
    };

    const redirectUserToPanelPage = (panel_type, panel_id) => {
        history.push({
            pathname: `/settings/panels/edit-panel/${panel_type}/${panel_id}`,
        });
    };

    useEffect(() => {
        if (isCreatePanelModalOpen) {
            fetchLocationData();
            fetchPanelsData();
        }
    }, [isCreatePanelModalOpen]);

    return (
        <Modal show={isCreatePanelModalOpen} onHide={closeCreatePanelModel} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Create New Panel</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.md}>
                    Panel Name
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>
                <Brick sizeInRem={0.25} />
                <InputTooltip
                    placeholder="Enter Panel Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                    }}
                    labelSize={Typography.Sizes.md}
                    value={panelObj?.name}
                    error={errorObj?.name}
                />

                <Brick sizeInRem={1.5} />

                <div className="d-flex space-between">
                    <div className="w-100 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>
                            Rated Amps
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            type="number"
                            placeholder="Enter Amperage"
                            onChange={(e) => {
                                if (e.target.value < 0) return;
                                handleChange('rated_amps', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={panelObj?.rated_amps}
                            error={errorObj?.rated_amps}
                        />
                    </div>

                    <div className="w-100 ml-2">
                        <Typography.Body size={Typography.Sizes.md}>
                            Volts
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            placeholder="Select Volts"
                            options={
                                panelObj?.panel_type === 'disconnect'
                                    ? voltsOption.filter((option) => option.value !== '120/240')
                                    : voltsOption
                            }
                            currentValue={voltsOption.filter((option) => option.value === panelObj?.voltage)}
                            onChange={(e) => {
                                handleChange('voltage', e.value);
                            }}
                            isSearchable={false}
                            error={errorObj?.voltage}
                        />
                    </div>
                </div>

                <Brick sizeInRem={1.5} />

                <div className="d-flex space-between">
                    <div className="w-100 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>
                            Panel Types
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            placeholder="Select Panel Type"
                            options={panelType}
                            currentValue={panelType.filter((option) => option.value === panelObj?.panel_type)}
                            onChange={(e) => {
                                handleChange('panel_type', e.value);
                            }}
                            isSearchable={false}
                            error={errorObj?.panel_type}
                        />
                    </div>

                    <div className="w-100 ml-2">
                        <div>
                            <Typography.Body size={Typography.Sizes.md}>
                                Number of Breakers
                                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                    *
                                </span>
                            </Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {panelObj?.panel_type === 'disconnect' ? (
                                <Select
                                    placeholder="Select Breakers"
                                    options={disconnectBreaker}
                                    currentValue={disconnectBreaker.filter(
                                        (option) => option.value === panelObj?.breaker_count
                                    )}
                                    onChange={(e) => {
                                        handleChange('breaker_count', e.value);
                                    }}
                                    isSearchable={true}
                                    error={errorObj?.breaker_count}
                                />
                            ) : (
                                <InputTooltip
                                    type="number"
                                    placeholder="Enter Breakers"
                                    onChange={(e) => {
                                        if (e.target.value < 0) return;
                                        handleChange('breaker_count', e.target.value);
                                    }}
                                    labelSize={Typography.Sizes.md}
                                    value={panelObj?.breaker_count}
                                    error={errorObj?.breaker_count}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Location</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Location"
                        options={locationData}
                        currentValue={locationData.filter((option) => option.value === panelObj?.space_id)}
                        onChange={(e) => {
                            handleChange('space_id', e.value);
                        }}
                        isSearchable={true}
                        menuPlacement="top"
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Parent Panel</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Parent Panel"
                        options={panelsData}
                        currentValue={panelsData.filter((option) => option.value === panelObj?.parent_panel)}
                        onChange={(e) => {
                            handleChange('parent_panel', e.value);
                        }}
                        isSearchable={true}
                        error={errorObj?.parent_panel}
                        menuPlacement="top"
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            closeCreatePanelModel();
                            setPanelObj(defaultPanelObj);
                            setErrorObj(defaultErrorObj);
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={savePanelDetails}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreatePanel;
