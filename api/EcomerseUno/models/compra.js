import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const compra = basedatos.define(
  'compra',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4
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
