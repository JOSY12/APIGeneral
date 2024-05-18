import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const categorias = basedatos.define(
  'categorias',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
