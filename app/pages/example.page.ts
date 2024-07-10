import { PageElement, Pom } from "./pom.interface";

const button1 = (text: string): PageElement => {
    return {
        path: `//span/button[@class, 'btn' and .='${text}']`,
        get() {
            return cy.xpath(this.path);
        },
    };
};

const button2: PageElement = {
    path: "button2",
    get() {
        return cy.getByDataTest(this.path);
    },
};

const elements = {
    button1,
    button2,
};

const clickButton1 = (text: "One" | "Two") => button1(text).get().click();
const clickButton2 = () => button2.get().click();


const actions = {
    clickButton1,
    clickButton2,
};

interface ExamplePagePom extends Pom<typeof elements, typeof actions, typeof navigate> {}

const navigate = () => cy.visit("/");

export const examplePage: ExamplePagePom = {
    elements,
    actions,
    navigate,
};