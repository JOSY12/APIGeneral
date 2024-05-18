import { ZodObject, ZodError } from 'zod'

export const validar = (esquema) => (req, res, next) => {
  try {
    esquema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({
        errores: error.issues.map((issue) => {
          return {
            error: issue.path[0],
            mensaje: issue.message
          }
        })
      })
    }
  }
}
