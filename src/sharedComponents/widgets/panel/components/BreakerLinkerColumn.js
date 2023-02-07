import React from 'react';
import cx from 'classnames';

import { BreakerLinkerButton } from './BreakerLinkerButton';

const BreakerLinkerColumn = ({ columnIndex, edge, onBreakerLinkedClick, nodesMap }) => {
    const [_, edgesData] = edge;
    const side = columnIndex % 2 === 0 ? 'left' : 'right';

    return (
        <div className={cx('breaker-linker-column', `breaker-linker-column-${side}`)}>
            {edgesData.map((edgeData) => {
                const isLinked = nodesMap[edgeData.source].is_linked && nodesMap[edgeData.target].is_linked;

                return (
                    <BreakerLinkerButton
                        edgeData={edgeData}
                        onClick={onBreakerLinkedClick}
                        side={side}
                        isLinked={isLinked}
                    />
                );
            })}
        </div>
    );
};

// BreakerLinkerColumn

export { BreakerLinkerColumn };
