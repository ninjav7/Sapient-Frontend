import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { saveEquipTypeData, getEndUseData } from './services';
import Select from '../../../sharedComponents/form/select';
import { UserStore } from '../../../store/UserStore';
import colorPalette from '../../../assets/scss/_colors.scss';

const CreateCustomer = ({ isAddCustomerOpen, closeAddCustomerModal }) => {
    const defaultCustomerObj = {
        name: '',
    };

    const [customerData, setCustomerData] = useState(defaultCustomerObj);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, customerData);
        obj[key] = value;
        setCustomerData(obj);
    };

    return (
        <Modal show={isAddCustomerOpen} onHide={closeAddCustomerModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Customer</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.md}>
                    Customer Name
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>
                <Brick sizeInRem={0.25} />
                <InputTooltip
                    placeholder="Enter Customer Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value.trim());
                    }}
                    //error={equipTypeNameError}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={1.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={closeAddCustomerModal}
                    />

                    <Button
                        label={isProcessing ? 'Adding...' : 'Add'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={() => {}}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreateCustomer;
