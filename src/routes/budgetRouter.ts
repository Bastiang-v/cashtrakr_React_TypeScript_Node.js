import { Router } from 'express'
import { body, param } from 'express-validator'
import { BudgetController } from '../controllers/BudgetController';
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from '../middleware/budget';


const router = Router();

router.param('idBuget', validateBudgetId)
router.param('idBuget', validateBudgetExist)

router.get('/', BudgetController.getAll)

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create)

router.get('/:idBuget',
    BudgetController.getByid)

router.put('/:idBuget',
    body('name').notEmpty().withMessage('el nombre del presupuesto no puede ir vacio'),
    body('amount')
        .notEmpty().withMessage('la cantidad presupuesto no puede ir vacio')
        .isNumeric().withMessage('Cantidad no valida')
        .custom(value => value > 0).withMessage('El presupuesto debe ser mayor a 0'),
    handleInputErrors,
    BudgetController.updateById)

router.delete('/:idBuget',
    handleInputErrors,
    BudgetController.deleteById)

export default router