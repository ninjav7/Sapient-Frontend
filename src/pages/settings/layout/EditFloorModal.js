import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Modal from 'react-bootstrap/Modal';
import { closedEditFloorModal } from '../../../store/globalState';
import { BuildingStore } from '../../../store/BuildingStore';
import { floorIdState } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Select from '../../../sharedComponents/form/select';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { addSpace, addFloors, fetchSpaceTypes, updateSpaces, updateFloors } from './services';
import './style.css';

const EditFloorModal = (props) => {
    const { handleModalClose, setModalShow } = props;

    const [loading, setLoading] = useState(false);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // API Body
    const [apiBody, setApiBody] = useState({ parent_building: bldgId });
    const [floorsName, setFloorName] = useState(props.floorName);
    const [floor, setFloor] = useState([]);
    const [spaceName, setSpaceName] = useState('');
    const [typeName, setTypeName] = useState('Room');
    const [floorModal, setFloorModal] = useAtom(closedEditFloorModal);
    const [floorid] = useAtom(floorIdState);
    const [floorNameApi, setFloorNameApi] = useState();
    const [spaceBody, setSpaceBody] = useState({
        building_id: bldgId,
    });

    useEffect(() => {
        if (props.currentFloorId !== '' && props?.parentSpace !== '') {
            setSpaceBody({ ...spaceBody, parents: props.currentFloorId, parent_space: props?.parentSpace });
        } else if (props.currentFloorId !== '') {
            setSpaceBody({ ...spaceBody, parents: props.currentFloorId });
        }
    }, [props.currentFloorId, props?.parentSpace]);

    useEffect(() => {
        setFloorName(props.floorName);
    }, [props.floorName]);
    useEffect(() => {
        setSpaceName(props.spaceName);
    }, [props.spaceName]);

    useEffect(() => {
        setTypeName(props.typeId);
    }, [props.typeId]);
    useEffect(() => {
        setFloorNameApi({ name: floorsName });
    }, [floorsName]);

    useEffect(() => {
        if (props.modalType != 'spaces') return;
        fetchingSpaceTypes();
    }, [props.modalType]);

    const fetchingSpaceTypes = async () => {
        let params = `?building_id=${bldgId}`;
        await fetchSpaceTypes(params)
            .then((res) => {
                const responseData = res?.data;
                let response = responseData.data?.[0]?.generic_spacetypes;
                response.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                let arr = [];
                response.map((el) => {
                    arr.push({ label: el?.name, value: el?.id });
                });
                setFloor(arr);
            })
            .catch(() => {});
    };

    const createFloorsFunc = async () => {
        setLoading(true);

        let params = `?building_id=${bldgId}`;
        await addFloors(params, apiBody)
            .then((res) => {
                handleModalClose();
                setLoading(false);
                setFloorModal(true);
                props.getFloorsFunc();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const updateFloorsFunc = async () => {
        setLoading(true);

        const params = `?floor_id=${props?.currentFloorId}`;
        await updateFloors(params, floorNameApi)
            .then((res) => {
                handleModalClose();
                setLoading(false);
                setFloorModal(true);
                props.getFloorsFunc();
            })
            .catch(() => {
                setLoading(false);
            });
    };
    const createSpacesAPI = async () => {
        setLoading(true);
        let params = `?building_id=${bldgId}`;
        await addSpace(params, spaceBody)
            .then((res) => {
                setLoading(false);
                handleModalClose();
                setFloorModal(true);
                props.getFloorsFunc();
                props.onClickForAllItems(props.selectedData);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    const updateSpacesFunc = async () => {
        setLoading(true);
        const params = `?space_id=${props?.currentSpaceId}`;
        await updateSpaces(params, spaceBody)
            .then((res) => {
                handleModalClose();
                setLoading(false);
                setFloorModal(true);
                props.getFloorsFunc();
                props.onClickForAllItems(props.selectedData);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Modal backdrop="static" keyboard={false} size="md" centered {...props}>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>
                        {props.editFloor && props?.modalType === 'floor' ? (
                            <Typography.Header size={Typography.Sizes.lg}>Edit Floor</Typography.Header>
                        ) : !props.editFloor && props?.modalType === 'floor' ? (
                            <Typography.Header size={Typography.Sizes.lg}>Add Floor</Typography.Header>
                        ) : props?.modalType === 'spaces' && !props.editFloor ? (
                            <Typography.Header size={Typography.Sizes.lg}>Add Spaces</Typography.Header>
                        ) : props?.modalType === 'spaces' && props.editFloor ? (
                            <Typography.Header size={Typography.Sizes.lg}>Edit Spaces</Typography.Header>
                        ) : null}
                    </Typography.Header>

                    <Brick sizeInRem={2} />

                    {props.editFloor && props.modalType === 'floor' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Enter Name"
                                    onChange={(e) => {
                                        setApiBody({ ...apiBody, name: e.target.value });
                                        setFloorName(e.target.value);
                                    }}
                                    labelSize={Typography.Sizes.md}
                                    value={floorsName}
                                />
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Select Type"
                                    labelSize={Typography.Sizes.md}
                                    disabled={true}
                                    value={'Floor'}
                                />
                                <Brick sizeInRem={0.25} />
                                <Typography.Body size={Typography.Sizes.sm}>
                                    Only Floors can be at the building root
                                </Typography.Body>
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div className="d-flex align-items-center">
                                <Button
                                    label="Delete Floor"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryDistructive}
                                    onClick={() => {
                                        setModalShow(false);
                                        props.handleDeleteAlertShow();
                                    }}
                                    icon={<DeleteSVG />}
                                />
                            </div>
                        </>
                    ) : !props.editFloor && props.modalType === 'floor' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Enter Name"
                                    labelSize={Typography.Sizes.md}
                                    value={floorsName}
                                    onChange={(e) => {
                                        setApiBody({ ...apiBody, name: e.target.value });
                                        setFloorName(e.target.value);
                                    }}
                                />
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Enter Name"
                                    labelSize={Typography.Sizes.md}
                                    disabled={true}
                                    value={'Floor'}
                                />
                                <Brick sizeInRem={0.25} />
                                <Typography.Body size={Typography.Sizes.sm}>
                                    {`Only Floors can be at the building root`}
                                </Typography.Body>
                            </div>
                        </>
                    ) : props.modalType === 'spaces' && !props.editFloor ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Enter Name"
                                    onChange={(e) => {
                                        setSpaceName(e.target.value);
                                        setSpaceBody({ ...spaceBody, name: e.target.value });
                                    }}
                                    labelSize={Typography.Sizes.md}
                                />
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <Select
                                    name="select"
                                    placeholder="Select Type"
                                    options={floor}
                                    onChange={(e) => {
                                        setTypeName(e.value);
                                        setSpaceBody({ ...spaceBody, type_id: e.value });
                                    }}
                                    isSearchable={true}
                                />
                            </div>

                            <Brick sizeInRem={0.5} />
                        </>
                    ) : props.editFloor && props.modalType === 'spaces' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <InputTooltip
                                    placeholder="Enter Name"
                                    labelSize={Typography.Sizes.md}
                                    value={spaceName}
                                    onChange={(e) => {
                                        setSpaceName(e.target.value);
                                        setSpaceBody({ ...spaceBody, name: e.target.value });
                                    }}
                                />
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <Select
                                    name="select"
                                    placeholder="Select Type"
                                    defaultValue={typeName}
                                    options={floor}
                                    onChange={(e) => {
                                        setTypeName(e.value);
                                        setSpaceBody({ ...spaceBody, type_id: e.value });
                                    }}
                                    isSearchable={true}
                                />
                            </div>

                            <Brick sizeInRem={1.25} />

                            <div className="d-flex align-items-center">
                                <Button
                                    label="Delete Spaces"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryDistructive}
                                    onClick={() => {
                                        setModalShow(false);
                                        props.handleDeleteAlertShow();
                                    }}
                                    icon={<DeleteSVG />}
                                />
                            </div>
                        </>
                    ) : null}

                    <Brick sizeInRem={1.5} />

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={handleModalClose}
                        />

                        <Button
                            label={loading ? 'Saving...' : 'Save'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            className="w-100"
                            disabled={loading}
                            onClick={() => {
                                if (props.editFloor && props?.modalType === 'floor') {
                                    updateFloorsFunc();
                                }
                                if (!props.editFloor && props?.modalType === 'floor') {
                                    createFloorsFunc();
                                }
                                if (!props.editFloor && props?.modalType === 'spaces') {
                                    createSpacesAPI();
                                }
                                if (props.editFloor && props?.modalType === 'spaces') {
                                    updateSpacesFunc();
                                }
                            }}
                        />
                    </div>

                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>
        </>
    );
};

export default EditFloorModal;
