import { genTestTitle } from "./test-title.helper";
import _ from "lodash";

type testMod = "only" | "skip" | "none";
/**
 * Runs the same test code for different data sets.
 * @param iterations.ids Test case ids
 * @param iteration.title Test case title
 * @param iteration.data Data to be used within the test iteration.
 * @param testBody Body of the tests
 * @param mod Modification to test, i.e. `"only"`, `"skip"`, or `"none"` (default)
 * @example
 * describe("Test Theory", () => {
 *     theory([
 *         {
 *             title: "@ID:111|Test 1",
 *             data: { dataPoint:  "hello"},
 *         },
 *         {
 *             title: "@ID:112|Test 2",
 *             data: { dataPoint: "goodbye" },
 *         },
 *     ],
 *     (iteration) => {
 *        expect(iteration.dataPoint).to.not.be.undefined;
 *     });
 * });
 */
export function theory<T>(
    iterations: { ids: (string | number)[]; title: string | string[]; data: T }[],
    testBody: (data: T) => void,
    mod: testMod = "none",
): void {
    iterations.forEach((iteration) => {
        const body = () => testBody(iteration.data);
        const title = genTestTitle(iteration.title, iteration.ids);
        switch (mod) {
            case "none":
                return it(title, body);
            case "only":
                return it.only(title, body);
            case "skip":
                return it.skip(title, body);
        }
    });
}

/**
 *
 * @param ids Test case ids
 * @param title Test case title
 * @param mod Modification to test, i.e. `"only"`, `"skip"`, or `"none"` (default) - i.e. set to "only" to set the equivalent of `it.only`
 * @returns Mocha test
 * @example
 * testCase({
 *   title: "Test case",
 *   ids: [ "C123" ],
 *   test: () => {
 *     // test body goes here...
 *   }
 * });
 */
export function testCase(args: {
    ids: string[] | number[] | string | number;
    title: string | string[];
    mod?: testMod;
    test: () => void;
    condition?: () => boolean;
}): Mocha.Test {
    const body = () => args.test();
    const title: string = genTestTitle(args.title, args.ids);
    switch (args.mod) {
        case "only":
            return it.only(title, body);
        case "skip":
            return it.skip(title, body);
        default:
            if (args.condition && args.condition() === true) {
                return it(title, body);
            } else if (args.condition && !args.condition()) {
                return it.skip(title, body);
            } else {
                return it(title, body);
            }
    }
}

/**
 * Interface that defines test group dataset.
 */
export interface DataSetEntry<T> {
    title: string;
    mod?: testMod;
    data: T;
}
/**
 * Single test that runs through a dataset.
 * @param args.ids TestRail ids for test.
 * @param args.title Title of the test.
 * @param args.mod Allows running skipping, or only running specific items in the dataset.
 * @param args.condition Specify a unique condition that needs to be satisfied for test to run.
 * @param args.dataset Data that the test group will iterate through.
 * @param args.test Test logic function (this will only act on one item in the dataset.)
 * @returns Mocha Test Object.
 * @example
 * testGroup({
 *  ids: "C123",
 *  title: "Test Group 1"
 *  dataset: [
 *   {
 *     title: "Test 1",
 *     data: {
 *      value1: true,
 *      value2: "test1",
 *      value3: 1
 *     }
 *   },
 *   {
 *     title: "Test 2",
 *     data: {
 *       value1: false,
 *       value2: "test2",
 *       value3: 3
 *     }
 *   }
 *  ],
 *  test(data) {
 *     ...
 *  }
 * })
 */
export function testGroup<T>(args: {
    ids: string[] | number[] | string | number;
    title: string | string[];
    mod?: testMod;
    condition?: () => boolean;
    dataset: DataSetEntry<T>[];
    test: (testData: T) => Cypress.Chainable;
}): Mocha.Test {
    return testCase({
        ids: args.ids,
        title: args.title,
        mod: args.mod,
        condition: args.condition,
        test() {
            const runTest = (input: typeof args.dataset): Cypress.Chainable => {
                if (input.length < 1) {
                    throw new Error("Test Group must contain more than on data element.");
                }
                const current = input[0];
                cy.logStep(current.title ?? "TEST");
                return args.test(current.data).then(() => {
                    if (input.length > 1) {
                        return runTest(input.slice(1));
                    }
                });
            };
            const onlyset = args.dataset.filter((d) => d.mod === "only");
            const runset = onlyset.length > 0 ? onlyset : args.dataset.filter((d) => d.mod !== "skip");
            if (runset.length >= 1) {
                runTest(runset);
            } else {
                cy.log("All tests skipped.");
            }
        },
    });
}

/**
 * Describes a collection of test cases.
 *
 * @example
 *   const testCases = {
 *      C123456: "Test one should pass",
 *   }
 */
type TestCases = Record<string, string>;

/**
 * Describe a `TestCases`-bound log method, which emits test flow progress info to the Cypress runner output.
 *
 * @example
 *   logTestCase("C123456", "trying to execute...");
 */
export type LogTestCase<C extends TestCases> = (id: keyof C, ...extra: any[]) => void;

/**
 * Implements the test body. Accepts the typed test case log function.
 */
type TestBody<C extends TestCases> = (params: {
    /** A function for logging steps related to the provided test cases, see {@link LogTestCase}. */
    logTestCase: LogTestCase<C>;
}) => void;

/**
 * Describes a test with a strongly typed test case definitions.
 *
 * @param title Test description, which is appended to the `it` title.
 * @param cases Test case definitions as a `{ ID: "description" }` map.
 * @param mod Optional, test run mode, can be "only", "skip", or "none"
 * @param testBody The test implementation that is executed in the `it` body.
 */
export function testCases<C extends TestCases>(
    title: string | string[],
    cases: C,
    mod: testMod,
    testBody: TestBody<C>
): Mocha.Test;
export function testCases<C extends TestCases>(title: string | string[], cases: C, testBody: TestBody<C>): Mocha.Test;
export function testCases<C extends TestCases>(
    title: string | string[],
    cases: C,
    modOrBody: testMod | TestBody<C>,
    testBody?: TestBody<C>,
): Mocha.Test {
    const logTestCase: LogTestCase<C> = (id, ...extra) =>
        cy.dummy().then(() =>
            Cypress.log({
                name: "TestCase",
                displayName: `[${String(id)}]`,
                message: `**_${cases[id] ?? `${String(id)}: CASE IS NOT DECLARED`}_**${
                    extra.length
                        ? `\n(${extra.map((arg) => (_.isObject(arg) ? JSON.stringify(arg) : arg)).join("\n")})`
                        : ""
                }`,
                consoleProps: (): Cypress.ObjectLike => ({
                    extra,
                    id,
                }),
            }),
        );

    const { mod, body } = _.isFunction(modOrBody)
        ? { mod: "none" as testMod, body: modOrBody }
        : { mod: modOrBody, body: testBody! };
    const test = () => body({ logTestCase });

    return testCase({
        mod,
        title,
        ids: _.keys(cases),
        test,
    });
}
