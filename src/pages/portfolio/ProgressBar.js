import React from 'react';
import { Line } from 'rc-progress';
import { Card, CardBody, Progress } from 'reactstrap';
import classNames from 'classnames';
import './style.css';

const ProgressBar = (props) => {
    return (
        <Card className={classNames(props.bgClass)}>
            <CardBody className="p-0">
                <div className="p-1 m-1">
                    <Line
                        percent={props.progressValue}
                        strokeWidth={1}
                        strokeColor={props.colors}
                        className="custom-progress-bar"
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
