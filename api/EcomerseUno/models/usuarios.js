import { basedatos } from '../../db.js'
import { DataTypes } from 'sequelize'

export const usuarios = basedatos.define(
  'usuarios',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nombre: {
      type: DataTypes.STRING
    },
    correo: {
      type: DataTypes.STRING
    },
    contrasena: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
