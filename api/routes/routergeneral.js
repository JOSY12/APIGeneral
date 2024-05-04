import { Router } from "express";
import paginacocina from "./rutaspaginacocina.js";

const general = Router();

general.use("/paginacocina", paginacocina);

// otras paginas
// general.use("/paginacocina", paginacocina);

// general.use("/paginacocina", paginacocina);

// general.use("/paginacocina", paginacocina);

export default general;
