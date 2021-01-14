/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender, waitFor, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import themeConfig from '../src/configs/theme.config';

const themeVariables = themeConfig.variables[themeConfig.name];

function render(ui, { route = '/', history = createMemoryHistory({ initialEntries: [route] }), ...renderOptions } = {}) {
    function Wrapper({ children }) {
        return (
            <ThemeProvider theme={themeVariables}>
                <Router history={history}>
                    {children}
                </Router>
            </ThemeProvider>
        );
    }

    Wrapper.propTypes = {
        children: PropTypes.node.isRequired
    };

    return {
        ...rtlRender(ui, {
            wrapper: Wrapper,
            ...renderOptions,
        }),
        // adding `history` to the returned utilities to allow us
        // to reference it in our tests (just try to avoid using
        // this to test implementation details).
        history,
    };
}

function renderSetUp(arg, component) {
    const utils = render(component);
    const input = utils.getByTestId(arg);
    return {
        input,
        ...utils,
    };
}

async function handleEventAndWait(input, value) {
    return waitFor(() => {
        fireEvent.change(input, {
            target: {
                value,
            }
        });
    });
}

export * from '@testing-library/react';
// override the built-in render with our own
export { render, renderSetUp, handleEventAndWait };
