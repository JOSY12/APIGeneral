import { Router } from "express";

import { obtenerrecetas, crearreceta } from "../controllers/paginacocina.js";

const paginacocina = Router();

// paginacocina.use("/:id", (req, res) => {});
paginacocina.use("/todas", obtenerrecetas);

paginacocina.use("/crear", crearreceta);

export default paginacocina;
