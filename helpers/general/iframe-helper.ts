export const LEGACY_APP_IFRAME_SELECTOR = "#legacy-app";

export interface IframeOptions extends Partial<Cypress.Loggable> {
    /**
     * Instructs whether the yielded value should be asserted.
     * Optional, `true` if omitted.
     */
    assert?: boolean;
}

interface GetIframeDocumentOptions extends IframeOptions {
    /**
     * The yielded value of this `Chainable` should contain a DOM element where to find the requested element.
     * Optional, if omitted, the top window document is used.
     */
    root?: Cypress.Chainable;
}

export const getIframeDocument = (
    iframeSelector = LEGACY_APP_IFRAME_SELECTOR,
    { log = true, assert = true, root }: GetIframeDocumentOptions = {},
) => {
    const doc = (
        root?.find(iframeSelector, { timeout: 60000, log }) ?? cy.get(iframeSelector, { timeout: 60000, log })
    ).its("0.contentDocument", { log });
    return assert ? doc.should("exist") : doc;
};

export const getIframeBody = (
    iframeSelector = LEGACY_APP_IFRAME_SELECTOR,
    { log = true, assert = true, root }: GetIframeDocumentOptions = {},
) => {
    const body = getIframeDocument(iframeSelector, { log, assert, root }).its("body", { log });
    return (assert ? body.should("not.be.undefined").should("not.be.null") : body).then((body) =>
        cy.wrap(body, { log }),
    );
};

export const getIframeRoot = (
    selector: any,
    {
        timeout = 5000,
        retries = 5,
        iframeSelector = LEGACY_APP_IFRAME_SELECTOR,
    }: { timeout?: number; retries?: number; iframeSelector?: string } = {},
) => {
    cy.log(`Trying to find iframe root ${selector}`);

    const internalGetIframeRoot = (retriesLeft: any): any => {
        return getIframeBody(iframeSelector, { log: false }).then(($iframe: any) => {
            const $root = $iframe.find(selector);
            if ($root.length === 0) {
                if (retriesLeft > 0) {
                    cy.wait(timeout / retries);

                    return internalGetIframeRoot(retriesLeft - 1);
                }

                expect($root.length).to.be.greaterThan(0, `Expected to find HTML element ${selector}`);
            }

            return cy.wrap($root).should("be.visible");
        });
    };

    return internalGetIframeRoot(retries);
};
