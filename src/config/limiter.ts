import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5, // Limite de 5 solicitudes por minuto
    message: { "error": "has acanzado el limite de solicitudes, intenta nuevamente mas tarde" }
})
