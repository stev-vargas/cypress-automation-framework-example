/**
 * Common interface for POMs.
 * @example
 * const elements = { ... }
 * const actions = { ... }
 * const navigate = () => { ... }
 * interface SamplePagePom extends Pom<typeof elements, typeof actions, typeof navigate> {};
 * export const samplePage: SamplePagePom = {  elements, actions, navigate };
 */
export interface Pom<TElements, TActions, TNavigate = void> {
    /**
     * Defines page elements
     */
    elements: TElements;
    /**
     * Predefined actions to be performed on the page under test.
     */
    actions: TActions;
    /**
     * Function that navigates to the page. *Optional*
     */
    navigate: TNavigate;
}

/** This is a POM that also includes pre-defined intercepts. */
export interface PomWithIntercepts<TElements, TActions, TIntercepts, TNavigate = void>
    extends Pom<TElements, TActions, TNavigate> {
    /** Predefined intercepts */
    intercepts: TIntercepts;
}

type ChainablePageElement = Cypress.Chainable<JQuery<HTMLElement>>;
export interface PageElement {
    /** Path to the element, can be css selector, xpath, data-test, data-test-id, etc. */
    path: string;
    /** Function that returns the chainable web element from the page. */
    get: () => ChainablePageElement;
}
