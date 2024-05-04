import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

export const Receta = sequelize.define("Receta", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
  },
  imagen: {
    type: DataTypes.STRING,
  },
  datos: {
    type: DataTypes.STRING,
  },
});
