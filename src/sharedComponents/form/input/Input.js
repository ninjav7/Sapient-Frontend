import React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../../typography';

import { ReactComponent as ErrorSVG } from '../../assets/icons/errorInfo.svg';

import './Input.scss';
import Brick from '../../brick';

const Input = ({ iconUrl, elementEnd, inputClassName = '', className = '', ...props }) => {
    const inputWrapperClassNames = cx('input-wrapper', className, {
        'element-end': !!elementEnd,
        error: !!props.error,
        icon: !!iconUrl,
    });

    return (
        <div className={inputWrapperClassNames}>
            <div className="input-inner-wrapper">
                {iconUrl && <img className="input-icon" src={iconUrl} />}
                <FormControl {...props} className={`input-control ${inputClassName}`} />
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
                    <Typography.Body size={Typography.Sizes.xs} style={{ color: 'red' }}>
                        {props.error}
                    </Typography.Body>
                </>
            )}
        </div>
    );
};

Input.propTypes = {
    iconUrl: PropTypes.string,
    elementEnd: PropTypes.node,
    error: PropTypes.string,
};

export default Input;
