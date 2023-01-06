import React from 'react';
import { Row, Col, CardHeader, CardBody } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import Brick from '../../../sharedComponents/brick';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';

const DeletePanel = ({
    isDeleting,
    isLoading = false,
    showDeletePanelAlert,
    handleDeletePanelAlertShow,
    handleDeletePanelAlertClose,
    deletePanel,
}) => {
    return (
        <>
            <Row>
                <Col lg={10}>
                    <div className="custom-card">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Danger Zone
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div>
                                {isLoading ? (
                                    <Skeleton count={1} height={40} width={125} />
                                ) : (
                                    <Button
                                        label="Delete Panel"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryDistructive}
                                        onClick={handleDeletePanelAlertShow}
                                        icon={<DeleteSVG />}
                                    />
                                )}
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Modal
                show={showDeletePanelAlert}
                onHide={handleDeletePanelAlertClose}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Delete Panel</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        Are you sure you want to delete the Panel and the Panel Inputs it contains?
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={handleDeletePanelAlertClose}
                    />
                    <Button
                        label={isDeleting ? 'Deleting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        disabled={isDeleting}
                        onClick={deletePanel}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeletePanel;
