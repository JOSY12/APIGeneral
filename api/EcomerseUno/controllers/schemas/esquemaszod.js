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

export const esquemaLogin = z.object({
  correo: z
    .string({ message: 'correo no puede estar vacio' })
    .min(1, 'correo no puede estar vacio'),
  // .regex(/^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{7,15})/, {
  //   message:
  //     'el correo debe contener al menos una letra mayuscula, un numero, no espacios, y tener entre 7 y 15 caracteres'
  // }),
  contrasena: z
    .string({ message: 'Contraseña no puede estar vacio' })
    .min(1, 'Contraseña no puede estar vacio')
})

export const esquemaProducto = z.object({
  nombre: z
    .string({ message: 'Nombre no puede estar vacio' })
    .min(1, 'Nombre no puede estar vacio'),
  precio: z
    .number({ message: 'Precio no puede estar vacio' })
    .min(0, 'Precio no puede ser negativo'),
  descripcion: z
    .string({ message: 'Descripcion no puede estar vacio' })
    .min(1, 'Descripcion no puede estar vacio')
  // imagen: z
  //   .string({ message: 'Imagen no puede estar vacio' })
  //   .min(1, 'Imagen no puede estar vacio')
})

export const esquemaCategoria = z.object({
  nombre: z
    .string({ message: 'Nombre no puede estar vacio' })
    .min(1, 'Nombre no puede estar vacio')
})
