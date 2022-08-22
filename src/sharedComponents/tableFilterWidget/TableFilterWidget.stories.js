import React from 'react';
import TableFilterWidget from './TableFilterWidget';
import '../assets/scss/stories.scss';
import { Table } from '../table';
import Typography from '../typography';
import Select from '../form/select';
import Brick from '../brick';
import { Badge } from '../badge';
import { TinyBarChart } from '../tinyBarChart';
import { TrendsBadge } from '../trendsBadge';
import { Button } from '../button';

export default {
    title: 'Widgets/TableFilterWidget',
    component: TableFilterWidget,
};

const TableHeader = () => (
    <Table.THead>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>Name</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Select
                isSearchable={false}
                options={[{ label: 'Energy Density', value: 'Energy Density' }]}
                defaultValue="Energy Density"
            />
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>% Change</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>HVAC Consumption</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>% Change</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>Total Consumption</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>% Change</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>Sq. Ft.</Typography.Subheader>
        </Table.Cell>
        <Table.Cell>
            <Typography.Subheader size={Typography.Sizes.sm}>Monitored Load</Typography.Subheader>
        </Table.Cell>
    </Table.THead>
);

const TableBody = () => (
    <Table.TBody>
        <Table.Row>
            <Table.Cell>
                <div style={{ fontSize: 0 }}>
                    <a className="typography-wrapper link" href="#">
                        123 Main St. Portland, OR
                    </a>
                    <Brick sizeInPixels={3} />
                    <Badge text="Office" />
                </div>
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>1.5 kWh / sq. ft.</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={100} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={22} />
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>25,003 kWh</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={100} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={40} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>25,003 kWh</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={40} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>46,332</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <Button size={Button.Sizes.sm} type={Button.Type.SecondaryGrey} label="Add Utility Bill" />
            </Table.Cell>
        </Table.Row>

        <Table.Row>
            <Table.Cell>
                <div style={{ fontSize: 0 }}>
                    <a className="typography-wrapper link" href="#">
                        15 University Blvd.
                    </a>
                    <Brick sizeInPixels={3} />
                    <Badge text="Office" />
                </div>
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>1.3 kWh / sq. ft.</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={70} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={12} />
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>0.6 kWh / sq. ft.</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={60} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={1} type={TrendsBadge.Type.NEUTRAL_UP_TREND} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>25,003 kWh</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={2} type={TrendsBadge.Type.NEUTRAL_UP_TREND} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>31,834</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>82%</Typography.Body>
            </Table.Cell>
        </Table.Row>

        <Table.Row>
            <Table.Cell>
                <div style={{ fontSize: 0 }}>
                    <a className="typography-wrapper link" href="#">
                        6223 Sycamore Ave.
                    </a>
                    <Brick sizeInPixels={3} />
                    <Badge text="Office" />
                </div>
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>1.25 kWh / sq. ft.</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={40} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={1} type={TrendsBadge.Type.NEUTRAL_UP_TREND} />
            </Table.Cell>
            <Table.Cell width={150}>
                <Typography.Body size={Typography.Sizes.sm}>0.5 kWh / sq. ft.</Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={27} />
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={8} type={TrendsBadge.Type.DOWNWARD_TREND} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>18,203 kWh</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <TrendsBadge value={8} type={TrendsBadge.Type.DOWNWARD_TREND} />
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>25,613</Typography.Body>
            </Table.Cell>
            <Table.Cell>
                <Typography.Body size={Typography.Sizes.md}>95%</Typography.Body>
            </Table.Cell>
        </Table.Row>
    </Table.TBody>
);

export const Default = arg => {
    return (
        <TableFilterWidget {...arg}>
            <Table>
                <TableHeader />
                <TableBody />
            </Table>
        </TableFilterWidget>
    );
};

Default.args = {
    columns: [
        { label: 'Select All', value: 'all' },
        { label: '7 Days', value: '7 days' },
        { label: '1 Year', value: '1 Year' },
    ],
    onSelectColumn: column => alert(JSON.stringify(column)),
};
