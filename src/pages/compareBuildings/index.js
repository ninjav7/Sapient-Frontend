import React, { useEffect, useState, useMemo } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Progress,
} from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { ChevronDown, Search } from 'react-feather';
import { Line } from 'rc-progress';
import { ComponentStore } from '../../store/ComponentStore';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUrl, compareBuildings } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { percentageHandler } from '../../utils/helper';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { Cookies } from 'react-cookie';
import './style.css';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);
    console.log(items);
    console.log(config);
    const sortedItems = useMemo(() => {
      let sortableItems = [...items];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
  
    const requestSort = (key) => {
      let direction = 'ascending';
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
      ) {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
  
    return { items: sortedItems, requestSort, sortConfig };
  };
  

const BuildingTable = ({ buildingsData, selectedOptions}) => {
    const records = [
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'down',
            totalConsumption: 25003,
            totalPerChg: '4',
            totalPerChgStatus: 'normal',
            sqFt: 46332,
            energyPer: 90,
            consumtnPer: 100,
        },
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '2',
            energyPerChgStatus: 'normal',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'down',
            totalConsumption: 25003,
            totalPerChg: '40',
            totalPerChgStatus: 'up',
            sqFt: 46332,
            energyPer: 75,
            consumtnPer: 50,
        },
        {
            name: '123 Main St. Portland OR',
            energyDensity: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'down',
            hvacConsumption: 0.8,
            hvacPerChg: '40',
            hvacPerChgStatus: 'up',
            totalConsumption: 25003,
            totalPerChg: '4',
            totalPerChgStatus: 'normal',
            sqFt: 46332,
            energyPer: 50,
            consumtnPer: 20,
        },
    ];

    const [topEnergyDensity, setTopEnergyDensity] = useState(1);
    const [topHVACConsumption, setTopHVACConsumption] = useState(1);
    const { items, requestSort, sortConfig } = useSortableData(buildingsData);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
    const columns = [
        {
            dataField: 'building_name',
            text: 'Name',
            sort: true,
            style: { color: 'blue' },
        },
        {
            dataField: 'energy_density',
            text: 'Energy Density',
            sort: true,
        },
        {
            dataField: 'energy_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'hvac_consumption',
            text: 'HVAC Consumption',
            sort: true,
        },
        {
            dataField: 'hvac_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'total_consumption',
            text: 'Total Consumption',
            sort: true,
        },
        {
            dataField: 'total_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'sq_ft',
            text: 'Sq. Ft.',
            sort: true,
        },
        {
            dataField: 'buildingAccess',
            text: 'Monitored Load',
            sort: true,
        },
    ];

    useEffect(() => {
        if (!buildingsData.length > 0) {
            return;
        }
        let topVal = buildingsData[0].energy_density;
        setTopEnergyDensity(topVal);
        let hvacVal = buildingsData[0].hvac_consumption.now;
        setTopHVACConsumption(hvacVal);
    }, [buildingsData]);

    return (
        <Card>
            <CardBody>
                {/* <BootstrapTable keyField='id' data={ userData } columns={ columns } bordered={ false } sort={ { dataField: 'name', order: 'asc' } } /> */}
                <Table className="mb-0 bordered">
                    <thead>
                        <tr>
                        {selectedOptions.some((record) => record.value === 'name') && 
                        <th className="table-heading-style"> 
                            <button
                                type="button"
                                onClick={() => requestSort('building_name')}
                                className={getClassNamesFor('building_name')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >Name</button></th>}
                        {selectedOptions.some((record) => record.value === 'density') && 
                        (<th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('energy_density')}
                                className={getClassNamesFor('energy_density')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                                Energy Density
                            </button>
                        </th>
                        )}
                        {selectedOptions.some((record) => record.value === 'per_change') && 
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('energy_density')}
                                className={getClassNamesFor('energy_density')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            % Change
                            </button>
                        </th>}
                        {selectedOptions.some((record) => record.value === 'hvac') &&
                        <th className="table-heading-style">
                                <button
                                type="button"
                                onClick={() => requestSort('hvac_density')}
                                className={getClassNamesFor('hvac_density')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            HVAC Consumption
                            </button>
                        </th>}
                        {selectedOptions.some((record) => record.value === 'hvac_per') && 
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('hvac_density')}
                                className={getClassNamesFor('hvac_density')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            % Change
                            </button>
                        </th>}
                        {selectedOptions.some((record) => record.value === 'total') && (
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('total_consumption')}
                                className={getClassNamesFor('total_consumption')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            Total Consumption
                            </button>
                        </th>
                        )}
                        {selectedOptions.some((record) => record.value === 'total_per') && (
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('total_consumption')}
                                className={getClassNamesFor('total_consumption')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            % Change
                            </button>
                        </th>)}
                        {selectedOptions.some((record) => record.value === 'sq_ft') && (
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('sq_ft')}
                                className={getClassNamesFor('sq_ft')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            Sq. Ft.
                            </button>
                        </th>)}
                        {selectedOptions.some((record) => record.value === 'load') && (
                        <th className="table-heading-style">
                            <button
                                type="button"
                                onClick={() => requestSort('')}
                                className={getClassNamesFor('')}
                                style={{border:"none",backgroundColor: "white",fontWeight: "bolder",fontSize: "16px"}} 
                                >
                            Monitored Load
                            </button>
                        </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((record, index) => {
                            return (
                                <tr key={record.building_id}>
                                     {selectedOptions.some((record) => record.value === 'name') && (
                                    <th scope="row">
                                        <Link
                                            to={{
                                                pathname: `/energy/building/overview/${record.building_id}`,
                                            }}>
                                            <a className="building-name">{record.building_name}</a>
                                        </Link>
                                        <span className="badge badge-soft-secondary mr-2">Office</span>
                                    </th>
                                      )}
                                     {selectedOptions.some((record) => record.value === 'density') && (
                                    <td className="table-content-style">
                                        {parseFloat(record.energy_density / 1000).toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                            {index === 0 && record.energy_density === 0 && (
                                                <Line
                                                    percent={0}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 0 && record.energy_density > 0 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 1 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#DF5775`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 2 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 3 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 4 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FC9EAC`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 5 && (
                                                <Line
                                                    percent={parseFloat(
                                                        (record.energy_density / topEnergyDensity) * 100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FFCFD6`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                        </div>
                                    </td>
                                     )}
                                    {selectedOptions.some((record) => record.value === 'per_change') && (
                                    <td>
                                        {record.energy_consumption.now >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'hvac') && (
                                    <td className="table-content-style">
                                        {parseFloat(record.hvac_consumption.now).toFixed(2)} kWh / sq. ft.sq. ft.
                                        <br />
                                        <div style={{ width: '100%', display: 'inline-block' }}>
                                            {/* <Line
                                                percent={percentageHandler(
                                                    record.hvac_consumption.now,
                                                    record.hvac_consumption.old
                                                )}
                                                strokeWidth="4"
                                                trailWidth="4"
                                                strokeColor="#C64245"
                                                strokeLinecap="round"
                                            /> */}
                                            {index === 0 && record.hvac_consumption.now === 0 && (
                                                <Line
                                                    percent={0}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 0 && record.hvac_consumption.now > 0 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#D14065`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 1 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#DF5775`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 2 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 3 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#EB6E87`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 4 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FC9EAC`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                            {index === 5 && (
                                                <Line
                                                    percent={(
                                                        (record.hvac_consumption.now / topHVACConsumption) *
                                                        100
                                                    ).toFixed(2)}
                                                    strokeWidth="3"
                                                    trailWidth="3"
                                                    strokeColor={`#FFCFD6`}
                                                    strokeLinecap="round"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'hvac_per') && (
                                    <td>
                                        {record.hvac_consumption.now >= record.hvac_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.hvac_consumption.now,
                                                            record.hvac_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.hvac_consumption.now,
                                                            record.hvac_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'total') && (
                                    <td className="value-style">
                                        {(record.total_consumption / 1000).toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })}
                                        kWh
                                    </td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'total_per') && (
                                    <td>
                                        {record.total_consumption >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.total_consumption,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.total_consumption,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </td>
                                    )}
                                    {selectedOptions.some((record) => record.value === 'sq_ft') && (
                                    <td className="value-style">
                                        {record.sq_ft.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const CompareBuildings = () => {
    const [buildingsData, setBuildingsData] = useState([]);
    const daysCount = DateRangeStore.useState((s) => s.dateFilter);
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const tableColumnOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Energy Density', value: 'density' },
        { label: '% Change', value: 'per_change' },
        { label: 'HVAC Consumption', value: 'hvac' },
        { label: 'HVAC % change', value: 'hvac_per' },
        { label: 'Total Consumption', value: 'total' },
        { label: 'Total % change', value: 'total_per' },
        { label: 'Sq. ft.', value: 'sq_ft' },
        { label: 'Monitored Load', value: 'load' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Compare Buildings',
                        path: '/energy/compare-buildings',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        ComponentStore.update((s) => {
            s.parent = 'portfolio';
        });
        updateBreadcrumbStore();
        let arr = [
            { label: 'Name', value: 'name' },
        { label: 'Energy Density', value: 'density' },
        { label: '% Change', value: 'per_change' },
        // { label: 'HVAC Consumption', value: 'hvac' },
        // { label: 'HVAC % change', value: 'hvac_per' },
        { label: 'Total Consumption', value: 'total' },
        { label: 'Total % change', value: 'total_per' },
        { label: 'Sq. ft.', value: 'sq_ft' },
        { label: 'Monitored Load', value: 'load' },
        ];
        setSelectedOptions(arr);
    }, []);

    useEffect(() => {
        const compareBuildingsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let count = parseInt(localStorage.getItem('dateFilter'));
                let params = `?days=${count}`;
                await axios.post(`${BaseUrl}${compareBuildings}${params}`, {}, { headers }).then((res) => {
                    let response = res.data;
                    response.sort((a, b) => b.energy_consumption - a.energy_consumption);
                    setBuildingsData(response);
                    // console.log('setBuildingsData => ', res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Buildings Data');
            }
        };
        compareBuildingsData();
    }, [daysCount]);

    return (
        <React.Fragment>
            <Header title="Compare Buildings" />

            {/* <Row className="m-4">
                <div>
                    <FontAwesomeIcon icon={faHome} />
                </div>
            </Row> */}

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <span class="input-group-text border-0" id="search-addon">
                            <Search className="icon-sm" />
                        </span>
                    </div>
                </Col>
                <Col xl={9}>
                    <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button>

                    {/* ---------------------------------------------------------------------- */}
                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xl={12}>
                    <BuildingTable buildingsData={buildingsData} selectedOptions={selectedOptions}/>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
