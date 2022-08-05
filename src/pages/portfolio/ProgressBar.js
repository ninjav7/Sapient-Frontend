import React from 'react';
import { Line } from 'rc-progress';
import classNames from 'classnames';
import './ProgressBar.scss';

const limit = 25;

const getOpacity = (percentage) => {
    const limitedPercentage =  percentage >= limit ? percentage : limit;
    
    return limitedPercentage / 100;
}

const ProgressBar = (props) => {
    const opacity = getOpacity(props.progressValue);
    
    return (
        <div className={classNames(props.className, 'progress-bar-wrapper')}>
            <Line
                style={{opacity}}
                percent={props.progressValue}
                strokeWidth={0.5}
                strokeColor={props.colors}
            />

            <span className="progress-bar-title float-left">{props.progressTitle}</span>
            <span className="progress-bar-value float-right">{props.progressUnit}</span>
            <div className="clearfix"></div>
        </div>
    );
};

export default ProgressBar;
