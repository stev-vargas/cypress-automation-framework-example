/* eslint-disable cypress/no-unnecessary-waiting */
export {};

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             *
             * @param from
             * @param to
             * @param droppableCoords
             * @returns Chainable
             */
            dragToOverride: (
                from: () => Cypress.Chainable<JQuery<HTMLElement>>,
                to: () => Cypress.Chainable<JQuery<HTMLElement>>,
                droppableCoords: Coords,
                override: boolean
            ) => Chainable;
            /**
             *
             * @param from
             * @param to
             * @returns Chainable
             */
            dragTo: (
                from: () => Cypress.Chainable<JQuery<HTMLElement>>,
                to: () => Cypress.Chainable<JQuery<HTMLElement>>,
                location?: "top" | "bottom" | "left" | "right" | "middle"
            ) => Chainable;

            /**
             * @param element
             */
            getCoords: (element: HTMLElement) => Chainable<Coords>;

            /**
             * Drag an element by a certain amount.
             *
             * @memberof Chainable
             */
            dragBy: (
                element: () => Cypress.Chainable<JQuery<HTMLElement>>,
                amount: { x?: number; y?: number },
                options?: {
                    skipMouseUp?: boolean;
                }
            ) => Chainable;
            /**
             * @param element
             * @param amount Amount to drag element in the x,y coordinates.
             * Drags an element from the element's center point by a certain amount relative to the position of the element on the page.
             */
            relativeDragBy: (
                element: () => Cypress.Chainable<JQuery<HTMLElement>>,
                amount: { x?: number; y?: number }
            ) => Chainable;
            /**
             * @param element
             */
            dragOverride: (drag: JQuery<HTMLElement>, drop: JQuery<HTMLElement>) => Chainable;
        }
    }
}

interface Coords {
    x: number;
    y: number;
}

const getCoords = (element: HTMLElement) => {
    const domRect = element.getBoundingClientRect();
    const coords: Coords = { x: domRect.left + (domRect.width / 2 || 0), y: domRect.top + (domRect.height / 2 || 0) };

    return cy.wrap(coords);
};

interface Coords {
    x: number;
    y: number;
}

function dragTo(
    from: () => Cypress.Chainable<JQuery<HTMLElement>>,
    to: () => Cypress.Chainable<JQuery<HTMLElement>>,
    location: "top" | "bottom" | "left" | "right" | "middle" = "middle",
) {
    return to().then((toElement) => {
        const droppableRect = toElement[0].getBoundingClientRect();

        // center to droppable area
        switch (location) {
            case "middle":
                droppableRect.x += droppableRect.width / 2;
                droppableRect.y += droppableRect.height / 2;
                break;
            case "top":
                droppableRect.x += droppableRect.width / 2;
                droppableRect.y += droppableRect.height;
                break;
            case "left":
                droppableRect.x += droppableRect.width;
                droppableRect.y += droppableRect.height / 2;
                break;
            case "right":
                droppableRect.x += droppableRect.width;
                droppableRect.y += droppableRect.height;
                break;
        }

        return from().then((fromElement) => {
            const draggableRect = fromElement[0].getBoundingClientRect();
            cy.log(`draggable rect: ${JSON.stringify(draggableRect)}`);
            const x = droppableRect.x - draggableRect.x;
            const y = droppableRect.y - draggableRect.y;
            return cy.wait(500).then(() => {
                from()
                    .should("be.visible")
                    .then(() => from().trigger("mousedown", { button: 0 }))
                    .then(() => from().trigger("mousemove", x, y, { force: true, bubbles: true }))
                    .then(() => from().trigger("mouseup", x, y, { force: true, bubbles: true }))
                    .then(() => from().trigger("mouseup"));
            });
        });
    });
}

function dragBy(
    element: () => Cypress.Chainable<JQuery<HTMLElement>>,
    amount: { x?: number; y?: number },
    options?: {
        skipMouseUp?: boolean;
    },
) {
    const x = amount.x ?? 0;
    const y = amount.y ?? 0;
    element()
        .should("be.visible")
        .then(() => {
            return element()
                .trigger("mousedown", { button: 0 })
                .then(() => {
                    cy.wait(300);
                    return element().trigger("mousemove", x, y, { force: true, bubbles: true });
                })
                .then(() => {
                    if (!options?.skipMouseUp) {
                        cy.wait(300);
                        return element().trigger("mouseup", x, y, { force: true, bubbles: true });
                    }
                });
        });
}

function relativeDragBy(element: () => Cypress.Chainable<JQuery<HTMLElement>>) {
    return element().then((e) => {
        const r = e[0].getBoundingClientRect();
        const rx = r.x + r.x / 2;
        const ry = r.y + r.y / 2;
        return element()
            .trigger("mousedown", { button: 0 })
            .wait(300)
            .then(() => element().trigger("mousemove", { clientX: rx, clientY: ry, force: true, bubbles: true }))
            .wait(300)
            .then(() => element().trigger("mouseup", { clientX: rx, clientY: ry, force: true, bubbles: true }));
    });
}

function dragOverride(drag: JQuery<HTMLElement>, drop: JQuery<HTMLElement>) {
    cy.log(`drag: ${JSON.stringify(drag[0].getBoundingClientRect())}`);
    cy.log(`drop: ${drop.length}`);

    const draggableRect = drag[0].getBoundingClientRect();
    const droppableRect = drop[0].getBoundingClientRect();

    const x = droppableRect.x - draggableRect.x;
    const y = droppableRect.y - draggableRect.y;

    cy.wrap(drag).trigger("mousedown", { button: 0, force: true });
    cy.wrap(drag).trigger("mousemove", x, y, { button: 0, force: true, bubbles: true });
    cy.wrap(drag).trigger("mouseup", x, y, { button: 0, force: true, bubbles: true });
}

Cypress.Commands.add("dragTo", dragTo);
Cypress.Commands.add("dragOverride", dragOverride);
Cypress.Commands.add("getCoords", getCoords);
Cypress.Commands.add("dragBy", dragBy);
Cypress.Commands.add("relativeDragBy", relativeDragBy);
