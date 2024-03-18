import React, { useState } from 'react';
import { Modal } from 'reactstrap';

import { Button } from '../../../../sharedComponents/button';
import Typography from '../../../../sharedComponents/typography';

const SpaceConfiguration = (props) => {
    const { showSpaceConfigModal = false, closeSpaceConfigModal, selectedSpaceObj = {} } = props;

    const [activeTab, setActiveTab] = useState('metrics');

    return (
        <Modal isOpen={showSpaceConfigModal} className="breaker-modal-fullscreen">
            <div className="passive-header-wrapper d-flex justify-content-between" style={{ background: 'none' }}>
                <div className="d-flex flex-column justify-content-between">
                    <Typography.Header size={Typography.Sizes.md}>{selectedSpaceObj?.space_name}</Typography.Header>
                    <div className="d-flex justify-content-start mouse-pointer ">
                        <Typography.Subheader
                            size={Typography.Sizes.md}
                            className={`typography-wrapper mr-4 ${activeTab === 'metrics' ? 'active-tab-style' : ''}`}
                            onClick={() => setActiveTab('metrics')}>
                            {`Metrics`}
                        </Typography.Subheader>
                        <Typography.Subheader
                            size={Typography.Sizes.md}
                            className={`typography-wrapper ${activeTab === 'configure' ? 'active-tab-style' : ''}`}
                            onClick={() => setActiveTab('configure')}>
                            {`Configure`}
                        </Typography.Subheader>
                    </div>
                </div>
                <div className="d-flex">
                    <div>
                        <Button
                            label={activeTab === 'configure' ? 'Cancel' : 'Close'}
                            size={Button.Sizes.md}
                            type={Button.Type.secondaryGrey}
                            onClick={closeSpaceConfigModal}
                        />
                    </div>

                    {activeTab === 'configure' && (
                        <div>
                            <Button label={'Save'} size={Button.Sizes.md} type={Button.Type.primary} className="ml-2" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-default">
                {/* Metrics  */}
                {activeTab === 'metrics' && <div>Metrics</div>}

                {/* Edit Breakers */}
                {activeTab === 'configure' && <div>Configure</div>}
            </div>
        </Modal>
    );
};

export default SpaceConfiguration;
