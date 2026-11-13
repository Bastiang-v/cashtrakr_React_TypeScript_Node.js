import { createRequest, createResponse } from "node-mocks-http";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
jest.mock("../../../models/User");
describe("AuthController.createAccount", () => {
  it("should return a 409 status and an aerror message if the email is already registered", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "test@test.com",
        password: "testpassword",
      },
    });
    const res = createResponse();
    await AuthController.createAccount(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
    expect(data).toHaveProperty(
      "error",
      "Un usuario con ese email ya esta registrado",
    );
  });
});
