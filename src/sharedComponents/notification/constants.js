import colors from '../../assets/scss/_colors.scss';

const COMPONENT_TYPES = Object.freeze({
    alert: 'alert',
    snackBar: 'snackBar',
});

const TYPES = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'success',
};

const COLORS_MAP_SNACKBAR = Object.freeze({
    [TYPES.error]: {
        background: colors.error600,
        icon: colors.error25,
        closeIcon: colors.baseWhite,
        title: colors.error25,
        description: colors.error25,
    },
    [TYPES.warning]: {
        background: colors.warning600,
        icon: colors.baseWhite,
        closeIcon: colors.baseWhite,
        title: colors.warning25,
        description: colors.warning25,
    },
    [TYPES.info]: {
        background: colors.primaryGray600,
        icon: colors.baseWhite,
        closeIcon: colors.baseWhite,
        title: colors.datavizBlue25,
        description: colors.datavizBlue25,
    },
    [TYPES.success]: {
        background: colors.success600,
        icon: colors.baseWhite,
        closeIcon: colors.baseWhite,
        title: colors.success25,
        description: colors.success25,
    },
});

const COLORS_MAP_ALERT = Object.freeze({
    [TYPES.error]: {
        background: colors.error100,
        icon: colors.error600,
        closeIcon: colors.error900,
        title: colors.error900,
        description: colors.error900,
    },
    [TYPES.warning]: {
        background: colors.warning100,
        icon: colors.warning600,
        closeIcon: colors.warning900,
        title: colors.warning900,
        description: colors.warning900,
    },
    [TYPES.info]: {
        background: colors.primaryGray150,
        icon: colors.primaryGray800,
        closeIcon: colors.primaryGray800,
        title: colors.primaryGray800,
        description: colors.primaryGray800,
    },
    [TYPES.success]: {
        background: colors.success100,
        icon: colors.success600,
        closeIcon: colors.success900,
        title: colors.success900,
        description: colors.success900,
    },
});

export { COMPONENT_TYPES, COLORS_MAP_SNACKBAR, COLORS_MAP_ALERT, TYPES };
