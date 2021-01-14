import standard from '../client/themes/standard';

export default {
    name: 'standard',
    variables: {
        standard,
    },
    /* Key = Antd theme variable
       value = Is our theme variable */
    antdOverrides: {
        'primary-color': 'color_primary',
        // 'error-color': 'color_danger',
        // 'warning-color': 'color_warning',
        // 'info-color': 'color_info',
        // 'success-color': 'color_success',
    },
};
