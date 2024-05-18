import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const carrito = basedatos.define(
  'carrito',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
