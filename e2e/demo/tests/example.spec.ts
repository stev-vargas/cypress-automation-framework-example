import { testCase } from "helpers";
import { examplePage } from "app/pages/example.page";
import { exampleService } from "app/services/example.service";

describe("Demo", () => {
    testCase({
        ids: "C123",
        title: "Example Test",
        test() {
            examplePage.navigate()
                .then(() => exampleService.read.getData())
                .then((response) => expect(response.isOkStatusCode).to.be.true)
                .then(() => examplePage.actions.clickButton1("One"))
                .then(() => examplePage.actions.clickButton1("Two"))
                .then(() => examplePage.actions.clickButton2());
        },
    });
});