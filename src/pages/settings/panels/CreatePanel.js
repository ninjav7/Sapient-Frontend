import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { BuildingStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';
import { addNewPanel, getLocationData, getPanelsData } from './services';
import { disconnectBreaker, panelType, voltsOption } from './utils';

const CreatePanel = ({ isCreatePanelModalOpen, closeCreatePanelModel, fetchPanelsDataWithFilter }) => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const defaultPanelObj = {
        name: '',
        parent_panel: '',
        space_id: '',
        device_id: '',
        voltage: '',
        phase_config: 1,
        rated_amps: '0',
        breaker_count: '0',
        panel_type: '',
    };

    const [panelObj, setPanelObj] = useState(defaultPanelObj);
    const [panelsData, setPanelsData] = useState([]);
    const [locationData, setLocationData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panelObj);
        if (key === 'panel_type') obj.breaker_count = '';
        obj[key] = value;
        setPanelObj(obj);
    };

    const savePanelDetails = async () => {
        setIsProcessing(true);
        let obj = Object.assign({}, panelObj);
        obj.rated_amps = +panelObj.rated_amps;
        obj.breaker_count = +panelObj.breaker_count;
        let params = `?building_id=${bldgId}`;
        await addNewPanel(params, panelObj)
            .then((res) => {
                closeCreatePanelModel();
                setPanelObj(defaultPanelObj);
                fetchPanelsDataWithFilter(bldgId);
                setIsProcessing(false);
            })
            .catch(() => {
                setIsProcessing(false);
            });
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
        const response = await getPanelsData(params);
        if (response?.data?.data?.data.length === 0) {
            setPanelsData([]);
            return;
        }
        let data = [];
        response.data.data.data.forEach((record) => {
            data.push({
                label: record?.panel_name,
                value: record?.panel_id,
            });
        });
        setPanelsData(data);
    };

    useEffect(() => {
        if (
            panelObj?.name.length > 0 &&
            panelObj?.voltage.length > 0 &&
            panelObj?.rated_amps.length > 0 &&
            panelObj?.breaker_count.length > 0 &&
            panelObj?.panel_type.length > 0
        ) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [panelObj]);

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

                <InputTooltip
                    label="Panel Name"
                    placeholder="Enter Panel Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                    }}
                    labelSize={Typography.Sizes.md}
                    value={panelObj?.name}
                />

                <Brick sizeInRem={1.5} />

                <div className="d-flex space-between">
                    <div className="w-100 mr-2">
                        <InputTooltip
                            type="number"
                            label="Rated Amps"
                            placeholder="Enter Amperage"
                            onChange={(e) => {
                                handleChange('rated_amps', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={panelObj?.rated_amps}
                        />
                    </div>

                    <div className="w-100 ml-2">
                        <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            placeholder="Select Volts"
                            options={voltsOption}
                            defaultValue={voltsOption.filter((option) => option.value === panelObj?.voltage)}
                            onChange={(e) => {
                                handleChange('voltage', e.value);
                            }}
                            isSearchable={true}
                        />
                    </div>
                </div>

                <Brick sizeInRem={1.5} />

                <div className="d-flex space-between">
                    <div className="w-100 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>Panel Types</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            placeholder="Select Panel Types"
                            options={panelType}
                            defaultValue={panelType.filter((option) => option.value === panelObj?.panel_type)}
                            onChange={(e) => {
                                handleChange('panel_type', e.value);
                            }}
                            isSearchable={true}
                        />
                    </div>

                    <div className="w-100 ml-2">
                        {panelObj?.panel_type === 'disconnect' ? (
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Number of Breakers</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <Select
                                    placeholder="Select Breakers"
                                    options={disconnectBreaker}
                                    defaultValue={disconnectBreaker.filter(
                                        (option) => option.value === panelObj?.space_id
                                    )}
                                    onChange={(e) => {
                                        handleChange('breaker_count', e.value);
                                    }}
                                    isSearchable={true}
                                />
                            </div>
                        ) : (
                            <InputTooltip
                                type="number"
                                label="Number of Breakers"
                                placeholder="Enter Breakers"
                                onChange={(e) => {
                                    handleChange('breaker_count', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={panelObj?.breaker_count}
                            />
                        )}
                    </div>
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Location</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Location"
                        options={locationData}
                        defaultValue={locationData.filter((option) => option.value === panelObj?.space_id)}
                        onChange={(e) => {
                            handleChange('space_id', e.value);
                        }}
                        isSearchable={true}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Parent Panel</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Parent Panel"
                        options={panelsData}
                        defaultValue={panelsData.filter((option) => option.value === panelObj?.parent_panel)}
                        onChange={(e) => {
                            handleChange('parent_panel', e.value);
                        }}
                        isSearchable={true}
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
                            setPanelObj(defaultPanelObj);
                            closeCreatePanelModel();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing}
                        onClick={() => {
                            savePanelDetails();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreatePanel;
