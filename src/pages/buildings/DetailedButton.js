import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

const DetailedButton = (props) => {
    return (
        <>
            <h5 className="card-title subtitle-style">
                {props.title}&nbsp;&nbsp;
                <div>
                    <i className="uil uil-info-circle avatar-xs rounded-circle" id="title" />
                    <UncontrolledTooltip placement="bottom" target="#title">
                        Information ToolTips
                    </UncontrolledTooltip>
                </div>
            </h5>
            <p className="card-text card-content-style">
                {props.description.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="card-unit-style">
                    &nbsp;&nbsp;{props.unit}&nbsp;&nbsp;&nbsp;
                    {props.consumptionNormal && (
                        <button className="button-success text-success btn-font-style" style={{ width: '100%' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                    {!props.consumptionNormal && (
                        <button className="button-danger text-danger btn-font-style" style={{ width: '100%' }}>
                            <i className="uil uil-chart-down">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                </span>
            </p>
        </>
    );
};

export default DetailedButton;
