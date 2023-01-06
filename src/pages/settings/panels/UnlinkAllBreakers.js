import React from 'react';
import { CardHeader, CardBody } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as UnlinkOldSVG } from '../../../assets/icon/panels/unlink_old.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';

const UnlinkAllBreakers = ({
    isResetting,
    isLoading,
    showUnlinkAlert,
    handleUnlinkAlertShow,
    handleUnlinkAlertClose,
    unLinkAllBreakers,
}) => {
    return (
        <>
            <div className="custom-card ml-4 mr-4">
                <CardHeader>
                    <div>
                        <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                            Danger Zone
                        </Typography.Subheader>
                    </div>
                </CardHeader>

                <CardBody>
                    <div>
                        {isLoading ? (
                            <Skeleton count={1} height={40} width={225} />
                        ) : (
                            <Button
                                label="Reset all Equipment & Device Links"
                                size={Button.Sizes.md}
                                type={Button.Type.secondaryDistructive}
                                onClick={handleUnlinkAlertShow}
                                icon={<UnlinkOldSVG />}
                            />
                        )}
                    </div>
                </CardBody>
            </div>

            <Modal show={showUnlinkAlert} onHide={handleUnlinkAlertClose} centered backdrop="static" keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Reset Configuration</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        Are you sure you want to reset the configuration of these breakers?
                    </Typography.Body>
                    <Typography.Body size={Typography.Sizes.lg}>
                        All links to equipment and sensors will be lost.
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={handleUnlinkAlertClose}
                    />
                    <Button
                        label={isResetting ? 'Resetting' : 'Reset'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        disabled={isResetting}
                        onClick={unLinkAllBreakers}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UnlinkAllBreakers;
