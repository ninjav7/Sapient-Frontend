import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { generateID } from '../../helpers/helper';

import { ReactComponent as HelpSVG } from '../../assets/icons/helpIcon.svg';

import './Input.scss';

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
    });

    return (
        <div className={inputWrapperClassNames}>
            <div className="input-inner-wrapper">
                {iconUrl && <img className="input-icon" src={iconUrl} />}
                <FormControl {...props} className={`input-control ${inputClassName}`} />

                {tooltipText && (
                    <>
                        <UncontrolledTooltip placement="bottom" target={'tooltip-' + tooltipId}>
                            {tooltipText}
                        </UncontrolledTooltip>

                        <button type="button" className="input-tooltip-button" id={'tooltip-' + tooltipId}>
                            <HelpSVG className="input-tooltip-icon" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

InputTooltip.propTypes = {
    iconUrl: PropTypes.string,
    tooltipText: PropTypes.string,
};

export default InputTooltip;
