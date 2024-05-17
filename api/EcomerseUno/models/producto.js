import { basedatos } from '../../db.js'

import { DataTypes } from 'sequelize'

export const producto = basedatos.define(
  'producto',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4
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
      type: DataTypes.DECIMAL
    },
    img: {
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
