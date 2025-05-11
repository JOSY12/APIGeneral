import { getAuth } from '@clerk/express'
import { DBPostgres } from '../../BDPostgres.js'

export const agregar_producto = async (req, res) => {
  const { nombre, precio, estado, stock, descripcion, fotos, categorias } =
    req.body
  if (
    !nombre ||
    !precio ||
    !estado ||
    !stock ||
    !descripcion ||
    !fotos.length ||
    !categorias.length
  ) {
    return res.status(400).json({ error: 'Faltan datos' })
  }
  if (precio < 1 || stock < 1) {
    return res
      .status(400)
      .json({ error: 'Los valores no pueden ser negativos' })
  }
  if (
    estado !== 'Disponible' &&
    estado !== 'Agotado' &&
    estado !== 'Pendiente'
  ) {
    return res.status(400).json({ error: 'Estado no valido' })
  }
  if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
    return res
      .status(400)
      .json({ error: 'Nombre y descripcion deben ser cadenas de texto' })
  }
  if (typeof precio !== 'number' || typeof stock !== 'number') {
    return res
      .status(400)
      .json({ error: 'Precio,   y stock deben ser numeros' })
  }
  if (nombre.length > 150) {
    return res.status(400).json({ error: 'Nombre demasiado largo' })
  }
  if (nombre.length < 10) {
    return res.status(400).json({ error: 'Nombre demasiado largo' })
  }

  if (precio > 9999) {
    return res.status(400).json({ error: 'Precio demasiado alto' })
  }

  if (stock > 1000) {
    return res.status(400).json({ error: 'Stock demasiado alto' })
  }

  try {
    const { rows } = await DBPostgres.query(
      'INSERT INTO sena.productos (nombre, precio,  estado, stock, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre, precio, estado, stock, descripcion]
    )
    if (rows.length) {
      for (let f of fotos) {
        await DBPostgres.query(
          'INSERT INTO sena.imagenes_producto (producto_id,public_id,url) VALUES ($1, $2, $3)',
          [rows[0].id, f.public_id, f.url]
        )
      }
      for (let c of categorias) {
        await DBPostgres.query(
          'INSERT INTO sena.Categorias_productos (categoria_id, producto_id ) VALUES ($1, $2)',
          [c.id, rows[0].id]
        )
      }
      return res.status(200).json({ exito: 'exito', id: rows[0].id })
    }
    return res.status(400).json({
      errores: error
    })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const listar_productos = async (req, res) => {
  const {
    nombre,
    // precio_orden,
    // nombre_orden,
    categorias,
    precio_min,
    precio_max,
    limit,
    offset
  } = req.params
  try {
    const { rows } = await DBPostgres.query(
      `
      SELECT * 
FROM sena.Filtrar_Producto
WHERE 
  ($1::text IS NULL OR nombre ILIKE ' % ' || $1 || ') % ') AND 
  ($2::text[] IS NULL OR categorias && $2) AND
  ($3::numeric IS NULL OR precio >= $3) AND
  ($4::numeric IS NULL OR precio <= $4)
ORDER BY precio DESC
LIMIT $5 OFFSET $6`,
      [
        nombre || null,
        categorias?.length ? categorias : null,
        precio_min || null,
        precio_max || null,
        Number(limit) || 10,
        Number(offset) || 0
      ]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json(rows)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
export const detalle_producto = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const producto = await DBPostgres.query(
      'SELECT * FROM sena.datos_producto WHERE id = $1',
      [id]
    )

    const comentarios = await DBPostgres.query(
      'SELECT * FROM sena.todos_comentarios WHERE producto_id  = $1',
      [id]
    )

    if (!producto.rows.length) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res
      .status(200)
      .json({ producto: producto.rows, comentarios: comentarios.rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const editar_producto = async (req, res) => {
  const { id, nombre, precio, estado, stock, descripcion } = req.body
  if (!id) {
    return res.status(400).json({ error: 'Faltan id de producto ' })
  }

  if (!nombre || !precio || !estado || !stock || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos para actualizar' })
  }
  if (precio < 0 || stock < 0) {
    return res
      .status(400)
      .json({ error: 'Los valores no pueden ser negativos' })
  }
  if (
    estado !== 'Pendiente' &&
    estado !== 'Agotado' &&
    estado !== 'Disponible'
  ) {
    return res.status(400).json({ error: 'Estado no valido' })
  }
  if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
    return res
      .status(400)
      .json({ error: 'Nombre y descripcion deben ser cadenas de texto' })
  }
  if (typeof precio !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({ error: 'Precio, y stock deben ser numeros' })
  }

  try {
    const query = await DBPostgres.query(
      'UPDATE productos SET nombre = $1, precio = $2,  estado = $4, stock = $5, descripcion = $6 WHERE id = $7',
      [nombre, precio, estado, stock, descripcion, id]
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

export const cloudinary = async (req, res) => {
  const { userId } = getAuth(req)
  try {
    const user = await clerkClient.users.getUser(userId)
    if (!user) {
      return res.status(404).json({ error: 'usuario no encontrado' })
    }
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const crear_categoria = async (req, res) => {
  const { nombre } = req.body
  try {
    const { rows } = await DBPostgres.query(
      `select * from sena.categorias where nombre like '%${nombre}'`
    )
    if (!rows.length) {
      await DBPostgres.query(
        'insert into sena.categorias (nombre) values($1)',
        [nombre]
      )

      return res.status(200).json({ Exito: 'Categoria creada exitosamente' })
    } else {
      return res.status(400).json({ Error: 'ya existe esta categoria' })
    }
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const categorias = async (req, res) => {
  try {
    const { rows } = await DBPostgres.query('select * from sena.categorias')
    if (!rows.length) {
      return res.status(400).json({ error: 'no hay categorias' })
    }

    return res.status(200).json(rows)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const borrar_categoria = async (req, res) => {
  const { id } = req.params

  try {
    const categoria = await DBPostgres.query(
      'DELETE FROM sena.categorias WHERE id = $1',
      [id]
    )

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const crear_comentario = async (req, res) => {
  const { titulo, comentario, producto_id, calificacion, usuario_id } = req.body
  console.log(titulo, comentario, producto_id, calificacion, usuario_id)

  try {
    return res.status(200).json({ exit: 'exito' })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
