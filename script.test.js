import { fireEvent, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let container;

function beforeRunTests() {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    dom = new JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
}

describe("Rendering elements:", () => {
    beforeEach(() => {
        beforeRunTests();
    });

    test("a heading element", () => {
        expect(container.querySelector("h2")).not.toBeNull();
        expect(getByText(container, "Expense Tracker")).toBeInTheDocument();
    });

    test("a balance element", () => {
        expect(container.querySelector(".title-balance")).toBeInTheDocument();
        expect(container.querySelector("#balance")).toHaveTextContent("$0.00");
    });

    test("a inc-exp-container", () => {
        expect(container.querySelector(".inc-exp-container")).toBeInTheDocument();
        expect(container.querySelector("#money-plus")).toHaveTextContent("+$0.00");
        expect(container.querySelector("#money-minus")).toHaveTextContent("-$0.00");
    });

    test("a history element is empty", () => {
        expect(container.querySelector("li")).not.toBeInTheDocument();
    });

    test("a form to add a new transaction", () => {
        expect(container.querySelector("#form")).toBeInTheDocument();
    });

    test("a button to add a new transaction", () => {
        const button = getByText(container, "Add transaction");
        expect(button).toBeInTheDocument();
    });

    /*  it("renders a new paragraph via JavaScript when the button is clicked", async () => {
        const button = getByText(container, "Click me for a terrible pun");

        fireEvent.click(button);
        let generatedParagraphs =
            container.querySelectorAll("#pun-container p");
        expect(generatedParagraphs.length).toBe(1);

        fireEvent.click(button);
        generatedParagraphs = container.querySelectorAll("#pun-container p");
        expect(generatedParagraphs.length).toBe(2);

        fireEvent.click(button);
        generatedParagraphs = container.querySelectorAll("#pun-container p");
        expect(generatedParagraphs.length).toBe(3);
    }); */
});
