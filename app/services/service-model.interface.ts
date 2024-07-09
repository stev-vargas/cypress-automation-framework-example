/**
 * Basic interface for service models.
 * @example
 * const read = { ... };
 * const write = { ... };
 * interface MyServiceModel extends ServiceModel<typeof read, typeof write> {};
 * export myService: MyServiceModel = {
 *   read,
 *   write,
 *   childServices: undefined,
 * }
 */
export interface ServiceModel<TRead = void, TWrite = void, TChild = void> {
    /**
     * Read actions against service, i.e. GET. *Optional*
     */
    read: TRead;
    /**
     * Write actions against service, i.e. POST, PUT, DELETE, etc. *Optional*
     */
    write: TWrite;
    /**
     * Child services  under main endpoint. *Optional*
     */
    childServices: TChild;
}

/**
 * Alias for a cypress chainable response.
 */
export type ServiceResponse = Cypress.Chainable<Cypress.Response<any>>;
/**
 * Represents the body of a service response.
 */
export type ResponseObject = { [key: string]: string | boolean | number | object };
