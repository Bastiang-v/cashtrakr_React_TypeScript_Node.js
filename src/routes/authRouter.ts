import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()
router.use(limiter) //aplicar limitador de peticiones a todas las rutas de este router
//rutas de autenticacion
router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password').isLength({ min: 8 }).withMessage('El Password es muy corto, minimo 8 caracteres'),
    body('email').isEmail().withMessage('Email no valido'),
    handleInputErrors,

    AuthController.createAccount)
//router.post('/create-account', AuthController.createAccount) //ruta para crear cuenta
router.post('/confirm-account',
    body('token').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount)
//router.post('/confirm-account', AuthController.confirmAccount) //ruta para confirmar cuenta
router.post('/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('El Password no puede ir vacio'),
    handleInputErrors,
    AuthController.login)

export default router