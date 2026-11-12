import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from '../Mocks/budget'
import { BudgetController } from '../../controllers/BudgetController';
import Budget from '../../models/Budget';

jest.mock('../../models/Budget', () => {
    return {
        __esModule: true,
        default: {
            findAll: jest.fn()
        }
    };
});
describe('BudgetController.getAll', () => {
    //filtra
      beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();

    (Budget.findAll as jest.Mock).mockImplementation((options) => {
        
        const updateBudgets = budgets.filter(
            budget => budget.userId === options.where.userId
        );

        return Promise.resolve(updateBudgets);
    });
});
    it('should return 2 budgets for user whith id 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 1
            }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);
        const data = res._getJSONData()
       expect(data).toHaveLength(2)
       expect(res.statusCode).toBe(200)
       expect(res.statusCode).not.toBe(404)
    });
    it('should return 1 budgets for user whith id 2', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 2
            }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);
        const data = res._getJSONData()
       expect(data).toHaveLength(1)
       expect(res.statusCode).toBe(200)
       expect(res.statusCode).not.toBe(404)
    });
    it('should return 0 budgets for user whith id 10', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 10
            }
        });
        const res = createResponse();
        await BudgetController.getAll(req, res);
        const data = res._getJSONData()
       expect(data).toHaveLength(0)
       expect(res.statusCode).toBe(200)
       expect(res.statusCode).not.toBe(404)
    });
    it('should handle errors when fetching budgets', async()=>{
     const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {
                id: 10
            }
        });
        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res);
        expect(res.statusCode).toBe(500)
         expect(res._getJSONData()).toEqual({error:'Hubo un error'})
    })
});