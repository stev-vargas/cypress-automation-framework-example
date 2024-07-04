/**
 * Composes the test title prefix from the test case IDs.
 * @param ids Ids test is associated with.
 */
export const getTestTitlePrefix = (ids: (string | number)[] | string | number): string => `@ID:${normalizeIds(ids)}|`;

const normalizeIds = (ids: (string | number)[] | string | number): string => {
    if (Array.isArray(ids)) {
        return ids.map(normalizeIds).join(",");
    }
    if (typeof ids === "number") {
        return `C${ids}`;
    }
    return ids;
};

/**
 * Generates the title of a test including test tags in the correct format.
 * @param title Title of the test.
 * @param ids Ids test is associated with.
 * @returns Test title with test ids.
 * @example Output: "@ID:C1,C2,C3|Sample test title"
 */
export const genTestTitle = (title: string | string[], ids: (string | number)[] | string | number): string => {
    const testTitle: string = Array.isArray(title) ? title.join("\n") : title;
    const prefix: string = getTestTitlePrefix(ids);
    return `${prefix}${testTitle}`;
};
