import { genTestTitle } from "./test-title.helper";

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