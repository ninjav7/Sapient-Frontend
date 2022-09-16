import React from 'react';
import { Table } from './index';
import Typography from '../typography';

export default {
    title: 'Components/Table',
    component: Table,
};

export const Default = (props) => (
    <Table>
        <Table.THead>
            <Table.Cell>
                <Typography.Subheader size={Typography.Sizes.md}>Heading 1</Typography.Subheader>
            </Table.Cell>
            <Table.Cell>
                <Typography.Subheader size={Typography.Sizes.md}>Heading 2</Typography.Subheader>
            </Table.Cell>
            <Table.Cell>
                <Typography.Subheader size={Typography.Sizes.md}>Heading 3</Typography.Subheader>
            </Table.Cell>
            <Table.Cell>
                <Typography.Subheader size={Typography.Sizes.md}>Heading 4</Typography.Subheader>
            </Table.Cell>
        </Table.THead>
        <Table.TBody>
            <Table.Row>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 1 Cell 1</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 1 Cell 2</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 1 Cell 3</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 1 Cell 4</Typography.Body>
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 2 Cell 1</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 2 Cell 2</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 2 Cell 3</Typography.Body>
                </Table.Cell>
                <Table.Cell>
                    <Typography.Body size={Typography.Sizes.md}>Row 2 Cell 4</Typography.Body>
                </Table.Cell>
            </Table.Row>
        </Table.TBody>
    </Table>
);
