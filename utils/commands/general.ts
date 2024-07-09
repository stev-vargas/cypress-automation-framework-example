
import _ from "lodash";
import * as XLSX from "xlsx";
import "@4tw/cypress-drag-drop";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Retrieves a page object using the `[data-test=...]` custom tag.
             * @param dataTestValue Value of the data-test tag.
             * @param timeout sets the timeout, optional. Default is 50000
             * @returns Chainable page object.
             */
            getByDataTest: (dataTestValue: string, timeout?: number) => Chainable;
            /**
             * Retrieves a page object using the `[data-testid=...]` custom tag.
             * @param dataTestValue Value of the data-testid tag.
             * @param timeout sets the timeout, optional. Default is 50000
             * @returns Chainable page object.
             */
            getByDataTestId: (dataTestIdValue: string, timeout?: number) => Chainable;
            /**
             * Retrieves a page object using the `[data-id=...]` custom tag.
             * @param dataTestValue Value of the data-id tag.
             * @param timeout sets the timeout, optional. Default is 50000
             * @returns Chainable page object.
             */
            getByDataId: (dataTestIdValue: string, timeout?: number) => Chainable;
            /**
             * Retrieves a dom element using the `[data-test-item-id=...]` custom tag.
             * @param itemId Value of the data-testid tag.
             * @returns Chainable page object.
             */
            getByDataItemId: (itemId: string) => Chainable;

            getById: (itemId: string) => Chainable;

            getByAutomationKey: (dataTestValue: string) => Chainable;

            /**
             * Retrieve the body of an iFrame as a chainable object.
             * @param iframeSelector Specific selector for the iframe object. Optional, default is `#legacy-app`
             * @returns iframe as a chainable object.
             */
            getIframeBody: (iframeSelector?: string, log?: any) => Chainable;
            /**
             * Logs a test in the format: **Step: {message}**
             * @param message Text of the message.
             * @param extra A dictionary of additional values to log.
             */
            logStep: (message: string | string[], extra?: Record<string, any>) => Chainable;
            logSubStep: (message: string, extra?: Record<string, any>) => Chainable;
            /**
             * Modifies domain attributes of cookies to avoid `401` errors in some specs.
             */
            extendCookieDomains: () => void;
            /**
             * Clears the current authentication cookies, i.e. the `cmsa` and the `rcmsa` cookies.
             */
            clearAuthCookies: () => Chainable;

            /**
             * Press the escape key to clear out any open menus.
             */
            pressEscape: () => Chainable;
            /**
             * Returns a dummy chainable value.
             *
             * @memberof Chainable
             */
            dummy: () => Chainable;
            /**
             * Chain a step after a cypress chainable command.
             *
             * @memberof Chainable
             */
            thenStep: <T = void, R = void>(
                this: Cypress.Chainable<T>,
                step: string,
                fn: (sub: T) => Cypress.Chainable<R> | void
            ) => Chainable<R>;
            /**
             * Chain a sub setup after a cypress chainable command.
             *
             * @memberof Chainable
             */
            thenSubStep: <T = void, R = void>(
                this: Cypress.Chainable<T>,
                step: string,
                fn: (sub: T) => Cypress.Chainable<R> | void
            ) => Chainable<R>;
            /**
             * Inject an object into a `.then` function after a cypress chainable
             *
             * @memberof Chainable
             */
            thenWith: <O, T = void, R = void>(
                this: Cypress.Chainable<T>,
                obj: O,
                fn: (obj: O, sub: T) => Cypress.Chainable<R> | void
            ) => Chainable<R>;
            /**
             * Inject an object into a `.then` function after a cypress chainable and log it as a step.
             *
             * @memberof Chainable
             */
            thenStepWith: <O, T = void, R = void>(
                this: Cypress.Chainable<T>,
                step: string,
                obj: O,
                fn: (obj: O, sub: T) => Cypress.Chainable<R> | void
            ) => Chainable<R>;
            /**
             * Inject an object into a `.then` function after a cypress chainable and log it as a sub step.
             *
             * @memberof Chainable
             */
            thenSubStepWith: <O, T = void, R = void>(
                this: Cypress.Chainable<T>,
                step: string,
                obj: O,
                fn: (obj: O, sub: T) => Cypress.Chainable<R> | void
            ) => Chainable<R>;
            /** Wrap an object inside a chainable with suppressed logging. */
            wrapNoLog: <T>(obj: T) => Cypress.Chainable<T>;
            /** Extending wait to also include a logged message to explain reason for waiting. */
            logAndWait: (message: string, time: number) => Chainable;
            /* Custom command to set launchdarkly feature flag values.
             * @param times - Limits the number of request interceptions to the 'clientstream.launchdarkly.com/eval' endpoint. Without limitation the spec can run undefinetly long.
             * @examples:
             *    cy.updateFeatureFlags({ 'flag-name': false });
             *    cy.updateFeatureFlags({ 'flag-name': false }, 10);
             */
            updateFeatureFlags(featureFlags: { [key: string]: boolean }, times?: number): Chainable<Element>;

            /**
             * Wait until an element is no longer detached from DOM
             *
             * @memberof Chainable
             */
            waitUntilNotDetached: (
                eleFn: () => Chainable<JQuery<any>>,
                options?: { timeout?: number; interval?: number; waitTime?: number }
            ) => Chainable;
            /**
             * Parses PDF based on RegExp.
             * @param url redirect PDF url.
             * @param regexp PDF template RegExp.
             * @returns array of matched product.
             */
            parsePdfWithRegExp(url: string, regexp: RegExp): Chainable;

            /**
             * Parses XLSX file from remote location and calculates hash value.
             * @param url redirect XLSX url.
             * @returns hash string of workbook object.
             */
            getExcelHash(url: string): Chainable<string>;
            /**
             * Downloads file from remote location and stores it in the file system.
             * @param url source url.
             * @param path target path.
             */
            downloadFile(url: string, path: string, isTempFile?: boolean): Chainable;
            /**
             * Downloads files with timeout from remote location and stores it in the file system.
             * @param url source url.
             * @param path target path.
             * @param timeout timeout.
             */
            downloadFileWithTimeout(url: string, path: string, timeout: number): Chainable;
            /**
             * Remove file from the file system.
             * @param path file path.
             */
            removeDownloadedFile(path: string): Chainable;

            /**
             * Verify xlsx contains headers only
             * @param path file path.
             */
            verifyXlsxContainsHeadersOnly(path: string): Chainable;

            /**
             * return excel column Values
             *
             *  @param path file path.
             *  @param columnName colmn name
             */
            returnExcelColumnValues(path: string, columnName: string): Chainable;

            /**
             * Retrieve the current value of the clipboard.
             * * Note: You may have to use the cypress `.focus` function on a focusable element to prevent the "Document Unfocused" error.
             * @memberof Chainable
             */
            getClipboardValue: (skipClipboardPermissions?: boolean) => Chainable;
            /**
             * Apply click action to unfocus and close open dropdowns.
             * @example Doors Menu, Tile Menu, etc
             */
            unfocus: () => Chainable;
            /**
             * Resolves all cypress promises passed.
             * @param fns callbacks that each return a cypress promise.
             * @returns cypress promise with all values as input.
             */
            all: (...fns: (() => Chainable)[]) => Chainable<any[]>;
            getByGrapesJsType: (type: string) => Chainable;
            draftJsEnter: (selector: string, text: string) => Chainable;
            waitRequest: (routeAlias: string) => Chainable;
            clickOutside: (clickOnZero?: boolean) => Chainable;
            /**
             * Wait for loading message to be gone.
             * @param circleType [svg] Uses svg to identify loading message.
             * @param circleType [css] Uses element class to identify loading message.
             * @param circleType [msg] Uses message text "Loading..." to identify loading message.
             * @param delay Delay checking for loading message by a certain amount, in ms.
             */
            waitForLoadingCircle: (circleType?: "svg" | "css" | "msg", delay?: number) => Chainable;

            /**
             * To workaround the open issue in Cypress:
             * https://github.com/cypress-io/cypress/issues/21173
             */
            makeXHRRequest: (brandId: string, method: string, url: string, data: any) => Chainable;
            /**
             *
             * @param delay Amount, in ms, to delay responses.
             * @param throttle  Simulate a connection with specific amount of bandwidth, in Mbps.
             * @returns
             */
            setDelayAndTimeout: (delay?: number, throttle?: number) => Chainable;
            /**
             * Simple function that injects '@' symbol to string and uses it to wait for an alias.
             * @param alias Alias name.
             */
            waitForAlias(alias: string, options?: Parameters<typeof cy.wait>[1]): Chainable;

            /**
             * Inserts/Updates LocalStorage with desired key and value and then refreshes page.
             * Specifically useful when refreshing within drive, assortments and whiteboard pages to prevent from being redirected to
             * "Switch your drive workspace" page in case `LAST_MERCHANT_ID` is wiped by another test running in parallel.
             * @param key A string containing the name of the key you want to create/update
             * @param value A string containing the value you want to give the key you are creating/updating
             */
            reloadWithStorage(key: string, value: string): Chainable;

            genCsv({
                name,
                data,
                useCsvExtension,
                useFixTuresTempDir,
            }: {
                name: string;
                data: { [key: string]: string | number | boolean | undefined }[];
                useCsvExtension?: boolean;
                useFixTuresTempDir?: boolean;
            }): Chainable;

            genXlsx({
                name,
                sheetName,
                data,
                useFixTuresTempDir,
            }: {
                name: string;
                sheetName?: string;
                data: Record<string, string | number | boolean>[];
                useFixTuresTempDir?: boolean;
            }): Chainable;
            /**
             * Subs the onBeforeLoad event.
             * Use to swallow browser alert on "beforeunload" event.
             * @example
             * beforeEach(() => {
             *     cy.stubBeforeUnload();
             * });
             */
            stubBeforeUnload(): void;
        }

        interface EventLegacy extends Event {
            initTextEvent(
                eventType: string,
                canBubble: boolean,
                cancelable: boolean,
                view: object,
                data: string,
                inputMethod: number,
                locale: string
            ): void;
        }
    }
}
// eslint-disable-next-line @typescript-eslint/naming-convention
const ADD = Cypress.Commands.add;

ADD("getByDataTest", (dataTestValue, timeout = 50000) => cy.get(`[data-test=${dataTestValue}]`, { timeout }));

ADD("getByDataTestId", (dataTestIdValue, timeout = 50000) => cy.get(`[data-testid=${dataTestIdValue}]`, { timeout }));

ADD("getById", (dataTestIdValue, timeout = 50000) => cy.get(`[id=${dataTestIdValue}]`, { timeout }));

ADD("getByDataId", (dataTestIdValue, timeout = 50000) => cy.get(`[data-id=${dataTestIdValue}]`, { timeout }));
// added for e2e linesheet test
ADD("getByDataItemId", (itemId) => cy.get(`[data-test-item-id=${itemId}]`));

ADD("getIframeBody", (iframeSelector = "#legacy-app", { log } = { log: true }) => {
    return cy
        .get(iframeSelector, { log })
        .should("exist")
        .its("0.contentDocument.body", { log })
        .should("not.be.empty")
        .then((body) => cy.wrap(body, { log }));
});

ADD("logStep", (message: string | string[], extra: Record<string, any> = {}) => {
    if (Array.isArray(message)) {
        message = message.map((m) => `**_${m}_**`).join("<br>");
    }
    return cy.dummy().then(() => {
        return Cypress.log({
            name: "Step",
            displayName: "Step",
            message: `**_${message}_**`,
            consoleProps: (): Cypress.ObjectLike => ({
                ...extra,
                message,
            }),
        });
    });
});

ADD("logSubStep", (message: string, extra: Record<string, any> = {}) =>
    cy.dummy().then(() => {
        return Cypress.log({
            name: "Sub Step",
            displayName: "Sub Step",
            message: `_${message}_`,
            consoleProps: (): Cypress.ObjectLike => ({
                ...extra,
                message,
            }),
        });
    }),
);

ADD("extendCookieDomains", () => {
    cy.getCookies().then((cookies) => {
        cookies.forEach((cookie) => {
            cookie.domain = ".nuorder.com";
            cy.setCookie(cookie.name, cookie.value, { ...cookie });
        });
    });
});

ADD("clearAuthCookies", () => {
    cy.logStep("Clearing Auth Cookies");
    cy.clearCookie("cmsa");
    return cy.clearCookie("rcmsa");
});

ADD("pressEscape", () => cy.xpath("//body").type("{esc}"));

ADD("thenStep", { prevSubject: "optional" }, function <
    T = void,
    R = void,
>(subject: T, step: string, fn: (s: T) => Cypress.Chainable<R> | void) {
    cy.logStep(step);
    return fn(subject);
});

ADD("thenSubStep", { prevSubject: "optional" }, function <
    T = void,
    R = void,
>(subject: T, step: string, fn: (s: T) => Cypress.Chainable<R> | void) {
    cy.logSubStep(step);
    return fn(subject);
});

ADD("thenWith", { prevSubject: "optional" }, function <
    O,
    T = void,
    R = void,
>(subject: T, obj: O, fn: (o: O, s: T) => Cypress.Chainable<R> | void) {
    return fn(obj, subject);
});

ADD("thenStepWith", { prevSubject: "optional" }, function <
    O,
    T = void,
    R = void,
>(subject: T, step: string, obj: O, fn: (o: O, s: T) => Cypress.Chainable<R> | void) {
    cy.logStep(step);
    return fn(obj, subject);
});

ADD("thenSubStepWith", { prevSubject: "optional" }, function <
    O,
    T = void,
    R = void,
>(subject: T, step: string, obj: O, fn: (o: O, s: T) => Cypress.Chainable<R> | void) {
    cy.logSubStep(step);
    return fn(obj, subject);
});

ADD("dummy", () => cy.wrap("skip", { log: false }));

ADD("wrapNoLog", <T>(obj: T) => cy.wrap(obj, { log: false }));

ADD("logAndWait", (message: string, time: number) => {
    cy.log(`_${message}_`);
    return cy.wait(time);
});

/**
 * Cypress command to turn on a feature flag for launch darkly.
 */
ADD("updateFeatureFlags", (featureFlags: { [key: string]: boolean }, times?: number) => {
    cy.logStep("Intercept Feature Flag Requests To Enable/Disable Features");
    // turn off push (EventSource) updates from LaunchDarkly
    cy.intercept(_.pickBy({ hostname: /.*clientstream.launchdarkly.com/, times }), (req) => {
        req.reply("data: no streaming feature flag data here\n\n", {
            "content-type": "text/event-stream; charset=utf-8",
        });
    }).as("clientstream-launchDarkly");

    // ignore api calls to events endpoint
    cy.intercept({ hostname: /.*events.launchdarkly.com/ }, { body: {} }).as("events-launchDarkly");

    // return feature flag values in format expected by launchdarkly client
    cy.intercept({ hostname: /.*app.launchdarkly.com/ }, (req) => {
        const body: { [key: string]: { value: boolean } } = {};
        Object.entries(featureFlags).forEach(([featureFlagName, featureFlagValue]) => {
            body[featureFlagName] = { value: featureFlagValue };
        });
        // Send the request to the target server ,  And intercept the actual response returned by the server
        req.on("response", (res) => {
            res.send({
                body: {
                    ...res.body,
                    ...body,
                },
                headers: res.headers,
            });
        });
    }).as("app-launchDarkly");
});

ADD(
    "waitUntilNotDetached",
    (
        eleFn: () => Cypress.Chainable<JQuery<any>>,
        options?: { timeout?: number; interval?: number; waitTime?: number },
    ) => {
        const timeout = options?.timeout ?? 1000;
        const interval = options?.interval ?? 10;
        const waitTime = options?.waitTime ?? 300;
        return cy
            .waitUntil(
                () =>
                    eleFn()
                        .wait(waitTime)
                        .then(($ele) => Cypress.dom.isAttached($ele)),
                { timeout, interval, log: false },
            )
            .then(() => eleFn());
    },
);

ADD("parsePdfWithRegExp", (url: string, regexp: RegExp) => {
    return cy.task("getTextFromPdfAfterPolling", url).then((text: any) => {
        const matches = text.matchAll(regexp);
        const products = [...matches].map((match) => ({ ...match.groups }));
        return { products };
    });
});


ADD("getExcelHash", (url: string) => cy.task("getWorkbookHash", url));

ADD("downloadFile", (url: string, path: string, isTempFile?: boolean) =>
    cy.task("downloadFile", { url, path, isTempFile }),
);

ADD("downloadFileWithTimeout", (url: string, path: string, timeout: number) => {
    cy.task("downloadFile", { url, path }), { timeout: timeout };
});

ADD("removeDownloadedFile", (path: string) => cy.task("removeDownloadedFile", path));

ADD("verifyXlsxContainsHeadersOnly", (filePath: string) => {
    cy.readFile(filePath, "binary").then((xlsxData) => {
        const workbook = XLSX.read(xlsxData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Get the range of the sheet (excluding headers)
        const range = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1);
        const numRows = range.length;
        const numCols = range[0] ? Object.keys(range[0]).length : 0;

        // Verify that there is no data (non-header) present in the sheet
        expect(numRows).to.equal(0, "Expected only one row (header)");
        expect(numCols).to.equal(0, "Expected zero columns");
    });
});

ADD("returnExcelColumnValues", (filePath: string, columnName: string) => {
    cy.readFile(filePath, "binary").then((fileContent) => {
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Taking the first sheet
        const columnData: string[] = [];
        const range = XLSX.utils.sheet_to_json(sheet, { raw: true, header: 1 }) as (string | number)[][];
        const headerRow = range[0];

        const columnIndex = headerRow.findIndex((headerCell) => headerCell === columnName);
        if (columnIndex === -1) {
            throw new Error(`Column "${columnName}" not found.`);
        }
        for (let rowNum = 1; rowNum < range.length; rowNum++) {
            const row = range[rowNum];
            const cellValue = row[columnIndex] as string;
            columnData.push(cellValue);
        }
        return columnData;
    });
});

ADD("getClipboardValue", (): Cypress.Chainable<string> => {
    let clipValue: string;

    const getClipboard = () =>
        cy
            .wrap(
                Cypress.automation("remote:debugger:protocol", {
                    command: "Browser.grantPermissions",
                    params: {
                        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
                        origin: window.location.origin,
                    },
                }),
            )
            .then(() =>
                cy.window().then((win) => {
                    return win.navigator.clipboard.readText().then((text) => {
                        clipValue = text;
                    });
                }),
            );

    return getClipboard().then(() => cy.wrapNoLog(clipValue));
});

ADD("unfocus", () => cy.xpath("//body").click());

ADD("all", (...fns) => {
    const results: any[] = [];

    fns.reduce((_, fn) => {
        fn().then((result: any) => results.push(result));
        return results;
    }, results);

    return cy.wrap(results);
});

ADD("getByAutomationKey", (dataTestValue) => cy.get(`[data-automation-key=${dataTestValue}]`));

ADD("getByGrapesJsType", (type) => cy.get(`[data-gjs-type=${type}]`));
ADD("draftJsEnter", (selector, text) => {
    cy.getByDataTestId(selector).then((input) => {
        const textarea = input.get(0);
        textarea.dispatchEvent(new Event("focus"));
        const textEvent = document.createEvent("TextEvent") as Cypress.EventLegacy;
        textEvent.initTextEvent("textInput", true, true, window, text, 1, "en-US");
        textarea.dispatchEvent(textEvent);
        textarea.dispatchEvent(new Event("blur"));
    });
});

ADD("waitRequest", (routeAlias) => {
    cy.wait(routeAlias).then(({ response }) => {
        if (response?.statusCode) {
            expect(response.statusCode).to.be.within(200, 201);
        }
    });
});

ADD("clickOutside", (clickOnZero = false) => {
    const body = () => cy.xpath("//body");
    return clickOnZero ? body().click(0, 0) : body().click();
});

ADD("waitForLoadingCircle", (loadingCircleType: "svg" | "css" | "msg" = "svg", delay = 500) => {
    let path: string;
    switch (loadingCircleType) {
        case "svg":
            path = "//*[local-name()='svg']/*[local-name()='circle' and contains(@style, 'stroke: rgb(47, 199, 190')]";
            break;
        case "css":
            path = "//div[contains(@class, 'loadingSpinner')]";
            break;
        case "msg":
            path = "//*[text()='Loading...']";
            break;
    }
    const circle = () => cy.xpath(path);

    return cy.wait(delay).waitUntil(
        () =>
            circle()
                .should(() => {})
                .then((c) => !c.is(":visible")),
        {
            customMessage: "Loading completed",
        },
    );
});

ADD("makeXHRRequest", (brandId: string, method: string, url: string, data: any) => {
    const xhr = new XMLHttpRequest();

    const promise = new Promise((resolve, reject) => {
        xhr.open(method, url);
        xhr.setRequestHeader("active-brand", brandId);
        xhr.onload = () => (xhr.status === 200 || xhr.status === 201 ? resolve(xhr.response) : reject(xhr.response));
        xhr.onerror = () => reject(xhr);
        xhr.send(data);
    });

    return cy.wrap(promise);
});

ADD("setDelayAndTimeout", (delay?: number, throttle?: number) => {
    if (!delay && !throttle) {
        return cy.dummy();
    }
    return cy
        .intercept(
            {
                url: "**",
                middleware: true,
            },
            (req) => {
                req.on("response", (res) => {
                    if (delay) {
                        res.delay = delay;
                    }
                    if (throttle) {
                        res.setThrottle(throttle);
                    }
                });
            },
        )
        .as(`Delay:${delay ?? 0}ms|Throttle:${throttle ?? 0}Mbps`);
});

ADD("waitForAlias", (alias: string, options?: Parameters<typeof cy.wait>[1]) => cy.wait(`@${alias}`, options));

ADD("reloadWithStorage", (key: string, value: string) => {
    localStorage.setItem(key, value);
    cy.reload();
});

const genCsv = ({
    name,
    data,
    useCsvExtension = true,
    useFixTuresTempDir = false,
}: {
    name: string;
    data: { [key: string]: string | number | boolean | undefined }[];
    useCsvExtension?: boolean;
    useFixTuresTempDir?: boolean;
}) =>
    cy.task("genCsv", { name, data, useCsvExtension, useFixTuresTempDir }).then((file) => {
        cy.wait(100);
        return cy.wrapNoLog(file as string);
    });

const genXlsx = ({
    name,
    sheetName,
    data,
    useFixTuresTempDir,
}: {
    name: string;
    sheetName?: string;
    data: { [key: string]: string | number | boolean }[];
    useFixTuresTempDir?: boolean;
}) =>
    cy.task("genXlsx", { name, sheetName, data, useFixTuresTempDir }).then((file) => {
        cy.wait(100);
        return cy.wrap(file as string);
    });

ADD("genCsv", genCsv);

ADD("genXlsx", genXlsx);

ADD("stubBeforeUnload", () =>
    cy.on("window:before:load", (win) => {
        const userCallback: any = cy.stub;
        const ourCallback = (e: any) => {
            Object.defineProperty(e, "returnValue", {
                get() {
                    return "";
                },
                set() {},
            });

            const result = userCallback(e);
            return result;
        };
        win.addEventListener("beforeunload", ourCallback);
    }),
);
