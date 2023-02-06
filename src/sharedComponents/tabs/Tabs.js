import React, { useCallback, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import TabsBt from 'react-bootstrap/Tabs';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TABS_TYPES } from './constants';

import './Tabs.scss';

const Tabs = (props) => {
    const [borders, setBorders] = useState(null);

    useEffect(() => {
        if (!props.defaultActiveKey) {
            setBorders({ 'no-radius-left': true });
        }
    }, []);

    const handleOnEnter = (element, index) => {
        if (element.classList.contains('active') && index === 0) {
            setBorders({ 'no-radius-left': true });

            return;
        }

        setBorders(null);
    };

    const classNames = cx('tabs-wrapper', props.className, borders, { [props.type]: !!props.type });

    const tabClassName = (() => {
        if (props.type === TABS_TYPES.subsection) {
            return 'typography-wrapper subheader md Medium gray-500';
        }
    })();

    return (
        <div className={classNames}>
            <TabsBt {...props} className={props.tabCustomStyle}>
                {React.Children.map(props.children, (child, index) =>
                    React.cloneElement(child, { onEnter: (element) => handleOnEnter(element, index), tabClassName })
                )}
            </TabsBt>
        </div>
    );
};

Tabs.Item = Tab;

Tabs.Types = TABS_TYPES;

Tabs.Item.propTypes = {
    eventKey: PropTypes.string.isRequired,
    title: PropTypes.node,
};

Tabs.propTypes = {
    defaultActiveKey: PropTypes.string,
    type: PropTypes.oneOf(Object.values(TABS_TYPES)),
    tabCustomStyle: PropTypes.string,
};

export default Tabs;
