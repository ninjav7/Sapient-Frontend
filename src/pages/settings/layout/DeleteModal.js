import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { removeFloor, removeSpace } from './services';
import './style.css';

const DeleteModal = (props) => {
    const [loading, setLoading] = useState(false);

    const DeleteFloorsFunc = async () => {
        setLoading(true);
        let params = `/${props?.currentFloorId}/`;
        await removeFloor(params)
            .then((res) => {
                const responseData = res?.data;
                setLoading(false);
                props.getFloorsFunc();
                props.onHide();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const DeleteSpacesFunc = async () => {
        setLoading(true);
        let params = `?space_id=${props?.currentSpaceId}`;
        await removeSpace(params)
            .then((res) => {
                const responseData = res?.data;
                setLoading(false);
                props.getFloorsFunc();
                props.onClickForAllItems(props.selectedData);
                props.onHide();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Modal {...props} centered dialogClassName="floor-space-container-style">
                <div className="p-4">
                    {props?.modalType === 'floor' ? (
                        <Typography.Header size={Typography.Sizes.lg}>Delete Floor</Typography.Header>
                    ) : props?.modalType === 'spaces' ? (
                        <Typography.Header size={Typography.Sizes.lg}>Delete Spaces</Typography.Header>
                    ) : null}
                    <Brick sizeInRem={2} />
                    <div>
                        {props?.modalType === 'floor' ? (
                            <Typography.Body size={Typography.Sizes.md}>
                                Are you sure you want to delete the Floor and the Spaces it contains?
                            </Typography.Body>
                        ) : props?.modalType === 'spaces' ? (
                            <Typography.Body size={Typography.Sizes.md}>
                                Are you sure you want to delete the Space and the Spaces it contains?
                            </Typography.Body>
                        ) : null}
                    </div>
                    <Brick sizeInRem={2.5} />

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="btnstyle"
                            onClick={props.onHide}
                        />

                        <Button
                            label={loading ? 'Deleting....' : 'Delete'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primaryDistructive}
                            className="btnstyle"
                            disabled={loading}
                            onClick={() => {
                                props?.modalType === 'floor' ? DeleteFloorsFunc() : DeleteSpacesFunc();
                            }}
                        />
                    </div>

                    <Brick sizeInRem={1} />
                </div>
            </Modal>
        </>
    );
};

export default DeleteModal;
