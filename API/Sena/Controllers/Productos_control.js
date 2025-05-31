import { getAuth } from '@clerk/express'
import { DBPostgres } from '../../BDPostgres.js'

export const agregar_producto = async (req, res) => {
  const { userId } = getAuth(req)

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
  if (nombre.length < 4) {
    return res.status(400).json({ error: 'Nombre demasiado corto' })
  }

  if (precio > 10000000) {
    return res.status(400).json({ error: 'Precio demasiado alto' })
  }

  if (stock > 10000000) {
    return res.status(400).json({ error: 'Stock demasiado alto' })
  }
  if (userId) {
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
  } else {
    return res.status(400).json({ error: 'Faltan datos de usuario' })
  }
}

export const listar_productos = async (req, res) => {
  const Categorias = req.query['Categorias[]'] || []
  const Minimo = req.query.Minimo ? parseInt(req.query.Minimo, 10) : null
  const Maximo = req.query.Maximo ? parseInt(req.query.Maximo, 10) : null
  const Nombre = req.query.Nombre || ''
  const categoriasPG = Array.isArray(Categorias) ? Categorias : [Categorias]

  try {
    const { rows } = await DBPostgres.query(
      `SELECT *
     FROM sena.Filtrar_Producto
     WHERE
         (nombre ILIKE '%' || COALESCE($1, '') || '%' OR $1 IS NULL) AND
         (categorias && $2 OR $2 IS NULL) AND
         (precio >= $3 OR $3 IS NULL) AND
         (precio <= $4 OR $4 IS NULL) AND
         estado = 'Disponible'
     ORDER BY precio DESC
     LIMIT $5 OFFSET $6;`,
      [
        Nombre || null,
        categoriasPG.length > 0 ? categoriasPG : null,
        Minimo || null,
        Maximo || null,
        50,
        0
      ]
    )

    if (!rows.length) {
      return res.status(200).json({ error: 'No hay productos disponibles' })
    }

    return res.status(200).json(rows)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const landing_page_productos = async (req, res) => {
  try {
    const Recientes = await DBPostgres.query(
      `SELECT * FROM sena.productos_recientes`
    )

    const valorados = await DBPostgres.query(
      `SELECT * FROM sena.Mejor_Valorados`
    )

    if (!Recientes.rows.length && !valorados.rows.length) {
      return res.status(200).json({ error: 'No hay productos disponibles' })
    }

    return res
      .status(200)
      .json({ Recientes: Recientes.rows, Valorados: valorados.rows })
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

    if (!producto.rows.length) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json({ producto: producto.rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const detalle_producto_editar = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const producto = await DBPostgres.query(
      'SELECT * FROM sena.datos_producto_editar WHERE id = $1',
      [id]
    )

    if (!producto.rows.length) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json({ producto: producto.rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const comentarios_producto = async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    const { rows } = await DBPostgres.query(
      'SELECT * FROM sena.productos WHERE id = $1',
      [id]
    )

    const comentarios = await DBPostgres.query(
      'SELECT * FROM sena.todos_comentarios WHERE producto_id  = $1',
      [id]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'No hay productos' })
    }
    return res.status(200).json({ comentarios: comentarios.rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const editar_producto = async (req, res) => {
  const producto = req.body
  const { id } = req.params
  const { nombre, precio, estado, stock, descripcion, categorias, fotos } =
    producto
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
    const fotosactuales = await DBPostgres.query(
      'SELECT * FROM sena.imagenes_producto WHERE producto_id = $1',
      [id]
    )
    if (fotosactuales.rows.length) {
      await DBPostgres.query(
        'DELETE FROM sena.imagenes_producto WHERE producto_id = $1',
        [id]
      )
    }
    const categoriasactuales = await DBPostgres.query(
      'SELECT * FROM sena.categorias_productos WHERE producto_id = $1',
      [id]
    )
    if (categoriasactuales.rows.length) {
      await DBPostgres.query(
        'DELETE FROM sena.categorias_productos WHERE producto_id = $1',
        [id]
      )
    }
    await DBPostgres.query(
      'UPDATE sena.productos SET nombre = $1, precio = $2,  estado = $3, stock = $4, descripcion = $5 WHERE id = $6',
      [nombre, precio, estado, stock, descripcion, id]
    )
    for (let f of fotos) {
      await DBPostgres.query(
        'INSERT INTO sena.imagenes_producto (producto_id,public_id,url) VALUES ($1, $2, $3)',
        [id, f.public_id, f.url]
      )
    }
    for (let c of categorias) {
      await DBPostgres.query(
        'INSERT INTO sena.Categorias_productos (categoria_id, producto_id ) VALUES ($1, $2)',
        [c.id, id]
      )
    }
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
    await DBPostgres.query('DELETE FROM sena.productos WHERE id = $1', [id])
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
  const { titulo, comentario, producto_id, calificacion } = req.body
  const { userId } = getAuth(req)

  try {
    if (userId)
      await DBPostgres.query(
        'INSERT INTO sena.comentarios_productos(producto_id,usuario_id,titulo,comentario,calificacion) values($1,$2,$3,$4,$5)',
        [producto_id, userId, titulo, comentario, calificacion]
      )
    else {
      return res.status(400).json({ error: 'Faltan datos' })
    }
    return res.status(200).json({ exit: 'exito' })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
