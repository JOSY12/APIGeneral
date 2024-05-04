import { Receta } from "../models/Receta.js";

export const crearreceta = async (req, res) => {
  const { nombre, imagen, datos } = req.body;
  const recetacreada = await Receta.create({ nombre, imagen, datos });
  res.json({ recetacreada });
};

export const obtenerrecetas = async (req, res) => {
  const recetas = await Receta.findAll();
  res.json({ recetas });
};
