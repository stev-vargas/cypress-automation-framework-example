import { setupCypressHooks } from "helpers";
import "utils/commands/general";
import "utils/commands/bigquery";
import "utils/commands/network";
import "utils/commands/recursion";

setupCypressHooks();

beforeEach(() => {
    cy.stubBeforeUnload();
});