import React from 'react';

const LayoutLoadingComponent = () =>
    new Array(23).fill().map((_, key) => (
        <div className="layout-loading-wrapper" key={key}>
            <div className="layout-loading skeleton"></div>
        </div>
    ));

export { LayoutLoadingComponent };
