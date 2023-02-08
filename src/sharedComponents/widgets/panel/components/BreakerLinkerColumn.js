import React, { useRef } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import { BreakerLinkerButton } from './BreakerLinkerButton';

const BreakerLinkerColumn = React.memo(({ columnIndex, edge, onBreakerLinkedClick, nodesMap }) => {
    const countItemsRefAPI = useRef(0);
    const [_, edgesData] = edge;
    const side = columnIndex % 2 === 0 ? 'left' : 'right';

    return (
        <div className={cx('breaker-linker-column', `breaker-linker-column-${side}`)}>
            {edgesData.map((edgeData) => {
                let isLinked = nodesMap[edgeData.source].is_linked && nodesMap[edgeData.target].is_linked;
                
                //@TODO Hack, should be resolved by another approach
                if(isLinked) {
                    if(countItemsRefAPI.current === 2) {
                        countItemsRefAPI.current = 0;
                        isLinked = false;
                    } else {
                        countItemsRefAPI.current += 1;
                    }
                    
                } else {
                    countItemsRefAPI.current = 0;
                }
                
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
}, (oldProps, newProps) => _.isEqual(oldProps, newProps));

// BreakerLinkerColumn

export { BreakerLinkerColumn };
