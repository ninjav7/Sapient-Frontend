import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { ReactComponent as UnGroupedSVG } from '../../../assets/icons/object-ungrouped.svg';
import { ReactComponent as GroupSVG } from '../../../assets/icons/object-group.svg';
import { ReactComponent as LoadingSVG } from '../../../assets/icons/loading.svg';

import { PROP_TYPES } from '../constants';

const BreakerLinkerButton = ({ isLinked, onClick, edgeData, side }) => {
    const [isLoading, setIsLoading] = useState(false);

    const clickHandler = useCallback(() => {
        onClick && onClick(edgeData, setIsLoading);
    }, [edgeData]);

    return (
        <button
            className={cx('reset-styles breaker-linker-button', side, {
                'is-linked': isLinked,
                'is-loading': isLoading,
            })}
            onClick={clickHandler}>
            {isLoading ? (
                <LoadingSVG className="breaker-linker-button-loader" />
            ) : (
                <>
                    <UnGroupedSVG className="breaker-linker-button-ungroup" />
                    <GroupSVG className="breaker-linker-button-group" />
                </>
            )}
        </button>
    );
};

BreakerLinkerButton.propTypes = PROP_TYPES?.breakerLinkerButton;

export { BreakerLinkerButton };
