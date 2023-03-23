import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../../typography';
import Brick from '../../brick';

import { ReactComponent as ErrorSVG } from '../../assets/icons/errorInfo.svg';

import './Textarea.scss';

const Textarea = ({ iconUrl, elementEnd, inputClassName = '', className = '', ...props }) => {
    const inputWrapperClassNames = cx('input-wrapper', className, {
        'element-end': !!elementEnd,
        error: !!props.error,
        icon: !!iconUrl,
    });
    const fieldRows = props.rows || '3';
    return (
        <div className={inputWrapperClassNames}>
            {props.label && (
                <>
                    <Typography.Body size={Typography.Sizes.sm} className="gray-550 font-weight-medium">
                        {props.label}
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                </>
            )}

            <div className="input-inner-wrapper">
                {iconUrl && <img className="input-icon" src={iconUrl} />}
                <FormControl
                    {...props}
                    className={`textarea-control ${inputClassName}`}
                    as="textarea"
                    rows={fieldRows}
                />
                {elementEnd &&
                    !props.error &&
                    React.cloneElement(elementEnd, {
                        className: 'element-end-node',
                    })}
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

Textarea.propTypes = {
    iconUrl: PropTypes.string,
    elementEnd: PropTypes.node,
    error: PropTypes.string,
    label: PropTypes.string,
};

export default Textarea;
