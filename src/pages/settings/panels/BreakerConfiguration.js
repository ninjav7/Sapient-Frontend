import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { BaseUrl, listSensor, updateBreakers, generalPassiveDevices, searchDevices } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { Handle } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import { BuildingStore } from '../../../store/BuildingStore';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import Typography from '../../../sharedComponents/typography';
import UnlinkBreaker from './UnlinkBreaker';
import { getBreakerDeleted, getSensorsList, resetAllBreakers } from './services';
import DeleteBreaker from './DeleteBreaker';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Tabs from '../../../sharedComponents/tabs/Tabs';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plusBlue.svg';
import Radio from '../../../sharedComponents/form/radio/Radio';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';
import { voltsOption } from './utils';
import './breaker-config-styles.scss';

import Form from 'react-bootstrap/Form';
import Skeleton from 'react-loading-skeleton';
import AsyncSelect from 'react-select/async';
import Select from '../../../sharedComponents/form/select';

const BreakerConfiguration = ({
    showBreakerConfigModal,
    openBreakerConfigModal,
    closeBreakerConfigModal,
    selectedBreakerObj,
    breakersList,
    panelObj,
}) => {
    const [activeTab, setActiveTab] = useState('edit-breaker');

    const [parentBreakerObj, setParentBreakerObj] = useState({});
    const [firstBreakerObj, setFirstBreakerObj] = useState({});
    const [secondBreakerObj, setSecondBreakerObj] = useState({});
    const [thirdBreakerObj, setThirdBreakerObj] = useState({});

    useEffect(() => {
        if (!selectedBreakerObj) return;
        setFirstBreakerObj(selectedBreakerObj);
        setParentBreakerObj(selectedBreakerObj);

        if (selectedBreakerObj?.breaker_type === 2) {
            let obj = breakersList.find((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(obj);
        }

        if (selectedBreakerObj?.breaker_type === 3) {
            let childbreakers = breakersList.filter((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(childbreakers[0]);
            setThirdBreakerObj(childbreakers[1]);
        }
    }, [selectedBreakerObj]);

    return (
        <React.Fragment>
            <Modal show={showBreakerConfigModal} onHide={closeBreakerConfigModal} size="xl" centered>
                <div>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm}>
                                {panelObj?.panel_name}
                                {firstBreakerObj?.device_name === '' ? '' : `> ${firstBreakerObj?.device_name}`}
                            </Typography.Subheader>
                            <Typography.Header size={Typography.Sizes.md}>
                                {firstBreakerObj?.breaker_type === 1 && `Breaker ${firstBreakerObj?.breaker_number}`}
                                {firstBreakerObj?.breaker_type === 2 &&
                                    `Breakers ${firstBreakerObj?.breaker_number}, ${secondBreakerObj?.breaker_number}`}
                                {firstBreakerObj?.breaker_type === 3 &&
                                    `Breakers ${firstBreakerObj?.breaker_number}, ${secondBreakerObj?.breaker_number}, ${thirdBreakerObj?.breaker_number}`}
                            </Typography.Header>
                            <div className="d-flex justify-content-start mouse-pointer ">
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper mr-4 ${
                                        activeTab === 'edit-breaker' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('edit-breaker')}>
                                    {`Edit Breaker${firstBreakerObj?.breaker_type !== 1 ? `(s)` : ''}`}
                                </Typography.Subheader>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper ${
                                        activeTab === 'metrics' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('metrics')}>
                                    {`Metrics`}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    // onClick={closeModalWithoutSave}
                                />
                            </div>

                            <div>
                                <Button
                                    label="Save"
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    // onClick={handleEquipmentUpdate}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-default">
                        {/* Edit Breakers */}
                        {activeTab === 'edit-breaker' && (
                            <>
                                <div className="breaker-basic-config">
                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Phase</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Phase"
                                            labelSize={Typography.Sizes.md}
                                            value={1}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Rated Amps</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Amperage"
                                            labelSize={Typography.Sizes.md}
                                            value={100}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <Brick sizeInRem={0.25} />
                                        <Select placeholder="Select Volts" options={voltsOption} isSearchable={true} />
                                    </div>
                                </div>

                                <Brick sizeInRem={1} />
                                <hr />
                                <Brick sizeInRem={1} />

                                <div className="breaker-main-config">
                                    <div className="w-100">
                                        {/* Breaker 1 */}
                                        <div>
                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                Breaker 1
                                            </Typography.Subheader>
                                            <Brick sizeInRem={1} />
                                            <div className="d-flex justify-content-between">
                                                <div className="w-100 mr-4">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Device ID
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Enter Device ID Name"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Sensor #
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Select Sensor Number"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                            </div>
                                            <Brick sizeInRem={0.25} />
                                            <hr />
                                            <Brick sizeInRem={0.25} />
                                        </div>

                                        {/* Breaker 2 */}
                                        <div>
                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                Breaker 2
                                            </Typography.Subheader>
                                            <Brick sizeInRem={1} />
                                            <div className="d-flex justify-content-between">
                                                <div className="w-100 mr-4">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Device ID
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Enter Device ID Name"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Sensor #
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Select Sensor Number"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                            </div>
                                            <Brick sizeInRem={0.25} />
                                            <hr />
                                            <Brick sizeInRem={0.25} />
                                        </div>

                                        {/* Breaker 3 */}
                                        <div>
                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                Breaker 3
                                            </Typography.Subheader>
                                            <Brick sizeInRem={1} />
                                            <div className="d-flex justify-content-between">
                                                <div className="w-100 mr-4">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Device ID
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Enter Device ID Name"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Sensor #
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <InputTooltip
                                                        placeholder="Select Sensor Number"
                                                        // onChange={(e) => {
                                                        //     handleChange('name', e.target.value);
                                                        //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                        // }}
                                                        // value={equipmentObj?.name}
                                                        labelSize={Typography.Sizes.md}
                                                        // error={equipmentErrors?.name}
                                                    />
                                                </div>
                                            </div>
                                            <Brick sizeInRem={0.25} />
                                            <hr />
                                            <Brick sizeInRem={0.25} />
                                        </div>
                                    </div>
                                    <div className="w-100">
                                        <Tabs type={Tabs.Types.subsection} tabCustomStyle="p-2">
                                            <Tabs.Item eventKey="equip" title="Equipment">
                                                <div className="p-default">
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-1" checked={true} />
                                                            </div>
                                                            <div className="w-100">
                                                                <Select
                                                                    id="exampleSelect"
                                                                    placeholder="Select Equipment"
                                                                    name="select"
                                                                    isSearchable={true}
                                                                    // options={equipmentsList}
                                                                    // currentValue={equipmentsList.filter(
                                                                    //     (option) =>
                                                                    //         (option.value === option.value) ===
                                                                    //         breakerData.equipment_link[0]
                                                                    // )}
                                                                    className="basic-single"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Brick sizeInRem={0.65} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-2" />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unlabelled
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-3" />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unwired Breaker
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-4" />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Blank
                                                            </Typography.Body>
                                                        </div>
                                                    </div>
                                                    <Brick sizeInRem={2} />
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Notes
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Textarea
                                                            type="textarea"
                                                            rows="4"
                                                            placeholder="Enter Notes here"
                                                            // value={equipData?.note}
                                                            // onChange={(e) => {
                                                            //     handleDataChange('note', e.target.value);
                                                            // }}
                                                            inputClassName="pt-2"
                                                            // disabled={
                                                            //     !(
                                                            //         userPermission?.user_role === 'admin' ||
                                                            //         userPermission?.permissions?.permissions
                                                            //             ?.account_buildings_permission?.edit
                                                            //     )
                                                            // }
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Item>

                                            {/* Create Equipment  */}
                                            <Tabs.Item eventKey="create-equip" title="Create Equipment">
                                                <div className="p-default">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="w-100 mr-4">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Name
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                placeholder="Enter Equipment Name"
                                                                // onChange={(e) => {
                                                                //     handleChange('name', e.target.value);
                                                                //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                                // }}
                                                                // value={equipmentObj?.name}
                                                                labelSize={Typography.Sizes.md}
                                                                // error={equipmentErrors?.name}
                                                            />
                                                        </div>
                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Quanity
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                placeholder="Enter Equipment Quanity"
                                                                // onChange={(e) => {
                                                                //     handleChange('name', e.target.value);
                                                                //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                                // }}
                                                                // value={equipmentObj?.name}
                                                                labelSize={Typography.Sizes.md}
                                                                // error={equipmentErrors?.name}
                                                            />
                                                        </div>
                                                    </div>

                                                    <Brick sizeInRem={1.5} />

                                                    <div className="d-flex justify-content-between">
                                                        <div className="w-100 mr-4">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Equipment Type
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <Select
                                                                id="exampleSelect"
                                                                placeholder="Select Equipment Type"
                                                                name="select"
                                                                isSearchable={true}
                                                                // currentValue={equipmentTypeDataAll.filter(
                                                                //     (option) =>
                                                                //         option.value === equipmentObj?.equipment_type
                                                                // )}
                                                                // options={equipmentTypeDataAll}
                                                                // onChange={(e) => {
                                                                //     handleChange('equipment_type', e.value);
                                                                // }}
                                                                // error={equipmentErrors?.equipment_type}
                                                                className="basic-single"
                                                            />
                                                        </div>

                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                End Use Category
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <Select
                                                                id="endUseSelect"
                                                                placeholder="Select End Use"
                                                                name="select"
                                                                isSearchable={true}
                                                                // currentValue={endUseDataNow.filter(
                                                                //     (option) => option.value === equipmentObj?.end_use
                                                                // )}
                                                                // options={endUseDataNow}
                                                                // onChange={(e) => {
                                                                //     handleChange('end_use', e.value);
                                                                //     setEquipmentErrors({
                                                                //         ...equipmentErrors,
                                                                //         end_use: null,
                                                                //     });
                                                                // }}
                                                                // error={equipmentErrors?.end_use}
                                                                className="basic-single"
                                                            />
                                                        </div>
                                                    </div>

                                                    <Brick sizeInRem={1.5} />

                                                    <div>
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Location
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Equipment Location"
                                                            name="select"
                                                            isSearchable={true}
                                                            // currentValue={locationDataNow.filter(
                                                            //     (option) => option.value === equipmentObj?.space_id
                                                            // )}
                                                            // options={locationDataNow}
                                                            // onChange={(e) => {
                                                            //     handleChange('space_id', e.value);
                                                            // }}
                                                            className="basic-single"
                                                        />
                                                        <Brick sizeInRem={0.25} />
                                                        <Typography.Body size={Typography.Sizes.sm}>
                                                            Select Equipment Location
                                                        </Typography.Body>
                                                    </div>

                                                    <Brick sizeInRem={1.5} />

                                                    <div className="d-flex justify-content-end">
                                                        <Button
                                                            label={'Add Equipment'}
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.secondary}
                                                            icon={<PlusSVG className="plus-icon-style" />}
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Item>
                                        </Tabs>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Metrics  */}
                        {activeTab === 'metrics' && <div>Edit Metrices</div>}
                    </div>
                </div>
            </Modal>

            {/* <UnlinkBreaker
                showUnlinkAlert={showUnlinkAlert}
                handleUnlinkAlertClose={handleUnlinkAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                isResetting={isResetting}
                unLinkCurrentBreaker={unLinkCurrentBreaker}
            />

            <DeleteBreaker
                showDeleteAlert={showDeleteAlert}
                handleDeleteAlertClose={handleDeleteAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                isDeleting={isDeleting}
                deleteCurrentBreaker={deleteCurrentBreaker}
            /> */}
        </React.Fragment>
    );
};

export default BreakerConfiguration;
