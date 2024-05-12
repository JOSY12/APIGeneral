import { Sequelize } from 'sequelize'
import pg from 'pg'

//conectado a basedatos fl0 postgressql
//  / const BDLOCAL = "postgres://postgres:1212@localhost:5432/basededatos";
const POSTGRESDB =
  process.env.POSTGRESDB ||
  'postgres://postgres:1212@localhost:5432/paginacocina'

export const paginacocina = new Sequelize(`${POSTGRESDB}`, {
  dialectModule: pg,
  dialect: 'postgres'
})
