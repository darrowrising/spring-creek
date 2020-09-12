import { theme as themeVars } from 'theme';

export default {
    axis: {
        style: {
            axis: {
                fill: 'transparent',
                stroke: themeVars('color_axis_line'),
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
            },
            grid: {
                stroke: themeVars('color_grid_line')
            },
            ticks: {
                size: 5,
                stroke: 'transparent'
            },
            tickLabels: {
                fill: themeVars('color_axis_label'),
                padding: 5
            }
        }
    },
    chart: {
        padding: {
            top: 0, bottom: 20, left: 60, right: 0
        }
    },
    bar: {
        style: {
            data: {
                fill: ({ datum }) => {
                    const { type } = datum;
                    if (type === 'newCases') return themeVars('color_new_cases');
                    return themeVars('color_graph_bar');
                },
                strokeWidth: 0
            }
        }
    },
    line: {
        style: {
            data: {
                stroke: ({ data }) => {
                    const { type } = data[0];
                    if (type === 'existing') return themeVars('color_existing');
                    if (type === 'recovered') return themeVars('color_recovered');
                    if (type === 'confirmed') return themeVars('color_confirmed');
                    if (type === 'deaths') return themeVars('color_deaths');
                    return themeVars('color_graph_bar');
                }
            }
        }
    }
};
