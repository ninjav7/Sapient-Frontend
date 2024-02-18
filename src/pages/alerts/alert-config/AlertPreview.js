import React from 'react';
import _ from 'lodash';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Checkbox } from '../../../sharedComponents/form/checkbox';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertPreview = (props) => {
    const { alertObj = {}, typeSelectedLabel = '', handleConditionChange } = props;

    const targetType = alertObj?.target?.type === `building` ? `Building` : `Equipment`;

    const renderTriggerNotification = (alert_obj) => {
        const obj = alert_obj?.recurrence;
        return `Trigger if conditions lasts at least ${obj?.triggerAt} min`;
    };

    return (
        <Row>
            <Col lg={9}>
                <div className="custom-card">
                    <CardHeader>
                        <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                            {`Alert Preview`}
                        </Typography.Subheader>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Typography.Subheader size={Typography.Sizes.md}>{`Target Type`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                {targetType}
                            </Typography.Body>
                        </div>

                        <Brick sizeInRem={1} />

                        <div>
                            <Typography.Subheader size={Typography.Sizes.md}>{targetType}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                {typeSelectedLabel && typeSelectedLabel}
                            </Typography.Body>
                        </div>

                        {alertObj?.condition?.alert_condition_description && (
                            <>
                                <Brick sizeInRem={1} />

                                <div>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Condition`}</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                        {alertObj?.condition?.alert_condition_description ?? ''}
                                    </Typography.Body>
                                </div>
                            </>
                        )}

                        {(alertObj?.condition?.type === 'energy_consumption' ||
                            alertObj?.condition?.type === 'peak_demand') && <Brick sizeInRem={0.5} />}

                        {alertObj?.recurrence?.triggerAlert && (
                            <>
                                <Brick sizeInRem={1.25} />
                                <div>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Recurrence`}</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                        {renderTriggerNotification(alertObj)}
                                    </Typography.Body>
                                </div>
                            </>
                        )}
                    </CardBody>
                </div>
            </Col>
        </Row>
    );
};

export default AlertPreview;
