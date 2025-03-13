import Hymns from '.';

describe('Hymns', () => {
  it('display hymns table', () => {
    cy.mount(<Hymns />);

    cy.findByText('Number');
    cy.findByText('Title');
    cy.findByRole('cell', { name: '1' });
    cy.findByRole('cell', { name: 'The Morning Breaks' });
  });

  it('Add hymn', () => {
    cy.mount(<Hymns />);

    cy.findByRole('button', { name: 'Add Hymn' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', { name: 'Save' }).click();

      cy.findByLabelText('Number').type('999');
      cy.findByLabelText('Title').type('Test Hymn');
      cy.findByLabelText('URL of PDF version of the hymn (optional)').type('https://example.com');
      cy.findAllByText('This field is required').should('not.exist');
      cy.findByRole('button', { name: 'Save' }).click();
    });

    cy.findByRole('cell', { name: '999' });
    cy.findByRole('cell', { name: 'Test Hymn' });
  });

  it('Edit hymn', () => {
    cy.mount(<Hymns />);

    cy.findByRole('cell', { name: '999' })
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Edit' }).click();
      });
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText('Number').clear().type('998');
      cy.findByLabelText('Title').clear().type('Test Hymn 2');
      cy.findByLabelText('URL of PDF version of the hymn (optional)').clear().type('https://example.com2');
      cy.findByRole('button', { name: 'Save' }).click();
    });

    cy.findByRole('cell', { name: '998' });
    cy.findByRole('cell', { name: 'Test Hymn 2' });
  });

  it('clears form content on cancel', () => {
    cy.mount(<Hymns />);

    cy.findByRole('button', { name: 'Add Hymn' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText('Number').clear().type('999');
      cy.findByLabelText('Title').clear().type('Test Hymn');
      cy.findByRole('button', { name: 'Cancel' }).click();
    });
    cy.findByRole('button', { name: 'Add Hymn' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText('Number').should('have.value', '');
      cy.findByLabelText('Title').should('have.value', '');
    });
  });

  it('search hymn by number or title', () => {
    cy.mount(<Hymns />);

    // search by text
    cy.findByRole('cell', { name: 'The Morning Breaks' });
    cy.findAllByRole('row').should('have.length', 380);
    cy.findByRole('searchbox', { name: 'search' }).type('The Morning Breaks');
    cy.findByRole('button', { name: 'search' }).click();
    cy.findAllByRole('row').should('have.length', 2);
    cy.findByRole('cell', { name: 'The Morning Breaks' });
    cy.findByRole('cell', { name: '1' });
    // search by number
    cy.findByRole('searchbox', { name: 'search' }).clear().type('10');
    cy.findByRole('button', { name: 'search' }).click();
    cy.findAllByRole('row').should('have.length', 2);
    cy.findByRole('cell', { name: 'Come, Sing to the Lord' });
    cy.findByRole('cell', { name: '10' });
  });

  it('display error states when adding a hymn', () => {
    cy.mount(<Hymns />);

    cy.findByRole('button', { name: 'Add Hymn' }).click();
    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', { name: 'Save' }).click();
      cy.findAllByText('This field is required').should('have.length', 2);
      cy.findByLabelText('Number').type('1');
      cy.findByLabelText('Title').type('The Morning Breaks');
      cy.findByRole('button', { name: 'Save' }).click();
      cy.findByText('Hymn number already exist');
      cy.findByText('Hymn title already exist');
    });
  });

  it('delete hymn', () => {
    cy.mount(<Hymns />);

    cy.findByRole('cell', { name: '998' })
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Delete' }).click();
      });
    cy.findByRole('button', { name: 'Remove' }).click();
    cy.findByRole('cell', { name: '998' }).should('not.exist');
  });
});
