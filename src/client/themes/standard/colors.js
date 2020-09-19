import {
    adjustHue, complement, desaturate, lighten
} from 'polished';

export const core = {
    // Whites
    color_white_1: '#FFFFFF',
    color_white_2: '#F7F9FB',
    // Blacks
    color_black_1: '#000000',
    color_black_2: '#333333',
    // Greys
    color_grey_1: '#888888',
    color_grey_2: '#CCCCCC',
    color_grey_3: '#eeeeee',
    // Greens
    color_green_1: '#B5CA8D',
    color_green_2: '#8BB174',
    color_green_3: '#B2BD7E',
    // Blues
    color_blue_1: '#31708E',
    color_blue_2: '#5085A5',
    color_blue_3: '#8FC1E3',
    // Yellows
    color_yellow_1: '#EBC351',
    color_yellow_2: '#F7CB15',
    color_yellow_3: '#E9D985',
    // Oranges
    color_orange_1: '#F55D3E',
    // Reds
    color_red_1: '#E03616',
    color_red_2: '#B0413E',
    // Pinks

    // Violet
    color_purple_1: '#760f9c'
};
const primary = core.color_blue_1;

export const colors = {
    // Main Colors
    color_primary: primary,
    color_secondary: core.color_green_1,
    color_tertiary: adjustHue(120, primary),
    color_complement: complement(primary),
    color_primary_admin: adjustHue(-10, primary),
    // Utility Colors

    // Types
    color_confirmed: core.color_red_1,
    color_confirmed_active: desaturate(0.2, core.color_red_1),
    color_recovered: core.color_green_1,
    color_existing: core.color_yellow_1,
    color_new_cases: core.color_purple_1,
    color_deaths: core.color_grey_1,
    color_new_deaths: lighten(0.1, core.color_grey_1),
    // Graphs
    color_axis_label: core.color_black_2,
    color_axis_line: core.color_grey_1,
    color_graph_new_cases_hover: adjustHue(20, core.color_purple_1),
    /* Bar */
    color_graph_bar: core.color_black_2,
    /* Line */
    color_graph_line: core.color_black_2
};
