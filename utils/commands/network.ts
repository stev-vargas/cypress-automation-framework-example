declare namespace Cypress {
    interface Chainable {
        /**
         * 🛑 Simulates browser loosing internet connectivity.
         * @description
         * ⚠️ Make sure to use the `cy.goOnline()` command
         * using a post test script, i.e. `afterEach()`
         * to restore network connectivity
         */
        goOffline: () => Chainable;
        /**
         * 🟢 Restore network connectivity.
         */
        goOnline: () => Chainable;
    }
}

Cypress.Commands.add("goOffline", () => {
    cy.log("**Going offline**");
    cy.intercept(`${Cypress.config().baseUrl}/**`, (req) => {
        req.destroy();
    }).as("OFFLINE");
});

Cypress.Commands.add("goOnline", () => {
    cy.log("**Going back online**");
    cy.intercept(`${Cypress.config().baseUrl}/**`, (req) => {
        req.continue();
    });
});
