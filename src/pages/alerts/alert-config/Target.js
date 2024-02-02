import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';
import { ReactComponent as TooltipIcon } from '../../../sharedComponents/assets/icons/tooltip.svg';

import { TARGET_TYPES, defaultAlertObj } from '../constants';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const TargetToolTip = () => {
    return (
        <div>
            <UncontrolledTooltip placement="top" target="tooltip-for-target">
                {`Select a Target to setup alert configuration.`}
            </UncontrolledTooltip>

            <button type="button" className="tooltip-button" id="tooltip-for-target">
                <TooltipIcon className="tooltip-icon" />
            </button>
        </div>
    );
};

const Target = (props) => {
    const {
        alertObj = {},
        handleTargetChange,
        renderTargetedList,
        renderTargetTypeHeader,
        handleModalClick,
        openBldgConfigModel,
        openEquipConfigModel,
        originalBldgsList,
        originalEquipsList,
        setAlertObj,
    } = props;

    const [selectedBldgsForEquip, setSelectedBldgsForEquip] = useState([]);

    useEffect(() => {
        if (alertObj?.target?.type !== TARGET_TYPES.EQUIPMENT && selectedBldgsForEquip.length !== 0) {
            setSelectedBldgsForEquip([]);
        }
    }, [alertObj?.target?.type]);

    return (
        <div className="custom-card">
            <CardHeader>
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-baseline">
                        <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                            {`Target`}
                        </Typography.Subheader>
                        <TargetToolTip />
                    </div>
                    {/* <Typography.Subheader
                        size={Typography.Sizes.lg}
                        className="reset-target-style"
                        onClick={() => {
                            setAlertObj(defaultAlertObj);
                        }}>
                        {`Reset Target Type`}
                    </Typography.Subheader> */}
                </div>
            </CardHeader>
            <CardBody>
                {alertObj?.target?.type && alertObj?.target?.lists.length !== 0 ? (
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {renderTargetTypeHeader(alertObj)}
                            </Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                {alertObj?.target?.type === TARGET_TYPES.BUILDING &&
                                    renderTargetedList(alertObj, originalBldgsList)}

                                {alertObj?.target?.type === TARGET_TYPES.EQUIPMENT &&
                                    renderTargetedList(alertObj, originalEquipsList)}
                            </Typography.Body>
                        </div>
                        <div>
                            <PenSVG
                                className="mouse-pointer"
                                width={17}
                                height={17}
                                onClick={() => {
                                    if (alertObj?.target?.type === TARGET_TYPES.BUILDING) {
                                        openBldgConfigModel();
                                    } else if (alertObj?.target?.type === TARGET_TYPES.EQUIPMENT) {
                                        openEquipConfigModel();
                                    }
                                    handleTargetChange('submitted', !alertObj?.target?.submitted);
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Typography.Subheader size={Typography.Sizes.md}>{`Select a Target Type`}</Typography.Subheader>
                        <Brick sizeInRem={1.25} />

                        <div className="d-flex" style={{ gap: '0.75rem' }}>
                            {/* Buidling */}
                            <div
                                id={TARGET_TYPES.BUILDING}
                                className={`d-flex align-items-center mouse-pointer ${
                                    alertObj?.target?.type === TARGET_TYPES.BUILDING
                                        ? `target-type-container-active`
                                        : `target-type-container`
                                }`}
                                onClick={(e) => {
                                    handleModalClick(e.currentTarget.id);
                                    handleTargetChange('type', TARGET_TYPES.BUILDING);
                                }}>
                                <BuildingTypeSVG className="p-0 square" width={20} height={20} />
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray700 }}>
                                    Building
                                </Typography.Subheader>
                            </div>

                            {/* Equipment */}
                            <div
                                id={TARGET_TYPES.EQUIPMENT}
                                className={`d-flex align-items-center mouse-pointer ${
                                    alertObj?.target?.type === TARGET_TYPES.EQUIPMENT
                                        ? `target-type-container-active`
                                        : `target-type-container`
                                }`}
                                onClick={(e) => {
                                    handleModalClick(e.currentTarget.id);
                                    handleTargetChange('type', TARGET_TYPES.EQUIPMENT);
                                }}>
                                <EquipmentTypeSVG className="p-0 square" width={20} height={20} />
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray700 }}>
                                    Equipment
                                </Typography.Subheader>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </div>
    );
};

export default Target;
