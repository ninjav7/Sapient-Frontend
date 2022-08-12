import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { generateID } from '../../helpers/helper';

import { ReactComponent as HelpSVG } from '../../assets/icons/helpIcon.svg';

import './Input.scss';
import Brick from '../../brick';
import Typography from '../../typography';
import { ReactComponent as ErrorSVG } from '../../assets/icons/errorInfo.svg';

const InputTooltip = ({
    iconUrl,
    tooltipText,
    tooltipId = generateID(),
    inputClassName = '',
    className = '',
    ...props
}) => {
    const inputWrapperClassNames = cx('input-wrapper', className, {
        'element-end': !!tooltipText,
        error: !!props.error,
    });

    return (
        <div className={inputWrapperClassNames}>
            {props.label && (
                <>
                    <Typography.Body size={Typography.Sizes.sm}>{props.label}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                </>
            )}

            <div className="input-inner-wrapper">
                {iconUrl && <img className="input-icon" src={iconUrl} />}
                <FormControl {...props} className={`input-control ${inputClassName}`} />

                {tooltipText && !props.error && (
                    <>
                        <UncontrolledTooltip placement="bottom" target={'tooltip-' + tooltipId}>
                            {tooltipText}
                        </UncontrolledTooltip>

                        <button type="button" className="input-tooltip-button" id={'tooltip-' + tooltipId}>
                            <HelpSVG className="input-tooltip-icon" />
                        </button>
                    </>
                )}

                {!!props.error && <ErrorSVG className="element-end-node" />}
            </div>

            {!!props.error && (
                <>
                    <Brick sizeInRem={0.375} />
                    <Typography.Body size={Typography.Sizes.xs} className="input-error-label">
                        {props.error}
                    </Typography.Body>
                </>
            )}
        </div>
    );
};

InputTooltip.propTypes = {
    iconUrl: PropTypes.string,
    tooltipText: PropTypes.string,
    label: PropTypes.string,
    tooltipId: PropTypes.string,
    error: PropTypes.string,
};

export default InputTooltip;
