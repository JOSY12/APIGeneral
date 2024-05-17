import { usuarios } from './usuarios.js'
import { favoritos } from './favoritos.js'
import { carrito } from './carrito.js'
import { compra } from './compra.js'
import { producto } from './producto.js'
import { categorias } from './categorias.js'
import { comentario } from './comentario.js'

usuarios.hasOne(favoritos, {
  foreignKey: 'id',
  as: 'favoritos'
})
favoritos.belongsTo(usuarios, {
  foreignKey: 'id',
  as: 'favoritos'
})

usuarios.hasOne(carrito, {
  foreignKey: 'id',
  as: 'carrito'
})

carrito.belongsTo(usuarios, {
  foreignKey: 'id',
  as: 'carrito'
})

usuarios.hasMany(compra, {
  foreignKey: 'id',
  as: 'compras'
})

compra.belongsTo(usuarios, {
  foreignKey: 'id',
  as: 'compras'
})

carrito.belongsToMany(producto, {
  through: 'relacionCarritoProducto' // No necesitas una tabla intermedia
})

producto.belongsToMany(carrito, {
  through: 'relacionCarritoProducto' // No necesitas una tabla intermedia
})
compra.belongsToMany(producto, {
  through: 'relacionCompraProducto' // Tabla intermedia para la relación muchos a muchos
})

producto.belongsToMany(compra, {
  through: 'relacionCompraProducto' // Tabla intermedia para la relación muchos a muchos
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
  through: 'relacionProductoCategoria' // Nombre de la tabla intermedia
})

categorias.belongsToMany(producto, {
  through: 'relacionProductoCategoria' // Nombre de la tabla intermedia
})
export const sincronisacion = [
  usuarios,
  favoritos,
  carrito,
  compra,
  producto,
  comentario,
  categorias
]
