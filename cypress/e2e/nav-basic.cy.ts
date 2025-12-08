describe('Staff navigation basic', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'user',
        JSON.stringify({ id: 'staff-001', email: 'staff@nightscene.com', name: 'Test Staff', role: 'staff' })
      );
      win.localStorage.setItem('token', 'token_staff');
    });
  });

  it('navigates dashboard -> arrivals -> bookings without table map leftovers', () => {
    cy.visit('/staff');
    cy.contains('Arrivals').click();
    cy.url().should('include', '/staff/arrivals');
    cy.get('[data-testid="arrivals-page"]').should('exist');
    cy.get('#tablemap-canvas').should('not.exist');

    cy.contains('Bookings').click();
    cy.url().should('include', '/staff/bookings');
    cy.get('#tablemap-canvas').should('not.exist');
  });
});
describe(''Staff navigation basic'', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        ''user'',
        JSON.stringify({ id: ''staff-001'', email: ''staff@nightscene.com'', name: ''Test Staff'', role: ''staff'' })
      );
      win.localStorage.setItem(''token'', ''token_staff'');
    });
  });

  it(''navigates dashboard -> arrivals -> bookings without table map leftovers'', () => {
    cy.visit(''/staff'');
    cy.contains(''Arrivals'').click();
    cy.url().should(''include'', ''/staff/arrivals'');
    cy.get(''[data-testid="arrivals-page"]'').should(''exist'');
    cy.get(''#tablemap-container'').should(''not.exist'');

    cy.contains(''Bookings'').click();
    cy.url().should(''include'', ''/staff/bookings'');
    cy.get(''#tablemap-container'').should(''not.exist'');
  });
});
