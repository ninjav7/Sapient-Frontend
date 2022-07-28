import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faLinkHorizontal } from '@fortawesome/pro-regular-svg-icons';
import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls, Handle, Position } from 'react-flow-renderer';
import '../style.css';
import './panel-style.css';

const BreakerLink = () => {
    return (
        <>
            <Handle
                type="source"
                position="top"
                id="a"
                style={{ width: '5px', height: '5px', backgroundColor: '#bababa' }}
            />
            <Handle
                type="target"
                position="bottom"
                id="b"
                style={{ width: '5px', height: '5px', backgroundColor: '#bababa' }}
            />
            <div className="breaker-link-container">
                {/* <FontAwesomeIcon icon={faLinkHorizontal} color="#3C6DF5" size="md" /> */}
                <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#D0D5DD" size="md" />
            </div>
        </>
    );
};

export default BreakerLink;
