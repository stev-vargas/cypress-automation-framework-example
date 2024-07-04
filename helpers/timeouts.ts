export const fromSeconds = (n: number) => n * 1000;
export const fromMinutes = (n: number) => n * 60000;

// @ts-expect-error required
global.timers = new Map();

export const testTimeout = (ms: number, test: Record<string, unknown>) => {
    // @ts-expect-error required
    const currentTest = cy.state("runnable") || test;
    if (!currentTest) {
        throw new Error("Could not determine current test.");
    }
    // @ts-expect-error required
    if (global.timers.has(currentTest)) {
        // @ts-expect-error required
        clearTimeout(global.timers.get(currentTest));
        // @ts-expect-error required
        global.timers.delete(currentTest);
    }
    const startedAt = +new Date();
    const timer = setTimeout(() => {
        // @ts-expect-error required
        const testNow = cy.state("runnable");
        if (currentTest !== testNow) {
            return;
        }
        if (testNow.state) {
            return;
        }
        const timeNow = +new Date();
        if (timeNow - startedAt >= ms) {
            const maxRunTimeText = getTimeText(ms);
            throw Error(`Test exceeded max runtime of ${maxRunTimeText}`);
        }
    }, ms);
    // @ts-expect-error required
    global.timers.set(currentTest, timer);
};

export const getTimeText = (ms: number) =>
    ms < 1000 ? `${ms} ms` : ms < 60000 ? `${ms / 1000} seconds` : `${ms / 60000} minutes`;
