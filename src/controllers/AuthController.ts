import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"
export class AuthController {
    //crear cuenta
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body
        //prevenir duplicidad de cuentas
        const usersExist = await User.findOne({ where: { email } })
        if (usersExist) {
            const error = new Error('Un usuario con ese email ya esta registrado')
            return res.status(409).json({ msg: error.message })
        }
        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json('Cuenta Creada Correctamente')
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    //confirmar cuenta
    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body
        const user = await User.findOne({ where: { token } })
        if (!user) {
            const error = new Error('Token no valido')
            return res.status(401).json({ msg: error.message })
        }
        user.confirmed = true
        user.token = null
        await user.save()
        res.json("Cuenta Confirmada Correctamente")
    }
    //login
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        //revisar que el usuario exista
        const user = await User.findOne({ where: { email } })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ msg: error.message })
        }
        if (!user.confirmed) {
            const error = new Error('Tu cuenta no ha sido confirmada')
            return res.status(403).json({ msg: error.message })
        }


        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('Password Incorrecto')
            return res.status(401).json({ msg: error.message })
        }
        const token = generateJWT(user.id)
        res.json(token)
    }
    //forgot password
    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body

        //revisar que el usuario exista
        const user = await User.findOne({ where: { email } })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ msg: error.message })
        }
        user.token = generateToken()
        await user.save()
        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })
        res.json("Revisa tu email para restablecer tu contraseña")
    }
    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body
        const tokenExists = await User.findOne({ where: { token } })
        if (!tokenExists) {
            const error = new Error('Token no valido')
            return res.status(404).json({ msg: error.message })
        }
        res.json('token Valido')
    }
    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params
        const { password } = req.body
        const user = await User.findOne({ where: { token } })
        if (!user) {
            const error = new Error('Token no valido')
            return res.status(404).json({ msg: error.message })
        }
        user.password = await hashPassword(password)
        user.token = null
        await user.save()
        res.json('Password Modificado Correctamente')
    }
    static user = async (req: Request, res: Response) => {
        res.json(req.user)

    }
}