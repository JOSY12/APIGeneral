export const agregar_producto = async (req, res) => {
  const { nombre, precio, cantidad, estado } = req.body
  try {
    return res.status(200).json({ exito: 'exito' })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
