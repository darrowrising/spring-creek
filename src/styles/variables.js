import { css } from 'styled-components';
import { rgba, lighten, darken, complement, adjustHue } from 'polished';

// whites
export const colorWhite1 = '#FFFFFF';
export const colorWhite2 = '#F7F9FB';
export const colorWhite3 = '#ebf1f5';
// blacks
export const colorBlack1 = '#000000';
export const colorBlack2 = '#333333';
// greys
export const colorGrey1 = '#888888';
export const colorGrey2 = '#CCCCCC';
export const colorGrey3 = '#eeeeee';
// browns
export const colorBrown1 = '#9b5a3a';
// greens
export const colorGreen1 = '#B5CA8D';
export const colorGreen2 = '#8BB174';
export const colorGreen3 = '#B2BD7E';
export const colorGreen4 = '#709658';
export const colorGreen5 = '#44b128';
// blues
export const colorBlue1 = '#31708E';
export const colorBlue2 = '#5085A5';
export const colorBlue3 = '#8FC1E3';
export const colorBlue4 = '#12c7d0';
export const colorBlue5 = '#317f8e';
export const colorBlue6 = '#0080ff';
// yellows
export const colorYellow1 = '#EBC351';
export const colorYellow2 = '#F7CB15';
export const colorYellow3 = '#E9D985';
// oranges
export const colorOrange1 = '#f1a213';
export const colorOrange2 = '#F55D3E';
// reds
export const colorRed1 = '#E03616';
export const colorRed2 = '#B0413E';
// Pinks
export const colorPink1 = '#de1a90';
export const colorPink2 = '#ED6B94';
// Violet
export const colorViolet1 = '#760f9c';
export const colorViolet2 = '#DA71FF';

// core colors
export const colorPrimary = colorBlue1;
export const colorSecondary = adjustHue(-120, colorPrimary);
export const colorTertiary = adjustHue(120, colorPrimary);
export const colorComplement = complement(colorPrimary);
// utility colors
export const colorInfo = lighten(0.1, colorBlue1);
export const colorWarning = colorOrange1;
export const colorAlert = darken(0.1, colorRed1);
export const colorError = lighten(0.1, colorRed1);
export const colorSuccess = colorGreen1;
// organizations
export const colorOrgBishopric = colorOrange1;
export const colorOrgEldersQuorum = colorBlue2;
export const colorOrgNeighborhood = colorRed1;
export const colorOrgOther = colorComplement;
export const colorOrgPrimary = colorBlue3;
export const colorOrgReliefSociety = colorGreen2;
export const colorOrgStake = lighten(0.2, colorComplement);
export const colorOrgWard = colorGreen1;
export const colorOrgYoungMen = colorBlue4;
export const colorOrgYoungWomen = lighten(0.2, colorRed1);
export const colorOrgYouth = lighten(0.1, colorRed1);
export const colorOrgSundaySchool = colorViolet1;
// status colors
export const colorStatusActive = colorGreen5;
export const colorStatusPending = colorOrange2;
export const colorStatusInactive = colorGrey1;
export const colorStatusDeactivated = colorRed1;
// background colors
export const colorBgDark = colorBlack2;
// text colors
export const colorBgText = colorGrey3;
export const colorText = colorBlack2;
// button colors
export const colorButtonGrey = colorGrey1;
export const colorButtonDark = colorGrey3;
// border colors
export const colorBorder1 = colorGrey3;
export const colorBorder2 = colorGrey2;
export const colorBorderPrint = lighten(0.3, colorBlack2);
// devices
export const mobileMaxWidth = '480px';

/* eslint-disable indent */
const rootCss = () => css`
  :root {
    /** COLORS **/
    /* whites */
    --color-white-1: ${colorWhite1};
    --color-white-2: ${colorWhite2};
    --color-white-3: ${colorWhite3};
    /* blacks */
    --color-black-1: ${colorBlack1};
    --color-black-2: ${colorBlack2};
    /* greys */
    --color-grey-1: ${colorGrey1};
    --color-grey-2: ${colorGrey2};
    --color-grey-3: ${colorGrey3};
    /* browns */
    --color-brown-1: ${colorBrown1};
    /* greens */
    --color-green-1: ${colorGreen1};
    /* blues */
    --color-blue-1: ${colorBlue1};
    --color-blue-2: ${colorBlue2};
    --color-blue-3: ${colorBlue3};
    --color-blue-4: ${colorBlue4};
    --color-blue-5: ${colorBlue5};
    --color-blue-6: ${colorBlue6};
    /* yellows */
    --color-yellow-1: ${colorYellow1};
    /* oranges */
    --color-orange-1: ${colorOrange1};
    /* reds */
    --color-red-1: ${colorRed1};
    /* pinks */
    --color-pink-1: ${colorPink1};
    --color-pink-2: ${colorPink2};
    /* violets */
    --color-violet-1: ${colorViolet1};

    /* prime colors */
    --color-primary: ${colorPrimary};
    --color-primary-hover: ${darken(0.1, colorPrimary)};
    --color-secondary: ${colorSecondary};
    --color-tertiary: ${colorTertiary};
    --color-complement: ${colorComplement};

    /* utility colors */
    --color-info: ${colorInfo};
    --color-success ${colorSuccess};
    --color-warning: ${colorWarning};
    --color-alert: ${colorAlert};
    --color-error: ${colorError};

    /* organizations */
    --color-org-bishopric: ${colorOrgBishopric};
    --color-org-elders-quorum: ${colorOrgEldersQuorum};
    --color-org-neighborhood: ${colorOrgNeighborhood};
    --color-org-other: ${colorOrgOther};
    --color-org-primary: ${colorOrgPrimary};
    --color-org-relief-society: ${colorOrgReliefSociety};
    --color-org-stake: ${colorOrgStake};
    --color-org-ward: ${colorOrgWard};
    --color-org-young-men: ${colorOrgYoungMen};
    --color-org-young-women: ${colorOrgYoungWomen};
    --color-org-youth: ${colorOrgYouth};
    --color-org-sunday-school: ${colorOrgSundaySchool};

    /* status colors */
    --color-status-active: ${colorStatusActive};
    --color-status-pending: ${colorStatusPending};
    --color-status-inactive: ${colorStatusInactive};
    --color-status-deactivated: ${colorStatusDeactivated};

    /* text colors */
    --color-text: ${colorText};
    --color-text-select: lighten(0.1, colorPrimary);
    --color-bg-text: var(--color-grey-3);
    --color-link: var(--color-blue-6);

    /* background colors */
    --color-bg-light: var(--color-white-1);
    --color-bg-dark: ${colorBgDark};
    --color-bg-select-transparent: ${rgba(colorPrimary, 0.15)};

    /* border colors */
    --color-border-1: ${colorBorder1};
    --color-border-2: ${colorBorder2};
    --color-border-print: ${colorBorderPrint};

    /* fonts */
    --font-brand: pattaya, sans-serif;
    --font-header: "Century Gothic", sans-serif;
    --font-text: "helvetica neue", helvetica, arial, sans-serif;
    /* font sizes */

    /* spacing */
    --space-1: 4px;
    --space-2: calc(var(--space-1) * 2);
    --space-3: calc(var(--space-1) * 3);
    --space-4: calc(var(--space-1) * 4);
    --space-5: calc(var(--space-1) * 5);
    --space-6: calc(var(--space-1) * 6);
    --space-7: calc(var(--space-1) * 7);
    --space-8: calc(var(--space-1) * 8);
    --space-9: calc(var(--space-1) * 9);
    --space-10: calc(var(--space-1) * 10);
    --space-11: calc(var(--space-1) * 11);
    --space-12: calc(var(--space-1) * 12);
    --space-13: calc(var(--space-1) * 13);
    --space-14: calc(var(--space-1) * 14);
    --space-15: calc(var(--space-1) * 15);
    --space-16: calc(var(--space-1) * 16);


    --space-res-1: 10%;
    --space-res-2: calc(var(--space-res-1) * 2);
    --space-res-3: calc(var(--space-res-1) * 3);

    /* elevations */
    --elevation-1: 2px 2px 10px ${rgba(colorGrey1, 0.2)};
    --elevation-2: 4px 4px 12px ${rgba(colorGrey1, 0.4)};
    --elevation-3: 1px 1px 8px ${rgba(colorGrey2, 0.2)};

    /* animations */
    /* --animation-fade-in: 0% { opacity: 0; } 100% { opacity: 1; };
    --animation-slow: 0.5s;
    --animation-medium: 0.35s;
    --animation-fast: 0.2s; */

    --transition-slow: 0.5s ease;
    --transition-medium: 0.35s ease;
    --transition-fast: 0.2s ease;

    /* media breaks */
    --mobile-view-max: 480px;
    --tablet-view-max: 768px;
    --mq-mobile-width: 48em;
    --mq-tablet-width: 64em;
    --mq-desktop-width: 96em;

    /* dimensions */
    --width-max-medium: 700px;
    --width-app-max: 1400px;
    --width-app-min: 960px;

    --padding-app-sides: 30px;
    --rotate-min: -10deg;
    --asset-size-desktop: 220px;

    /** COMPONENTS SPECIFIC **/
    /* Menu */
    --menu-width: 300px;
    --menu-bottom-box-height: 60px;
    --menu-bottom-box-bg-color: ${colorBlue1}; /* ${lighten(0.05, colorBlue1)}; */
    --menu-bottom-box-color: var(--color-gray-1);

    /* Buttons */
    --color-button-grey: ${colorButtonGrey};
    --color-button-dark: ${colorButtonDark};
  `;

export default rootCss;
