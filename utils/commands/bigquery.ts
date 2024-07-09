export {};

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * pre-requisite for all the functions:
             *  - User has to be authenticated by google cloud to access BigQuery table
             *  - Tests have to be tagged to run in pipeline. Example tag https://nuorder-inc.atlassian.net/browse/PLAT-5423:
             *
             */
            /**
             * Get BigQuery table
             * @param datasetId bigquery dataset id
             * @param tableId bigquery table id.
             * @returns Chainable
             */
            getBQTable: (params: { datasetId: string; tableId: string }) => Chainable;
            /**
             * Query BigQuery table
             * @param queryStr query string
             * @returns Chainable
             */
            queryBQTable: (queryStr: string) => Chainable;
        }
    }
}

Cypress.Commands.add("getBQTable", (params: { datasetId: string; tableId: string }) => {
    cy.log("**Get BQ table info**");
    const { datasetId, tableId } = params;
    return cy.task("accessBQ", { datasetId, tableId });
});

Cypress.Commands.add("queryBQTable", (queryStr: string) => {
    return cy.task("queryBQTable", queryStr);
});
