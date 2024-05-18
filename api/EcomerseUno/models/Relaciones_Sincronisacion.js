import { usuarios } from './usuarios.js'
import { favoritos } from './favoritos.js'
import { carrito } from './carrito.js'
import { compra } from './compra.js'
import { producto } from './producto.js'
import { categorias } from './categorias.js'
import { comentario } from './comentario.js'
import { basedatos } from '../../db.js'

usuarios.hasOne(favoritos)
favoritos.belongsTo(usuarios)

usuarios.hasOne(carrito)

carrito.belongsTo(usuarios)

usuarios.hasMany(compra, {
  foreignKey: 'id',
  as: 'compras'
})

compra.belongsTo(usuarios, {
  foreignKey: 'id',
  as: 'compras'
})

carrito.belongsToMany(producto, {
  through: 'relacionCarritoProducto', // No necesitas una tabla intermedia
  onDelete: 'CASCADE'
})

producto.belongsToMany(carrito, {
  through: 'relacionCarritoProducto', // No necesitas una tabla intermedia
  onDelete: 'CASCADE' // No necesitas una tabla intermedia
})

favoritos.belongsToMany(producto, {
  through: 'FavoritosProducto',
  onDelete: 'CASCADE'
})

producto.belongsToMany(favoritos, {
  through: 'FavoritosProducto',
  onDelete: 'CASCADE'
})

compra.belongsToMany(producto, {
  through: 'relacionCompraProducto', // No necesitas una tabla intermedia
  onDelete: 'CASCADE' // Tabla intermedia para la relación muchos a muchos
})

producto.belongsToMany(compra, {
  through: 'relacionCompraProducto', // No necesitas una tabla intermedia
  onDelete: 'CASCADE' // Tabla intermedia para la relación muchos a muchos
})

producto.hasMany(comentario, {
  foreignKey: 'id',
  as: 'comentarios'
})

comentario.belongsTo(producto, {
  foreignKey: 'id',
  as: 'comentarios'
})

producto.belongsToMany(categorias, {
  through: 'relacionProductoCategoria', // No necesitas una tabla intermedia
  onDelete: 'CASCADE' // Nombre de la tabla intermedia
})

categorias.belongsToMany(producto, {
  through: 'relacionProductoCategoria', // No necesitas una tabla intermedia
  onDelete: 'CASCADE' // Nombre de la tabla intermedia
})
export const sincronisacion = [
  usuarios,

  producto,
  favoritos,
  carrito,
  compra,
  comentario,
  categorias
]
