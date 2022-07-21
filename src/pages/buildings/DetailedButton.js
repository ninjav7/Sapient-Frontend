import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

const DetailedButton = (props) => {
    return (
        <div>
            <h5 className="card-title subtitle-style">
                {props.title}&nbsp;&nbsp;
                <div>
                    <FontAwesomeIcon icon={faCircleInfo} size="md" color="#D0D5DD" id={'tooltip-' + props.infoType} />
                    {/* <i className="uil uil-info-circle avatar-xs rounded-circle" id={'tooltip-' + props.infoType} /> */}

                    <UncontrolledTooltip placement="bottom" target={'tooltip-' + props.infoType}>
                        {props.infoText}
                    </UncontrolledTooltip>
                </div>
            </h5>
            <p className="card-text card-content-style">
                {props.description.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="card-unit-style">
                    &nbsp;&nbsp;{props.unit}&nbsp;&nbsp;&nbsp;
                    {!props.consumptionNormal && (
                        <button className="button-success text-success btn-font-style" style={{ width: '100%' }}>
                            <i className="uil uil-chart-down">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                    {props.consumptionNormal && (
                        <button className="button-danger text-danger btn-font-style" style={{ width: '100%' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                </span>
            </p>
        </div>
    );
};

export default DetailedButton;
