import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { exploreFiltersList } from './constants';
import { ExploreStore } from '../../store/ExploreStore';

const ExploreFilters = (props) => {
    const { selectedFilter, handleMenuItemClick } = props;

    const MENU = (
        <Menu selectable={true} defaultSelectedKeys={[selectedFilter]} onSelect={handleMenuItemClick}>
            {exploreFiltersList.map((item) => (
                <Menu.Item key={item?.value}>{item?.label}</Menu.Item>
            ))}
        </Menu>
    );

    const activeFilterObj = exploreFiltersList.find((el) => el?.value === selectedFilter);

    return (
        <Dropdown overlay={MENU} className="mouse-pointer">
            <a className="ant-dropdown-link">
                {activeFilterObj?.label} <DownOutlined className="ml-2" />
            </a>
        </Dropdown>
    );
};

const ExplorePage = () => {
    const history = useHistory();
    const { filterType = 'no-grouping' } = useParams();

    const selectedFilter = ExploreStore.useState((s) => s.selectedFilter);

    const handleMenuItemClick = ({ key }) => {
        history.push({
            pathname: `/explore/overview/${key}`,
        });
    };

    useEffect(() => {
        if (filterType) {
            localStorage.setItem('selectedFilter', filterType);

            ExploreStore.update((s) => {
                s.selectedFilter = filterType;
            });
        }
    }, [filterType]);

    return (
        <div>
            <ExploreFilters selectedFilter={selectedFilter} handleMenuItemClick={handleMenuItemClick} />
        </div>
    );
};

export default ExplorePage;
