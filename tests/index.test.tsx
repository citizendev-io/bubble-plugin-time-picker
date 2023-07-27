import { mount } from "enzyme";
import { h } from "preact";

import Hello from "../src";

describe("Hello logic", () => {
  it("should be able to run tests", () => {
    expect(1 + 2).toEqual(3);
  });
});

describe("Hello Snapshot", () => {
  it("should render header with content", () => {
    const tree = mount(<Hello />);
    const titleElement = tree.find("h1");
    const button = tree.find("button");

    expect(titleElement.text()).toBe("TimePicker: 0");

    button.simulate("click");

    expect(titleElement.text()).toBe("TimePicker: 1");
  });
});
