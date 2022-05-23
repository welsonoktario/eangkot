import { mount } from "@vue/test-utils";
import HomePage from "@/views/Auth/HomePage.vue";

describe("HomePage.vue", () => {
  it("renders tab home HomePage", () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch("Home page");
  });
});
