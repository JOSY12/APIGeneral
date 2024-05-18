import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const compra = basedatos.define(
  'compra',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto: {
      type: DataTypes.STRING
    },
    cantidad: {
      type: DataTypes.DECIMAL
    },
    estado: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: true,
    schema: 'ecomerseuno'
  }
)
