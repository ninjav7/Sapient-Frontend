import React from 'react';
import { Row, Col, CardHeader, CardBody } from 'reactstrap';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import colorPalette from '../../../assets/scss/_colors.scss';
import DeletePassiveAlert from './DeletePassiveAlert';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';

const DeleteDevice = ({
    isLoading = false,
    showDeleteModal,
    showDeleteAlert,
    closeDeleteAlert,
    redirectToPassivePage,
    selectedPassiveDevice,
}) => {
    return (
        <>
            <Row>
                <Col lg={12}>
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
                                        label="Delete Smart Meter"
                                        size={Button.Sizes.md}
                                        type={Button.Type.primaryDistructive}
                                        onClick={showDeleteAlert}
                                        icon={<DeleteSVG />}
                                    />
                                )}
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <DeletePassiveAlert
                isDeleteDeviceModalOpen={showDeleteModal}
                closeDeleteDeviceModal={closeDeleteAlert}
                nextActionAfterDeletion={redirectToPassivePage}
                selectedPassiveDevice={selectedPassiveDevice}
            />
        </>
    );
};

export default DeleteDevice;
