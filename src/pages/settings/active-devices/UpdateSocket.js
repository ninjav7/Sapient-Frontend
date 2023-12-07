import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import { getEquipmentTypes } from './services';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { defaultDropdownSearch } from '../../../sharedComponents/form/select/helpers';

const UpdateSocket = ({
    showSocketModal,
    closeSocketModal,
    bldgId,
    selectedEquipType,
    selectedSensor,
    setSelectedSensor,
    linkSensorToEquipment,
    isUpdating,
    equipTypeError,
    setEquipTypeError,
}) => {
    const [equipTypeId, setEquipTypeId] = useState('');
    const [equipTypeData, setEquipTypeData] = useState([]);
    const [isFetechingData, setFetechingData] = useState(false);

    const fetchEquipmentTypeData = async () => {
        setFetechingData(true);
        const params = `?end_use=Plug&building_id=${bldgId}`;
        await getEquipmentTypes(params)
            .then((res) => {
                const response = res?.data?.data;
                const dataList = [];
                response.forEach((record) => {
                    let obj = {
                        label: record?.equipment_type,
                        value: record?.equipment_id,
                    };
                    dataList.push(obj);
                });
                setEquipTypeData(dataList);
                setFetechingData(false);
            })
            .catch(() => {
                setEquipTypeData([]);
                setFetechingData(false);
            });
    };

    useEffect(() => {
        if (showSocketModal) fetchEquipmentTypeData();
    }, [showSocketModal]);

    useEffect(() => {
        setEquipTypeId(selectedEquipType);
    }, [showSocketModal]);

    return (
        <Modal show={showSocketModal} onHide={closeSocketModal} backdrop="static" keyboard={false} centered>
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
                            options={equipTypeData}
                            currentValue={equipTypeData.filter((option) => option.value === equipTypeId)}
                            onChange={(e) => {
                                setEquipTypeId(e.value);
                                setEquipTypeError(null);
                            }}
                            isSearchable={true}
                            customSearchCallback={({ data, query }) => defaultDropdownSearch(data, query?.value)}
                            error={equipTypeError}
                        />
                    )}
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            closeSocketModal();
                            setEquipTypeId('');
                            setSelectedSensor('');
                        }}
                    />

                    <Button
                        label={isUpdating ? 'Updating...' : 'Update Equipment Type'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isUpdating}
                        onClick={() => {
                            linkSensorToEquipment(selectedSensor, selectedEquipType, equipTypeId);
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default UpdateSocket;
