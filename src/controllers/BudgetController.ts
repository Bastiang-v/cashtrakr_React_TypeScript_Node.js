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
        console.log('controller')
        res.json(req.budget)

    }

    static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.json('Presupuesto Actualizado Correctamente')
    }


    static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy()
        res.json('Presupuesto Eliminado Correctamente')
    }

}