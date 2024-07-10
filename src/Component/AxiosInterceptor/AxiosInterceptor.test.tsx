import { axiosInstance } from "./AxiosInterceptor";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axiosInstance);

describe("Axios Interceptor", () => {
  afterEach(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    mock.reset();
  });

  test("Not add headers when user is missing in localStorage", async () => {
    const mockSession = { token: "mockToken123" };
    localStorage.setItem("session", JSON.stringify(mockSession));

    const responseData = { success: true };
    mock.onGet("/test").reply(200, responseData);

    const response = await axiosInstance.get("/test");

    expect(response.config.headers).not.toHaveProperty("userId");
    expect(response.config.headers).not.toHaveProperty("Authorization");
  });

  test("Not add headers when session is missing in localStorage", async () => {
    const mockUser = { id: 123 };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const responseData = { success: true };
    mock.onGet("/test").reply(200, responseData);

    const response = await axiosInstance.get("/test");

    expect(response.config.headers).not.toHaveProperty("userId");
    expect(response.config.headers).not.toHaveProperty("Authorization");
  });

  test("Not add headers when both user and session are missing in localStorage", async () => {
    const responseData = { success: true };
    mock.onGet("/test").reply(200, responseData);

    const response = await axiosInstance.get("/test");

    expect(response.config.headers).not.toHaveProperty("userId");
    expect(response.config.headers).not.toHaveProperty("Authorization");
  });
});
