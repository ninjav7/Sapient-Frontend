import React from 'react';

import './Table.scss';

const Head = ({ children, ...props }) => (
    <thead className="table-head" {...props}>
        {children}
    </thead>
);
const Body = ({ children, ...props }) => (
    <tbody className="table-body" {...props}>
        {children}
    </tbody>
);
const Row = ({ children, ...props }) => (
    <tr className="table-row" {...props}>
        {children}
    </tr>
);
const Cell = ({ children, className = '', ...props }) => (
    <td {...props} className={`table-cell ${className}`}>
        {children}
    </td>
);

const THead = ({ children, ...props }) => (
    <Head {...props}>
        <Row>{children}</Row>
    </Head>
);
const TBody = ({ children, ...props }) => <Body {...props}>{children}</Body>;

const Table = ({ children, ...props }) => {
    return (
        <div className="table-wrapper" {...props}>
            <table className="table-component">{children}</table>
        </div>
    );
};

Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.THead = THead;
Table.TBody = TBody;

export default Table;
