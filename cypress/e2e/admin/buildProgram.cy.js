const id = '230108';

describe('Build Program Page', () => {
  before(() => {
    cy.login('ultron');
    cy.viewport(1400, 1000);

    cy.visit(`/admin/build-program/${id}`);

    cy.wait(3000);
    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Yes' }).click();
    cy.wait(3000);
  });

  it('should save program data', () => {
    cy.visit(`/admin/build-program/${id}`);

    cy.selectDropdown('print-layout', 'events');
    cy.findByTestId('topic').type('topic test');
    cy.selectDropdown('conducting', 'Bus Garden');
    cy.selectDropdown('chorister', 'Kristi von Neiderhausern');
    cy.selectDropdown('organist', 'test 5 Baggs');
    cy.findByTestId('opening-hymn').type(5);
    cy.selectDropdown('invocation', 'Jim Halpert');
    cy.findByTestId('sacrament-hymn').type(194);
    cy.selectDropdown('speaker-name-0', 'Pam Beasley', { type: 'Pam' });
    cy.findByRole('button', { name: 'plus Add field' }).click();
    cy.selectDropdown('program-type-1', 'music');
    cy.findByTestId('music-title').clear().type('My Redeemer Lives');
    cy.findByTestId('music-performers').type('Performed by Hallie Ellis. Accompanied by Sydrick');
    cy.findByRole('button', { name: 'plus Add field' }).click();
    cy.selectDropdown('speaker-name-2', 'Steve Rogers', { type: 'Steve' });
    cy.findByTestId('closing-hymn').type(142);
    cy.selectDropdown('benediction', 'Dwight Shrutt', { type: 'Dwight' });

    cy.findByTestId('program-component').within(() => {
      cy.findByText('Bus Garden').should('exist');
      cy.findByText('Kristi von Neiderhausern').should('exist');
      cy.findByText('test 5 Baggs').should('exist');
      cy.findByText('High on the Mountain Top').should('exist');
      cy.findByText('Jim Halpert').should('exist');
      cy.findByText('There Is a Green Hill Far Away').should('exist');
      cy.findByText('Pam Beasley').should('exist');
      cy.findByText('My Redeemer Lives').should('exist');
      cy.findByText('Performed by Hallie Ellis. Accompanied by Sydrick').should('exist');
      cy.findByText('Steve Rogers').should('exist');
      cy.findByText('Sweet Hour of Prayer').should('exist');
      cy.findByText('Dwight Shrutt').should('exist');
    });

    cy.findByRole('button', { name: 'Save' }).click();
    cy.wait(2000);
  });

  it('should show saved data on Sacrament Speakers page', () => {
    cy.visit('/admin/sacrament-speakers');

    cy.get('[data-row-key=o2k6toCQV]').should('contains.text', 'Pam BeasleyJan 8, 2023');
    cy.get('[data-row-key=jEAKHF_XY]').should('contains.text', 'Steve RogersJan 8, 2023');

    cy.findByText('2023').click();
    cy.get('[data-row-key="Jan 8"]')
      .eq(1)
      .within(() => {
        cy.findByText('topic test');
        cy.findByText('Pam Beasley');
        cy.findByText('Steve Rogers');
      });
  });

  it('should show saved data on Conducting page', () => {
    cy.visit(`/admin/conducting/${id}`);

    cy.findByTestId('presiding').should('contains.text', 'Bishop Bishop User');
    cy.findByTestId('chorister').should('contains.text', 'Kristi von Neiderhausern');
    cy.findByTestId('organist').should('contains.text', 'test 5 Baggs');
    cy.findByTestId('openingHymn').should('contains.text', '#5 - High on the Mountain Top');
    cy.findByTestId('invocation').should('contains.text', 'Jim Halpert');
    cy.findByTestId('sacramentHymn').should('contains.text', '#194 - There Is a Green Hill Far Away');
    cy.findAllByTestId('speaker').eq(0).should('contains.text', 'Pam Beasley');
    cy.findByTestId('musical-number')
      .should('contains.text', 'My Redeemer Lives')
      .and('contains.text', 'Performed by Hallie Ellis. Accompanied by Sydrick');
    cy.findAllByTestId('speaker').eq(1).should('contains.text', 'Steve Rogers');
    cy.findByTestId('closingHymn').should('contains.text', '#142 - Sweet Hour of Prayer');
    cy.findByTestId('benediction').should('contains.text', 'Dwight Shrutt');
  });

  it('should show saved data on Program page', () => {
    cy.visit(`/program/${id}`);

    cy.findByText('January 8, 2023 9:00 AM');
    cy.findByText('Bishop Bishop User');
    cy.findByText('Kristi von Neiderhausern');
    cy.findByText('test 5 Baggs');
    cy.findByText('#5');
    cy.findByText('High on the Mountain Top');
    cy.findByText('Jim Halpert');
    cy.findByText('#194');
    cy.findByText('There Is a Green Hill Far Away');
    cy.findByText('Pam Beasley');
    cy.findByText('My Redeemer Lives');
    cy.findByText('Performed by Hallie Ellis. Accompanied by Sydrick');
    cy.findByText('Steve Rogers');
    cy.findByText('#142');
    cy.findByText('Sweet Hour of Prayer');
    cy.findByText('Dwight Shrutt');
  });

  it('should revert old speaker history when a new speaker is selected', () => {
    cy.visit('/admin/sacrament-speakers');

    cy.get('[data-row-key=JniLZxDzC]').should('contains.text', 'Rachael CleggJan 5, 2020');

    cy.visit(`/admin/build-program/${id}`);

    cy.selectDropdown('speaker-name-2', 'Rachael Clegg', { type: 'Rach' });

    cy.findByRole('button', { name: 'Save' }).click();
    cy.wait(2000);

    cy.visit('/admin/sacrament-speakers');

    cy.get('[data-row-key=JniLZxDzC]').should('contains.text', 'Rachael CleggJan 8, 2023');
    cy.get('[data-row-key=jEAKHF_XY]').should('contains.text', 'Steve RogersJan 16, 2022');

    cy.findByText('2023').click();
    cy.get('[data-row-key="Jan 8"]')
      .eq(1)
      .within(() => {
        cy.findByText('topic test');
        cy.findByText('Pam Beasley');
        cy.findByText('Rachael Clegg');
      });
  });

  it('should remove speaker history when a program is deleted', () => {
    cy.visit(`/admin/build-program/${id}`);

    cy.wait(3000);
    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Yes' }).click();
    cy.wait(3000);

    cy.visit('/admin/sacrament-speakers');

    cy.get('[data-row-key=JniLZxDzC]').should('contains.text', 'Rachael CleggJan 5, 2020');
    cy.get('[data-row-key=o2k6toCQV]').should('contains.text', 'Pam BeasleyJan 7, 2018');

    cy.findByText('2023').click();
    cy.get('[data-row-key="Jan 8"]')
      .eq(1)
      .within(() => {
        cy.findByText('topic test').should('not.exist');
        cy.findByText('Pam Beasley').should('not.exist');
        cy.findByText('Rachael Clegg').should('not.exist');
      });
  });
});
