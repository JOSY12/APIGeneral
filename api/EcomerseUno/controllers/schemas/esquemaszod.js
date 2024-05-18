import { z } from 'zod'

export const esquemaregistro = z.object({
  nombre: z
    .string({ message: 'Nombre invalido' })

    .min(1, 'Nombre no puede estar vacio'),

  //  .regex(/^[^\s]*$/, { message: 'Nombre no puede tener espacios en blanco' })

  contrasena: z
    .string({ message: 'Contraseña invalida' })

    .min(7, 'minimo 7 caracteres')
    .regex(/^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{7,15})/, {
      message:
        'la Contraseña debe contener al menos una letra mayuscula, un numero, no espacios, y tener entre 7 y 15 caracteres'
    }),
  correo: z
    .string({ message: 'Correo no puede estar vacio' })
    .email('el Correo no es valido')
})
