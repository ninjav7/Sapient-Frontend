import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { UserStore } from '../../../store/UserStore';
import { updatePanelDetails } from './services';

const PanelConfiguration = (props) => {
    const { showPanelConfigModal = false, closePanelConfigModal, panelObj, bldgId, fetchSinglePanelData } = props;

    const [panelData, setPanelData] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePanelUpdate = async () => {
        if (!panelData?.panel_id) return;

        setIsProcessing(true);
        const params = `?panel_id=${panelData?.panel_id}`;

        await updatePanelDetails(params, { rated_amps: panelData?.rated_amps })
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Rated Amps for Panel updated successfully.';
                        s.notificationType = 'success';
                    });
                    fetchSinglePanelData(panelData?.panel_id, bldgId);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Failed to update Rated Amps for Panel due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to update Rated Amps for Panel due to Internal Server Error.';
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
                        disabled={panelObj?.rated_amps === panelData?.rated_amps}
                        onClick={handlePanelUpdate}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default PanelConfiguration;
