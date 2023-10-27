import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

import { UserStore } from '../../../store/UserStore';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { updatePanelDetails } from './services';

import { voltsOption } from './utils';
import { compareObjData } from '../../../helpers/helpers';

const PanelConfiguration = (props) => {
    const {
        showPanelConfigModal = false,
        closePanelConfigModal,
        panelObj,
        bldgId,
        fetchSinglePanelData,
        fetchBreakersData,
    } = props;

    const [panelData, setPanelData] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePanelUpdate = async () => {
        if (!panelData?.panel_id) return;

        setIsProcessing(true);

        const params = `?panel_id=${panelData?.panel_id}`;
        let payload = {};

        if (panelObj?.rated_amps !== panelData?.rated_amps) payload.rated_amps = panelData?.rated_amps;
        if (panelObj?.voltage !== panelData?.voltage) payload.voltage = panelData?.voltage;

        await updatePanelDetails(params, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Panel configuration updated successfully.';
                        s.notificationType = 'success';
                    });
                    fetchSinglePanelData(panelData?.panel_id, bldgId);
                    fetchBreakersData(panelData?.panel_id, bldgId);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Failed to update Panel configuration due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to update Panel configuration due to Internal Server Error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setIsProcessing(false);
                setPanelData({});
                closePanelConfigModal();
            });
    };

    useEffect(() => {
        if (showPanelConfigModal && panelObj?.panel_id) setPanelData(panelObj);
    }, [showPanelConfigModal]);

    return (
        <Modal show={showPanelConfigModal} onHide={closePanelConfigModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Update Panel`}</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Rated Amps"
                    type="number"
                    min={0}
                    placeholder="Enter Amperage"
                    onChange={(e) => {
                        setPanelData({ ...panelData, rated_amps: +e.target.value });
                    }}
                    labelSize={Typography.Sizes.md}
                    value={panelData?.rated_amps}
                />

                <Brick sizeInRem={1.5} />

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Volts"
                        options={voltsOption}
                        currentValue={voltsOption.filter((option) => option.value === panelData?.voltage)}
                        onChange={(e) => {
                            setPanelData({ ...panelData, voltage: e.value });
                        }}
                        isSearchable={false}
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
                            closePanelConfigModal();
                            setPanelData({});
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={compareObjData(panelObj, panelData) || isProcessing}
                        onClick={handlePanelUpdate}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default PanelConfiguration;
