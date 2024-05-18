import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const comentario = basedatos.define(
  'comentario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    timestamps: true,
    schema: 'ecomerseuno'
  }
)
