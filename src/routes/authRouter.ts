import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(limiter); //aplicar limitador de peticiones a todas las rutas de este router
//rutas de autenticacion
//crear cuenta
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"),
  body("email").isEmail().withMessage("Email no valido"),
  handleInputErrors,
  AuthController.createAccount,
);
//confirmar cuenta
router.post(
  "/confirm-account",
  body("token").isLength({ min: 6, max: 6 }).withMessage("Token no valido"),
  handleInputErrors,
  AuthController.confirmAccount,
);
//login
router.post(
  "/login",
  body("email").isEmail().withMessage("Email no valido"),
  body("password").notEmpty().withMessage("El Password no puede ir vacio"),
  handleInputErrors,
  AuthController.login,
);
//recuperar password
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email no valido"),
  handleInputErrors,
  AuthController.forgotPassword,
);
//validar token de recuperacion
router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no valido"),
  handleInputErrors,
  AuthController.validateToken,
);
//resetear password
router.post(
  "/reset-password/:token",
  param("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"),
  handleInputErrors,
  AuthController.resetPasswordWithToken,
);
//obtener usuario logueado
router.get("/user", authenticate, AuthController.user);
router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password nuevo es muy corto, mínimo 8 caracteres"),
  handleInputErrors,
  AuthController.updateCurrentUserPassword,
);
router.post(
  "/check-password",
  authenticate,
  body("password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacio"),
  handleInputErrors,
  AuthController.checkPassword,
);
export default router;
