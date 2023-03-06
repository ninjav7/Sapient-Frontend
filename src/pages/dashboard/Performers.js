import React from 'react';
import {
    Card,
    CardBody,
    Media,
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
} from 'reactstrap';

const Member = ({ image, name, description, className }) => {
    return (
        <Media className="mt-1 border-top pt-3">
            <img src={image} className={`avatar rounded mr-3 ${className}`} alt={name} />
            <Media body>
                <h6 className="mt-1 mb-0 font-size-15">{name}</h6>
                <h6 className="text-muted font-weight-normal mt-1 mb-3">{description}</h6>
            </Media>
            <UncontrolledButtonDropdown className="align-self-center float-right">
                <DropdownToggle tag="button" className="btn btn-link p-0 dropdown-toggle text-muted">
                    <i className="uil uil-ellipsis-v"></i>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <i className="uil uil-edit-alt mr-2"></i>Edit
                    </DropdownItem>
                    <DropdownItem>
                        <i className="uil uil-exit mr-2"></i>Remove from Team
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem className="text-danger">
                        <i className="uil uil-trash mr-2"></i>Delete
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </Media>
    );
};

const Performers = () => {
    return (
        <Card>
            <CardBody className="pb-0 pt-2">
                <h5 className="mb-3 header-title">Top Performers</h5>
            </CardBody>
        </Card>
    );
};

export default Performers;
