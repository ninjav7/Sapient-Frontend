import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { faArrowTrendUp } from '@fortawesome/pro-solid-svg-icons';
import { faArrowTrendDown } from '@fortawesome/pro-solid-svg-icons';

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
                            <FontAwesomeIcon icon={faArrowTrendDown} size="md" color="#43d39e" className="mr-1" />
                            <strong>{props.value} %</strong>
                        </button>
                    )}
                    {props.consumptionNormal && (
                        <button className="button-danger text-danger btn-font-style" style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} size="md" color="#ff5c75" className="mr-1" />
                            <strong>{props.value} %</strong>
                        </button>
                    )}
                </span>
            </p>
        </div>
    );
};

export default DetailedButton;
