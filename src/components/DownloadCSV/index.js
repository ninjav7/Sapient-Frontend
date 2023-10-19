import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { useState } from 'react';
import Brick from '../../sharedComponents/brick';
import Typography from '../../sharedComponents/typography';
import { Button } from '../../sharedComponents/button';
import './styles.scss';
import Radio from '../../sharedComponents/form/radio/Radio';
import { useEffect } from 'react';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';

const DownloadCSV = (props) => {
    const { isOpen = false, closeModal } = props;

    const [downloadType, setDownloadType] = useState('current');
    const [count, setCount] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setCount(null);
            setDownloadType('current');
        }
    }, [isOpen]);

    const onConfirmSelect = (data_type, count) => {
        if (data_type === 'current') return { exportType: data_type };
        if (data_type === 'all') return { exportType: data_type };
        if (data_type === 'custom')
            return {
                exportType: data_type,
                exportCount: count,
            };
    };

    return (
        <Modal show={isOpen} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Download CSV`}</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body
                    size={Typography.Sizes.lg}>{`Please select the range you would like to download.`}</Typography.Body>

                <Brick sizeInRem={1} />

                <div
                    className={`options-wrapper ${
                        downloadType === 'current' ? `active-selection` : ``
                    } d-flex align-items-center p-3`}
                    onClick={() => setDownloadType('current')}>
                    <Radio
                        name="radio-1"
                        checked={downloadType === 'current'}
                        onClick={() => setDownloadType('current')}
                    />

                    <div>
                        <Typography.Subheader
                            size={Typography.Sizes.md}>{`Download current view`}</Typography.Subheader>
                        <Brick sizeInRem={0.25} />
                        <Typography.Body
                            size={Typography.Sizes.xl}>{`Download the data you are viewing as CSV`}</Typography.Body>
                    </div>
                </div>

                <Brick sizeInRem={0.75} />

                <div
                    className={`options-wrapper ${
                        downloadType === 'all' ? `active-selection` : ``
                    } d-flex align-items-center p-3`}
                    onClick={() => setDownloadType('all')}>
                    <Radio name="radio-2" checked={downloadType === 'all'} onClick={() => setDownloadType('all')} />

                    <div>
                        <Typography.Subheader size={Typography.Sizes.md}>{`Download all data`}</Typography.Subheader>
                        <Brick sizeInRem={0.25} />
                        <Typography.Body size={Typography.Sizes.xl}>{`This may take some time`}</Typography.Body>
                    </div>
                </div>

                <Brick sizeInRem={0.75} />

                <div
                    className={`options-wrapper ${
                        downloadType === 'custom' ? `active-selection` : ``
                    } d-flex align-items-center p-3`}
                    onClick={() => setDownloadType('custom')}>
                    <Radio
                        name="radio-3"
                        checked={downloadType === 'custom'}
                        onClick={() => setDownloadType('custom')}
                    />

                    <div>
                        <Typography.Subheader
                            size={Typography.Sizes.md}>{`Choose how many results to download`}</Typography.Subheader>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            type="number"
                            placeholder="Enter number of results"
                            onChange={(e) => {
                                if (e.target.value < 0) return;
                                setCount(+e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={count}
                        />
                    </div>
                </div>

                <Brick sizeInRem={0.75} />

                <Brick sizeInRem={2} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={closeModal}
                    />
                    <Button
                        label={'Confirm'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        onClick={() => {
                            onConfirmSelect(downloadType, count);
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default DownloadCSV;
