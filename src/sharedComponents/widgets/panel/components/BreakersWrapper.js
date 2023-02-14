import React from 'react';
import cx from 'classnames';

import { BreakerColumn } from './BreakerColumn';
import { BreakerLinkerColumn } from './BreakerLinkerColumn';

import { groupEdgesToColumns, sortEdges } from '../helper';
import { generateID } from '../../../helpers/helper';

import { PROP_TYPES } from '../constants';

const BreakersWrapper = (props) => {
    const { edges, nodesMap, isEditingMode, isOneColumn } = props;

    if (!edges) {
        return null;
    }

    const groupedEdges = isOneColumn ? { edges: sortEdges(edges) } : groupEdgesToColumns(edges);
    
    return (
        <div className={cx('panel-breakers-wrapper', { 'is-one-column': isOneColumn })}>
            {Object.entries(groupedEdges).map((edge, index) => {
                return (
                    <>
                        {isEditingMode && (
                            <BreakerLinkerColumn
                                nodesMap={nodesMap}
                                columnIndex={index}
                                edge={edge}
                                onBreakerLinkedClick={props.onBreakerLinkedClick}
                            />
                        )}
                        <BreakerColumn key={generateID()} edge={edge} {...props} nodes={nodesMap} />
                    </>
                );
            })}
        </div>
    );
};

BreakersWrapper.propTypes = PROP_TYPES.breakerWrapper;

export { BreakersWrapper };
