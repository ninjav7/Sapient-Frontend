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

                        <Brick sizeInRem={1} />

                        <div>
                            <Typography.Subheader size={Typography.Sizes.md}>{`Condition`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                {alertObj?.condition?.conditionDescription ?? ''}
                            </Typography.Body>
                        </div>

                        {(alertObj?.condition?.type === 'energy_consumption' ||
                            alertObj?.condition?.type === 'peak_demand') && <Brick sizeInRem={0.5} />}

                        {alertObj?.condition?.type === 'energy_consumption' && (
                            <div className="d-flex" style={{ gap: '1rem' }}>
                                <Checkbox
                                    label="Alert at 50%"
                                    type="checkbox"
                                    id="50-percent-alert"
                                    name="50-percent-alert"
                                    size="md"
                                    checked={alertObj?.condition?.threshold50}
                                    value={alertObj?.condition?.threshold50}
                                    onClick={(e) => {
                                        handleConditionChange('threshold50', e.target.value === 'false' ? true : false);
                                    }}
                                />
                                <Checkbox
                                    label="Alert at 75%"
                                    type="checkbox"
                                    id="75-percent-alert"
                                    name="75-percent-alert"
                                    size="md"
                                    checked={alertObj?.condition?.threshold75}
                                    value={alertObj?.condition?.threshold75}
                                    onClick={(e) => {
                                        handleConditionChange('threshold75', e.target.value === 'false' ? true : false);
                                    }}
                                />
                            </div>
                        )}

                        {alertObj?.condition?.type === 'peak_demand' && (
                            <Checkbox
                                label="Alert at 90%"
                                type="checkbox"
                                id="90-percent-alert"
                                name="90-percent-alert"
                                size="md"
                                checked={alertObj?.condition?.threshold90}
                                value={alertObj?.condition?.threshold90}
                                onClick={(e) => {
                                    handleConditionChange('threshold90', e.target.value === 'false' ? true : false);
                                }}
                            />
                        )}

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
