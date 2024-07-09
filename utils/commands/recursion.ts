import { RecurseOptions, recurse } from "cypress-recurse";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Repeat an action over all the values in an array.
             * @param args.items Array of items to iterate over.
             * @param args.action Action to be performed on each iteration of the loop.
             * @param args.delay How long to wait before each action. (Optional: default = 300)
             * @param args.log Log message to display after each iteration.
             * @memberof Chainable
             * @example
             * const items = [...];
             * cy.iterate({
             *  items,
             *  action: (item) => { ... },
             *  delay: 300,
             *  log: "Completed iteration"
             *
             * });
             */
            iterate: <A, T>(args: {
                items: A[];
                action: (item: A) => Cypress.Chainable<T>;
                delay?: number;
                log?: string;
            }) => Chainable;
            /**
             * Allows chaining `recurse` function directly from `cy` object in order to reduce nesting.
             * @param commandsFn Initial command
             * @param checkFn Validates result of initial command to determine whether loop should be terminated.
             * @param options Recuse options.
             */
            recurse: <T>(
                commandsFn: () => Chainable<T>,
                checkFn: (x: T, reducedValue?: any) => boolean | void | Chai.Assertion,
                options?: Partial<RecurseOptions<T>>
            ) => Chainable;
        }
    }
}

Cypress.Commands.add("iterate", function <
    A,
    T,
>(args: { items: A[]; action: (item: A) => Cypress.Chainable<T>; delay?: number; log?: string }) {
    let i = 0;
    let item: A = args.items[i];
    return recurse(
        () => args.action(item),
        () => {
            return i === args.items.length - 1;
        },
        {
            post: () => {
                item = args.items[++i];
            },
            delay: args.delay ?? 300,
            log: args.log ?? "Performed iteration",
        },
    );
});

Cypress.Commands.add(
    "recurse",
    <T>(
        commandsFn: () => Cypress.Chainable<T>,
        checkFn: (x: T, reducedValue?: any) => boolean | void | Chai.Assertion,
        options?: Partial<RecurseOptions<T>>,
    ): Cypress.Chainable<T> => recurse(commandsFn, checkFn, options),
);
