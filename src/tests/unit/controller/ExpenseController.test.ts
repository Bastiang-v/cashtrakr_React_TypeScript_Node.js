import { describe, expect, it, jest } from "@jest/globals";
import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expenses";
import { ExpensesController } from "../../../controllers/ExpensesController";
import { expenses } from "../../Mocks/expenses";
jest.mock("../../../models/Expenses", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));
describe("ExpensesController.create", () => {
  it("should create a new expense", async () => {
    const expenseMock = {
      save: jest.fn(),
    };
    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);
    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Test Expense", amount: 500 },
      budget: { id: 1 },
    });
    const res = createResponse();
    await ExpensesController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data).toEqual("Gasto Agregado Correctamente");
    expect(expenseMock.save).toHaveBeenCalled();
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
  it("should handle expense creation error", async () => {
    const expenseMock = {
      save: jest.fn(),
    };
    (Expense.create as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "Test Expense", amount: 500 },
      budget: { id: 1 },
    });
    const res = createResponse();
    await ExpensesController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(expenseMock.save).not.toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
});
describe("ExpensesController.getById", () => {
  it("should return expenses with Id 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });
    const res = createResponse();
    await ExpensesController.getById(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });
});
describe("ExpensesController.updateById", () => {
  it("should update expense and return succes message", async () => {
    const expensesMock = {
      ...expenses[0],
      update: jest.fn(),
    };
    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expensesMock,
      body: { name: "Update Expenses", amount: 100 },
    });
    const res = createResponse();
    await ExpensesController.updateById(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Se actualizo correctamente");
    expect(expensesMock.update).toHaveBeenCalled();
    expect(expensesMock.update).toHaveBeenCalledWith(req.body);
    expect(expensesMock.update).toHaveBeenCalledTimes(1);
  });
});
describe("ExpensesController.deleteById", () => {
  it("should delete expense and return succes message ", async () => {
    const expensesMock = {
      ...expenses[0],
      destroy: jest.fn(),
    };
    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expensesMock,
    });
    const res = createResponse();
    await ExpensesController.deleteById(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Gasto Eliminado");
    expect(expensesMock.destroy).toHaveBeenCalled();
    expect(expensesMock.destroy).toHaveBeenCalledTimes(1);
  });
});
