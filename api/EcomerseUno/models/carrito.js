import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const carrito = basedatos.define(
  'carrito',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
