import type { Request, Response } from "express"
import Budget from "../models/Budget"

export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
            })
            // TODO: Filtrar por el usuario autenticado 
            res.json(budgets)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static create = async (req: Request, res: Response) => {
        try {
            console.log(req.body)
            const budget = new Budget(req.body)
            await budget.save()
            res.status(201).json('Presupuesto Creado Correctamente')
        } catch (errror) {
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static getByid = async (req: Request, res: Response) => {
        console.log('desde getbyid /api/budgets/id v2')
    }

    static updateById = async (req: Request, res: Response) => {
        console.log('desde updateById /api/budgets/id v2')
    }


    static deleteById = async (req: Request, res: Response) => {
        console.log('desde deleteById /api/budgets/id v2')
    }

}