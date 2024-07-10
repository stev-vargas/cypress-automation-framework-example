import { getEnv } from "helpers";
import { ServiceModel } from "./service-model.interface";

const url = `${getEnv().baseUrls?.apiUrl}/example`;

const getData = () => cy.request({
    method: "GET",
    url,
    headers: {
        example: "test",
    },
});

const writeData = (data: { field1: string, field2: number }) => {
    return cy.request("POST", data);
};


const read = { getData };
const write = { writeData };

interface ExampleService extends ServiceModel<typeof read, typeof write> {}

export const exampleService: ExampleService = {
    read,
    write,
    childServices: undefined,
};