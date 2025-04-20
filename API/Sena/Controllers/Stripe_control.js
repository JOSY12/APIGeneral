export const comprar_producto = async (req, res) => {
  const { productos } = req.body
  try {
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
