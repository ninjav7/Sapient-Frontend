import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import { Notification } from '../../../sharedComponents/notification';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import LayoutElements from '../../../sharedComponents/layoutElements/LayoutElements';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

import { compareObjData } from '../../../helpers/helpers';
import { addSpaceService, updateSpaceService, deleteSpaceService, getAllSpaceTypes } from './services';

import DeleteLayout from './DeleteLayout';
import MoveLayout from './MoveLayout';
import { defaultDropdownSearch } from '../../../sharedComponents/form/select/helpers';
import ChangeLayout from './ChangeLayout';

const MoveSpaceLayout = (props) => {
    const {
        isModalOpen = false,
        openParentModal,
        closeModal,
        operationType,
        bldgId,
        fetchAllFloorData,
        fetchAllSpaceData,
        notifyUser,
        spaceObj = {},
        setSpaceObj,
        defaultObjVal = {},
        isSuperAdmin = false,
        canUserDelete = false,
        floorsList,
        spacesList,
        currentSpace,
        oldStack,
        newStack,
        setNewStack,
        confirmMove,
    } = props;

    const [rootObj, setRootObj] = useState({
        type: 'root',
        bldg_id: bldgId,
    });

    const defaultErrorObj = {
        name: null,
        type_id: null,
    };

    const [shouldMove, setShouldMove] = useState(false);
    const [isFetchingFloor, setFetchingFloor] = useState(false);
    const [isFetchingSpace, setFetchingSpace] = useState(false);
    const [newParent, setNewParent] = useState({});
    const allowMove = () => setShouldMove(true);
    const disableMove = () => setShouldMove(false);

    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [spaceTypes, setSpaceTypes] = useState([]);
    const [isProcessing, setProcessing] = useState(false);
    const [showMoveSpace, setShowMoveSpace] = useState(false);

    const closeMoveSpacePopup = () => {
        setShowMoveSpace(false);
        setNewStack(null);
    };

    const openMoveSpacePopup = (newStack) => {
        newStack && setNewStack(newStack);
        setShowMoveSpace(true);
    };

    const confirmMoveSpacePopup = async () => {
        confirmMove();
        setShowMoveSpace(false);
        closeModal();
        openParentModal();
    };

    // Change Parents of Space
    const [showChangeParents, setShowChangeParents] = useState(false);
    const closeChangeSpacePopup = () => setShowChangeParents(false);
    const openChangeSpacePopup = () => setShowChangeParents(true);

    const handleCreateSpace = async (space_obj, bldg_id) => {
        if (!bldg_id || !space_obj?.parents) return;

        let alertObj = Object.assign({}, errorObj);

        if (!space_obj?.name || space_obj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (!space_obj?.type_id || space_obj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type_id) {
            setProcessing(true);

            const params = `?building_id=${bldg_id}`;

            await addSpaceService(params, space_obj)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, `Space created successfully.`);
                        fetchAllFloorData(bldg_id);
                        fetchAllSpaceData(space_obj?.parents, bldg_id);
                    } else {
                        notifyUser(Notification.Types.error, response?.message);
                    }
                })
                .catch((err) => {
                    notifyUser(Notification.Types.error, `Failed to add Space.`);
                })
                .finally(() => {
                    setProcessing(false);
                    closeModal();
                    setSpaceObj({});
                    window.scroll(0, 0);
                });
        }
    };
    const onClickForAllItems = async ({ nativeHandler, data }) => {
        console.log(1);
        nativeHandler();
        if (data?.parent_building && data?.floor_id) {
            fetchAllSpaceData(data?.floor_id, data?.parent_building);
        }
    };

    const fetchEditSpace = async (defaultAction = true) => {
        setProcessing(true);

        const params = `?space_id=${spaceObj?._id}`;

        const fetches = [];

        const payload = {
            building_id: bldgId,
            name: spaceObj?.name,
            type_id: spaceObj?.type_id,
            parents: spaceObj?.new_parents,
            parent_space: spaceObj?.parent_space,
        };

        fetches.push(updateSpaceService(params, payload));

        if (defaultAction === false) {
            const parent_spaces = [];

            parent_spaces.push(spaceObj._id);

            for (let space of spacesList) {
                if (parent_spaces.includes(space?.parent_space)) {
                    const params = `?space_id=${space?._id}`;

                    const payload = {
                        building_id: bldgId,
                        name: space?.name,
                        type_id: space?.type_id,
                        parents: spaceObj?.new_parents,
                        parent_space: space?.parent_space,
                    };

                    fetches.push(updateSpaceService(params, payload));

                    parent_spaces.push(space?._id);
                }
            }
        }

        Promise.all(fetches)
            .then(([res]) => {
                const response = res?.data;
                if (response?.success) {
                    notifyUser(Notification.Types.success, `Space updated successfully.`);
                    fetchAllFloorData(bldgId);
                    fetchAllSpaceData(spaceObj?.parents, bldgId);
                } else {
                    notifyUser(Notification.Types.error, response?.message);
                }
            })
            .catch((err) => {
                notifyUser(Notification.Types.error, `Failed to update Space.`);
            })
            .finally(() => {
                setProcessing(false);
                closeModal();
                closeChangeSpacePopup();
                setSpaceObj({});
                window.scroll(0, 0);
            });
    };

    const handleEditSpace = () => {
        if (!bldgId || !spaceObj?._id) return;

        let alertObj = Object.assign({}, errorObj);

        if (!spaceObj?.name || spaceObj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (!spaceObj?.type_id || spaceObj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type && !alertObj.new_parents) {
            if (spaceObj?.new_parents) {
                closeModal();
                openChangeSpacePopup();
            } else {
                fetchEditSpace();
            }
        }
    };

    const fetchSpaceTypes = async () => {
        const params = `?ordered_by=name&sort_by=ace`;

        await getAllSpaceTypes(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) {
                        const mappedSpaceTypes = response?.data.map((el) => {
                            return {
                                label: el?.name,
                                value: el?.id,
                            };
                        });
                        setSpaceTypes(mappedSpaceTypes);
                    }
                }
            })
            .catch(() => {});
    };

    const floorsTypes = floorsList.map((el) => ({ label: el?.name, value: el?.floor_id }));

    const handleChange = (key, value) => {
        let obj = Object.assign({}, spaceObj);
        setErrorObj({ ...errorObj, [key]: null });
        obj[key] = value;
        setSpaceObj(obj);
    };

    const handleMoveModalClose = () => {
        closeMoveSpacePopup();
        openParentModal();
    };

    const handleChangeModalClose = () => {
        closeChangeSpacePopup();
        openParentModal();
    };

    const handleChangeModalSave = () => fetchEditSpace(false);

    useEffect(() => {
        if (isModalOpen) fetchSpaceTypes();
        if (!isModalOpen) setErrorObj(defaultErrorObj);
    }, [isModalOpen]);

    const ableToBeMoved = (space) => {
        if (spaceObj?._id === space?._id) return false;

        if (spaceObj?.parent_space) {
            if (spaceObj?.parent_space === space?._id) return false;
        } else {
            if ((spaceObj?.new_parents ? spaceObj?.new_parents : spaceObj?.parents) === space?.floor_id) return false;
        }

        return true;
    };

    const onMoveClick = (stack) => {
        console.log(stack);

        openMoveSpacePopup(stack);
    };

    return (
        <>
            <Modal show={isModalOpen} backdrop="static" keyboard={false} size="lg" centered>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Move Space Layout</Typography.Header>
                    <Typography.Body size={Typography.Sizes.md}>Current Space:{currentSpace.name}</Typography.Body>

                    <Brick sizeInRem={2} />

                    <LayoutElements
                        spaces={spacesList}
                        floors={floorsList}
                        buildingData={rootObj}
                        isLoadingLastColumn={isFetchingFloor || isFetchingSpace}
                        onClickEachChild={[onClickForAllItems]}
                        onColumnAdd={null}
                        onColumnNameEdit={null}
                        onItemEdit={null}
                        isMoveSpace={true}
                        initialStackThree={oldStack}
                        confirmMove={true}
                        ableToBeMoved={ableToBeMoved}
                        onMoveClick={onMoveClick}
                        shouldMove={shouldMove}
                        allowMove={allowMove}
                        disableMove={disableMove}
                    />

                    <Brick sizeInRem={canUserDelete || isSuperAdmin ? 1.5 : 2} />

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label={`Cancel`}
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                closeModal();
                                setSpaceObj({});
                                setErrorObj(defaultErrorObj);
                            }}
                        />
                    </div>
                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>

            <MoveLayout
                isModalOpen={showMoveSpace}
                onCancel={closeMoveSpacePopup}
                onSave={confirmMoveSpacePopup}
                newStack={newStack}
                oldStack={oldStack}
            />
        </>
    );
};

export default MoveSpaceLayout;
