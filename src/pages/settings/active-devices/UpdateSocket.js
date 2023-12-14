import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TagsInput } from 'react-tag-input-component';
import Skeleton from 'react-loading-skeleton';

import { UserStore } from '../../../store/UserStore';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { getEquipmentTypes, getSensorEquipmentLinked } from './services';
import { updateEquipmentDetails } from '../../chartModal/services';

import { compareObjData } from '../../../helpers/helpers';
import { defaultDropdownSearch } from '../../../sharedComponents/form/select/helpers';

import 'react-loading-skeleton/dist/skeleton.css';

const UpdateSocket = ({
    isSocketModalOpen,
    closeSocketModal,
    bldgId,
    selectedSocketObj = {},
    fetchActiveSensorsList,
}) => {
    const [socketObj, setSocketObj] = useState({});
    const [isProcessing, setProcessing] = useState(false);

    const [equipTypesList, setEquipTypesList] = useState([]);
    const [isFetechingData, setFetechingData] = useState(false);

    const fetchEquipmentTypeData = async () => {
        setFetechingData(true);
        const params = `?end_use=Plug&building_id=${bldgId}`;

        await getEquipmentTypes(params)
            .then((res) => {
                const response = res?.data?.data;
                const dataList = [];
                response &&
                    response.length !== 0 &&
                    response.forEach((record) => {
                        dataList.push({
                            label: record?.equipment_type,
                            value: record?.equipment_id,
                        });
                    });
                setEquipTypesList(dataList);
            })
            .catch(() => {})
            .finally(() => {
                setFetechingData(false);
            });
    };

    const updateNotification = (message, type) => {
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = message;
            s.notificationType = type;
        });
    };

    const handleEquipmentUpdate = async (socket_obj, equip_id) => {
        if (!equip_id) return;

        setProcessing(true);
        const newParams = `?equipment_id=${equip_id}`;
        const payload = {
            name: socket_obj?.equipment,
            tag: socket_obj?.equipment_tags ?? [],
        };

        await updateEquipmentDetails(newParams, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    updateNotification('Smart Plug socket updated successfully!', 'success');
                } else {
                    updateNotification('Failed to update socket configuration.', 'error');
                }
            })
            .catch((err) => {
                updateNotification('Unable to update socket configuration due to Internal Server Error.', 'error');
            })
            .finally(() => {
                setProcessing(false);
                closeSocketModal();
                fetchActiveSensorsList();
            });
    };

    const handleSensorEquipmentLinking = async (socket_obj) => {
        if (!socket_obj?.id) return;

        setProcessing(true);
        const params = `?sensor_id=${socket_obj?.id}&equipment_type_id=${socket_obj?.equipment_type_id}`;

        await getSensorEquipmentLinked(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    response?.id && handleEquipmentUpdate(socket_obj, response?.id);
                } else {
                    setProcessing(false);
                    closeSocketModal();
                    updateNotification('Failed to update socket configuration.', 'error');
                    fetchActiveSensorsList();
                }
            })
            .catch((err) => {
                setProcessing(false);
                closeSocketModal();
                updateNotification('Unable to update socket configuration due to Internal Server Error.', 'error');
                fetchActiveSensorsList();
            });
    };

    const handleOnSocketUpdate = (newSocketObj, oldSocketObj) => {
        const { equipment_id, equipment, equipment_type_id, equipment_tags: tags } = newSocketObj;
        const {
            equipment: oldEquipment,
            equipment_tags: oldTags,
            equipment_type_id: oldEquipmentTypeId,
        } = oldSocketObj;

        if (equipment_type_id !== oldEquipmentTypeId) {
            handleSensorEquipmentLinking(newSocketObj);
        } else if (equipment !== oldEquipment || JSON.stringify(tags) !== JSON.stringify(oldTags)) {
            handleEquipmentUpdate(newSocketObj, equipment_id);
        }
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, socketObj);
        obj[key] = value;
        setSocketObj(obj);
    };

    useEffect(() => {
        if (selectedSocketObj?.id) setSocketObj(selectedSocketObj);
    }, [selectedSocketObj]);

    useEffect(() => {
        isSocketModalOpen ? fetchEquipmentTypeData() : setSocketObj({});
    }, [isSocketModalOpen]);

    return (
        <Modal show={isSocketModalOpen} onHide={closeSocketModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Edit Socket</Typography.Header>

                <Brick sizeInRem={2} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Equipment Type</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    {isFetechingData ? (
                        <Skeleton count={1} height={35} />
                    ) : (
                        <Select
                            placeholder="Select Equipment Type"
                            options={equipTypesList}
                            currentValue={equipTypesList.filter(
                                (option) => option.value === socketObj?.equipment_type_id
                            )}
                            onChange={(e) => {
                                handleChange('equipment_type_id', e.value);
                            }}
                            isSearchable={true}
                            customSearchCallback={({ data, query }) => defaultDropdownSearch(data, query?.value)}
                        />
                    )}
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Equipment Name</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter Equipment Name"
                        labelSize={Typography.Sizes.md}
                        value={socketObj?.equipment}
                        onChange={(e) => {
                            handleChange('equipment', e.target.value);
                        }}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Tags</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <TagsInput
                        placeHolder={
                            socketObj?.equipment_tags && socketObj?.equipment_tags.length !== 0 ? '' : 'Enter Tags'
                        }
                        value={socketObj?.equipment_tags ? socketObj?.equipment_tags : []}
                        onChange={(value) => {
                            handleChange('equipment_tags', value);
                        }}
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={closeSocketModal}
                    />

                    <Button
                        label={isProcessing ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        onClick={() => {
                            handleOnSocketUpdate(socketObj, selectedSocketObj);
                        }}
                        disabled={isProcessing || compareObjData(socketObj, selectedSocketObj)}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default UpdateSocket;
