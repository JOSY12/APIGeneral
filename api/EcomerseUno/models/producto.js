import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const producto = basedatos.define(
  'producto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING
    },
    compañia: {
      type: DataTypes.STRING
    },
    categoria: {
      type: DataTypes.STRING
    },
    precio: {
      type: DataTypes.INTEGER
    },
    imagen: {
      type: DataTypes.STRING
    },
    stock: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false,
    schema: 'ecomerseuno'
  }
)
