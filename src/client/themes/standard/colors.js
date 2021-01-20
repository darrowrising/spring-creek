import { adjustHue, complement, lighten } from 'polished';

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
    color_green_4: '#709658',
    color_green_5: '#44b128',
    // Blues
    color_blue_1: '#31708E',
    color_blue_2: '#5085A5',
    color_blue_3: '#8FC1E3',
    color_blue_4: '#12c7d0',
    // Yellows
    color_yellow_1: '#EBC351',
    color_yellow_2: '#F7CB15',
    color_yellow_3: '#E9D985',
    // Oranges
    color_orange_1: '#F55D3E',
    color_orange_2: '#f1a213',
    // Reds
    color_red_1: '#E03616',
    color_red_2: '#B0413E',
    // Pinks
    color_pink_1: '#de1a90',
    // Violet
    color_purple_1: '#760f9c',
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
    color_danger: core.color_red_1,
    color_success: core.color_green_5,
    color_warning: core.color_orange_2,
    // Organizations
    color_org_bishopric: core.color_orange_1,
    color_org_relief_society: core.color_green_2,
    color_org_young_men: lighten(0.2, core.color_blue_1),
    color_org_young_women: core.color_pink_1,
    color_org_elders_quorum: core.color_orange_2,
    color_org_primary: core.color_blue_4,
    color_org_sunday_school: core.color_purple_1,
    color_org_ward: core.color_green_1,
    color_org_stake: lighten(2, core.color_red_2),
    color_org_neighborhood: core.color_red_1,
    color_org_youth: lighten(1, core.color_red_1),
    // Status Colors
    color_status_active: core.color_green_5,
    color_status_pending: core.color_orange_2,
    color_status_inactive: core.color_grey_1,
    color_status_deactivated: core.color_red_1,
    // Categories
    color_category_youth: core.color_green_3,
    color_category_adult: core.color_orange_1,
};
