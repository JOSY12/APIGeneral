import { basedatos } from '../../db.js'
import { DataTypes } from 'sequelize'

export const usuarios = basedatos.define(
  'usuarios',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
      // trim: true
      // validate: {
      //   min: { args: [3], msg: 'minimo 3 caracteres' }
      // }
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false
      // validate: {
      //   isEmail: { msg: 'El correo no es valido' },
      //   notEmpty: { msg: 'El correo no puede estar vacio' },
      //   notNull: { msg: 'El correo no puede estar vacio' },
      //   async isUnique(value) {
      //     try {
      //       let usuario = await this.constructor.findOne({
      //         where: { correo: value }
      //       })
      //       if (usuario) {
      //         throw new Error('El correo ya existe')
      //       }
      //     } catch (error) {
      //       throw new Error('El correo ya existe')
      //     }
      //   }
      // }
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
      // trim: true
      // validate: {
      //   min: { args: [8], msg: 'minimo 8 caracteres' },
      //   notEmpty: { msg: 'La contrasena no puede estar vacia' },
      //   notNull: { msg: 'La contrasena no puede estar vacia' },
      //   is: {
      //     args: ['^(?!.* )(?=.*[0-9])(?=.*[A-Z]).{6,10}$', 'i'],
      //     // msg: 'La contrasena debe contener al menos una letra mayuscula, un numero, no espacios, y tener entre 6 y 10 caracteres'
      //     msg: 'la contrasena debe cumplir con los requisitos'
      //   }
      // }
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
