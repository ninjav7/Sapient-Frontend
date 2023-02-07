import React from 'react';

import { BreakerColumn } from './BreakerColumn';
import { BreakerLinkerColumn } from './BreakerLinkerColumn';

import { groupEdgesToColumns } from '../helper';
import { generateID } from '../../../helpers/helper';

import { PROP_TYPES } from '../constants';

const BreakersWrapper = (props) => {
    const { edges, nodesMap, isEditingMode } = props;

    if (!edges) {
        return null;
    }

    const groupedEdges = groupEdgesToColumns(edges);
    
    return (
        <div className="panel-breakers-wrapper">
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
