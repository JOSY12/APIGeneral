import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const comentario = basedatos.define(
  'comentario',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4
    }
  },
  {
    timestamps: true,
    schema: 'ecomerseuno'
  }
)
