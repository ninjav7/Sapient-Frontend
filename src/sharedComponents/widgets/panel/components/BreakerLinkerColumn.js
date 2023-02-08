import React, { useContext } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import { BreakerLinkerButton } from './BreakerLinkerButton';
import { PanelWidgetContext } from '../Panel';

const BreakerLinkerColumn = React.memo(({ columnIndex, edge, onBreakerLinkedClick, nodesMap }) => {
    const { widgetProps } = useContext(PanelWidgetContext);
    const [_, edgesData] = edge;
    const side = columnIndex % 2 === 0 ? 'left' : 'right';

    const {isLinked, parentBreaker} = widgetProps.breakerPropsAccessor;

    return (
        <div className={cx('breaker-linker-column', `breaker-linker-column-${side}`)}>
            {edgesData.map((edgeData) => {
                const isLinkedProp = nodesMap[edgeData.source][isLinked] && nodesMap[edgeData.target][isLinked] && nodesMap[edgeData.target][parentBreaker];

                return (
                    <BreakerLinkerButton
                        edgeData={edgeData}
                        onClick={onBreakerLinkedClick}
                        side={side}
                        isLinked={isLinkedProp}
                    />
                );
            })}
        </div>
    );
}, (oldProps, newProps) => _.isEqual(oldProps, newProps));

// BreakerLinkerColumn

export { BreakerLinkerColumn };
