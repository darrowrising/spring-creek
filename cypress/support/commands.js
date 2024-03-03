import '@testing-library/cypress/add-commands';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (user) => {
  const password = Cypress.env('USER_PASSWORD');
  const username = `${user}@user.com`;

  cy.session([username, password], () => {
    cy.visit('/login');
    cy.findByRole('textbox', { name: 'Email Address' }).type(username);
    cy.findByTestId('password').type(password);
    cy.findByRole('button', { name: 'Log In' }).click();
  });
});

Cypress.Commands.add('selectDropdown', (selector, text, { type } = {}) => {
  cy.findByTestId(selector).click().as(selector);
  if (type) cy.get(`@${selector}`).type(type);
  cy.get('.ant-select-dropdown')
    .find('.ant-select-item-option')
    .each((el) => {
      if (el.text() === text) {
        cy.wrap(el).click();
      }
    });
});

// Cypress.Commands.add('selectSearch', (selector, text) => {
//   cy.findByTestId(selector).type(text).as(`Select Search ${text}`);
//   cy.get(`@Select Search ${text}`).blur();
// });
