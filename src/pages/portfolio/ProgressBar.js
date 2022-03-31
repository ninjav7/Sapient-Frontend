import React from 'react';
import { Card, CardBody, Progress } from 'reactstrap';
import classNames from 'classnames';
import './style.css';

const ProgressBar = (props) => {
    const progressColor = props.color || 'success';
    return (
        <Card className={classNames(props.bgClass)}>
            <CardBody className="p-0">
                <div className="p-1">
                    <Progress
                        className="my-2"
                        style={{ height: '5px' }}
                        color={progressColor}
                        value={props.progressValue}
                    />
                    <span className="text-muted font-weight-bolder float-left progress-title">
                        {props.progressTitle}
                    </span>
                    <span className="text-muted font-weight-semibold float-right">{props.progressUnit}</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProgressBar;
