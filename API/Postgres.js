import pg from 'pg'
const { Pool } = pg

const URLBASEDEDATOS =
  process.env.POSTGRES_DOCKER === 'POSTGRES'
    ? process.env.URL_BASEDEDATOS_POSTGRES
    : process.env.URL_BASEDEDATOS_DOCKER

export const basedatospostgres = new Pool({
  connectionString: URLBASEDEDATOS
})
