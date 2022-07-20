import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { iterationDataList, iterationNumber } from '../../store/globalState';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import EditInfiniteModal from './EditInfiniteModal';

const InfiniteLayout = ({ iterationValue }) => {
    const [iterations, setIterations] = useAtom(iterationNumber);
    const [modalShow, setModalShow] = useState(false);
    const [iterationData] = useAtom(iterationDataList);

    return (
        <>
            {/* spaceIndex={spaceClicked} show={modalShowArea} onHide={() => setModalShowArea(false)} */}
            <EditInfiniteModal iterationValue={iterationValue} show={modalShow} onHide={() => setModalShow(false)} />
            <div className="header">
                <div className="container-heading">
                    <span>{iterationData?.filter()}</span>
                    <i className="uil uil-pen ml-2"></i>
                    <div className="mr-2" style={{ marginLeft: 'auto' }}>
                        <i className="uil uil-filter mr-3"></i>
                        {/* <i className="uil uil-plus mr-2"></i> */}
                        <UncontrolledDropdown className="align-self-center float-right">
                            <DropdownToggle tag="button" className="btn btn-link p-0 dropdown-toggle text-muted">
                                <i className="uil uil-plus mr-2"></i>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem
                                    onClick={() => {
                                        setModalShow(true);
                                        console.log('iterationValue', iterationValue);
                                    }}>
                                    Add Area
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
                <div className="container-content-group">
                    {iterationData
                        ?.filter((items) => items?.iterationIndex === iterationValue)
                        .map((item, i) => (
                            <div
                                className="container-single-content mr-4"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setIterations(iterations + 1);
                                    // setSpaceClicked(i);
                                    // setClickedToOpen(3);
                                }}>
                                <span>{item.areaName}</span>
                                {/* <span class="badge badge-light font-weight-bold float-right mr-4">{item?.typeName}</span> */}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default InfiniteLayout;
