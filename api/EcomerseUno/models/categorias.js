import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const categorias = basedatos.define(
  'categorias',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4
    },
    nombre: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
