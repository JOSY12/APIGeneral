import { DBPostgres } from '../../BDPostgres'

export const agregar_producto = async (req, res) => {
  const { nombre, precio, cantidad, estado, stock, descripcion } = req.body
  if (!nombre || !precio || !cantidad || !estado || !stock || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (precio < 0 || cantidad < 0 || stock < 0) {
    return res
      .status(400)
      .json({ error: 'Los valores no pueden ser negativos' })
  }
  if (estado !== 'activo' && estado !== 'inactivo') {
    return res.status(400).json({ error: 'Estado no valido' })
  }
  if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
    return res
      .status(400)
      .json({ error: 'Nombre y descripcion deben ser cadenas de texto' })
  }
  if (
    typeof precio !== 'number' ||
    typeof cantidad !== 'number' ||
    typeof stock !== 'number'
  ) {
    return res
      .status(400)
      .json({ error: 'Precio, cantidad y stock deben ser numeros' })
  }
  if (nombre.length > 50) {
    return res.status(400).json({ error: 'Nombre demasiado largo' })
  }
  if (descripcion.length > 255) {
    return res.status(400).json({ error: 'Descripcion demasiado larga' })
  }
  if (precio > 1000000) {
    return res.status(400).json({ error: 'Precio demasiado alto' })
  }
  if (cantidad > 10000) {
    return res.status(400).json({ error: 'Cantidad demasiado alta' })
  }
  if (stock > 10000) {
    return res.status(400).json({ error: 'Stock demasiado alto' })
  }
  try {
    const query = await DBPostgres.query(
      'INSERT INTO productos (nombre, precio, cantidad, estado, stock, descripcion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [nombre, precio, cantidad, estado, stock, descripcion]
    )
    const { id } = query.rows[0]
    return res.status(200).json({ exito: 'exito', id })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const listar_productos = async (req, res) => {
  try {
    const query = await DBPostgres.query('SELECT * FROM productos')
    const productos = query.rows
    if (productos.length === 0) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json(productos)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
export const listar_producto = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  if (id < 0) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  try {
    const query = await DBPostgres.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    )
    const producto = query.rows[0]
    if (!producto) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json(producto)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const editar_producto = async (req, res) => {
  const { id } = req.params
  const { nombre, precio, cantidad, estado, stock, descripcion } = req.body
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  if (id < 0) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  if (!nombre || !precio || !cantidad || !estado || !stock || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (precio < 0 || cantidad < 0 || stock < 0) {
    return res
      .status(400)
      .json({ error: 'Los valores no pueden ser negativos' })
  }
  if (estado !== 'activo' && estado !== 'inactivo') {
    return res.status(400).json({ error: 'Estado no valido' })
  }
  if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
    return res
      .status(400)
      .json({ error: 'Nombre y descripcion deben ser cadenas de texto' })
  }
  if (
    typeof precio !== 'number' ||
    typeof cantidad !== 'number' ||
    typeof stock !== 'number'
  ) {
    return res
      .status(400)
      .json({ error: 'Precio, cantidad y stock deben ser numeros' })
  }

  try {
    const query = await DBPostgres.query(
      'UPDATE productos SET nombre = $1, precio = $2, cantidad = $3, estado = $4, stock = $5, descripcion = $6 WHERE id = $7',
      [nombre, precio, cantidad, estado, stock, descripcion, id]
    )
    return res.status(200).json({ exito: 'exito' })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const eliminar_producto = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  if (id < 0) {
    return res.status(400).json({ error: 'ID no valido' })
  }
  try {
    const query = await DBPostgres.query(
      'DELETE FROM productos WHERE id = $1',
      [id]
    )
    return res.status(200).json({ exito: 'exito' })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
