import PropTypes from 'prop-types';

const PROP_TYPES = {
    panel: {
        typeOptions: PropTypes.arrayOf(
            PropTypes.shape({ label: PropTypes.node.isRequired, value: PropTypes.any.isRequired })
        ),
        typeProps: PropTypes.any,
        startingBreaker: PropTypes.any,
        numberOfBreakers: PropTypes.object,
        mainBreaker: PropTypes.any.isRequired,
        mainBreakerEdit: PropTypes.any,

        //callBacks
        //breakerProps, breakerData, children - args
        callBackBreakerProps: PropTypes.func,
        onBreakerLinkedClick: PropTypes.func.isRequired,
        isEditable: PropTypes.bool,
        states: {
            isEditingModeState: PropTypes.bool,
            isViewDeviceIdsState: PropTypes.bool,
        },
        hideViewDeviceIdControl: PropTypes.bool,
        isOneColumn: PropTypes.bool,
        styles: PropTypes.object,
    },
    breakerColumn: {
        //breakerProps, breakerData, children - args
        callBackBreakerProps: PropTypes.func,
    },
    breakerWrapper: {
        nodesMap: PropTypes.any,
    },
    breakerLinkerButton: {
        isLinked: PropTypes.bool,
    },
    onPanelEditClick: PropTypes.func,
    onPanelToggleDeviceView: PropTypes.func,
    dangerZoneProps: PropTypes.any,
};

const PREFIXES_TO_BREAKERS_VALUES = Object.freeze({
    ratedAmps: 'A',
    ratedVolts: 'V',
});

export { PROP_TYPES, PREFIXES_TO_BREAKERS_VALUES };
