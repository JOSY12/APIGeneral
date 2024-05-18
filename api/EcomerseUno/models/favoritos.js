import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const favoritos = basedatos.define(
  'favoritos',
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
