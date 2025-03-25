// import { Sequelize } from 'sequelize'
import pg from 'pg'
const { Pool } = pg

// O también puedes hacerlo en una línea:
// import { Pool } from 'pg' assert { type: 'json' }; // Alternativa para Node.js 16+import 'dotenv/config'
// import mysql from 'mysql2'

const URLBASEDEDATOS =
  process.env.POSTGRES_DOCKER === 'POSTGRES'
    ? process.env.URL_BASEDEDATOS_POSTGRES
    : process.env.URL_BASEDEDATOS_DOCKER

// export const basedatos = new Sequelize(`${URLBASEDEDATOS}`, {
//   dialectModule: pg,
//   dialect: 'postgres'
// })

export const basedatospostgres = new Pool({
  connectionString: URLBASEDEDATOS
})
